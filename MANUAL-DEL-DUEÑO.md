# MANUAL DEL DUEÑO — MANIFIESTA con Victoria

> Para ti, no para desarrolladores. Todo en lenguaje simple.

---

## TUS CUENTAS Y DÓNDE ESTÁN

| Servicio | Para qué sirve | URL |
|----------|---------------|-----|
| **Vercel** | Donde vive la app en internet | vercel.com → equipo "el-universo-de-victoria" |
| **Supabase** | Base de datos y cuentas de usuarios | supabase.com → proyecto "fkugcdfdvfcsuolkxreg" |
| **GitHub** | Guarda el código | github.com → Eluniversodevictoria/Manifiesta-App |
| **Hotmart** | Cobra los pagos y gestiona suscripciones | hotmart.com |
| **Anthropic** | La IA que genera las prácticas | console.anthropic.com |
| **Cartesia** | La voz de Victoria (texto a audio) | play.cartesia.ai |
| **Sentry** | Avisa si algo se rompe en la app | sentry.io |
| **Gmail** | Envía los emails de la app | soportemanifiesta.app@gmail.com |

---

## URL DE LA APP

**Producción:** https://manifiesta-app-sooty.vercel.app  
*(Cuando tengas dominio propio, cambiarlo en Vercel → Settings → Domains)*

---

## TAREAS DEL DÍA A DÍA

### Ver cuántas usuarias tienes y cómo van
→ Entra a la app con tu cuenta → `/admin`  
Ahí ves: usuarias activas, pagadas, en trial, y el log de emails.

### Alguien pide reembolso
1. Ir a Hotmart → gestionar el reembolso desde ahí
2. El sistema detecta el reembolso automáticamente y desactiva el acceso de esa usuaria
3. No necesitas hacer nada más en la app

### Alguien no puede entrar / perdió su acceso
1. Pídele su email
2. Ir a Supabase → Authentication → Users → buscar su email
3. Puedes reenviar el magic link desde ahí, o escribirle directamente

### Subir contenido nuevo a la Biblioteca
Hoy es manual (editar el código). En V2 habrá panel de admin para esto.  
Contacta al equipo técnico con el contenido listo.

### Enviar notificación push a todas las usuarias
→ Entra a la app con tu cuenta → `/admin` → sección Notificaciones → "Enviar a todas"

---

## DEPLOY — CÓMO SE ACTUALIZA LA APP

El deploy es **automático**: cuando el equipo técnico sube cambios a GitHub, Vercel los detecta y actualiza la app en ~2 minutos. Tú no necesitas hacer nada.

Para verificar que el último deploy fue exitoso:
→ Vercel → proyecto manifiesta-app → pestaña "Deployments" → el primero de arriba debe decir "Ready" en verde.

---

## SI ALGO SE ROMPE — RUNBOOK DE INCIDENTES

### La app no carga / error 500
1. Ir a Vercel → "Deployments" → ver si el último deploy falló (aparece en rojo)
2. Si falló: hacer clic en el deploy anterior que funcionaba → "Promote to Production"
3. Avisar al equipo técnico con la URL del error que ves en Sentry (sentry.io)

### Las usuarias no reciben emails
1. Verificar que la cuenta de Gmail (soportemanifiesta.app@gmail.com) no fue suspendida
2. Ir a Supabase → Edge Functions → "send-email" → ver logs de errores
3. Avisar al equipo técnico

### Un pago en Hotmart no activó el acceso
1. Ir a Supabase → Table Editor → tabla `hotmart_orders` → buscar el email de la usuaria
2. Si la orden no aparece: el webhook falló → ir a Hotmart → buscar la compra → reenviar el webhook manualmente
3. Si la orden aparece pero `status` = "approved" y la usuaria aún no tiene acceso: ir a `user_settings` → buscar la usuaria → cambiar `access_status` a `paid_active` manualmente

### Alerta de Sentry (recibo un email de error)
1. Hacer clic en el link del email de Sentry para ver el detalle
2. Si es un error que afecta a muchas usuarias: avisar al equipo técnico de inmediato
3. Si es un error aislado (1 usuaria, 1 vez): anotar y revisar en la próxima sesión técnica

---

## VARIABLES DE ENTORNO (CLAVES SECRETAS)

Están guardadas en **Vercel → Settings → Environment Variables**.  
**Nunca las compartas por WhatsApp, email ni chat.**  
Si sospechas que una clave fue expuesta, avisa al equipo técnico para rotarla.

Las más importantes:
- `SUPABASE_SERVICE_ROLE_KEY` — acceso total a la base de datos
- `ANTHROPIC_API_KEY` — genera las prácticas de IA (tiene costo por uso)
- `HOTMART_HOTTOK` — verifica que los pagos vienen de Hotmart real
- `CARTESIA_API_KEY` — genera el audio de Victoria

---

## COSTOS MENSUALES ESTIMADOS (primeras 100-300 usuarias)

| Servicio | Plan | Costo |
|---------|------|-------|
| Vercel | Hobby (gratis) o Pro ($20/mes si necesitas más) | $0-20 |
| Supabase | Free (gratis hasta ~500 usuarias activas) | $0 |
| Anthropic (IA) | Por uso — ~$0.015-0.025 por usuaria Pro/mes | ~$1.5-7.5 por 100 usuarias |
| Cartesia (audio) | Por uso — muy bajo | ~$1-3 |
| Sentry | Free (5k errores/mes) | $0 |
| **Total estimado** | | **~$3-30/mes** |

La app empieza a ser rentable desde la **primera usuaria pagada** ($6.99/mes).

---

## PRECIO OFICIAL

| Plan | Precio |
|------|--------|
| Mensual | $6.99/mes |
| Anual | $49.99/año (~$4.17/mes) |

Para cambiar precios: Hotmart → producto → editar oferta. Avisar al equipo para actualizar la app.

---

## CONTACTO TÉCNICO

Para cambios en la app, bugs o nuevas funciones:  
Usar la sesión de Claude Code con el proyecto abierto.

---

*Generado: 2026-08-20 · Versión 1.0*
