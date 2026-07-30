# Verfügbarkeits- und Linkmonitoring

Der Workflow `Monitor production` läuft täglich und kann manuell gestartet
werden. Er prüft:

- `https://legal.haslbeck.ch/`,
- alle laut Projektkonfiguration erwarteten Sprach-/Dokument-URLs,
- erfolgreiche TLS-Verbindungen und HTTPS-Endziele,
- alle internen Links, die in den geprüften HTML-Seiten gefunden werden.

Fehler erzeugen oder aktualisieren genau ein GitHub-Issue. Nach erfolgreicher
Wiederherstellung wird es automatisch geschlossen. Die Prüfung verwendet nur
HTTP-GET-Anfragen, setzt keine Cookies und bindet keine Trackingdienste ein.

