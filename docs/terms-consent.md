# AGB-Versionen und Zustimmungsnachweis

Veröffentlichte AGB werden vor dem Deployment als statische, unveränderliche
Snapshots archiviert:

```bash
npm run archive:terms -- --project=capthook
```

Die öffentliche URL lautet:

```text
/{sprache}/{project_id}/agb/version/{document_version}
```

Das Archivskript:

- akzeptiert keine `-draft`-Version,
- verlangt freigegebene deutsche Module und Übersetzungen,
- rendert alle Projektsprachen,
- schreibt mit exklusivem Dateimodus und verweigert vorhandene Versionen,
- speichert zusätzlich ein Release-Manifest mit Projekt, Version,
  Wirksamkeitsdatum, Modulen und Änderungsprozess.

Frühere Snapshot-Verzeichnisse werden bei neuen Releases nicht verändert oder
gelöscht. Sie bleiben zusätzlich über Git und Releases nachvollziehbar.

## Projektintegration

Ein Projekt mit Online-Vertragsabschluss speichert mindestens:

- Projekt-ID,
- AGB-Version,
- Sprache,
- unveränderliche Snapshot-URL,
- Zeitpunkt der aktiven Zustimmung,
- Zeitpunkt des Vertragsabschlusses.

Die Projektkonfiguration legt über `material_change_process` fest, ob
wesentliche Änderungen nur mitgeteilt werden (`notify`) oder eine erneute
aktive Zustimmung erfordern (`reconsent`). Bei `notify` ist zusätzlich
`material_change_notice_days` erforderlich.

Die Release-Validierung blockiert aktivierte AGB, wenn Snapshot, veröffentlichter
Änderungsprotokolleintrag oder Freigabestatus fehlen.
