import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parse, stringify } from "yaml";

const [sourcePath, expectedId, repository, commit] = process.argv.slice(2);
if (!sourcePath || !expectedId || !repository || !commit) {
  throw new Error("Usage: import-project-config SOURCE PROJECT_ID REPOSITORY COMMIT");
}
if (!/^[a-z][a-z0-9-]*$/.test(expectedId)) throw new Error("Ungültige Projekt-ID");
if (!/^[0-9a-f]{40}$/.test(commit)) throw new Error("Ungültiger Projekt-Commit");

const project = parse(await readFile(sourcePath, "utf8"));
if (project.project_id !== expectedId) {
  throw new Error(`${sourcePath}: project_id ${project.project_id} stimmt nicht mit ${expectedId} überein`);
}

project.source = {
  repository,
  commit,
  verified_at: new Date().toISOString().slice(0, 10)
};

const target = path.join("projects", `${expectedId}.yml`);
await writeFile(target, stringify(project, { lineWidth: 100 }), "utf8");
console.log(`${sourcePath} wurde commitgenau nach ${target} importiert.`);

