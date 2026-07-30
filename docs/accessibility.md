# Barrierefreiheit und responsive Darstellung

Die generierten Rechtstextseiten verwenden semantische Bereiche, genau eine
Hauptüberschrift und eine fortlaufende Überschriftenhierarchie. Ein
lokalisierter Sprunglink führt Tastaturnutzende direkt zum Hauptinhalt. Der
Sprachumschalter besitzt eine zugängliche Bezeichnung und kennzeichnet die
aktuelle Sprache mit `aria-current`.

## Automatische Prüfung

```bash
npm test
```

Die Tests prüfen für alle generierten Seiten:

- semantische Hauptbereiche und Überschriften,
- Sprunglink, Sprachumschalter und Fokusdarstellung,
- Mindestschriftgrösse sowie responsive CSS-Regeln,
- Druckregeln und die Ausgabe externer Linkziele.

## Manuelle Browserprüfung

Am 29. Juli 2026 wurde die deutsche CaptHook-Datenschutzseite zusätzlich in
einem echten Browser bei 320 × 640 Pixel geprüft:

- kein horizontales Scrollen,
- Grundschrift 16 Pixel,
- ein `h1`, danach ausschliesslich `h2`,
- alle fünf Sprachlinks vorhanden,
- Text- und Linkkontrast mindestens 7,23:1,
- lesbare Druckdarstellung mit ausgeblendeter Navigation und ausgeschriebenen
  externen Linkzielen.

Die Druckansicht ist so gestaltet, dass Browser sie auch als gut lesbares PDF
speichern können. Vor einer produktiven Freigabe sollte die manuelle
Tastatur- und PDF-Sichtprüfung nochmals mit den freigegebenen Rechtstexten
wiederholt werden.
