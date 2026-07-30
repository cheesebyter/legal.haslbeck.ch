# Projektkonfiguration

Jedes Projekt wird durch eine sprachneutrale YAML-Datei beschrieben. Im
Quellprojekt ist dafür `legal/project.yml` vorgesehen; im zentralen
Legal-Repository werden die geprüften Konfigurationen unter
`projects/{project_id}.yml` geführt.

`projects/project.schema.json` ist das verbindliche Schema. Eine vollständige
Konfiguration zeigt `projects/capthook.yml`.

## Pflichtangaben

- `schema_version`: aktuell exakt `1`
- `project_id`: stabile, kleingeschriebene ID
- `name` und `domain`
- `contract_language`: verbindlich `de`
- `supported_languages`
- `contact`: Referenz auf eine zentrale Adresse oder ausdrücklicher Override
- `documents`: Impressum, Datenschutz und AGB explizit an/aus
- `features`: jede relevante Funktion explizit als Boolean
- `providers`: ausschließlich stabile IDs aus dem Anbieterkatalog
- `retention`: strukturierte Aufbewahrungsregeln

Aufbewahrung wird als `until_deletion`, konkrete `duration` oder
`legal_obligation` mit Begründung modelliert. Texte, Namen, Domains,
E-Mail-Adressen und Zahlen werden nicht pro Sprache dupliziert.

## Beispiel für eine konkrete Frist

```yaml
retention:
  server_logs:
    basis: duration
    value: 30
    unit: days
```

Unbekannte Felder, ungültige Referenzen und fehlende Pflichtangaben werden mit
`LEGAL-007` automatisiert geprüft.

## AGB

`documents.terms.enabled` steuert AGB pro Projekt. Bei aktivierten AGB werden
die gemeinsamen Klauselmodule über `terms_modules` ausgewählt und konkrete
Vertragswerte unter `terms_config` gepflegt. Pflichtmodule und
modulabhängige Werte werden automatisch geprüft. Das vollständige Modell ist
in [`terms-model.md`](terms-model.md) beschrieben.
