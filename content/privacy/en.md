---
version: 1.0.0
source_version: 1.0.0
date: 2026-07-30
change_reason: Initial English translation of the CaptHook privacy modules.
review_status: approved
---

{% if "controller" in project.privacy_modules %}
## 1. Controller

The controller for processing related to **{{ project.name }}** at
**{{ project.domain }}** is {{ operator.name }}, {{ operator.address.street }},
{{ operator.address.postal_code }} {{ operator.address.city }},
{{ operator.address.country }}. Email:
[{{ project | projectEmail(operator) }}](mailto:{{ project | projectEmail(operator) }}).
{% endif %}

## 2. Scope

This policy applies to {{ project.name }} under Swiss data protection law and,
where applicable, the EU GDPR.

{% if "user-accounts" in project.privacy_modules %}
## 3. Accounts and sign-in

Depending on the selected provider, we process a GitHub ID and username or a
Google account identifier, plus a user-chosen username. Google access is
limited to `openid`. CaptHook does not request or store an email address from
either provider.
{% endif %}

{% if "webhook-processing" in project.privacy_modules %}
## 4. Webhook processing

CaptHook processes pipes, filter rules, signing secrets, destination webhook
URLs, raw incoming event payloads and delivery records. Matching events are
forwarded to destinations configured by the user, including Slack, Discord or
Microsoft Teams/Power Automate.
{% endif %}

{% if "payments" in project.privacy_modules %}
## 5. Payments

For paid Pro subscriptions we process the Stripe customer and subscription
IDs, plan, status and billing period. Payment instrument details are handled
only by Stripe and are not stored by CaptHook.
{% endif %}

{% if "email-delivery" in project.privacy_modules %}
## 6. Operational email

Technical event and error details may be sent to a configured address for
operational notifications. CaptHook sends no newsletters or advertising.
{% endif %}

{% if "hosting-server-logs" in project.privacy_modules %}
## 7. Hosting and server logs

{{ project.name }} runs on self-managed infrastructure in the European Union. IP
address, timestamp, requested resource and technical log data may be processed
for security, troubleshooting and abuse prevention, normally for 30 days.
{% endif %}

{% if "essential-cookies" in project.privacy_modules %}
## 8. Cookies

Only the encrypted, essential session cookie `capthook_session` and the
language preference cookie `capthook_locale` are used. There are no analytics,
tracking or advertising cookies.
{% endif %}

{% if "contact" in project.privacy_modules %}
## 9. Contact and support

Contact details and message content are processed to answer requests and
provide support. The operator may access account and pipe data through an
internal administration area where necessary for support or abuse prevention.
{% endif %}

{% if "international-transfers" in project.privacy_modules %}
## 10. Recipients and international transfers

The self-managed infrastructure is located in the European Union and therefore
outside Switzerland. {% if "github-oauth" in project.providers %}GitHub or Google
may be used for sign-in and Stripe for paid subscriptions.{% endif %}
{% if "slack-webhooks" in project.providers %}User-selected Slack, Discord or
Microsoft destinations may receive events.{% endif %} Applicable safeguards
are used where required. Personal data is not sold.
{% endif %}

{% if "retention-deletion" in project.privacy_modules %}
## 11. Retention and deletion

Server logs are generally kept for no more than 30 days.
{% if project.features.user_accounts %}Accounts, pipes, events, destinations
and delivery records are kept until the account or pipe is deleted. Events
currently have no automatic deletion period. Statutory billing records remain
for the legally required period.{% endif %}
{% endif %}

{% if "data-security" in project.privacy_modules %}
## 12. Security

Connections use HTTPS/TLS. {% if project.features.user_accounts %}{{ project.name }}
stores no passwords; sign-in uses OAuth and pipe secrets verify incoming
webhooks.{% endif %} Appropriate technical and organisational safeguards are
applied.
{% endif %}

{% if "data-subject-rights" in project.privacy_modules %}
## 13. Your rights

Subject to applicable law, individuals may request access, correction,
deletion, restriction, portability or object to processing. Requests may be
sent to [{{ operator.email.privacy }}](mailto:{{ operator.email.privacy }}).
Complaints may be submitted to the Swiss FDPIC or the competent EU authority.
{% endif %}

## 14. Changes

This policy is updated when functions or processing activities change. The
version published at this URL applies.
