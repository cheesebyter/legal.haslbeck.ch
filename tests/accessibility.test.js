import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const html = await readFile(
  path.join(root, "_site", "de", "capthook", "datenschutz", "index.html"),
  "utf8"
);
const css = await readFile(path.join(root, "_site", "styles.css"), "utf8");

test("document exposes semantic landmarks and one primary heading", () => {
  assert.match(html, /<html lang="de">/);
  assert.match(html, /<header class="site-header">/);
  assert.match(html, /<main id="main-content"/);
  assert.match(html, /<footer class="site-footer">/);
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1);
  assert.ok((html.match(/<h2(?:\s|>)/g) ?? []).length >= 1);
});

test("keyboard users have a skip link, language label, current state and visible focus CSS", () => {
  assert.match(html, /class="skip-link" href="#main-content"/);
  assert.match(html, /class="language-switcher" aria-label="Sprachauswahl"/);
  assert.match(html, /aria-current="page"/);
  assert.match(css, /a:focus-visible\s*{[^}]*outline:/s);
  assert.match(css, /\.skip-link:focus\s*{[^}]*transform:\s*translateY\(0\)/s);
});

test("responsive and print safeguards are present", () => {
  assert.match(css, /overflow-wrap:\s*anywhere/);
  assert.match(css, /@media \(max-width:\s*36rem\)/);
  assert.match(css, /@media print/);
  assert.match(css, /a\[href\^="http"\]::after/);
  assert.doesNotMatch(css, /white-space:\s*nowrap/);
});

