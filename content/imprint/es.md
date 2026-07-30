---
version: 1.0.0
source_version: 1.0.0
date: 2026-07-28
change_reason: Primera traducción al español.
review_status: approved
---

## Responsable

{{ operator.name }}  
{{ operator.address.street }}  
{{ operator.address.postal_code }} {{ operator.address.city }}  
{{ operator.address.country }}  
Correo electrónico: [{{ project | projectEmail(operator) }}](mailto:{{ project | projectEmail(operator) }})

## Ámbito de aplicación

Este aviso legal se aplica a **{{ project.name }}** y al dominio
**{{ project.domain }}**.

## Responsabilidad y enlaces externos

Los contenidos se mantienen con un cuidado razonable. Los operadores de los
sitios externos enlazados son los únicos responsables de sus contenidos.

