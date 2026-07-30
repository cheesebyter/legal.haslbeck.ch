# Produktives Deployment

Ein Push auf `main` startet nach erfolgreicher CI den Workflow
`Publish and deploy`. Er veröffentlicht ein unveränderliches GHCR-Image mit
dem vollständigen Commit-SHA und übergibt genau dieses Image an
`43-delphi-deploy-legal-haslbeck.yml`.

## Release-Sperre

`npm run validate:release` blockiert jede produktive Veröffentlichung, solange
eine Fassung `draft` ist oder keinen freigegebenen Prüfstatus besitzt. Die
gegenwärtigen Texte sind deshalb absichtlich noch nicht deploybar.

## GitHub-Konfiguration

Das Environment `production` benötigt:

- `ANSIBLE_HOST`: Hostname oder IP des Ansible-Controllers
- `ANSIBLE_USER`: SSH-Benutzer des Controllers
- `ANSIBLE_SSH_PRIVATE_KEY`: privater Schlüssel nur für diesen Deploymentweg

Das GHCR-Paket muss für Delphi lesbar sein. Bevorzugt wird ein öffentlich
lesbares Paket ohne Registry-Zugangsdaten auf dem Server. Das
`production`-Environment sollte eine manuelle Freigabe verlangen.

## Infrastruktur

Das Ansible-Playbook:

- prüft DNS,
- stellt TLS über Let's Encrypt bereit,
- erzwingt HTTP → HTTPS,
- setzt HSTS und weitere Sicherheitsheader,
- deployt das anhand des Commits identifizierbare Image,
- speichert das zuvor laufende Image in
  `/opt/apps/legal-haslbeck/previous-image`,
- prüft Container-Health und den öffentlichen HTTPS-Endpunkt.

## Rollback

Im GitHub-Workflow `Roll back production` werden die frühere vollständige
Image-URI und der zugehörige Commit eingegeben. Der gleiche geprüfte
Ansible-Weg stellt diese unveränderliche Fassung wieder her.

