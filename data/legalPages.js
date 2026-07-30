import { readFile, readdir } from "node:fs/promises";
import { parse } from "yaml";

export default async function () {
  const directory = new URL("../projects/", import.meta.url);
  const files = (await readdir(directory)).filter((file) => file.endsWith(".yml")).sort();
  const projects = await Promise.all(files.map(async (file) =>
    parse(await readFile(new URL(file, directory), "utf8"))
  ));

  return projects.flatMap((project) =>
    project.supported_languages.map((lang) => ({ project, lang }))
  );
}

