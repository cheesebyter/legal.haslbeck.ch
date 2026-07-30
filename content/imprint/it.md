---
version: 1.0.0
source_version: 1.0.0
date: 2026-07-28
change_reason: Prima traduzione italiana.
review_status: approved
---

## Responsabile

{{ operator.name }}  
{{ operator.address.street }}  
{{ operator.address.postal_code }} {{ operator.address.city }}  
{{ operator.address.country }}  
E-mail: [{{ project | projectEmail(operator) }}](mailto:{{ project | projectEmail(operator) }})

## Ambito di applicazione

Le presenti note legali si applicano a **{{ project.name }}** e al dominio
**{{ project.domain }}**.

## Responsabilità e link esterni

I contenuti sono curati con ragionevole diligenza. I gestori dei siti esterni
collegati sono gli unici responsabili dei rispettivi contenuti.

