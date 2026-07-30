---
version: 1.0.0
source_version: 1.0.0
date: 2026-07-28
change_reason: Première traduction française des modules de confidentialité CaptHook.
review_status: approved
---

{% if "controller" in project.privacy_modules %}
## 1. Responsable du traitement

Le responsable des traitements liés à **{{ project.name }}** sur
**{{ project.domain }}** est {{ operator.name }}, {{ operator.address.street }},
{{ operator.address.postal_code }} {{ operator.address.city }},
{{ operator.address.country }}. E-mail :
[{{ project | projectEmail(operator) }}](mailto:{{ project | projectEmail(operator) }}).
{% endif %}

## 2. Champ d’application

La présente déclaration s’applique à {{ project.name }} selon le droit suisse
de la protection des données et, lorsqu’il s’applique, le RGPD.

{% if "user-accounts" in project.privacy_modules %}
## 3. Comptes et connexion

Selon le fournisseur choisi, nous traitons un identifiant et un nom
d’utilisateur GitHub ou un identifiant de compte Google, ainsi qu’un nom
d’utilisateur choisi. L’accès Google est limité à `openid`. CaptHook ne demande
ni ne conserve d’adresse e-mail provenant de ces fournisseurs.
{% endif %}

{% if "webhook-processing" in project.privacy_modules %}
## 4. Traitement des webhooks

CaptHook traite les pipes, règles de filtrage, secrets de signature, URL de
destination, contenus bruts des événements et journaux de livraison. Les
événements correspondants sont transmis aux destinations Slack, Discord ou
Microsoft Teams/Power Automate configurées par l’utilisateur.
{% endif %}

{% if "payments" in project.privacy_modules %}
## 5. Paiements

Pour les abonnements Pro payants, nous traitons les identifiants client et
abonnement Stripe, le tarif, le statut et la période. Les moyens de paiement
sont traités uniquement par Stripe et ne sont pas enregistrés par CaptHook.
{% endif %}

{% if "email-delivery" in project.privacy_modules %}
## 6. E-mails opérationnels

Des données techniques d’événement et d’erreur peuvent être envoyées à une
adresse configurée. CaptHook n’envoie ni newsletter ni publicité.
{% endif %}

{% if "hosting-server-logs" in project.privacy_modules %}
## 7. Hébergement et journaux serveur

{{ project.name }} fonctionne sur une infrastructure autogérée dans l’Union européenne.
L’adresse IP, l’heure, la ressource demandée et les journaux techniques peuvent
être traités pour la sécurité, le diagnostic et la prévention des abus,
normalement pendant 30 jours.
{% endif %}

{% if "essential-cookies" in project.privacy_modules %}
## 8. Cookies

Seuls le cookie de session chiffré indispensable `capthook_session` et le
cookie de langue `capthook_locale` sont utilisés. Aucun cookie d’analyse, de
suivi ou de publicité n’est utilisé.
{% endif %}

{% if "contact" in project.privacy_modules %}
## 9. Contact et assistance

Les coordonnées et le contenu du message sont traités pour répondre et fournir
une assistance. L’exploitant peut accéder aux données du compte et des pipes
si cela est nécessaire à l’assistance ou à la prévention des abus.
{% endif %}

{% if "international-transfers" in project.privacy_modules %}
## 10. Destinataires et transferts internationaux

L’infrastructure autogérée se trouve dans l’Union européenne et donc hors de
Suisse. {% if "github-oauth" in project.providers %}GitHub ou Google peuvent
servir à la connexion et Stripe aux abonnements payants.{% endif %}
{% if "slack-webhooks" in project.providers %}Les destinations choisies peuvent
recevoir des événements.{% endif %} Les garanties légales applicables sont
utilisées. Les données ne sont pas vendues.
{% endif %}

{% if "retention-deletion" in project.privacy_modules %}
## 11. Conservation et suppression

Les journaux serveur sont normalement conservés au maximum 30 jours.
{% if project.features.user_accounts %}Les comptes, pipes, événements,
destinations et journaux sont conservés jusqu’à leur suppression. Les documents
de facturation restent pendant la durée légale.{% endif %}
{% endif %}

{% if "data-security" in project.privacy_modules %}
## 12. Sécurité

Les connexions utilisent HTTPS/TLS. {% if project.features.user_accounts %}
{{ project.name }} ne conserve aucun mot de passe; la connexion utilise OAuth
et les secrets vérifient les webhooks.{% endif %} Des mesures appropriées sont
appliquées.
{% endif %}

{% if "data-subject-rights" in project.privacy_modules %}
## 13. Vos droits

Dans les limites du droit applicable, les personnes peuvent demander l’accès,
la rectification, la suppression, la limitation, la portabilité ou s’opposer
au traitement. Les demandes sont adressées à
[{{ operator.email.privacy }}](mailto:{{ operator.email.privacy }}).
{% endif %}

## 14. Modifications

Cette déclaration est mise à jour lorsque les fonctions ou traitements
changent. La version publiée à cette URL s’applique.
