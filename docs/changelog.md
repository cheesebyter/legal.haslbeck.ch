# Öffentliches Änderungsprotokoll

Wesentliche Änderungen an den Rechtstexten werden pro Projekt in
`data/changelog.yml` gepflegt und unter
`/{sprache}/{project_id}/aenderungen` veröffentlicht.

Jeder Eintrag enthält:

- eine eindeutige Version,
- ein Datum,
- den Status `draft` oder `published`,
- die betroffenen Dokumenttypen,
- eine Zusammenfassung in allen unterstützten Projektsprachen.

Nur Änderungen mit rechtlicher oder inhaltlicher Bedeutung gehören in dieses
Protokoll. Technische Umbauten, Layoutkorrekturen und rein redaktionelle
Korrekturen ohne geänderte Aussage bleiben über Git-Commits, Pull Requests und
Releases intern nachvollziehbar.

Einträge mit Status `published` dürfen keine `-draft`-Version verwenden.
Unbekannte Projekte, deaktivierte Dokumente, doppelte Versionen oder fehlende
Übersetzungen werden durch `npm test` blockiert.

Die derzeitigen Einträge kennzeichnen die noch nicht rechtlich freigegebenen
Fassungen ausdrücklich als Entwurf. Beim ersten Release werden Version,
Prüfstatus und Änderungsprotokoll gemeinsam auf die freigegebene Fassung
umgestellt.
