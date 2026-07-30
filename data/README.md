# Zentrale Daten

Dieser Ordner enthält gemeinsame Betreiber- und Dienstleisterdaten. Angaben,
die für mehrere Projekte gelten, werden ausschliesslich hier gepflegt.

## Betreiber-Pflichtfelder

Die zentrale Datei `operator.yml` muss folgende nicht leere Felder enthalten:

- `name`
- `address.street`
- `address.postal_code`
- `address.city`
- `address.country`
- `email.general`
- `email.privacy`

Die E-Mail-Felder müssen syntaktisch gültige Adressen enthalten. Der Build
bricht mit Angabe von Datei und Feld ab, wenn ein Pflichtfeld fehlt oder leer
ist. Projektspezifische Kontaktadressen werden später in der jeweiligen
Projektkonfiguration referenziert und nicht in Templates kopiert.

## Dienstleister

`providers.yml` ist der zentrale Katalog aller von Projekten referenzierten
Dienstleister. Jede stabile ID enthält Firmenname beziehungsweise
Betriebsform, Sitz, Verwendungszweck und relevante offizielle Links.
Projektkonfigurationen enthalten nur diese IDs. Abweichungen dürfen
ausschliesslich über einen ausdrücklich benannten `provider_overrides`-Eintrag
erfolgen.

