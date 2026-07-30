# Modulares AGB-Datenmodell

AGB werden pro Projekt über `documents.terms.enabled` aktiviert. Solange der
Wert `false` ist, müssen `terms_modules` leer bleiben und `terms_config` darf
nicht vorhanden sein. Dadurch wird keine AGB-Seite erzeugt.

## Zentrale Klauselmodule

`data/terms-modules.yml` ist der gemeinsame Modulkatalog. Er enthält die 16 in
LEGAL-027 vorgesehenen Vertragsbereiche. Jede Definition legt fest:

- den deutschen Modultitel,
- ob das Modul für jedes AGB-Projekt verpflichtend ist,
- welche projektspezifischen Felder bei Aktivierung benötigt werden.

Projekte speichern nur die ausgewählten IDs in `terms_modules`; gemeinsame
Klauseltexte werden nicht in Projektdateien kopiert. Die eigentlichen
versionierten Klauseltexte werden mit LEGAL-028 ergänzt.

## Projektspezifische Vertragsdaten

Ein Projekt mit aktivierten AGB benötigt `terms_config`. Das Schema unterstützt
insbesondere:

- Betreiberreferenz und verbindliche Vertragssprache Deutsch,
- Zielgruppe und Art des Vertragsabschlusses,
- Leistungsbeschreibung und Kontopflicht,
- Preismodell, Währung und Steuerdarstellung,
- Laufzeit, Verlängerung und Kündigungsregel,
- Wartungshinweis und Umfang der Nutzungsrechte,
- Gründe für Sperrung oder Beendigung,
- Schweizer Recht und projektspezifischen Gerichtsstand,
- gezielte `clause_overrides` für aktivierte Module.

Ein Override ist eine projektspezifische Abweichung. Er darf nur auf ein
aktiviertes Modul verweisen und ersetzt nicht den zentralen Modulkatalog.

## Validierung

`npm test` kontrolliert:

- Übereinstimmung zwischen Allowlist und Modulkatalog,
- alle universellen Pflichtmodule,
- modulabhängige Pflichtangaben,
- gültige Datentypen und Werte,
- ausschließlich aktivierte Module in `clause_overrides`,
- Deutsch als verbindliche Vertragssprache,
- leere AGB-Konfiguration bei deaktivierten AGB,
- das Ausbleiben einer AGB-Seite bei deaktivierten AGB.

Ein vollständiges, nur für Tests aktiviertes Beispiel steht in
`tests/terms-model.test.js`. Die produktiven Projekte behalten AGB bis zur
Umsetzung und rechtlichen Prüfung von LEGAL-028 und LEGAL-029 deaktiviert.
