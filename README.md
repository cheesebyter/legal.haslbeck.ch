# Legal Haslbeck

Zentraler, statisch erzeugter Legal-Service für die Projekte von Andreas
Haslbeck. Die Website stellt Impressum, Datenschutzerklärung und – sofern für
ein Projekt aktiviert – Allgemeine Geschäftsbedingungen unter
`legal.haslbeck.ch` bereit.

Deutsch ist die inhaltliche Ausgangsfassung und verbindliche Vertragssprache.
Französisch, Italienisch, Spanisch und Englisch werden als versionierte
Übersetzungen geführt.

## Verzeichnisstruktur

- `data/`: zentrale Betreiber- und Dienstleisterdaten
- `projects/`: sprachneutrale Projektkonfigurationen
- `content/`: versionierte Rechtstextmodule
- `templates/`: HTML-Layouts und Dokumentvorlagen
- `public/`: statische, unverändert zu kopierende Dateien
- `tests/`: automatisierte Validierungs- und Seitentests

Generierte HTML-Dateien werden nach `_site/` geschrieben und nicht in Git
versioniert.

## Lokal starten

Voraussetzung ist Node.js 22. Abhängigkeiten installieren und die statische
Website erzeugen:

```bash
npm ci
npm run build
```

Die lokale Vorschau mit automatischem Neuladen startet mit:

```bash
npm run dev
```

Die Vorschau ist standardmässig unter `http://localhost:8080` erreichbar.

Die standardisierte Einbindung in Projekt-Footer ist in
[`docs/integration.md`](docs/integration.md) beschrieben.
Die durchgeführten Prüfungen zur Barrierefreiheit sind in
[`docs/accessibility.md`](docs/accessibility.md) dokumentiert.
Wiederkehrende Änderungen und Rollbacks beschreibt das
[`Pflegehandbuch`](docs/maintenance.md).
Die Regeln für öffentliche, wesentliche Änderungen stehen unter
[`Öffentliches Änderungsprotokoll`](docs/changelog.md).
Das noch deaktivierte modulare AGB-Modell ist unter
[`Modulares AGB-Datenmodell`](docs/terms-model.md) beschrieben.
Die freigegebene deutsche AGB-Ausgangsfassung ist unter
[`Deutsche AGB-Ausgangsfassung`](docs/terms-authoring.md) dokumentiert.
Metadaten, Glossar und Freigabeprozess der Übersetzungen beschreibt
[`AGB-Übersetzungen`](docs/terms-translations.md).
Unveränderliche Versionen und den Zustimmungsnachweis beschreibt
[`AGB-Versionen und Zustimmungsnachweis`](docs/terms-consent.md).
Die projektspezifischen AGB-Entscheidungen stehen unter
[`AGB-Entscheidungen der bestehenden Projekte`](docs/project-terms-decisions.md).

## Rechtliche Prüfung

Die technische Generierung ersetzt keine fachliche oder rechtliche Prüfung.
Deutsche Ausgangstexte und Übersetzungen dürfen erst nach dokumentierter
Prüfung produktiv freigegeben werden.

Die dokumentierte Freigabe der Erstfassungen ist erfolgt. Sie tragen die
Version `1.0.0`; Impressum, Datenschutz und die für CaptHook aktivierten AGB
sind für die produktive Veröffentlichung vorbereitet.

## Verantwortlichkeit und Lizenz

Verantwortlich für Inhalt und Betrieb ist Andreas Haslbeck. Der Quellcode und
die Rechtstexte sind nicht zur allgemeinen Weiterverwendung freigegeben.
Details stehen in [LICENSE](LICENSE).

## Ticketstand

- `LEGAL-001`: abgeschlossen
- `LEGAL-002`: abgeschlossen
- `LEGAL-003`: abgeschlossen
- `LEGAL-004`: abgeschlossen
- `LEGAL-005`: abgeschlossen
- `LEGAL-006`: abgeschlossen
- `LEGAL-007`: abgeschlossen
- `LEGAL-008`: abgeschlossen
- `LEGAL-009`: abgeschlossen
- `LEGAL-010`: abgeschlossen und freigegeben
- `LEGAL-011`: abgeschlossen
- `LEGAL-012`: abgeschlossen
- `LEGAL-013`: abgeschlossen
- `LEGAL-014`: abgeschlossen
- `LEGAL-015`: abgeschlossen
- `LEGAL-016`: abgeschlossen
- `LEGAL-017`: abgeschlossen
- `LEGAL-018`: abgeschlossen
- `LEGAL-019`: abgeschlossen
- `LEGAL-020`: technisch abgeschlossen und zur Produktivsetzung freigegeben
- `LEGAL-021`: abgeschlossen
- `LEGAL-022`: abgeschlossen
- `LEGAL-023`: abgeschlossen
- `LEGAL-024`: abgeschlossen
- `LEGAL-025`: abgeschlossen
- `LEGAL-026`: abgeschlossen
- `LEGAL-027`: abgeschlossen
- `LEGAL-028`: abgeschlossen und freigegeben
- `LEGAL-029`: abgeschlossen und freigegeben
- `LEGAL-030`: technisch abgeschlossen; AGB-Version `1.0.0` ist freigegeben
- `LEGAL-031`: abgeschlossen und freigegeben
- `LEGAL-032`: abgeschlossen

## Aktuell erzeugte Projekte

- CaptHook: Impressum, Datenschutz und AGB-Version `1.0.0` in fünf Sprachen;
  zur produktiven Veröffentlichung freigegeben.
- Weedli: Impressum und Datenschutz in fünf Sprachen; keine AGB. Berücksichtigt
  wird nur die produktive statische Website, nicht das unverbundene
  .NET-/SQLite-Grundgerüst.
- Haslbeck.ch: Impressum und Datenschutz in fünf Sprachen; keine AGB,
  Benutzerkonten, Cookies oder Analysewerkzeuge.
