---
version: 1.0.0
date: 2026-07-30
review_status: freigegeben
---
## Preise, Steuern und Zahlungsbedingungen

{% if terms.pricing_model == "free" %}Die angebotene Leistung ist unentgeltlich.{% else %}{{ terms.price_description }} Es gelten die beim Vertragsabschluss ausgewiesenen Preise in {{ terms.currency }}. {% if terms.tax_included %}Anwendbare Steuern sind im ausgewiesenen Endpreis enthalten.{% else %}Anwendbare Steuern werden zusätzlich ausgewiesen, soweit gesetzlich zulässig.{% endif %} Zahlungen sind zu den im Bestellvorgang angegebenen Zeitpunkten fällig.{% endif %}
