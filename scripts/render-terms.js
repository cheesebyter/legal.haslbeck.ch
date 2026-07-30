import { readFile } from "node:fs/promises";
import MarkdownIt from "markdown-it";
import nunjucks from "nunjucks";
import { parse } from "yaml";

const markdown = new MarkdownIt({ html: true, linkify: true });
const templates = new nunjucks.Environment(undefined, {
  autoescape: false,
  throwOnUndefined: true
});

function splitSource(source, relativePath) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`Frontmatter fehlt: ${relativePath}`);
  return { metadata: parse(match[1]), body: match[2] };
}

export async function renderTermsModules(
  project,
  operator,
  lang = "de",
  rootUrl = new URL("..", import.meta.url)
) {
  const chunks = [];
  const translatedModules = lang === "de"
    ? null
    : parse(await readFile(new URL(`content/terms/${lang}.yml`, rootUrl), "utf8"));
  const localization = project.terms_localizations?.[lang] ?? {};
  const terms = {
    ...project.terms_config,
    ...localization,
    clause_overrides: {
      ...(project.terms_config.clause_overrides ?? {}),
      ...(localization.clause_overrides ?? {})
    }
  };
  for (const moduleId of project.terms_modules) {
    let metadata;
    let body;
    if (lang === "de") {
      const relativePath = `content/terms/de/${moduleId}.md`;
      const source = await readFile(new URL(relativePath, rootUrl), "utf8");
      ({ metadata, body } = splitSource(source, relativePath));
    } else {
      const translated = translatedModules[moduleId];
      if (!translated) throw new Error(`Übersetzung fehlt: ${lang}/${moduleId}`);
      ({ body, ...metadata } = translated);
    }
    const rendered = templates.renderString(body, {
      project,
      operator,
      terms
    });
    const override = terms.clause_overrides?.[moduleId];
    const overrideMarkdown = override
      ? `\n\n**Projektspezifische Ergänzung:** ${override}`
      : "";
    chunks.push(
      `${rendered}${overrideMarkdown}\n\n`
      + `<p class="clause-meta">Version ${metadata.version} · Stand ${metadata.date}</p>`
    );
  }
  return markdown.render(chunks.join("\n\n"));
}
