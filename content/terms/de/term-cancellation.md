---
version: 1.0.0
date: 2026-07-30
review_status: freigegeben
---
## Laufzeit, Verlängerung und Kündigung

{% if terms.term_model == "indefinite" %}Der Vertrag läuft auf unbestimmte Zeit.{% else %}Der Vertrag läuft für die beim Vertragsabschluss vereinbarte feste Dauer.{% endif %}
{% if terms.renewal == "automatic" %}Er verlängert sich nach dem vereinbarten Abrechnungszeitraum automatisch, sofern er nicht fristgerecht gekündigt wird.{% elif terms.renewal == "manual" %}Eine Verlängerung setzt eine erneute Vereinbarung voraus.{% else %}Eine automatische Verlängerung findet nicht statt.{% endif %}
{{ terms.cancellation_notice }}
