import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { parse } from "yaml";
import { validateTermsConfiguration } from "./terms-validation.js";

const root = fileURLToPath(new URL("..", import.meta.url));
const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);

async function json(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
}

async function yaml(relativePath) {
  try {
    return parse(await readFile(path.join(root, relativePath), "utf8"));
  } catch (error) {
    throw new Error(`${relativePath}: YAML kann nicht gelesen werden: ${error.message}`);
  }
}

async function markdownMetadata(relativePath) {
  const source = await readFile(path.join(root, relativePath), "utf8");
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) throw new Error(`${relativePath}: Frontmatter fehlt`);
  return parse(match[1]);
}

function fieldFor(error) {
  const suffix = error.keyword === "additionalProperties"
    ? `/${error.params.additionalProperty}`
    : "";
  return `${error.instancePath || "/"}${suffix}`;
}

function validateDocument(relativePath, schema, data) {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (valid) return;

  const warnings = validate.errors.filter((error) => error.keyword === "additionalProperties");
  const errors = validate.errors.filter((error) => error.keyword !== "additionalProperties");

  for (const warning of warnings) {
    console.warn(`WARN ${relativePath}: ${fieldFor(warning)}: unbekanntes Feld`);
  }

  if (errors.length) {
    throw new Error(errors
      .map((error) => `${relativePath}: ${fieldFor(error)}: ${error.message}`)
      .join("\n"));
  }
}

const [
  operatorSchema,
  providersSchema,
  modulesSchema,
  changelogSchema,
  termsModulesSchema,
  termsGlossarySchema,
  projectSchema,
  operator,
  providers,
  modules,
  changelog,
  termsModules,
  termsGlossary
] = await Promise.all([
  json("schemas/operator.schema.json"),
  json("schemas/providers.schema.json"),
  json("schemas/modules.schema.json"),
  json("schemas/changelog.schema.json"),
  json("schemas/terms-modules.schema.json"),
  json("schemas/terms-glossary.schema.json"),
  json("projects/project.schema.json"),
  yaml("data/operator.yml"),
  yaml("data/providers.yml"),
  yaml("data/modules.yml"),
  yaml("data/changelog.yml"),
  yaml("data/terms-modules.yml"),
  yaml("data/terms-glossary.yml")
]);

validateDocument("data/operator.yml", operatorSchema, operator);
validateDocument("data/providers.yml", providersSchema, providers);
validateDocument("data/modules.yml", modulesSchema, modules);
validateDocument("data/changelog.yml", changelogSchema, changelog);
validateDocument("data/terms-modules.yml", termsModulesSchema, termsModules);
validateDocument("data/terms-glossary.yml", termsGlossarySchema, termsGlossary);

const termsAllowlist = new Set(modules.terms);
const termsCatalogIds = new Set(Object.keys(termsModules));
for (const moduleId of termsAllowlist) {
  if (!termsCatalogIds.has(moduleId)) {
    throw new Error(`data/terms-modules.yml: Definition für ${moduleId} fehlt`);
  }
}
for (const moduleId of termsCatalogIds) {
  if (!termsAllowlist.has(moduleId)) {
    throw new Error(`data/modules.yml: AGB-Modul ${moduleId} fehlt in der Allowlist`);
  }
}

const preview = process.argv.includes("--preview");
for (const documentType of ["imprint", "privacy"]) {
  const sourcePath = `content/${documentType}/de.md`;
  const sourceMetadata = await markdownMetadata(sourcePath);
  for (const field of ["version", "source_version", "date", "change_reason", "review_status"]) {
    if (!sourceMetadata[field]) throw new Error(`${sourcePath}: /${field}: Pflichtfeld fehlt`);
  }
  if (sourceMetadata.version !== sourceMetadata.source_version) {
    throw new Error(`${sourcePath}: /source_version: deutsche Ausgangsversion muss der Version entsprechen`);
  }

  for (const lang of ["fr", "it", "es", "en"]) {
    const translationPath = `content/${documentType}/${lang}.md`;
    let metadata;
    try {
      metadata = await markdownMetadata(translationPath);
    } catch (error) {
      if (preview) {
        console.warn(`WARN ${translationPath}: Übersetzung fehlt; Vorschau ist unvollständig`);
        continue;
      }
      throw new Error(`${translationPath}: Übersetzung fehlt`);
    }
    for (const field of ["version", "source_version", "date", "change_reason", "review_status"]) {
      if (!metadata[field]) throw new Error(`${translationPath}: /${field}: Pflichtfeld fehlt`);
    }
    if (metadata.source_version !== sourceMetadata.version) {
      const message = `${translationPath}: Quellversion ${sourceMetadata.version}, Übersetzungsversion ${metadata.source_version}`;
      if (preview) console.warn(`WARN ${message}`);
      else throw new Error(message);
    }
  }
}

const germanTermsMetadata = {};
for (const moduleId of Object.keys(termsModules)) {
  const relativePath = `content/terms/de/${moduleId}.md`;
  const metadata = await markdownMetadata(relativePath);
  germanTermsMetadata[moduleId] = metadata;
  for (const field of ["version", "date", "review_status"]) {
    if (!metadata[field]) throw new Error(`${relativePath}: /${field}: Pflichtfeld fehlt`);
  }
}

for (const lang of ["fr", "it", "es", "en"]) {
  const relativePath = `content/terms/${lang}.yml`;
  const translations = await yaml(relativePath);
  for (const moduleId of Object.keys(termsModules)) {
    const translation = translations[moduleId];
    if (!translation) throw new Error(`${relativePath}: /${moduleId}: Übersetzung fehlt`);
    for (const field of ["version", "source_version", "date", "review_status", "body"]) {
      if (!translation[field]) throw new Error(`${relativePath}: /${moduleId}/${field}: Pflichtfeld fehlt`);
    }
    if (translation.source_version !== germanTermsMetadata[moduleId].version) {
      throw new Error(
        `${relativePath}: /${moduleId}/source_version: erwartet `
        + `${germanTermsMetadata[moduleId].version}, gefunden ${translation.source_version}`
      );
    }
  }
  for (const moduleId of Object.keys(translations)) {
    if (!termsModules[moduleId]) {
      throw new Error(`${relativePath}: /${moduleId}: unbekanntes AGB-Modul`);
    }
  }
}

const projectFiles = (await readdir(path.join(root, "projects")))
  .filter((file) => file.endsWith(".yml"))
  .sort();

const ids = new Set();
const domains = new Set();
for (const file of projectFiles) {
  const relativePath = `projects/${file}`;
  const project = await yaml(relativePath);
  validateDocument(relativePath, projectSchema, project);

  if (ids.has(project.project_id)) {
    throw new Error(`${relativePath}: /project_id: doppelte Projekt-ID ${project.project_id}`);
  }
  if (domains.has(project.domain)) {
    throw new Error(`${relativePath}: /domain: doppelte Domain ${project.domain}`);
  }
  ids.add(project.project_id);
  domains.add(project.domain);

  const entries = changelog[project.project_id];
  if (!entries?.length) {
    throw new Error(`data/changelog.yml: /${project.project_id}: mindestens ein Eintrag fehlt`);
  }
  const changelogVersions = new Set();
  for (const entry of entries) {
    if (changelogVersions.has(entry.version)) {
      throw new Error(`data/changelog.yml: /${project.project_id}: doppelte Version ${entry.version}`);
    }
    changelogVersions.add(entry.version);
    if (entry.status === "published" && entry.version.endsWith("-draft")) {
      throw new Error(`data/changelog.yml: /${project.project_id}: veröffentlichte Version darf kein Entwurf sein`);
    }
    for (const lang of project.supported_languages) {
      if (!entry.summaries[lang]) {
        throw new Error(`data/changelog.yml: /${project.project_id}/${entry.version}/summaries/${lang}: Übersetzung fehlt`);
      }
    }
    for (const document of entry.documents) {
      if (!project.documents[document]?.enabled) {
        throw new Error(`data/changelog.yml: /${project.project_id}/${entry.version}/documents: ${document} ist deaktiviert`);
      }
    }
  }

  for (const providerId of project.providers) {
    if (!providers[providerId]) {
      throw new Error(`${relativePath}: /providers: unbekannte Anbieter-ID ${providerId}`);
    }
  }
  for (const providerId of Object.keys(project.provider_overrides ?? {})) {
    if (!providers[providerId]) {
      throw new Error(`${relativePath}: /provider_overrides: unbekannte Anbieter-ID ${providerId}`);
    }
  }
  for (const moduleId of project.privacy_modules ?? []) {
    if (!modules.privacy.includes(moduleId)) {
      throw new Error(`${relativePath}: /privacy_modules: unbekannte Modul-ID ${moduleId}`);
    }
  }
  const modulesRequiringDetails = new Set([
    "hosting-server-logs",
    "contact",
    "user-accounts",
    "webhook-processing",
    "email-delivery",
    "payments",
    "analytics",
    "essential-cookies"
  ]);
  for (const moduleId of project.privacy_modules ?? []) {
    if (!modulesRequiringDetails.has(moduleId)) continue;
    const details = project.privacy_details?.[moduleId];
    if (!details) {
      throw new Error(`${relativePath}: /privacy_details/${moduleId}: Pflichtangaben für aktiviertes Modul fehlen`);
    }
    for (const providerId of details.recipients) {
      if (!providers[providerId]) {
        throw new Error(`${relativePath}: /privacy_details/${moduleId}/recipients: unbekannte Anbieter-ID ${providerId}`);
      }
    }
    for (const retentionId of details.retention_refs) {
      if (!project.retention[retentionId]) {
        throw new Error(`${relativePath}: /privacy_details/${moduleId}/retention_refs: unbekannte Aufbewahrungsregel ${retentionId}`);
      }
    }
  }
  for (const moduleId of project.terms_modules ?? []) {
    if (!modules.terms.includes(moduleId)) {
      throw new Error(`${relativePath}: /terms_modules: unbekannte Modul-ID ${moduleId}`);
    }
  }
  const termsErrors = validateTermsConfiguration(project, termsModules);
  if (termsErrors.length) {
    throw new Error(termsErrors
      .map((message) => `${relativePath}: /terms: ${message}`)
      .join("\n"));
  }
}

for (const projectId of Object.keys(changelog)) {
  if (!ids.has(projectId)) {
    throw new Error(`data/changelog.yml: /${projectId}: unbekannte Projekt-ID`);
  }
}

console.log(`Konfiguration gültig: ${projectFiles.length} Projekt(e), ${Object.keys(providers).length} Anbieter.`);
