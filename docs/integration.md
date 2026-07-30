# Legal-Links in Projekten

Impressum und Datenschutzerklärung müssen von jeder öffentlich relevanten
Projektseite ohne Anmeldung direkt erreichbar sein. AGB werden nur verlinkt,
wenn sie in der Projektkonfiguration aktiviert und veröffentlicht sind.

## URL-Schema

```text
https://legal.haslbeck.ch/{sprache}/{projekt}/impressum
https://legal.haslbeck.ch/{sprache}/{projekt}/datenschutz
https://legal.haslbeck.ch/{sprache}/{projekt}/agb
```

Erlaubte Sprachcodes sind `de`, `fr`, `it`, `es` und `en`. Ist die
Projektsprache unbekannt oder nicht unterstützt, muss `de` verwendet werden.
Die Sprache darf aus der bereits gewählten Projektsprache übernommen werden;
für die Legal-Seite ist kein Cookie erforderlich.

## Einfache HTML-Footer-Vorlage

Für eine ausschließlich deutsche Website:

```html
<footer>
  <nav aria-label="Rechtliche Hinweise">
    <a href="https://legal.haslbeck.ch/de/PROJEKT/impressum">Impressum</a>
    <a href="https://legal.haslbeck.ch/de/PROJEKT/datenschutz">Datenschutz</a>
  </nav>
</footer>
```

`PROJEKT` wird durch die stabile `project_id` ersetzt, beispielsweise
`capthook`, `weedli` oder `haslbeck`.

## Sprachwahl in serverseitigen Templates

Die Anwendung normalisiert ihre Sprache vor dem Rendern:

```js
const legalLanguages = new Set(["de", "fr", "it", "es", "en"]);
const legalLanguage = legalLanguages.has(projectLanguage)
  ? projectLanguage
  : "de";
```

Danach werden die Links mit `legalLanguage` erzeugt:

```html
<a href="https://legal.haslbeck.ch/{{ legalLanguage }}/PROJEKT/impressum">
  Impressum
</a>
<a href="https://legal.haslbeck.ch/{{ legalLanguage }}/PROJEKT/datenschutz">
  Datenschutz
</a>
```

## Prüfliste

- Links sind auf Start-, Login-, Registrierungs-, Bestell- und
  Zahlungsseiten sichtbar, soweit diese Seiten existieren.
- Links funktionieren in einem privaten Browserfenster ohne Anmeldung.
- Der Sprachcode entspricht der angezeigten Projektsprache.
- Nicht unterstützte Sprachen verwenden `de`.
- AGB werden nur bei `documents.terms.enabled: true` verlinkt.
- Projekt-ID und Dokumentpfad werden nicht aus frei eingegebenen URL-Teilen
  zusammengesetzt.

