# Deutsche AGB-Ausgangsfassung

LEGAL-028 stellt 16 zentrale deutsche Klauselmodule unter `content/terms/de/`
und das Seitentemplate `site/documents/terms.njk` bereit. Jedes Modul besitzt
eine eigene Version, ein Änderungsdatum und einen Prüfstatus.

Die Klauseln kombinieren zentrale Betreiberangaben mit den in
`terms_config` gepflegten projektspezifischen Werten. Fehlende Werte lösen
durch das strikte Nunjucks-Rendering einen Fehler aus. Ein
`clause_override` wird als ausdrücklich gekennzeichnete projektspezifische
Ergänzung ausgegeben.

## Rechtliche Leitplanken

Der Entwurf orientiert sich insbesondere an:

- dem Schweizer Obligationenrecht für Vertragsschluss und Haftung,
- Artikel 8 UWG zur Missbrauchskontrolle vorformulierter AGB,
- zwingenden Gerichtsständen und Konsumentenschutzbestimmungen,
- dem Schweizer Datenschutzgesetz sowie der projektspezifischen
  Datenschutzerklärung.

Primärquellen:

- [Obligationenrecht, SR 220](https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de)
- [Bundesgesetz gegen den unlauteren Wettbewerb](https://www.fedlex.admin.ch/eli/cc/1988/223_223_223/de)
- [Schweizerische Zivilprozessordnung](https://www.fedlex.admin.ch/eli/cc/2010/262/de)
- [Bundesgesetz über den Datenschutz](https://www.fedlex.admin.ch/eli/cc/2022/491/de)

## Freigabestatus

Die freigegebene Erstfassung aller Module trägt `1.0.0` und
`review_status: freigegeben`.

CaptHook erzeugt fünf freigegebene AGB-Seiten. Weedli und Haslbeck.ch behalten
`documents.terms.enabled: false`.

## Prüfung

`npm test` prüft:

- alle ausgewählten Module und ihre Metadaten,
- Projektname, Domain, Betreiber und konfigurierbare Vertragswerte,
- modulare Klausel-Overrides,
- den Datenschutzlink,
- nicht ersetzte Template-Ausdrücke,
- das Ausbleiben produktiver AGB-Seiten bei deaktivierten AGB.
