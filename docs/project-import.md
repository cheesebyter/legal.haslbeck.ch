# Übernahme aus Projekt-Repositories

Ein Projekt darf die produktive Legal-Website nicht direkt verändern.

1. Das Projekt ändert seine `legal/project.yml`.
2. Das Projekt validiert die Datei in seiner CI.
3. Nach dem Merge sendet es ein `repository_dispatch` vom Typ
   `legal-project-config` mit `project_id`, Repository und vollständigem
   Commit-SHA.
4. Das Legal-Repository prüft die erlaubte Quelle, checkt exakt diesen Commit
   aus, validiert alle Schemas und baut ein Vorschau-Artefakt.
5. Erst danach wird ein Pull Request mit dem Label `project-data` erstellt.
6. Produktion folgt ausschließlich nach Prüfung und Merge dieses Pull
   Requests.

Gemeinsame Rechtstexte werden nie durch diesen Prozess importiert. Dadurch
sind reine Projektdatenänderungen anhand Label, Commit und PR-Titel eindeutig
von Rechtstextänderungen unterscheidbar.

Erforderliches Secret: `PROJECT_SYNC_TOKEN` mit Leserechten auf den
Projekt-Repositories sowie Schreib- und Pull-Request-Rechten im
Legal-Repository.

## Dispatch-Beispiel

```json
{
  "event_type": "legal-project-config",
  "client_payload": {
    "project_id": "capthook",
    "repository": "AndyHaslbeck/CaptHook",
    "commit": "0123456789abcdef0123456789abcdef01234567"
  }
}
```

