import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const root = fileURLToPath(new URL("..", import.meta.url));
const output = path.join(root, "_site");
const operator = parse(await readFile(path.join(root, "data/operator.yml"), "utf8"));
const changelog = parse(await readFile(path.join(root, "data/changelog.yml"), "utf8"));
const projectFiles = (await readdir(path.join(root, "projects")))
  .filter((file) => file.endsWith(".yml"))
  .sort();
const projects = await Promise.all(projectFiles.map(async (file) =>
  parse(await readFile(path.join(root, "projects", file), "utf8"))
));

const documentPaths = {
  imprint: "impressum",
  privacy: "datenschutz",
  terms: "agb"
};

async function exists(file) {
  try {
    return (await stat(file)).isFile();
  } catch {
    return false;
  }
}

test("each project has exactly the configured localized document pages", async () => {
  for (const project of projects) {
    const enabledDocuments = Object.entries(project.documents)
      .filter(([, config]) => config.enabled)
      .map(([document]) => document);
    const expectedCount = enabledDocuments.length * project.supported_languages.length;
    let actualCount = 0;

    for (const lang of project.supported_languages) {
      for (const [document, segment] of Object.entries(documentPaths)) {
        const file = path.join(output, lang, project.project_id, segment, "index.html");
        const shouldExist = project.documents[document].enabled;
        assert.equal(
          await exists(file),
          shouldExist,
          `${project.project_id}/${lang}/${segment} existence differs from configuration`
        );
        if (shouldExist) actualCount += 1;
      }
    }
    assert.equal(actualCount, expectedCount);
    assert.ok([10, 15].includes(actualCount), `${project.project_id} must produce 10 or 15 pages`);
  }
});

test("every page contains project and version data without placeholders", async () => {
  for (const project of projects) {
    for (const lang of project.supported_languages) {
      for (const [document, segment] of Object.entries(documentPaths)) {
        if (!project.documents[document].enabled) continue;
        const file = path.join(output, lang, project.project_id, segment, "index.html");
        const html = await readFile(file, "utf8");
        const expectedDate = document === "terms" ? "2026-07-29" : "2026-07-28";
        for (const value of [project.name, project.domain, operator.name, "1.0.0", expectedDate]) {
          assert.ok(html.includes(value), `${file} misses ${value}`);
        }
        assert.doesNotMatch(html, /{{|}}|{%|%}|\[\[[A-Z0-9_.-]+\]\]/);
        assert.match(html, new RegExp(`<html lang="${lang}"`));
      }
    }
  }
});

test("translations contain the controlling-language notice and German link", async () => {
  for (const project of projects) {
    for (const lang of project.supported_languages.filter((code) => code !== "de")) {
      for (const [document, segment] of Object.entries(documentPaths)) {
        if (!project.documents[document].enabled) continue;
        const html = await readFile(
          path.join(output, lang, project.project_id, segment, "index.html"),
          "utf8"
        );
        assert.match(html, /language-notice/);
        assert.ok(html.includes(`/de/${project.project_id}/${segment}`));
      }
    }
  }
});

test("disabled CaptHook-independent modules do not leak into German pages", async () => {
  for (const project of projects) {
    const privacy = await readFile(
      path.join(output, "de", project.project_id, "datenschutz", "index.html"),
      "utf8"
    );
    if (!project.features.user_accounts) assert.doesNotMatch(privacy, /Benutzerkonten und Anmeldung/);
    if (!project.features.payments) assert.doesNotMatch(privacy, /Zahlungsabwicklung/);
    if (!project.features.essential_cookies) assert.doesNotMatch(privacy, /<h2>8\. Cookies<\/h2>/);
    if (!project.features.analytics) assert.doesNotMatch(privacy, /<h2[^>]*>.*Analytics.*<\/h2>/);
  }
});

test("all root-relative links in generated pages resolve to generated files", async () => {
  const checked = new Set();
  for (const project of projects) {
    for (const lang of project.supported_languages) {
      for (const [document, segment] of Object.entries(documentPaths)) {
        if (!project.documents[document].enabled) continue;
        const html = await readFile(
          path.join(output, lang, project.project_id, segment, "index.html"),
          "utf8"
        );
        for (const match of html.matchAll(/href="(\/[^"#?]*)"/g)) {
          const urlPath = decodeURIComponent(match[1]);
          if (checked.has(urlPath)) continue;
          checked.add(urlPath);
          const target = urlPath === "/"
            ? path.join(output, "index.html")
            : path.extname(urlPath)
              ? path.join(output, urlPath)
              : path.join(output, urlPath, "index.html");
          assert.ok(await exists(target), `internal link has no generated target: ${urlPath}`);
        }
      }
    }
  }
});

test("every project exposes a localized material change log", async () => {
  for (const project of projects) {
    for (const lang of project.supported_languages) {
      const file = path.join(output, lang, project.project_id, "aenderungen", "index.html");
      assert.ok(await exists(file), `change log missing: ${project.project_id}/${lang}`);
      const html = await readFile(file, "utf8");
      for (const entry of changelog[project.project_id]) {
        assert.ok(html.includes(entry.version), `${file} misses version ${entry.version}`);
        assert.ok(html.includes(String(entry.date)), `${file} misses date ${entry.date}`);
        assert.ok(
          html.includes(entry.summaries[lang]),
          `${file} misses localized summary for ${entry.version}`
        );
      }
      assert.match(html, new RegExp(`<html lang="${lang}"`));
      assert.match(html, /<time datetime="\d{4}-\d{2}-\d{2}">/);
    }
  }
});
