---
version: 1.0.0
source_version: 1.0.0
date: 2026-07-28
change_reason: Prima traduzione italiana dei moduli privacy CaptHook.
review_status: approved
---

{% if "controller" in project.privacy_modules %}
## 1. Titolare del trattamento

Il titolare dei trattamenti relativi a **{{ project.name }}** su
**{{ project.domain }}** è {{ operator.name }}, {{ operator.address.street }},
{{ operator.address.postal_code }} {{ operator.address.city }},
{{ operator.address.country }}. E-mail:
[{{ project | projectEmail(operator) }}](mailto:{{ project | projectEmail(operator) }}).
{% endif %}

## 2. Ambito

La presente informativa si applica a {{ project.name }} secondo il diritto
svizzero in materia di protezione dei dati e, ove applicabile, il GDPR.

{% if "user-accounts" in project.privacy_modules %}
## 3. Account e accesso

In base al fornitore scelto trattiamo ID e nome utente GitHub oppure un
identificativo Google, più un nome utente scelto. L’accesso Google è limitato a
`openid`. CaptHook non richiede né conserva e-mail provenienti dai fornitori.
{% endif %}

{% if "webhook-processing" in project.privacy_modules %}
## 4. Trattamento dei webhook

CaptHook tratta pipe, regole, secret di firma, URL di destinazione, contenuti
grezzi degli eventi e registri di consegna. Gli eventi corrispondenti sono
inoltrati alle destinazioni Slack, Discord o Microsoft Teams/Power Automate
configurate dall’utente.
{% endif %}

{% if "payments" in project.privacy_modules %}
## 5. Pagamenti

Per gli abbonamenti Pro trattiamo ID cliente e abbonamento Stripe, piano,
stato e periodo. I dati degli strumenti di pagamento sono trattati solo da
Stripe e non sono conservati da CaptHook.
{% endif %}

{% if "email-delivery" in project.privacy_modules %}
## 6. E-mail operative

Dati tecnici relativi a eventi ed errori possono essere inviati a un indirizzo
configurato. CaptHook non invia newsletter o pubblicità.
{% endif %}

{% if "hosting-server-logs" in project.privacy_modules %}
## 7. Hosting e log del server

{{ project.name }} opera su infrastruttura autogestita nell’Unione europea. Indirizzo IP,
orario, risorsa richiesta e log tecnici possono essere trattati per sicurezza,
diagnosi e prevenzione degli abusi, normalmente per 30 giorni.
{% endif %}

{% if "essential-cookies" in project.privacy_modules %}
## 8. Cookie

Sono usati solo il cookie di sessione cifrato necessario
`capthook_session` e il cookie lingua `capthook_locale`. Non sono usati cookie
di analisi, tracciamento o pubblicità.
{% endif %}

{% if "contact" in project.privacy_modules %}
## 9. Contatto e assistenza

I dati di contatto e il messaggio sono trattati per rispondere e fornire
assistenza. Il gestore può accedere ai dati di account e pipe quando necessario
per assistenza o prevenzione degli abusi.
{% endif %}

{% if "international-transfers" in project.privacy_modules %}
## 10. Destinatari e trasferimenti internazionali

L’infrastruttura autogestita si trova nell’Unione europea e quindi fuori dalla
Svizzera. {% if "github-oauth" in project.providers %}GitHub o Google possono
essere usati per l’accesso e Stripe per gli abbonamenti.{% endif %}
{% if "slack-webhooks" in project.providers %}Le destinazioni scelte possono
ricevere eventi.{% endif %} Si applicano le garanzie richieste. I dati non
vengono venduti.
{% endif %}

{% if "retention-deletion" in project.privacy_modules %}
## 11. Conservazione e cancellazione

I log del server sono conservati normalmente per non più di 30 giorni.
{% if project.features.user_accounts %}Account, pipe, eventi, destinazioni e
log restano fino alla cancellazione. I documenti contabili restano per il
periodo legale.{% endif %}
{% endif %}

{% if "data-security" in project.privacy_modules %}
## 12. Sicurezza

Le connessioni usano HTTPS/TLS. {% if project.features.user_accounts %}
{{ project.name }} non conserva password; l’accesso usa OAuth e i secret
verificano i webhook.{% endif %} Sono adottate misure adeguate.
{% endif %}

{% if "data-subject-rights" in project.privacy_modules %}
## 13. Diritti

Nei limiti della legge applicabile è possibile chiedere accesso, rettifica,
cancellazione, limitazione, portabilità o opporsi al trattamento scrivendo a
[{{ operator.email.privacy }}](mailto:{{ operator.email.privacy }}).
{% endif %}

## 14. Modifiche

L’informativa viene aggiornata quando cambiano funzioni o trattamenti. Si
applica la versione pubblicata a questo URL.
