# Legal Haslbeck – Umsetzungsbacklog

## Ziel

Unter `legal.haslbeck.ch` werden Impressum, Datenschutzerklärung und AGB für mehrere Projekte zentral bereitgestellt. Gemeinsame Angaben werden nur einmal gepflegt, während projektspezifische Angaben aus einer Projektkonfiguration stammen.

Die bestehenden Projekte `haslbeck.ch`, `weedli.ch` und `capthook.ch` werden von Anfang an berücksichtigt.

Unterstützte Sprachen:

- Deutsch (`de`) – verbindliche Vertragssprache und inhaltliche Ausgangsversion
- Französisch (`fr`)
- Italienisch (`it`)
- Spanisch (`es`)
- Englisch (`en`)

## Technische Leitplanken

- Statische Seitengenerierung, empfohlen mit Eleventy
- Gemeinsame Daten in YAML
- Rechtstexte als versionierte Markdown-Module
- Projektspezifische Konfiguration über `legal/project.yml`
- Ausgabe als statisches HTML
- Bereitstellung als Docker-Container
- Automatisierter Build und Deployment über GitHub Actions
- Kein JavaScript, keine API und kein `iframe` zum Nachladen rechtlich notwendiger Inhalte
- AGB werden nur für Projekte ausgegeben, bei denen sie benötigt und ausdrücklich aktiviert sind

## Definition of Done

Ein Ticket gilt als abgeschlossen, wenn:

- die Akzeptanzkriterien erfüllt sind,
- automatisierte Tests erfolgreich laufen,
- die Dokumentation angepasst wurde,
- keine Secrets im Repository enthalten sind,
- die generierten Seiten mobil und auf Desktop funktionieren,
- die deutsche und alle betroffenen Übersetzungen denselben Versionsstand besitzen.

---

# Epic 1 – Projektgrundlage

## LEGAL-001 – Repository und Grundstruktur erstellen

**Priorität:** Muss  
**Abhängigkeiten:** keine

**Beschreibung**

Ein neues Repository für den zentralen Legal-Service erstellen und die Verzeichnisstruktur für Daten, Projekte, Templates, Inhalte und generierte Dateien anlegen.

**Akzeptanzkriterien**

- Das Repository enthält eine README mit Zweck und lokaler Startanleitung.
- Die Verzeichnisse `data`, `projects`, `content`, `templates`, `public` und `tests` sind vorhanden.
- Die generierten Dateien werden nicht unnötig im Git-Repository versioniert.
- Eine passende `.gitignore` ist vorhanden.
- Lizenz und Verantwortlichkeit des Repositorys sind dokumentiert.

## LEGAL-002 – Statischen Seitengenerator einrichten

**Priorität:** Muss  
**Abhängigkeiten:** LEGAL-001

**Beschreibung**

Eleventy als statischen Seitengenerator konfigurieren. Aus Testdaten soll eine erste HTML-Seite erzeugt werden.

**Akzeptanzkriterien**

- `npm run build` erzeugt die Website reproduzierbar.
- `npm run dev` startet eine lokale Vorschau.
- Quell- und Zielverzeichnisse sind klar getrennt.
- Ein fehlerhafter Build liefert einen Exit-Code ungleich null.
- Die generierte Testseite ist ohne clientseitiges JavaScript lesbar.

## LEGAL-003 – Docker-Image erstellen

**Priorität:** Muss  
**Abhängigkeiten:** LEGAL-002

**Beschreibung**

Einen mehrstufigen Docker-Build erstellen. Die Website wird gebaut und anschliessend durch einen schlanken Webserver ausgeliefert.

**Akzeptanzkriterien**

- `docker build` läuft erfolgreich.
- Der finale Container enthält nur die benötigten Laufzeitdateien.
- Die statischen Seiten sind über HTTP erreichbar.
- Ein Healthcheck ist vorhanden.
- Der Container läuft ohne Root-Berechtigungen, soweit der verwendete Webserver dies unterstützt.

---

# Epic 2 – Datenmodell

## LEGAL-004 – Zentrale Betreiber-Stammdaten definieren

**Priorität:** Muss  
**Abhängigkeiten:** LEGAL-001

**Beschreibung**

Ein YAML-Schema für gemeinsame Angaben wie verantwortliche Person, Anschrift und Kontaktadressen definieren.

**Beispieldaten**

```yaml
name: Andreas Haslbeck
address:
  street: ""
  postal_code: ""
  city: ""
  country: Schweiz
email:
  general: ""
  privacy: ""
```

**Akzeptanzkriterien**

- Gemeinsame Daten werden in genau einer zentralen Datei gepflegt.
- Pflichtfelder sind dokumentiert.
- E-Mail-Adressen und Anschrift werden in den Templates nicht dupliziert.
- Fehlende Pflichtfelder führen zu einem Build-Fehler.

## LEGAL-005 – Schema für Projektkonfiguration erstellen

**Priorität:** Muss  
**Abhängigkeiten:** LEGAL-004

**Beschreibung**

Ein sprachneutrales Schema für `legal/project.yml` definieren. Es beschreibt Domain, Projektname, Kontakte, Funktionen, Dienstleister und Aufbewahrungsfristen.

**Akzeptanzkriterien**

- Das Schema besitzt eine `schema_version`.
- Projekt-ID, Name, Domain und Vertragssprache sind Pflichtfelder.
- Unterstützte Funktionen können explizit aktiviert oder deaktiviert werden.
- Externe Dienstleister werden über stabile IDs referenziert.
- Aufbewahrungsfristen können als strukturierte Werte angegeben werden.
- Eine vollständige Beispieldatei ist dokumentiert.

## LEGAL-006 – Katalog externer Dienstleister erstellen

**Priorität:** Soll  
**Abhängigkeiten:** LEGAL-005

**Beschreibung**

Wiederkehrende Dienstleister wie Hosting-, E-Mail-, Analyse- oder Zahlungsanbieter zentral definieren.

**Akzeptanzkriterien**

- Jeder Anbieter besitzt eine eindeutige ID.
- Firmenname, Sitz, Verwendungszweck und relevante Links sind zentral hinterlegt.
- Projekte referenzieren Anbieter nur über deren ID.
- Änderungen an einem Anbieter werden nach dem Build in allen betroffenen Projekten übernommen.
- Projektspezifische Abweichungen können ausdrücklich überschrieben werden.

## LEGAL-007 – Konfiguration automatisch validieren

**Priorität:** Muss  
**Abhängigkeiten:** LEGAL-005, LEGAL-006

**Beschreibung**

Vor dem Build alle Betreiber-, Projekt- und Anbieterdaten gegen Schemas validieren.

**Akzeptanzkriterien**

- Ungültige Domains, Sprachcodes und E-Mail-Adressen werden erkannt.
- Nicht vorhandene Anbieter- und Modul-IDs werden erkannt.
- Unbekannte Konfigurationsfelder erzeugen mindestens eine Warnung.
- Fehlermeldungen nennen Datei und betroffenes Feld.
- Die Validierung läuft lokal und in der CI.

---

# Epic 3 – Rechtstexte und Module

## LEGAL-008 – Gemeinsames Impressum-Template erstellen

**Priorität:** Muss  
**Abhängigkeiten:** LEGAL-004, LEGAL-005

**Beschreibung**

Ein Impressum-Template erstellen, das zentrale Betreiberangaben und die eindeutige Projektzuordnung kombiniert.

**Akzeptanzkriterien**

- Projektname und zugehörige Domain werden ausdrücklich genannt.
- Verantwortlicher, Anschrift und Kontaktmöglichkeit werden aus zentralen Daten eingefügt.
- Eine projektspezifische Kontaktadresse kann verwendet werden.
- Die Seite enthält Versionsdatum und direkte URL zur deutschen Fassung.
- Für jedes konfigurierte Projekt kann ein Impressum erzeugt werden.

## LEGAL-009 – Modulare Datenschutzerklärung erstellen

**Priorität:** Muss  
**Abhängigkeiten:** LEGAL-005, LEGAL-006

**Beschreibung**

Die Datenschutzerklärung aus gemeinsamen Abschnitten und aktivierbaren Modulen zusammensetzen.

**Mindestens vorzusehende Module**

- Verantwortlicher
- Betroffenenrechte
- Datensicherheit
- Hosting und Server-Logs
- Kontaktaufnahme
- Benutzerkonten
- Webhook-Verarbeitung
- E-Mail-Versand
- Zahlungsabwicklung
- Analytics
- Cookies und ähnliche Technologien
- Datenübermittlung ins Ausland
- Aufbewahrung und Löschung

**Akzeptanzkriterien**

- Nur aktivierte projektspezifische Module werden ausgegeben.
- Gemeinsame Abschnitte werden nicht pro Projekt dupliziert.
- Zwecke, Datenkategorien, Empfänger und Aufbewahrung können projektspezifisch angegeben werden.
- Ein deaktiviertes Modul erscheint nicht in der Ausgabe.
- Fehlende Pflichtangaben eines aktivierten Moduls führen zu einem Build-Fehler.

## LEGAL-010 – Deutsche Ausgangstexte erfassen und prüfen

**Priorität:** Muss  
**Abhängigkeiten:** LEGAL-008, LEGAL-009

**Beschreibung**

Alle gemeinsamen Texte und Module zunächst vollständig auf Deutsch erfassen. Deutsch bildet die inhaltliche und versionierte Ausgangsfassung.

**Akzeptanzkriterien**

- Alle für das erste Projekt benötigten Module besitzen einen deutschen Text.
- Jeder Text besitzt eine eindeutige Versionsnummer.
- Datum und Grund der letzten Änderung sind nachvollziehbar.
- Platzhalter werden beim Build vollständig ersetzt.
- Nicht ersetzte Platzhalter führen zu einem Build-Fehler.
- Die Texte wurden vor Produktionsfreigabe fachlich beziehungsweise rechtlich geprüft.

---

# Epic 4 – Mehrsprachigkeit

## LEGAL-011 – Sprach- und URL-Konzept umsetzen

**Priorität:** Muss  
**Abhängigkeiten:** LEGAL-002

**Beschreibung**

Für Deutsch, Französisch, Italienisch, Spanisch und Englisch getrennte, direkt erreichbare URLs erzeugen.

**Zielstruktur**

```text
/de/{project}/impressum
/de/{project}/datenschutz
/de/{project}/agb
/fr/{project}/impressum
/fr/{project}/datenschutz
/fr/{project}/agb
/it/{project}/impressum
/it/{project}/datenschutz
/it/{project}/agb
/es/{project}/impressum
/es/{project}/datenschutz
/es/{project}/agb
/en/{project}/impressum
/en/{project}/datenschutz
/en/{project}/agb
```

**Akzeptanzkriterien**

- Alle fünf Sprachen werden unterstützt.
- Deutsch wird verwendet, wenn keine unterstützte Sprache bestimmt werden kann.
- Jede URL ist ohne Cookie und ohne JavaScript direkt aufrufbar.
- Ein Sprachwechsel führt zum gleichen Projekt und Dokumenttyp.
- Es erfolgt keine erzwungene, wiederholte Weiterleitung anhand der Browsersprache.

## LEGAL-012 – Übersetzungsstruktur und Vorrangklausel implementieren

**Priorität:** Muss  
**Abhängigkeiten:** LEGAL-010, LEGAL-011

**Beschreibung**

Für jeden gemeinsamen Text und jedes Datenschutzmodul Übersetzungen in `fr`, `it`, `es` und `en` ermöglichen. Auf den Übersetzungen wird transparent auf Deutsch als Vertragssprache und massgebende Fassung hingewiesen.

**Akzeptanzkriterien**

- Jede Übersetzung referenziert die Version ihrer deutschen Ausgangsfassung.
- Die Vorrangklausel ist in der jeweils angezeigten Sprache vorhanden.
- Die deutsche Fassung ist mit einem Klick erreichbar.
- Projektdaten wie Name, Domain, E-Mail und Zahlen werden nicht unnötig übersetzt oder dupliziert.
- Für fehlende Übersetzungen wird nicht stillschweigend ein gemischter Text veröffentlicht.

## LEGAL-013 – Übersetzungsstand im Build prüfen

**Priorität:** Muss  
**Abhängigkeiten:** LEGAL-012

**Beschreibung**

Der Build vergleicht die Version jeder Übersetzung mit der deutschen Ausgangsfassung.

**Akzeptanzkriterien**

- Eine veraltete oder fehlende Übersetzung führt im Produktions-Build zum Abbruch.
- Die Fehlermeldung nennt Modul, Sprache sowie Quell- und Übersetzungsversion.
- Ein lokaler Vorschau-Modus darf unvollständige Übersetzungen klar markieren.
- Der Produktions-Build darf keine Markierungen oder unvollständigen Texte enthalten.

## LEGAL-014 – Sprachumschalter und Metadaten ergänzen

**Priorität:** Soll  
**Abhängigkeiten:** LEGAL-011, LEGAL-012

**Beschreibung**

Auf jeder Seite einen zugänglichen Sprachumschalter sowie passende Sprach- und Suchmaschinen-Metadaten ergänzen.

**Akzeptanzkriterien**

- Alle fünf Sprachen sind sichtbar auswählbar.
- Das aktive Dokument ist erkennbar.
- Das HTML-Attribut `lang` ist korrekt gesetzt.
- `hreflang`-Verweise zeigen auf alle verfügbaren Sprachversionen.
- Canonical-URLs sind korrekt.
- Seitentitel und Beschreibungen sind lokalisiert.

---

# Epic 5 – Bestehende Projekte anbinden

## LEGAL-015 – CaptHook an den Legal-Service anbinden

**Priorität:** Muss  
**Abhängigkeiten:** LEGAL-007, LEGAL-010, LEGAL-013

**Beschreibung**

Das bestehende Projekt CaptHook konfigurieren und dessen tatsächliche Datenbearbeitungen und Vertragsleistungen abbilden.

**Akzeptanzkriterien**

- `capthook.ch` ist eindeutig als Geltungsbereich genannt.
- Alle tatsächlich verwendeten Dienstleister und Datenbearbeitungen sind konfiguriert.
- Impressum und Datenschutz werden in allen fünf Sprachen erzeugt.
- Sofern aktiviert, werden die CaptHook-AGB in allen fünf Sprachen erzeugt.
- Nicht verwendete Module erscheinen nicht.
- Die Links können im Footer von CaptHook eingesetzt werden.
- Die deutsche Fassung wurde vor der Veröffentlichung inhaltlich geprüft.

## LEGAL-016 – Weedli an den Legal-Service anbinden

**Priorität:** Soll  
**Abhängigkeiten:** LEGAL-015

**Beschreibung**

Das bestehende Projekt Weedli mit eigener Projektkonfiguration und den tatsächlich benötigten Datenschutz- und AGB-Modulen anbinden.

**Akzeptanzkriterien**

- `weedli.ch` ist eindeutig als Geltungsbereich genannt.
- Die Konfiguration ist von CaptHook unabhängig.
- Gemeinsame Betreiberangaben werden nicht kopiert.
- Impressum und Datenschutz werden in allen fünf Sprachen erzeugt.
- Sofern aktiviert, werden die Weedli-AGB in allen fünf Sprachen erzeugt.
- Die Links können im Footer von Weedli eingesetzt werden.

## LEGAL-017 – Haslbeck.ch an den Legal-Service anbinden

**Priorität:** Soll  
**Abhängigkeiten:** LEGAL-015

**Beschreibung**

Die bestehende Hauptdomain `haslbeck.ch` als eigenes Projekt an den Legal-Service anbinden.

**Akzeptanzkriterien**

- `haslbeck.ch` ist eindeutig als Geltungsbereich genannt.
- Nur die auf der Hauptdomain tatsächlich vorhandenen Bearbeitungen werden beschrieben.
- Impressum und Datenschutz werden in allen fünf Sprachen erzeugt.
- Sofern aktiviert, werden die AGB für `haslbeck.ch` in allen fünf Sprachen erzeugt.
- Die Links können im Footer von `haslbeck.ch` eingesetzt werden.

## LEGAL-018 – Projektseitige Legal-Links standardisieren

**Priorität:** Muss  
**Abhängigkeiten:** LEGAL-015

**Beschreibung**

Eine dokumentierte Integrationsvorgabe für alle Projekte erstellen.

**Akzeptanzkriterien**

- Impressum, Datenschutz und – sofern benötigt – AGB sind von jeder relevanten Seite direkt erreichbar.
- Die Projektsprache wird an die Legal-URL übergeben.
- Bei unbekannter Sprache wird auf Deutsch verlinkt.
- Die Links funktionieren ohne Anmeldung.
- Eine Codevorlage für einfache HTML-Footer ist dokumentiert.

---

# Epic 6 – Automatisierung und Betrieb

## LEGAL-019 – CI-Pipeline für Prüfung und Build erstellen

**Priorität:** Muss  
**Abhängigkeiten:** LEGAL-003, LEGAL-007, LEGAL-013

**Beschreibung**

Eine GitHub-Actions-Pipeline für Installation, Validierung, Tests und statischen Build einrichten.

**Akzeptanzkriterien**

- Die Pipeline läuft bei Pull Requests und Änderungen am Hauptbranch.
- Daten- und Übersetzungsvalidierung laufen vor dem Build.
- Ein fehlerhafter Build kann nicht veröffentlicht werden.
- Das Docker-Image wird reproduzierbar gebaut.
- Abhängigkeiten und Actions sind auf definierte Versionen festgelegt.

## LEGAL-020 – Deployment auf legal.haslbeck.ch automatisieren

**Priorität:** Muss  
**Abhängigkeiten:** LEGAL-019

**Beschreibung**

Nach erfolgreichem Build das Docker-Image veröffentlichen und die Website automatisiert bereitstellen.

**Akzeptanzkriterien**

- Nur ein erfolgreicher Hauptbranch-Build wird produktiv bereitgestellt.
- Das Deployment ist anhand eines Commits nachvollziehbar.
- Eine vorherige funktionierende Version kann wiederhergestellt werden.
- TLS ist aktiv.
- HTTP wird auf HTTPS umgeleitet.
- Sicherheitsrelevante HTTP-Header sind gesetzt.

## LEGAL-021 – Änderungen aus Projekt-Repositories übernehmen

**Priorität:** Soll  
**Abhängigkeiten:** LEGAL-005, LEGAL-019

**Beschreibung**

Einen automatisierten Prozess definieren, über den Änderungen an `legal/project.yml` eines Projekts einen geprüften Legal-Build auslösen.

**Empfohlener Ablauf**

1. Das Projekt validiert seine `legal/project.yml`.
2. Die Änderung wird als Pull Request in das Legal-Repository übertragen.
3. Vorschauseiten werden gebaut.
4. Nach Prüfung und Merge erfolgt das produktive Deployment.

**Akzeptanzkriterien**

- Ein Projekt kann die zentrale Website nicht ungeprüft direkt verändern.
- Änderungen sind einem Projekt-Commit zuordenbar.
- Vor dem Merge wird eine Vorschau oder ein Build-Artefakt erzeugt.
- Schemafehler blockieren die Übernahme.
- Rechtstextänderungen und reine Projektdatenänderungen sind unterscheidbar.

## LEGAL-022 – Verfügbarkeit und fehlerhafte Links überwachen

**Priorität:** Soll  
**Abhängigkeiten:** LEGAL-020

**Beschreibung**

Die Erreichbarkeit der Legal-Seiten und die Gültigkeit interner Links regelmässig prüfen.

**Akzeptanzkriterien**

- Die Startseite und alle produktiven Legal-URLs werden geprüft.
- HTTP-Fehler und TLS-Probleme werden erkannt.
- Interne Sprach- und Dokumentlinks werden auf Fehler geprüft.
- Bei einem Fehler wird eine Benachrichtigung ausgelöst.
- Die Überwachung benötigt keine personenbezogenen Tracking-Daten.

---

# Epic 7 – Qualität und Dokumentation

## LEGAL-023 – Automatisierte Seitentests erstellen

**Priorität:** Muss  
**Abhängigkeiten:** LEGAL-009, LEGAL-013

**Beschreibung**

Tests für generierte Dokumente und zentrale fachliche Regeln erstellen.

**Akzeptanzkriterien**

- Für jedes Projekt werden abhängig von der Konfiguration zehn oder fünfzehn Seiten erwartet: zwei beziehungsweise drei Dokumenttypen in fünf Sprachen.
- Jede Seite enthält Projektname, Domain, Verantwortlichen und Versionsdatum.
- Übersetzte Seiten enthalten die Vorrangklausel.
- Jede übersetzte Seite verlinkt die deutsche Fassung.
- Es bleiben keine Template-Platzhalter übrig.
- Deaktivierte Module werden nachweislich nicht ausgegeben.

## LEGAL-024 – Barrierefreiheit und responsive Darstellung prüfen

**Priorität:** Soll  
**Abhängigkeiten:** LEGAL-014

**Beschreibung**

Die Seiten für Tastaturbedienung, Screenreader und unterschiedliche Bildschirmgrössen optimieren.

**Akzeptanzkriterien**

- Die Dokumentstruktur verwendet sinnvolle Überschriften.
- Sprachumschalter und Links sind per Tastatur erreichbar.
- Fokuszustände sind sichtbar.
- Kontrast und Schriftgrösse sind ausreichend.
- Die Seiten sind auf kleinen Mobilgeräten ohne horizontales Scrollen lesbar.
- Drucken und Speichern als PDF ergeben eine lesbare Darstellung.

## LEGAL-025 – Pflegehandbuch erstellen

**Priorität:** Muss  
**Abhängigkeiten:** LEGAL-015, LEGAL-019

**Beschreibung**

Ein kurzes Handbuch für wiederkehrende Änderungen erstellen.

**Akzeptanzkriterien**

Das Handbuch erklärt:

- wie ein neues Projekt hinzugefügt wird,
- wie Betreiber- oder Adressdaten geändert werden,
- wie ein Datenschutzmodul aktiviert wird,
- wie ein neuer Dienstleister ergänzt wird,
- wie deutsche Texte geändert und Übersetzungen aktualisiert werden,
- wie Versionen erhöht werden,
- wie lokal eine Vorschau gestartet wird,
- wie ein Rollback durchgeführt wird.

## LEGAL-026 – Änderungsprotokoll auf der Website bereitstellen

**Priorität:** Kann  
**Abhängigkeiten:** LEGAL-010, LEGAL-013

**Beschreibung**

Wesentliche Änderungen an den Rechtstexten pro Projekt nachvollziehbar machen.

**Akzeptanzkriterien**

- Jede veröffentlichte Fassung besitzt ein Datum und eine Version.
- Wesentliche Änderungen können pro Projekt aufgelistet werden.
- Rein technische oder redaktionelle Änderungen müssen nicht öffentlich erscheinen.
- Frühere Fassungen bleiben intern über Git beziehungsweise Releases nachvollziehbar.

---

# Epic 8 – Allgemeine Geschäftsbedingungen

## LEGAL-027 – Modulares AGB-Datenmodell definieren

**Priorität:** Muss  
**Abhängigkeiten:** LEGAL-005

**Beschreibung**

Ein Datenmodell für gemeinsame und projektspezifische Vertragsbedingungen definieren. Ein Projekt kann AGB aktivieren und die für sein Geschäftsmodell benötigten Module auswählen.

**Mindestens vorzusehende Module**

- Geltungsbereich
- Vertragspartner und Vertragssprache
- Vertragsabschluss
- Leistungsbeschreibung
- Kundenkonto
- Preise, Steuern und Zahlungsbedingungen
- Laufzeit, Verlängerung und Kündigung
- Pflichten der Kundschaft
- Zulässige und unzulässige Nutzung
- Verfügbarkeit, Wartung und Änderungen
- Geistiges Eigentum und Nutzungsrechte
- Gewährleistung und Haftung
- Datenschutzverweis
- Sperrung und Vertragsbeendigung
- Anwendbares Recht und Gerichtsstand
- Schlussbestimmungen

**Akzeptanzkriterien**

- AGB können pro Projekt aktiviert oder deaktiviert werden.
- Gemeinsame Klauseln werden nicht pro Projekt kopiert.
- Projektspezifische Werte und Klauseln können konfiguriert werden.
- Pflichtmodule und Pflichtangaben werden validiert.
- Deutsch ist als verbindliche Vertragssprache konfiguriert.
- Ein Projekt ohne aktivierte AGB erhält keine AGB-Seite.

## LEGAL-028 – AGB-Templates und deutsche Ausgangsfassung erstellen

**Priorität:** Muss  
**Abhängigkeiten:** LEGAL-027

**Beschreibung**

Ein AGB-Template und die benötigten deutschen Ausgangsmodule erstellen. Die Ausgabe kombiniert zentrale Betreiberangaben, projektspezifische Vertragsdaten und die aktivierten Klauseln.

**Akzeptanzkriterien**

- Projektname, Domain, Vertragspartner und Geltungsbereich sind eindeutig.
- Preise, Laufzeiten, Kündigungsregeln und Leistungsumfang können projektspezifisch abgebildet werden.
- Jede deutsche Klausel besitzt eine Version und ein Änderungsdatum.
- Nicht ersetzte Platzhalter führen zu einem Build-Fehler.
- Die AGB verlinken die zugehörige Datenschutzerklärung.
- Die deutsche Fassung wird vor der produktiven Verwendung rechtlich geprüft.

## LEGAL-029 – AGB in alle unterstützten Sprachen übersetzen

**Priorität:** Muss  
**Abhängigkeiten:** LEGAL-012, LEGAL-013, LEGAL-028

**Beschreibung**

Die aktivierten AGB-Module auf Französisch, Italienisch, Spanisch und Englisch bereitstellen. Die deutsche Fassung bleibt rechtlich massgebend.

**Akzeptanzkriterien**

- Alle aktivierten Klauseln liegen in `de`, `fr`, `it`, `es` und `en` vor.
- Jede Übersetzung referenziert die Version der deutschen Ausgangsklausel.
- Veraltete oder fehlende Übersetzungen blockieren den Produktions-Build.
- Jede Übersetzung enthält die Vorrangklausel und einen Link zur deutschen Fassung.
- Vertragliche Fachbegriffe werden konsistent über ein Glossar übersetzt.
- Automatische Übersetzungen werden vor Veröffentlichung fachlich geprüft.

## LEGAL-030 – AGB-Version und Zustimmung nachweisbar machen

**Priorität:** Muss bei Online-Vertragsabschluss  
**Abhängigkeiten:** LEGAL-028, LEGAL-029

**Beschreibung**

Für Projekte mit Online-Vertragsabschluss sicherstellen, dass die akzeptierte AGB-Version dauerhaft identifiziert und nachgewiesen werden kann.

**Akzeptanzkriterien**

- Jede veröffentlichte AGB-Fassung besitzt eine unveränderliche Versions-ID.
- Projekte speichern beim Vertragsabschluss mindestens Projekt-ID, AGB-Version, Sprache und Zeitpunkt der Zustimmung.
- Der Zustimmungsdialog verlinkt die konkrete AGB-Version.
- Die Zustimmung erfolgt aktiv und ist nicht vorausgewählt.
- Eine nachträgliche Veröffentlichung überschreibt keine bereits referenzierte Version.
- Frühere Vertragsfassungen können für Nachweiszwecke wiedergegeben werden.
- Wesentliche Vertragsänderungen lösen den im Projekt definierten Informations- oder Zustimmungsprozess aus.

## LEGAL-031 – AGB für CaptHook, Weedli und Haslbeck.ch konfigurieren

**Priorität:** Muss  
**Abhängigkeiten:** LEGAL-015, LEGAL-016, LEGAL-017, LEGAL-029

**Beschreibung**

Für jedes bestehende Projekt prüfen, ob AGB benötigt werden, und die jeweils tatsächlichen Leistungen, Preise, Laufzeiten, Kündigungsbedingungen und Nutzungsregeln konfigurieren.

**Akzeptanzkriterien**

- Für CaptHook ist dokumentiert, ob und welche AGB gelten.
- Für Weedli ist dokumentiert, ob und welche AGB gelten.
- Für Haslbeck.ch ist dokumentiert, ob und welche AGB gelten.
- Jedes Projekt verwendet nur die für sein Geschäftsmodell passenden Module.
- Abweichende Leistungen und Vertragsbedingungen werden nicht über ein unzutreffendes gemeinsames Modul vereinheitlicht.
- Aktivierte AGB stehen in allen fünf Sprachen bereit.
- AGB, Bestellprozess, Preisangaben und tatsächlich angebotene Leistungen widersprechen sich nicht.

## LEGAL-032 – AGB-Ausgabe automatisiert testen

**Priorität:** Muss  
**Abhängigkeiten:** LEGAL-029, LEGAL-031

**Beschreibung**

Automatisierte Tests für aktivierte AGB, deren Sprachversionen, Versionierung und Verlinkung ergänzen.

**Akzeptanzkriterien**

- Für jedes Projekt mit aktivierten AGB werden fünf Sprachseiten erzeugt.
- Projekt, Vertragspartner, Vertragsversion und Stand sind auf jeder Seite vorhanden.
- Übersetzungen verlinken die deutsche Fassung.
- Alle aktivierten Module erscheinen, deaktivierte Module erscheinen nicht.
- Links zu Datenschutz und Impressum funktionieren.
- Veraltete Übersetzungen und fehlende Pflichtangaben führen zu fehlgeschlagenen Tests.

---

# Empfohlene Umsetzungsetappen

## Meilenstein 1 – Technischer MVP

- LEGAL-001 bis LEGAL-005
- LEGAL-007 bis LEGAL-013
- LEGAL-015 bis LEGAL-017
- LEGAL-027 bis LEGAL-029
- LEGAL-031
- LEGAL-019
- LEGAL-023
- LEGAL-032

**Ergebnis:** CaptHook, Weedli und Haslbeck.ch besitzen ein generiertes Impressum, eine Datenschutzerklärung und – wo benötigt – AGB in allen fünf Sprachen.

## Meilenstein 2 – Produktiver Betrieb

- LEGAL-003
- LEGAL-014
- LEGAL-018
- LEGAL-020
- LEGAL-024
- LEGAL-025
- LEGAL-030

**Ergebnis:** Die Seiten laufen produktiv unter `legal.haslbeck.ch`, sind aus allen drei Projekten korrekt verlinkt und akzeptierte AGB-Versionen sind nachweisbar.

## Meilenstein 3 – Weitere Projekte und Automatisierung

- LEGAL-006
- LEGAL-021
- LEGAL-022
- LEGAL-026

**Ergebnis:** Weedli und Haslbeck.ch sind integriert; Änderungen und Betrieb sind weitgehend automatisiert.

## Nicht Teil des ersten MVP

- Cookie-Consent-Plattform
- Benutzeroberfläche zur Bearbeitung der Konfiguration
- Datenbank
- Mandantenfähige API
- Automatische Veröffentlichung ungeprüfter Übersetzungen
