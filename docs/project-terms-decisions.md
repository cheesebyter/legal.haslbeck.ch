# AGB-Entscheidungen der bestehenden Projekte

Stand: 29. Juli 2026. Die technische Konfiguration ersetzt keine juristische
Freigabe.

## CaptHook

AGB sind erforderlich und in der Projektkonfiguration aktiviert, weil CaptHook:

- registrierte Benutzerkonten bereitstellt,
- einen Free-Tarif und ein entgeltliches Pro-Abonnement anbietet,
- den Pro-Vertrag online mit aktiver Zustimmung abschließt,
- CHF 9 pro Monat über Stripe abrechnet,
- das Abonnement automatisch monatlich verlängert und zum Ende des laufenden
  Abrechnungszeitraums kündbar macht.

Aktiviert sind alle 16 Module. Das entspricht dem tatsächlichen Modell mit
Kundenkonto, Online-Vertragsabschluss, Tarifgrenzen, zulässiger Nutzung,
Wartung, Nutzungsrechten, Haftung, Datenschutz, Sperrung und Schweizer Recht.

Die Leistungsgrenzen stimmen mit CaptHook überein:

| Tarif | Preis | Pipes | Ziele je Pipe | Ereignisse/Monat | Support |
|---|---:|---:|---:|---:|---|
| Free | CHF 0 | 3 | 2 | 500 | Standard |
| Pro | CHF 9/Monat | 50 | 10 | 50.000 | E-Mail |

Die Fassung `1.0.0` ist in fünf Sprachen freigegeben und darf produktiv
veröffentlicht sowie in den Bestellprozess eingebunden werden. Der neue
Pro-Checkout bleibt weiterhin von der Konfiguration dieser unveränderlichen
Snapshot-Version abhängig.

## Weedli

Keine AGB. Die produktive Fassung ist eine unentgeltliche statische
Informationswebsite ohne Benutzerkonto, Bestellung, individuelle Leistung,
Zahlung oder Vertragsabschluss. Das nicht produktiv angebundene
.NET-/SQLite-Grundgerüst ändert diese Beurteilung nicht.

`documents.terms.enabled` bleibt `false`, `terms_modules` bleibt leer und es
werden keine AGB-Seiten erzeugt.

## Haslbeck.ch

Keine AGB. Die Website ist eine unentgeltliche statische persönliche
Informationswebsite ohne Benutzerkonto, Bestellung, individuelle Leistung,
Zahlung oder Vertragsabschluss.

`documents.terms.enabled` bleibt `false`, `terms_modules` bleibt leer und es
werden keine AGB-Seiten erzeugt.

## Erneute Prüfung

Die Entscheidung ist neu zu prüfen, sobald Weedli oder Haslbeck.ch
Registrierung, entgeltliche Leistungen, Bestellungen, Abonnemente oder andere
vertragliche Angebote einführen. Für CaptHook sind Preis-, Tarif-,
Leistungs- und Kündigungsänderungen gleichzeitig in Anwendung,
Projektkonfiguration, AGB-Modulen, Übersetzungen und Änderungsprotokoll
anzupassen.
