---
version: 1.0.0
source_version: 1.0.0
date: 2026-07-30
change_reason: Primera traducción al español de los módulos de privacidad de CaptHook.
review_status: approved
---

{% if "controller" in project.privacy_modules %}
## 1. Responsable del tratamiento

El responsable de los tratamientos relativos a **{{ project.name }}** en
**{{ project.domain }}** es {{ operator.name }}, {{ operator.address.street }},
{{ operator.address.postal_code }} {{ operator.address.city }},
{{ operator.address.country }}. Correo:
[{{ project | projectEmail(operator) }}](mailto:{{ project | projectEmail(operator) }}).
{% endif %}

## 2. Ámbito

Esta política se aplica a {{ project.name }} conforme al derecho suizo de
protección de datos y, cuando corresponda, al RGPD.

{% if "user-accounts" in project.privacy_modules %}
## 3. Cuentas e inicio de sesión

Según el proveedor elegido, tratamos un ID y nombre de GitHub o un identificador
de Google, además de un nombre elegido. Google se limita a `openid`. CaptHook
no solicita ni conserva direcciones de correo de estos proveedores.
{% endif %}

{% if "webhook-processing" in project.privacy_modules %}
## 4. Tratamiento de webhooks

CaptHook trata pipes, reglas, secretos de firma, URL de destino, eventos brutos
y registros de entrega. Los eventos coincidentes se envían a los destinos
Slack, Discord o Microsoft Teams/Power Automate configurados por el usuario.
{% endif %}

{% if "payments" in project.privacy_modules %}
## 5. Pagos

Para suscripciones Pro tratamos los ID de cliente y suscripción de Stripe, el
plan, estado y periodo. Los medios de pago son tratados solo por Stripe y no se
guardan en CaptHook.
{% endif %}

{% if "email-delivery" in project.privacy_modules %}
## 6. Correos operativos

Los datos técnicos de eventos y errores pueden enviarse a una dirección
configurada. CaptHook no envía boletines ni publicidad.
{% endif %}

{% if "hosting-server-logs" in project.privacy_modules %}
## 7. Alojamiento y registros

{{ project.name }} funciona en infraestructura autogestionada en la Unión Europea. La IP,
hora, recurso solicitado y registros técnicos pueden tratarse por seguridad,
diagnóstico y prevención de abusos, normalmente durante 30 días.
{% endif %}

{% if "essential-cookies" in project.privacy_modules %}
## 8. Cookies

Solo se usan la cookie de sesión cifrada necesaria `capthook_session` y la
cookie de idioma `capthook_locale`. No hay cookies analíticas, publicitarias ni
de seguimiento.
{% endif %}

{% if "contact" in project.privacy_modules %}
## 9. Contacto y soporte

Los datos de contacto y mensajes se tratan para responder y prestar soporte.
El operador puede acceder a datos de cuenta y pipes cuando sea necesario para
soporte o prevención de abusos.
{% endif %}

{% if "international-transfers" in project.privacy_modules %}
## 10. Destinatarios y transferencias internacionales

La infraestructura autogestionada está en la Unión Europea y, por tanto, fuera
de Suiza. {% if "github-oauth" in project.providers %}GitHub o Google pueden
usarse para iniciar sesión y Stripe para suscripciones.{% endif %}
{% if "slack-webhooks" in project.providers %}Los destinos elegidos pueden
recibir eventos.{% endif %} Se aplican las garantías exigidas. Los datos no se
venden.
{% endif %}

{% if "retention-deletion" in project.privacy_modules %}
## 11. Conservación y eliminación

Los registros del servidor se conservan normalmente durante un máximo de 30
días. {% if project.features.user_accounts %}Cuentas, pipes, eventos, destinos
y registros se conservan hasta su eliminación. Los documentos contables
permanecen durante el plazo legal.{% endif %}
{% endif %}

{% if "data-security" in project.privacy_modules %}
## 12. Seguridad

Las conexiones usan HTTPS/TLS. {% if project.features.user_accounts %}
{{ project.name }} no almacena contraseñas; el acceso usa OAuth y los secretos
verifican webhooks.{% endif %} Se aplican medidas adecuadas.
{% endif %}

{% if "data-subject-rights" in project.privacy_modules %}
## 13. Derechos

Conforme a la ley aplicable pueden solicitarse acceso, rectificación,
eliminación, limitación, portabilidad u oposición escribiendo a
[{{ operator.email.privacy }}](mailto:{{ operator.email.privacy }}).
{% endif %}

## 14. Cambios

Esta política se actualiza cuando cambian las funciones o tratamientos. Se
aplica la versión publicada en esta URL.
