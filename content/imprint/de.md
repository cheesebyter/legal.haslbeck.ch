---
version: 1.0.0
source_version: 1.0.0
date: 2026-07-28
change_reason: Erste zentrale Impressumsfassung für CaptHook.
review_status: freigegeben
---

## Verantwortliche Person

{{ operator.name }}  
{{ operator.address.street }}  
{{ operator.address.postal_code }} {{ operator.address.city }}  
{{ operator.address.country }}

E-Mail: [{{ project | projectEmail(operator) }}](mailto:{{ project | projectEmail(operator) }})

## Geltungsbereich

Dieses Impressum gilt für **{{ project.name }}** und die Domain
**{{ project.domain }}**.

## Haftung und externe Links

Die Inhalte werden mit angemessener Sorgfalt gepflegt. Für Inhalte externer
Websites, auf die verwiesen wird, sind ausschließlich deren Betreiber
verantwortlich.

