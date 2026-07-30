import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const root = fileURLToPath(new URL("..", import.meta.url));
const problems = [];
const releasedDocuments = {};

for (const documentType of ["imprint", "privacy"]) {
  const directory = path.join(root, "content", documentType);
  for (const file of (await readdir(directory)).filter((name) => name.endsWith(".md"))) {
    const relative = `content/${documentType}/${file}`;
    const source = await readFile(path.join(directory, file), "utf8");
    const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
    const metadata = match ? parse(match[1]) : {};
    if (file === "de.md") releasedDocuments[documentType] = metadata;
    if (String(metadata.version ?? "").includes("draft")) {
      problems.push(`${relative}: version ist noch ein Entwurf`);
    }
    if (!["approved", "freigegeben"].includes(metadata.review_status)) {
      problems.push(`${relative}: review_status ist nicht freigegeben`);
    }
  }
}

const changelog = parse(await readFile(path.join(root, "data", "changelog.yml"), "utf8"));
const projectFiles = (await readdir(path.join(root, "projects")))
  .filter((name) => name.endsWith(".yml"));
for (const file of projectFiles) {
  const project = parse(await readFile(path.join(root, "projects", file), "utf8"));
  const entries = changelog[project.project_id] ?? [];
  if (project.documents.terms.enabled) {
    const translatedTerms = {};
    for (const lang of project.supported_languages.filter((code) => code !== "de")) {
      translatedTerms[lang] = parse(
        await readFile(path.join(root, "content", "terms", `${lang}.yml`), "utf8")
      );
    }
    for (const moduleId of project.terms_modules) {
      const relative = `content/terms/de/${moduleId}.md`;
      const source = await readFile(path.join(root, relative), "utf8");
      const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
      const metadata = match ? parse(match[1]) : {};
      if (String(metadata.version ?? "").includes("draft")) {
        problems.push(`${relative}: version ist noch ein Entwurf`);
      }
      if (!["approved", "freigegeben"].includes(metadata.review_status)) {
        problems.push(`${relative}: review_status ist nicht freigegeben`);
      }
      for (const lang of project.supported_languages.filter((code) => code !== "de")) {
        const translated = translatedTerms[lang][moduleId] ?? {};
        const translatedRelative = `content/terms/${lang}.yml:${moduleId}`;
        if (translated.source_version !== metadata.version) {
          problems.push(`${translatedRelative}: deutsche Quellversion ist veraltet`);
        }
        if (String(translated.version ?? "").includes("draft")) {
          problems.push(`${translatedRelative}: version ist noch ein Entwurf`);
        }
        if (!["approved", "freigegeben"].includes(translated.review_status)) {
          problems.push(`${translatedRelative}: review_status ist nicht freigegeben`);
        }
      }
    }
    const version = project.terms_config.document_version;
    for (const lang of project.supported_languages) {
      const archive = path.join(
        root,
        "archives",
        lang,
        project.project_id,
        "agb",
        "version",
        version,
        "index.html"
      );
      try {
        await access(archive);
      } catch {
        problems.push(`AGB-Archiv fehlt: ${lang}/${project.project_id}/${version}`);
      }
    }
    const termsChangelogEntry = entries.find((entry) =>
      entry.status === "published"
      && entry.version === version
      && String(entry.date) === String(project.terms_config.effective_date)
      && entry.documents.includes("terms")
    );
    if (!termsChangelogEntry) {
      problems.push(
        `data/changelog.yml: ${project.project_id} hat keinen veröffentlichten `
        + `terms-Eintrag für ${version} vom ${project.terms_config.effective_date}`
      );
    }
  }
  for (const documentType of ["imprint", "privacy"]) {
    if (!project.documents[documentType].enabled) continue;
    const metadata = releasedDocuments[documentType];
    const matchingEntry = entries.find((entry) =>
      entry.status === "published"
      && entry.version === metadata.version
      && String(entry.date) === String(metadata.date)
      && entry.documents.includes(documentType)
    );
    if (!matchingEntry) {
      problems.push(
        `data/changelog.yml: ${project.project_id} hat keinen veröffentlichten `
        + `${documentType}-Eintrag für ${metadata.version} vom ${metadata.date}`
      );
    }
  }
}

if (problems.length) {
  throw new Error(`Produktive Freigabe blockiert:\n${problems.join("\n")}`);
}

console.log("Alle Rechtstexte sind für die produktive Veröffentlichung freigegeben.");
