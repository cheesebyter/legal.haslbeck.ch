# Pflegehandbuch

Dieses Handbuch beschreibt wiederkehrende Änderungen am zentralen Legal-Service.
Alle Befehle werden im Verzeichnis `legal/` ausgeführt. Änderungen an
Rechtstexten dürfen erst nach fachlicher und rechtlicher Freigabe produktiv
werden.

## Standardablauf

1. Einen eigenen Git-Branch erstellen.
2. Daten oder Texte ändern.
3. `npm test` ausführen und die erzeugten Seiten lokal prüfen.
4. Änderungen prüfen lassen und über einen Pull Request zusammenführen.
5. Vor einem Release zusätzlich `npm run validate:release` ausführen.

Die CI wiederholt Validierung, Build, Tests, Audit und Docker-Build. Ein Merge
auf `main` kann nur dann produktiv ausgerollt werden, wenn keine
Entwurfsfassung mehr vorhanden ist.

## Neues Projekt hinzufügen

1. `projects/{project_id}.yml` anhand von `projects/capthook.yml` anlegen.
2. Eine dauerhafte, kleingeschriebene `project_id`, Domain, Sprachen und
   Kontaktangaben eintragen.
3. Unter `documents` nur die tatsächlich benötigten Dokumente aktivieren.
4. Funktionen, Anbieter, Datenschutzmodule und Aufbewahrungsregeln auf den
   realen Projektstand abstimmen. Nicht verwendete Funktionen bleiben
   ausdrücklich `false`.
5. `npm test` ausführen und die URLs
   `/{sprache}/{project_id}/impressum` und
   `/{sprache}/{project_id}/datenschutz` prüfen.
6. Die Links nach `docs/integration.md` in das Projekt einbauen.

Bei einem angebundenen Quellprojekt wird zusätzlich dessen
`legal/project.yml` gepflegt. Der in `docs/project-import.md` beschriebene
Import erzeugt daraus einen prüfbaren Pull Request; er veröffentlicht niemals
direkt.

## Betreiber- oder Adressdaten ändern

Gemeinsame Betreiber-, Adress- und E-Mail-Angaben stehen in
`data/operator.yml`. Nach einer Änderung:

1. kontrollieren, welche Projekte die zentrale E-Mail über
   `contact.email_ref` verwenden,
2. bei projektspezifischen Kontakten stattdessen `contact.email_override` in
   der jeweiligen Projektdatei setzen,
3. `npm test` ausführen,
4. Impressum und Datenschutzerklärung jedes betroffenen Projekts in der
   Vorschau kontrollieren.

Eine Adressänderung ist eine inhaltliche Änderung. Deshalb müssen die
betroffenen Dokumentversionen und Übersetzungen wie unten beschrieben
aktualisiert und erneut freigegeben werden.

## Datenschutzmodul aktivieren

Die erlaubten Modul-IDs stehen in `data/modules.yml`; die Textblöcke befinden
sich in `content/privacy/{sprache}.md`.

1. Die zugehörige Funktion unter `features` in der Projektdatei korrekt setzen.
2. Die Modul-ID unter `privacy_modules` ergänzen.
3. Falls das Modul konkrete Angaben benötigt, unter `privacy_details` Zweck,
   Datenkategorien, Empfänger und `retention_refs` eintragen.
4. Referenzierte Aufbewahrungsregeln unter `retention` und Empfänger unter
   `providers` ergänzen.
5. Sicherstellen, dass der bedingte Textblock in allen fünf Sprachdateien
   vorhanden und inhaltlich aktuell ist.
6. `npm test` ausführen und prüfen, dass der Abschnitt nur bei den vorgesehenen
   Projekten erscheint.

Die Validierung weist unbekannte Module, Anbieter und Aufbewahrungsreferenzen
zurück.

## Neuen Dienstleister ergänzen

1. In `data/providers.yml` eine stabile, kleingeschriebene ID ergänzen.
2. Name, Sitz, Kategorie, externen Status, Zweck und offizielle Links
   vollständig eintragen.
3. Die ID in den betroffenen Projektdateien unter `providers` und bei den
   passenden `privacy_details.*.recipients` ergänzen.
4. Falls nötig, den gemeinsamen Rechtstext in allen Sprachen um die
   Datenbearbeitung oder Auslandübermittlung erweitern.
5. `npm test` ausführen und die betroffenen Seiten prüfen.

Abweichende projektspezifische Angaben gehören unter `provider_overrides` in
die Projektdatei; der gemeinsame Katalog wird nicht für ein einzelnes Projekt
umgeschrieben.

## Deutsche Texte und Übersetzungen ändern

Deutsch ist die Ausgangsfassung. Die Dateien liegen unter
`content/imprint/de.md` und `content/privacy/de.md`.

1. Zuerst ausschließlich die deutsche Fassung inhaltlich ändern.
2. Im Frontmatter `version`, `source_version`, `date`, `change_reason` und
   `review_status` aktualisieren. In Deutsch müssen `version` und
   `source_version` identisch sein.
3. Die deutsche Änderung fachlich und rechtlich prüfen lassen.
4. Danach `fr`, `it`, `es` und `en` aktualisieren.
5. In jeder Übersetzung `source_version` exakt auf die deutsche `version`
   setzen und eine eigene `version`, ein Datum, einen Änderungsgrund und den
   Prüfstatus pflegen.
6. `npm test` ausführen. Veraltete Übersetzungen werden beim normalen Build
   blockiert.

Für eine unfertige Vorschau darf `npm run dev` fehlende oder veraltete
Übersetzungen als Warnung behandeln. Diese Ausnahme gilt nicht für CI oder
Produktion.

## Version erhöhen und freigeben

Versionen folgen `MAJOR.MINOR.PATCH`:

- `PATCH` für redaktionelle Korrekturen ohne geänderte Aussage,
- `MINOR` für neue Abschnitte, Anbieter oder Datenbearbeitungen,
- `MAJOR` für grundlegende Änderungen mit erheblicher rechtlicher Wirkung.

Während der Bearbeitung wird `-draft` angehängt und
`review_status: fachlich-und-rechtlich-zu-pruefen` verwendet. Nach
dokumentierter Freigabe:

1. `-draft` aus allen betroffenen Fassungen entfernen,
2. `review_status` auf `freigegeben` setzen,
3. Datum und Änderungsgrund abschließend prüfen,
4. `npm test` und `npm run validate:release` ausführen.

Die auf der Website sichtbare Version und das Datum werden automatisch aus
dem Frontmatter der jeweiligen Sprachfassung übernommen.

Wesentliche inhaltliche Änderungen werden außerdem pro betroffenem Projekt in
`data/changelog.yml` ergänzt. Der Eintrag erhält dieselbe Version und dasselbe
Datum, die betroffenen Dokumenttypen sowie eine Zusammenfassung in allen
unterstützten Sprachen. Technische oder rein redaktionelle Änderungen ohne
geänderte rechtliche Aussage werden dort nicht eingetragen.

Bei Änderungen an deutschen AGB-Modulen müssen anschließend die vier
Übersetzungskataloge unter `content/terms/{fr,it,es,en}.yml` aktualisiert
werden. Jede `source_version` wird auf die neue deutsche Modulversion gesetzt.
Neue oder geänderte projektspezifische AGB-Freistexte werden zusätzlich unter
`terms_localizations` in allen unterstützten Sprachen gepflegt. Die
Terminologie wird gegen `data/terms-glossary.yml` geprüft.

Vor der ersten Veröffentlichung einer freigegebenen AGB-Version wird ihr
unveränderlicher Snapshot erzeugt:

```bash
npm run archive:terms -- --project={project_id}
```

Ein vorhandenes Versionsarchiv darf nie ersetzt werden. Nach dem Archivieren
wird ein veröffentlichter `terms`-Eintrag mit identischer Version und
identischem Wirksamkeitsdatum in `data/changelog.yml` ergänzt. Erst danach darf
die Version im jeweiligen Projekt für den Zustimmungsdialog konfiguriert
werden.

## Lokale Vorschau starten

Voraussetzungen sind Node.js 22 und einmalig installierte Abhängigkeiten:

```bash
npm ci
npm run dev
```

Die Vorschau ist anschließend unter `http://localhost:8080` erreichbar und
wird bei Dateiänderungen neu gebaut. Vor dem Commit immer den strengeren
vollständigen Lauf ausführen:

```bash
npm test
```

## Rollback durchführen

Ein Rollback stellt ein bereits veröffentlichtes, unveränderliches
Container-Image wieder her.

1. In GitHub Actions den Workflow **Roll back production** öffnen.
2. Die vollständige frühere Image-URI
   `ghcr.io/{owner}/{repository}:{40-stelliger-commit}` eintragen.
3. Den dazugehörigen vollständigen 40-stelligen Git-Commit eintragen.
4. Den Workflow starten und die Freigabe des Environments `production`
   bestätigen.
5. Den erfolgreichen Healthcheck sowie Impressum und Datenschutz aller
   Projekte prüfen.

Das Deployment-Playbook speichert das zuvor laufende Image zusätzlich unter
`/opt/apps/legal-haslbeck/previous-image`. Rollbacks verwenden trotzdem immer
eine explizite Image-URI und den passenden Commit, damit die wiederhergestellte
Fassung eindeutig nachvollziehbar bleibt. Weitere technische Einzelheiten
stehen in `docs/deployment.md`.

## Abschlusskontrolle

- Keine Platzhalter oder Entwurfshinweise in einer freigegebenen Fassung.
- Alle aktivierten Sprachen und Dokumente wurden geprüft.
- Deaktivierte Module erscheinen nicht.
- Footer-Links der betroffenen Projekte funktionieren.
- `npm test` ist erfolgreich.
- Vor Produktion ist `npm run validate:release` erfolgreich.
- Versionsnummer, Datum, Prüfstatus und Änderungsgrund sind dokumentiert.
