---
version: 1.0.0
source_version: 1.0.0
date: 2026-07-30
change_reason: Première traduction française.
review_status: approved
---

## Responsable

{{ operator.name }}  
{{ operator.address.street }}  
{{ operator.address.postal_code }} {{ operator.address.city }}  
{{ operator.address.country }}  
E-mail : [{{ project | projectEmail(operator) }}](mailto:{{ project | projectEmail(operator) }})

## Champ d’application

Ces mentions légales s’appliquent à **{{ project.name }}** et au domaine
**{{ project.domain }}**.

## Responsabilité et liens externes

Les contenus sont entretenus avec un soin raisonnable. Les exploitants des
sites externes liés sont seuls responsables de leurs contenus.

