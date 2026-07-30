import { readFile, readdir } from "node:fs/promises";
import { parse } from "yaml";

const baseUrl = new URL(process.env.LEGAL_BASE_URL ?? "https://legal.haslbeck.ch");
const projectDirectory = new URL("../projects/", import.meta.url);
const projectFiles = (await readdir(projectDirectory))
  .filter((file) => file.endsWith(".yml"))
  .sort();
const projects = await Promise.all(projectFiles.map(async (file) =>
  parse(await readFile(new URL(file, projectDirectory), "utf8"))
));

if (baseUrl.hostname === "legal.haslbeck.ch" && baseUrl.protocol !== "https:") {
  throw new Error("Der produktive Monitor verlangt HTTPS.");
}

const expected = new Set([new URL("/", baseUrl).href]);
for (const project of projects) {
  for (const lang of project.supported_languages) {
    expected.add(new URL(`/${lang}/${project.project_id}/aenderungen`, baseUrl).href);
    if (project.documents.imprint.enabled) {
      expected.add(new URL(`/${lang}/${project.project_id}/impressum`, baseUrl).href);
    }
    if (project.documents.privacy.enabled) {
      expected.add(new URL(`/${lang}/${project.project_id}/datenschutz`, baseUrl).href);
    }
    if (project.documents.terms.enabled) {
      expected.add(new URL(`/${lang}/${project.project_id}/agb`, baseUrl).href);
    }
  }
}

const visited = new Set();
const failures = [];
const queue = [...expected];

while (queue.length) {
  const url = queue.shift();
  if (visited.has(url)) continue;
  visited.add(url);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": "legal-haslbeck-availability-monitor/1.0" },
      signal: AbortSignal.timeout(15_000)
    });
    if (!response.ok) {
      failures.push(`${url}: HTTP ${response.status}`);
      continue;
    }
    if (response.url.startsWith("http://") && baseUrl.hostname === "legal.haslbeck.ch") {
      failures.push(`${url}: auf unverschlüsseltes HTTP umgeleitet`);
    }
    const type = response.headers.get("content-type") ?? "";
    if (!type.includes("text/html")) continue;
    const html = await response.text();
    for (const match of html.matchAll(/href=["']([^"'#]+)["']/g)) {
      const linked = new URL(match[1], response.url);
      if (linked.origin !== baseUrl.origin) continue;
      if (!["http:", "https:"].includes(linked.protocol)) continue;
      linked.hash = "";
      queue.push(linked.href);
    }
  } catch (error) {
    failures.push(`${url}: ${error.message}`);
  }
}

if (failures.length) {
  throw new Error(`Monitoring fehlgeschlagen:\n${failures.join("\n")}`);
}

console.log(`Monitoring erfolgreich: ${visited.size} URL(s), ${projects.length} Projekt(e).`);
