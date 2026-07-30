import { parse } from "yaml";
import { readFile } from "node:fs/promises";
import MarkdownIt from "markdown-it";
import nunjucks from "nunjucks";
import { renderTermsModules } from "./scripts/render-terms.js";

const markdown = new MarkdownIt({ html: true, linkify: true });
const legalTemplates = new nunjucks.Environment(undefined, { autoescape: false });

function projectEmail(project, operator) {
  if (project.contact.email_override) return project.contact.email_override;
  const parts = project.contact.email_ref.split(".");
  return parts.slice(1).reduce((value, key) => value?.[key], operator);
}

legalTemplates.addFilter("projectEmail", projectEmail);

async function readDocumentMetadata(documentType, lang) {
  const source = await readFile(
    new URL(`content/${documentType}/${lang}.md`, import.meta.url),
    "utf8"
  );
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) throw new Error(`Frontmatter fehlt: content/${documentType}/${lang}.md`);
  return parse(match[1]);
}

export default function (eleventyConfig) {
  eleventyConfig.addDataExtension("yaml", (contents) => parse(contents));
  eleventyConfig.addDataExtension("yml", (contents) => parse(contents));
  eleventyConfig.addGlobalData("documentMetadata", async () => {
    const result = {};
    for (const documentType of ["imprint", "privacy"]) {
      result[documentType] = {};
      for (const lang of ["de", "fr", "it", "es", "en"]) {
        result[documentType][lang] = await readDocumentMetadata(documentType, lang);
      }
    }
    return result;
  });
  eleventyConfig.addPassthroughCopy({ public: "/" });
  eleventyConfig.addPassthroughCopy({ archives: "/" });
  eleventyConfig.addFilter("projectEmail", projectEmail);
  eleventyConfig.addNunjucksAsyncShortcode(
    "renderTermsModules",
    async (project, operator, lang) => renderTermsModules(project, operator, lang)
  );
  eleventyConfig.addNunjucksAsyncShortcode(
    "renderLegalMarkdown",
    async (relativePath, project, operator) => {
      const source = await readFile(new URL(relativePath, import.meta.url), "utf8");
      const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
      return markdown.render(legalTemplates.renderString(body, { project, operator }));
    }
  );

  return {
    dir: {
      input: "site",
      includes: "../templates",
      data: "../data",
      output: "_site"
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "md"]
  };
}
