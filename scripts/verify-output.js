import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const output = fileURLToPath(new URL("../_site", import.meta.url));

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory()
      ? htmlFiles(target)
      : entry.name.endsWith(".html") ? [target] : [];
  }));
  return nested.flat();
}

const unresolved = /{{|}}|{%|%}|\[\[[A-Z0-9_.-]+\]\]/;
const files = await htmlFiles(output);
for (const file of files) {
  const html = await readFile(file, "utf8");
  if (unresolved.test(html)) {
    throw new Error(`${path.relative(output, file)}: nicht ersetzter Template-Platzhalter`);
  }
}

console.log(`Ausgabe geprüft: ${files.length} HTML-Datei(en), keine offenen Platzhalter.`);

