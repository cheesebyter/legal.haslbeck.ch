# AGB-Übersetzungen

Die 16 deutschen AGB-Ausgangsmodule sind vollständig auf Französisch,
Italienisch, Spanisch und Englisch übertragen. Die Übersetzungen liegen in:

- `content/terms/fr.yml`
- `content/terms/it.yml`
- `content/terms/es.yml`
- `content/terms/en.yml`

Jedes übersetzte Modul besitzt `version`, `source_version`, `date`,
`review_status` und den übersetzten Inhalt. `source_version` muss exakt mit
der Version des zugehörigen deutschen Moduls übereinstimmen.

## Projektspezifische Vertragswerte

Freitexte aus `terms_config` werden nicht unverändert in andere Sprachen
übernommen. Ein AGB-Projekt muss unter `terms_localizations` für jede
unterstützte Sprache insbesondere Leistungsbeschreibung, Kündigungsregel,
Wartungshinweis, Nutzungsrecht, Beendigungsgründe und Klauselergänzungen
bereitstellen.

## Vertragssprache und Glossar

Deutsch bleibt die verbindliche Vertragssprache. Jede übersetzte AGB-Seite
enthält:

- einen Vorranghinweis zur deutschen Fassung,
- einen direkten Link auf die deutsche AGB-Seite,
- einen Link zur Datenschutzerklärung in derselben Sprache.

Das verbindliche Fachwortverzeichnis steht in `data/terms-glossary.yml` und
enthält die Kernbegriffe in allen fünf Sprachen.

## Freigabe

Die Übersetzungen sind technische Entwürfe mit
`review_status: professional-review-required`. Sie dürfen erst veröffentlicht
werden, nachdem fachkundige Muttersprachlerinnen oder Muttersprachler sowie die
juristische Prüfung die Terminologie und rechtliche Wirkung bestätigt haben.

Der normale Build blockiert fehlende Module, fehlende Metadaten und veraltete
`source_version`-Referenzen. Die Release-Validierung verlangt bei aktivierten
AGB zusätzlich für jedes ausgewählte Modul und jede Sprache:

- eine Version ohne `-draft`,
- den Prüfstatus `approved` oder `freigegeben`,
- eine aktuelle Referenz auf die deutsche Quellversion.
