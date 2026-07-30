---
version: 1.0.0
source_version: 1.0.0
date: 2026-07-28
change_reason: Erste modulare Fassung auf Basis der implementierten CaptHook-Funktionen.
review_status: freigegeben
---

{% if "controller" in project.privacy_modules %}
## 1. Verantwortlicher

Verantwortlich für die Datenbearbeitung im Zusammenhang mit **{{ project.name }}**
unter **{{ project.domain }}** ist:

{{ operator.name }}  
{{ operator.address.street }}  
{{ operator.address.postal_code }} {{ operator.address.city }}  
{{ operator.address.country }}  
E-Mail: [{{ project | projectEmail(operator) }}](mailto:{{ project | projectEmail(operator) }})
{% endif %}

## 2. Geltungsbereich

Diese Datenschutzerklärung gilt für die Nutzung von {{ project.name }}. Sie
orientiert sich am Schweizer Datenschutzgesetz. Soweit Personen aus der EU
oder dem EWR betroffen sind, werden zusätzlich die Vorgaben der DSGVO
berücksichtigt.

{% if "user-accounts" in project.privacy_modules %}
## 3. Benutzerkonten und Anmeldung

Je nach gewähltem Anmeldeweg bearbeiten wir eine GitHub-ID und den
GitHub-Benutzernamen oder eine Google-Kontokennung sowie einen selbst gewählten
Benutzernamen. Bei Google wird nur `openid` angefordert. CaptHook fragt bei
GitHub und Google keine E-Mail-Adresse ab und speichert von diesen Anbietern
keine E-Mail-Adresse.
{% endif %}

{% if "webhook-processing" in project.privacy_modules %}
## 4. Webhook-Verarbeitung

CaptHook bearbeitet die von Nutzenden angelegten Pipes, Filterregeln,
Signatur-Secrets und Ziel-Webhook-URLs. Eingehende Webhook-Inhalte werden
gespeichert, geprüft und bei passenden Regeln an die selbst konfigurierten
Ziele bei Slack, Discord oder Microsoft Teams/Power Automate weitergeleitet.
Der Inhalt eines Events wird durch die sendende Person bestimmt.
{% endif %}

{% if "payments" in project.privacy_modules %}
## 5. Zahlungsabwicklung

Beim Abschluss eines kostenpflichtigen Pro-Abonnements bearbeiten wir
Stripe-Kunden-ID, Abonnement-ID, Tarif, Status und Abrechnungszeitraum.
Zahlungsmittel wie Kreditkartendaten werden ausschließlich durch Stripe
bearbeitet und nicht bei CaptHook gespeichert.
{% endif %}

{% if "email-delivery" in project.privacy_modules %}
## 6. Betriebliche E-Mails

Für betriebliche Fehler- und Systembenachrichtigungen können technische
Ereignis- und Fehlerdaten per E-Mail an eine konfigurierte Adresse versandt
werden. CaptHook betreibt keinen Newsletter und keine Werbe-E-Mails.
{% endif %}

{% if "hosting-server-logs" in project.privacy_modules %}
## 7. Hosting und Server-Protokolle

{{ project.name }} läuft auf eigener Serverinfrastruktur innerhalb der Europäischen
Union. Für sicheren Betrieb, Fehleranalyse und Missbrauchsprävention können
IP-Adresse, Zeitpunkt, angeforderte Ressource und technische Protokolldaten
bearbeitet werden. Die konfigurierte Regelfrist beträgt 30 Tage.
{% endif %}

{% if "essential-cookies" in project.privacy_modules %}
## 8. Cookies

Es werden ausschließlich ein technisch notwendiges, verschlüsseltes
Session-Cookie (`capthook_session`) und ein Cookie für die Sprachpräferenz
(`capthook_locale`) verwendet. CaptHook verwendet keine Analyse-, Tracking-
oder Werbe-Cookies.
{% endif %}

{% if "contact" in project.privacy_modules %}
## 9. Kontakt und Support

Bei einer Kontaktaufnahme bearbeiten wir die übermittelten Kontaktdaten und
den Inhalt der Anfrage zur Beantwortung und für Support. Der Betreiber kann
über einen internen Administrationsbereich auf Konto- und Pipe-Daten
zugreifen, soweit dies für Support oder Missbrauchsprävention erforderlich ist.
{% endif %}

{% if "international-transfers" in project.privacy_modules %}
## 10. Empfänger und Datenübermittlung ins Ausland

Die eigene Serverinfrastruktur befindet sich in der Europäischen Union und
damit außerhalb der Schweiz. {% if "github-oauth" in project.providers %}Für
die optionale Anmeldung werden GitHub oder Google eingesetzt; für
kostenpflichtige Abonnemente Stripe.{% endif %} {% if "slack-webhooks" in project.providers %}
Von Nutzenden konfigurierte Events können an Slack, Discord oder Microsoft
Teams/Power Automate übermittelt werden.{% endif %} Anbieter in den USA oder
mit US-Bezug können Daten außerhalb der Schweiz bearbeiten. Dabei werden die
anwendbaren gesetzlichen Garantien berücksichtigt.

Es findet kein Verkauf personenbezogener Daten statt.
{% endif %}

{% if "retention-deletion" in project.privacy_modules %}
## 11. Aufbewahrung und Löschung

Server-Protokolle werden grundsätzlich höchstens 30 Tage aufbewahrt.
{% if project.features.user_accounts %}Konten, Pipes, Events,
Zielkonfigurationen und Zustellprotokolle bleiben bis zur Löschung des Kontos
beziehungsweise der jeweiligen Pipe gespeichert. Für Events besteht aktuell
keine automatische Löschfrist. Gesetzlich aufbewahrungspflichtige
Abrechnungsunterlagen bleiben für die vorgeschriebene Dauer erhalten.{% endif %}
{% endif %}

{% if "data-security" in project.privacy_modules %}
## 12. Datensicherheit

Die Verbindung zur Website erfolgt über HTTPS/TLS. {% if project.features.user_accounts %}
{{ project.name }} speichert keine Passwörter; die Anmeldung erfolgt über
OAuth. Pipe-Secrets werden zur Signaturprüfung eingehender Webhooks
verwendet.{% endif %} Es werden angemessene technische und organisatorische
Schutzmaßnahmen eingesetzt.
{% endif %}

{% if "data-subject-rights" in project.privacy_modules %}
## 13. Rechte betroffener Personen

Betroffene Personen können im Rahmen des anwendbaren Rechts Auskunft,
Berichtigung, Löschung, Einschränkung, Herausgabe beziehungsweise Übertragung
ihrer Daten sowie Widerspruch verlangen. Pipes und Ziele können in der
CaptHook-Oberfläche selbst gelöscht werden. Weitere Anfragen sind an
[{{ operator.email.privacy }}](mailto:{{ operator.email.privacy }}) zu richten.

In der Schweiz ist der [Eidgenössische Datenschutz- und
Öffentlichkeitsbeauftragte](https://www.edoeb.admin.ch) die zuständige
Aufsichtsbehörde. Personen in der EU können sich an die Datenschutzbehörde
ihres Wohnsitzstaates wenden.
{% endif %}

## 14. Änderungen

Diese Erklärung wird angepasst, wenn sich Funktionen oder Datenbearbeitungen
ändern. Es gilt die unter dieser URL veröffentlichte Fassung.
