function present(value) {
  return value !== undefined && value !== null && value !== "";
}

export function validateTermsConfiguration(project, catalog) {
  const errors = [];
  const enabled = project.documents?.terms?.enabled === true;
  const selected = project.terms_modules ?? [];
  if (project.terms_decision?.required !== enabled) {
    errors.push("terms_decision.required widerspricht documents.terms.enabled");
  }

  if (!enabled) {
    if (selected.length) errors.push("AGB sind deaktiviert, terms_modules muss leer sein");
    if (project.terms_config) errors.push("AGB sind deaktiviert, terms_config darf nicht gesetzt sein");
    if (project.terms_localizations) errors.push("AGB sind deaktiviert, terms_localizations darf nicht gesetzt sein");
    return errors;
  }

  if (project.contract_language !== "de") {
    errors.push("Deutsch muss die verbindliche Vertragssprache sein");
  }
  if (!project.terms_config) {
    errors.push("terms_config fehlt");
    return errors;
  }
  for (const field of ["document_version", "effective_date", "material_change_process"]) {
    if (!present(project.terms_config[field])) {
      errors.push(`terms_config.${field} fehlt`);
    }
  }
  if (
    project.terms_config.material_change_process === "notify"
    && !Number.isInteger(project.terms_config.material_change_notice_days)
  ) {
    errors.push("terms_config.material_change_notice_days fehlt für Informationsprozess");
  }

  for (const [moduleId, definition] of Object.entries(catalog)) {
    if (definition.required && !selected.includes(moduleId)) {
      errors.push(`Pflichtmodul fehlt: ${moduleId}`);
    }
  }

  for (const moduleId of selected) {
    const definition = catalog[moduleId];
    if (!definition) {
      errors.push(`unbekanntes AGB-Modul: ${moduleId}`);
      continue;
    }
    for (const field of definition.required_fields) {
      if (!present(project.terms_config[field])) {
        errors.push(`${moduleId}: Pflichtangabe terms_config.${field} fehlt`);
      }
    }
  }

  for (const moduleId of Object.keys(project.terms_config.clause_overrides ?? {})) {
    if (!selected.includes(moduleId)) {
      errors.push(`Klausel-Override verweist auf nicht aktiviertes Modul: ${moduleId}`);
    }
  }

  const translatedFieldsByModule = {
    "service-description": ["service_description"],
    "prices-payment": ["price_description"],
    "term-cancellation": ["cancellation_notice"],
    "availability-changes": ["maintenance_notice"],
    "intellectual-property": ["license_scope"],
    "suspension-termination": ["termination_reasons"]
  };
  for (const lang of project.supported_languages.filter((code) => code !== "de")) {
    const localization = project.terms_localizations?.[lang];
    if (!localization) {
      errors.push(`terms_localizations.${lang} fehlt`);
      continue;
    }
    for (const moduleId of selected) {
      for (const field of translatedFieldsByModule[moduleId] ?? []) {
        if (!present(localization[field])) {
          errors.push(`${moduleId}: terms_localizations.${lang}.${field} fehlt`);
        }
      }
    }
    for (const moduleId of Object.keys(project.terms_config.clause_overrides ?? {})) {
      if (!present(localization.clause_overrides?.[moduleId])) {
        errors.push(`terms_localizations.${lang}.clause_overrides.${moduleId} fehlt`);
      }
    }
  }

  return errors;
}
