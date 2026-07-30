import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { parse } from "yaml";
import { renderTermsModules } from "./render-terms.js";

const root = new URL("..", import.meta.url);
const projectId = process.argv.find((value) => value.startsWith("--project="))?.split("=")[1];
if (!projectId) throw new Error("Aufruf: npm run archive:terms -- --project=<project_id>");

const project = parse(
  await readFile(new URL(`projects/${projectId}.yml`, root), "utf8")
);
const operator = parse(await readFile(new URL("data/operator.yml", root), "utf8"));
if (!project.documents.terms.enabled) throw new Error(`${projectId}: AGB sind deaktiviert`);

const version = project.terms_config.document_version;
if (version.includes("draft")) throw new Error(`${projectId}: Entwurf kann nicht archiviert werden`);

for (const moduleId of project.terms_modules) {
  const source = await readFile(new URL(`content/terms/de/${moduleId}.md`, root), "utf8");
  const metadata = parse(source.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
  if (!["approved", "freigegeben"].includes(metadata.review_status)) {
    throw new Error(`${moduleId}: deutsche Klausel ist nicht freigegeben`);
  }
  for (const lang of project.supported_languages.filter((code) => code !== "de")) {
    const translations = parse(
      await readFile(new URL(`content/terms/${lang}.yml`, root), "utf8")
    );
    const translated = translations[moduleId];
    if (
      translated.source_version !== metadata.version
      || !["approved", "freigegeben"].includes(translated.review_status)
    ) {
      throw new Error(`${lang}/${moduleId}: Übersetzung ist veraltet oder nicht freigegeben`);
    }
  }
}

const releaseRoot = new URL(`archives/releases/${projectId}/${version}/`, root);
try {
  await access(releaseRoot, constants.F_OK);
  throw new Error(`Release ${projectId}/${version} existiert bereits und wird nicht überschrieben`);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

for (const lang of project.supported_languages) {
  const body = await renderTermsModules(project, operator, lang);
  const canonical = `https://legal.haslbeck.ch/${lang}/${projectId}/agb/version/${version}`;
  const germanNotice = lang === "de"
    ? ""
    : `<aside class="language-notice"><p>Die deutsche Fassung ist die verbindliche Vertragsfassung.</p><p><a href="https://legal.haslbeck.ch/de/${projectId}/agb/version/${version}">Deutsche Fassung</a></p></aside>`;
  const html = `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AGB ${escapeHtml(project.name)} – Version ${escapeHtml(version)}</title>
  <link rel="canonical" href="${canonical}">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <main id="main-content" class="legal-document">
    <article>
      <header>
        <p class="eyebrow">${escapeHtml(project.name)} · ${escapeHtml(project.domain)}</p>
        <h1>Allgemeine Geschäftsbedingungen</h1>
        <p>Unveränderliche Vertragsfassung ${escapeHtml(version)} · gültig ab ${escapeHtml(project.terms_config.effective_date)}</p>
      </header>
      ${body}
      ${germanNotice}
    </article>
  </main>
</body>
</html>`;
  const target = new URL(`archives/${lang}/${projectId}/agb/version/${version}/`, root);
  await mkdir(target, { recursive: true });
  await writeFile(new URL("index.html", target), html, { encoding: "utf8", flag: "wx" });
}

await mkdir(releaseRoot, { recursive: true });
await writeFile(
  new URL("release.json", releaseRoot),
  `${JSON.stringify({
    project_id: projectId,
    version,
    effective_date: project.terms_config.effective_date,
    material_change_process: project.terms_config.material_change_process,
    languages: project.supported_languages,
    modules: project.terms_modules
  }, null, 2)}\n`,
  { encoding: "utf8", flag: "wx" }
);
console.log(`Unveränderliches AGB-Archiv erstellt: ${projectId}/${version}`);
