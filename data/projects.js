import { readFile, readdir } from "node:fs/promises";
import { parse } from "yaml";

export default async function () {
  const directory = new URL("../projects/", import.meta.url);
  const files = (await readdir(directory))
    .filter((file) => file.endsWith(".yml"))
    .sort();

  return Promise.all(files.map(async (file) => {
    const project = parse(await readFile(new URL(file, directory), "utf8"));
    return { ...project, config_file: `projects/${file}` };
  }));
}

