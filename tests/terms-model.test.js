import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { parse } from "yaml";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { validateTermsConfiguration } from "../scripts/terms-validation.js";
import { renderTermsModules } from "../scripts/render-terms.js";

const projectSchema = JSON.parse(
  await readFile(new URL("../projects/project.schema.json", import.meta.url), "utf8")
);
const catalog = parse(
  await readFile(new URL("../data/terms-modules.yml", import.meta.url), "utf8")
);
const baseProject = parse(
  await readFile(new URL("../projects/capthook.yml", import.meta.url), "utf8")
);
const operator = parse(
  await readFile(new URL("../data/operator.yml", import.meta.url), "utf8")
);

function enabledProject() {
  const project = structuredClone(baseProject);
  project.documents.terms.enabled = true;
  project.terms_modules = Object.keys(catalog).filter((id) =>
    catalog[id].required || ["customer-account", "prices-payment", "term-cancellation"].includes(id)
  );
  project.terms_config = {
    contracting_party_ref: "operator",
    contract_language: "de",
    audience: "both",
    contract_formation: "online",
    service_description: "Webhook-Verarbeitung mit kostenlosem und kostenpflichtigem Tarif.",
    account_required: true,
    pricing_model: "subscription",
    price_description: "Free costs CHF 0. Pro costs CHF 9 per month.",
    currency: "CHF",
    tax_included: true,
    term_model: "indefinite",
    renewal: "automatic",
    cancellation_notice: "Kündigung auf das Ende des laufenden Abrechnungszeitraums.",
    maintenance_notice: "Planbare Wartungen werden nach Möglichkeit angekündigt.",
    license_scope: "Nicht übertragbares Recht zur vertragsgemäßen Nutzung.",
    termination_reasons: ["Zahlungsverzug", "Missbräuchliche Nutzung"],
    governing_law: "CH",
    jurisdiction: "Rorschach, Schweiz",
    document_version: "1.0.0-draft",
    effective_date: "2026-07-29",
    material_change_process: "reconsent",
    clause_overrides: {
      "service-description": "CaptHook verarbeitet und verteilt Webhook-Ereignisse."
    }
  };
  project.terms_localizations = {
    fr: {
      service_description: "Traitement de webhooks avec offre gratuite et payante.",
      price_description: "Free coûte CHF 0. Pro coûte CHF 9 par mois.",
      cancellation_notice: "Résiliation à la fin de la période de facturation.",
      maintenance_notice: "Les maintenances planifiées sont annoncées si possible.",
      license_scope: "Droit non transférable d’utilisation conforme au contrat.",
      termination_reasons: ["Retard de paiement", "Utilisation abusive"],
      clause_overrides: { "service-description": "CaptHook traite et distribue des webhooks." }
    },
    it: {
      service_description: "Elaborazione di webhook con piano gratuito e a pagamento.",
      price_description: "Free costa CHF 0. Pro costa CHF 9 al mese.",
      cancellation_notice: "Disdetta alla fine del periodo di fatturazione.",
      maintenance_notice: "Le manutenzioni pianificate sono annunciate se possibile.",
      license_scope: "Diritto non trasferibile all’uso conforme al contratto.",
      termination_reasons: ["Ritardo di pagamento", "Uso abusivo"],
      clause_overrides: { "service-description": "CaptHook elabora e distribuisce webhook." }
    },
    es: {
      service_description: "Procesamiento de webhooks con plan gratuito y de pago.",
      price_description: "Free cuesta CHF 0. Pro cuesta CHF 9 al mes.",
      cancellation_notice: "Rescisión al final del periodo de facturación.",
      maintenance_notice: "El mantenimiento planificado se anuncia cuando sea posible.",
      license_scope: "Derecho no transferible de uso conforme al contrato.",
      termination_reasons: ["Impago", "Uso abusivo"],
      clause_overrides: { "service-description": "CaptHook procesa y distribuye webhooks." }
    },
    en: {
      service_description: "Webhook processing with free and paid plans.",
      price_description: "Free costs CHF 0. Pro costs CHF 9 per month.",
      cancellation_notice: "Termination at the end of the billing period.",
      maintenance_notice: "Planned maintenance is announced where possible.",
      license_scope: "Non-transferable right to use the service as agreed.",
      termination_reasons: ["Late payment", "Abusive use"],
      clause_overrides: { "service-description": "CaptHook processes and distributes webhooks." }
    }
  };
  return project;
}

test("terms catalog contains all sixteen required model areas", () => {
  assert.equal(Object.keys(catalog).length, 16);
  for (const definition of Object.values(catalog)) {
    assert.equal(typeof definition.title, "string");
    assert.equal(typeof definition.required, "boolean");
    assert.ok(Array.isArray(definition.required_fields));
  }
});

test("a fully configured terms-enabled project passes schema and cross-field validation", () => {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  const validate = ajv.compile(projectSchema);
  const project = enabledProject();
  assert.equal(validate(project), true, JSON.stringify(validate.errors));
  assert.deepEqual(validateTermsConfiguration(project, catalog), []);
});

test("required modules and module-specific values are enforced", () => {
  const project = enabledProject();
  project.terms_modules = project.terms_modules.filter((id) => id !== "scope");
  delete project.terms_config.currency;
  delete project.terms_localizations.fr.price_description;
  const errors = validateTermsConfiguration(project, catalog);
  assert.ok(errors.some((message) => message.includes("Pflichtmodul fehlt: scope")));
  assert.ok(errors.some((message) => message.includes("terms_config.currency fehlt")));
  assert.ok(errors.some((message) =>
    message.includes("prices-payment: terms_localizations.fr.price_description fehlt")
  ));
});

test("disabled terms reject modules and project-specific terms values", () => {
  const project = enabledProject();
  project.documents.terms.enabled = false;
  const errors = validateTermsConfiguration(project, catalog);
  assert.ok(errors.some((message) => message.includes("terms_modules muss leer sein")));
  assert.ok(errors.some((message) => message.includes("terms_config darf nicht gesetzt sein")));
  assert.ok(errors.some((message) => message.includes("terms_localizations darf nicht gesetzt sein")));
});

test("German terms modules render all selected clauses without placeholders", async () => {
  const project = enabledProject();
  const html = await renderTermsModules(project, operator);
  assert.equal((html.match(/<h2>/g) ?? []).length, project.terms_modules.length);
  assert.equal((html.match(/class="clause-meta"/g) ?? []).length, project.terms_modules.length);
  for (const value of [
    project.name,
    project.domain,
    operator.name,
    project.terms_config.service_description,
    project.terms_config.jurisdiction,
    `/de/${project.project_id}/datenschutz`,
    "1.0.0",
    "2026-07-30",
    "Projektspezifische Ergänzung"
  ]) {
    assert.ok(html.includes(value), `rendered terms miss ${value}`);
  }
  assert.doesNotMatch(html, /{{|}}|{%|%}|\[\[[A-Z0-9_.-]+\]\]/);
});

test("terms page template uses modular rendering and links privacy", async () => {
  const template = await readFile(
    new URL("../site/documents/terms.njk", import.meta.url),
    "utf8"
  );
  assert.match(template, /renderTermsModules termsPage\.project, operator, termsPage\.lang/);
  assert.match(template, /termsPage\.lang.*termsPage\.project\.project_id.*datenschutz/);
  assert.match(template, /terms_draft_notice/);
  assert.match(template, /german_notice/);
  assert.match(template, /german_terms_link/);
});

test("all four terms translations render with localized values and no placeholders", async () => {
  const project = enabledProject();
  for (const lang of ["fr", "it", "es", "en"]) {
    const html = await renderTermsModules(project, operator, lang);
    assert.equal((html.match(/<h2>/g) ?? []).length, project.terms_modules.length);
    assert.ok(html.includes(project.terms_localizations[lang].service_description));
    assert.ok(html.includes(`/${lang}/${project.project_id}/datenschutz`));
    assert.ok(html.includes("1.0.0"));
    assert.doesNotMatch(html, /{{|}}|{%|%}|\[\[[A-Z0-9_.-]+\]\]/);
  }
});

test("all translated clauses reference the current German source and glossary covers five languages", async () => {
  const germanVersions = {};
  for (const moduleId of Object.keys(catalog)) {
    const source = await readFile(
      new URL(`../content/terms/de/${moduleId}.md`, import.meta.url),
      "utf8"
    );
    const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    germanVersions[moduleId] = parse(frontmatter[1]).version;
  }

  for (const lang of ["fr", "it", "es", "en"]) {
    const translations = parse(
      await readFile(new URL(`../content/terms/${lang}.yml`, import.meta.url), "utf8")
    );
    assert.deepEqual(Object.keys(translations).sort(), Object.keys(catalog).sort());
    for (const moduleId of Object.keys(catalog)) {
      assert.equal(translations[moduleId].source_version, germanVersions[moduleId]);
      assert.equal(translations[moduleId].review_status, "approved");
    }
  }

  const glossary = parse(
    await readFile(new URL("../data/terms-glossary.yml", import.meta.url), "utf8")
  );
  for (const terms of Object.values(glossary)) {
    assert.deepEqual(Object.keys(terms).sort(), ["de", "en", "es", "fr", "it"]);
  }
});

test("stale translation metadata violates the source-version invariant", async () => {
  const germanSource = await readFile(
    new URL("../content/terms/de/scope.md", import.meta.url),
    "utf8"
  );
  const germanVersion = parse(
    germanSource.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]
  ).version;
  const translations = parse(
    await readFile(new URL("../content/terms/en.yml", import.meta.url), "utf8")
  );
  const staleTranslation = structuredClone(translations.scope);
  staleTranslation.source_version = "0.9.0";

  assert.notEqual(
    staleTranslation.source_version,
    germanVersion,
    "a stale translation must fail the same equality asserted for release catalogs"
  );
  assert.equal(translations.scope.source_version, germanVersion);
});

test("terms releases use immutable version URLs and refuse overwrites", async () => {
  const archiveScript = await readFile(
    new URL("../scripts/archive-terms-release.js", import.meta.url),
    "utf8"
  );
  const template = await readFile(
    new URL("../site/documents/terms.njk", import.meta.url),
    "utf8"
  );
  assert.match(archiveScript, /archives\/\$\{lang\}\/\$\{projectId\}\/agb\/version\/\$\{version\}/);
  assert.match(archiveScript, /flag: "wx"/);
  assert.match(archiveScript, /existiert bereits und wird nicht überschrieben/);
  assert.match(template, /agb\/version\/{{ termsPage\.project\.terms_config\.document_version }}/);
});

test("project-specific terms decisions match the deployed business models", async () => {
  const projects = {};
  for (const id of ["capthook", "weedli", "haslbeck"]) {
    projects[id] = parse(
      await readFile(new URL(`../projects/${id}.yml`, import.meta.url), "utf8")
    );
  }

  const capthook = projects.capthook;
  assert.equal(capthook.terms_decision.required, true);
  assert.equal(capthook.documents.terms.enabled, true);
  assert.deepEqual(capthook.terms_modules.sort(), Object.keys(catalog).sort());
  assert.equal(capthook.terms_config.price_description, "Free kostet CHF 0. Pro kostet CHF 9 pro Monat.");
  assert.equal(capthook.terms_config.term_model, "indefinite");
  assert.equal(capthook.terms_config.renewal, "automatic");
  assert.equal(capthook.terms_config.material_change_process, "reconsent");
  for (const plan of Object.values(capthook.service.plans)) {
    for (const value of [
      plan.max_pipes,
      plan.max_destinations_per_pipe,
      plan.max_events_per_month
    ]) {
      assert.ok(capthook.terms_config.service_description.includes(String(value)));
    }
  }

  for (const id of ["weedli", "haslbeck"]) {
    const project = projects[id];
    assert.equal(project.terms_decision.required, false);
    assert.equal(project.documents.terms.enabled, false);
    assert.deepEqual(project.terms_modules, []);
    assert.equal(project.terms_config, undefined);
  }
});
