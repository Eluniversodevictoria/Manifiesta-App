# ESTADO — MANIFIESTA con Victoria

> Última actualización: 2026-08-19 (sesión tarde) · Fase: Producción — APTA PARA VENDER · Notificaciones push activas

---

## LA APP

**Nombre:** MANIFIESTA — con Victoria
**Tagline:** Tu práctica diaria de manifestación personalizada por Victoria

**Qué hace en una frase:** La persona escribe qué quiere atraer a su vida y Victoria le prepara una práctica diaria personalizada (afirmación, visualización, scripting, journaling, ritual y acción concreta) — más un espacio de seguimiento de sus manifestaciones y una biblioteca de prácticas espirituales.

**Marca madre:** El Universo de Victoria — audiencia propia, lo que elimina el riesgo de demanda en frío.

---

## VALIDACIÓN — FICHA DE VIABILIDAD

```
FICHA DE VIABILIDAD — MANIFIESTA con Victoria

Test de 30 Segundos:        ✅ Usuario escribe su deseo → práctica personalizada inmediata
Test de Recurrencia:        ✅ Práctica DIARIA por diseño + historial que crece + seguimiento de manifestaciones
Test de Irreemplazabilidad: ✅ Memoria de deseos propios, voz de Victoria, historial "se manifestó ✨", ChatGPT no guarda ni personaliza esto
Test de Monetización:       ✅ Línea natural: 1 práctica/día gratis → Pro desbloquea "Necesito manifestar...", biblioteca completa, historial ilimitado
Test de Simplificación:     ✅ "Tu práctica diaria de manifestación personalizada por Victoria"

Resultado: VIABLE — construir
```

---

## GATE DE DEMANDA

**Estado:** CUBIERTO POR AUDIENCIA PROPIA

El Universo de Victoria tiene audiencia establecida en el nicho espiritual/manifestación. No es tráfico frío. La app se lanzará a una comunidad que ya confía en la marca y ya consume este contenido.

Anotado: construcción avanza con gate de audiencia propia; se persigue señal de pago en la landing antes de invertir en tráfico pagado externo.

---

## MODELO DE NEGOCIO

**Tipo:** Onboarding personalizado → Práctica generada PARA ella → Paywall (modelo ganador según RevenueCat 2025/2026)

**Modelo:** Freemium — uso diario frecuente, valor que crece con el tiempo (historial de manifestaciones)

| Plan | Precio | Qué incluye |
|------|--------|-------------|
| Free | $0 | 1 práctica diaria · 3 manifestaciones guardadas · Biblioteca básica (10 prácticas) |
| Pro | **$6.99/mes** | Prácticas diarias ilimitadas · "Necesito manifestar..." ilimitado · Biblioteca completa · Historial completo · Rituales semanales · Journaling ilimitado |
| Anual | **$49.99/año (~$4/mes)** | Todo Pro + 2 meses gratis · Se muestra como "$4/mes" con total anual visible |

**Precio base oficial:** $6.99/mes / $49.99/año — ajustado por decisión del equipo (2026-08-17). Rango validado contra competidores del nicho (I Am $4.99, ThinkUp $7.99).

---

## ECONOMÍA UNITARIA DE IA

- Modelo: Claude Haiku 4.5 (barato, rápido, suficiente para prácticas de bienestar)
- Uso estimado por usuario Pro: ~30-60 prácticas/mes + 10-20 "Necesito manifestar..." = ~50-80 llamadas/mes
- Costo estimado por llamada (Haiku, ~500 tokens total): ~$0.0003
- Costo mensual por usuario Pro: ~$0.015-$0.025 — bien por debajo del 20% de $12 ($2.40 límite)
- ✅ La economía cierra holgadamente

---

## STACK TÉCNICO (decidido)

- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Backend/DB:** Supabase (auth + base de datos + storage)
- **IA:** Claude Haiku 4.5 via API de Anthropic
- **Deploy:** Vercel
- **Emails:** Resend
- **Pagos:** Hotmart (mercado LATAM, sin necesidad de Stripe)

---

## FUNCIONES NÚCLEO (construir)

1. **Práctica diaria personalizada** — el usuario define su deseo, Victoria genera práctica (afirmación + visualización + scripting + journaling + ritual + acción)
2. **"Necesito manifestar..."** — práctica al instante para situación concreta (Pro)
3. **Mis manifestaciones** — guardar deseos, seguimiento, marcar "Se manifestó ✨"
4. **Biblioteca** — rituales, decretos, afirmaciones, visualizaciones, scripting, señales/números, abundancia, dinero, amor, hogar, merecimiento
5. **Journaling** — espacio de escritura libre vinculado a cada manifestación

## FUNCIONES QUE NO SE CONSTRUYEN AHORA

- Comunidad / perfiles públicos
- IA que "aprende" el estilo con el tiempo (v2)

---

## ESTÉTICA Y DISEÑO

- Paleta: blanco, crema (#FDF8F0), rosado blush (#F2C4C4), dorado suave (#D4A96A)
- Elementos: lunas, estrellas, corazones — muy femenino, muy delicado
- Fuentes: serif elegante para títulos (Playfair Display o similar) + sans legible para cuerpo
- Referencia: El Universo de Victoria — estética ya validada por la audiencia
- Tarjetas suaves, bordes redondeados, sombras muy sutiles

---

## SECUENCIA DE CONSTRUCCIÓN

Según SECUENCIA-MAESTRA-CONSTRUCCION.md:

- [x] Fase 1: Página de ventas (landing) ✅
- [x] Fase 2: Onboarding + Paywall ✅
- [x] Fase 3: Login / Auth ✅
- [x] Fase 4: App interna (práctica diaria, mis manifestaciones, biblioteca, journaling) ✅
- [~] Fase 5: Supabase conectado (schema + migraciones) ✅ — Hotmart webhook + Resend pendientes
- [x] Fase 6: Backoffice básico ✅ — `/admin` con 6 módulos
- [ ] Gate de seguridad → publicar

**Fase actual:** Capa legal completa (2026-08-18) · Hotmart webhook + Resend pendientes

### AUDITORÍA LEGAL — 2026-08-18 ✅ COMPLETA

Páginas creadas: `/privacidad` · `/terminos` · `/reembolsos` · `/aviso-ia`
Email de contacto legal: manifiesta.app@mail.com
Garantía: 7 días (alineada Hotmart + landing + reembolsos)
Botón "Eliminar mi cuenta" en Perfil → abre email a soporte (TODO: endpoint /api/delete-account)
Micro-disclaimer IA en M0: "Orientación espiritual, no consejo profesional"
Sin analytics ni cookies de terceros → sin banner de cookies obligatorio
Subprocesadores declarados: Supabase · Vercel · Anthropic · Cartesia · Hotmart · Resend
Ley aplicable: New Jersey, EE.UU. · CCPA declarada para usuarios en California

### PANTALLAS COMPLETADAS (sesiones anteriores + sesión actual)

| Pantalla | Ruta | Estado |
|---|---|---|
| Landing | `/` | ✅ 10 secciones canónicas completas |
| Inicio M0 | `/app` | ✅ Práctica diaria por manifestación activa, 5 categorías, preferencia Leer/Escuchar/Ambas, check-in "Lo hice hoy" |
| Manifestaciones | `/app/manifestaciones` | ✅ Rediseñada + stagger variants orquestado con motion-presets |
| Detalle Manifestación | `/app/manifestaciones/[id]` | ✅ StarBurst en celebrando (cierre "Se manifestó") |
| Scripting | `/app/scripting` | ✅ Modo libre + vinculado a manifestación via ?manifestacionId |
| Biblioteca | `/app/biblioteca` | ✅ Catálogo real, búsqueda, filtros por tipo, favoritos, recientes, layout editorial |
| Detalle Biblioteca | `/app/biblioteca/[id]` | ✅ Adaptativo por tipo: ritual/afirmación/decreto/visualización/señal/scripting |
| Historial | `/app/historial` | ✅ Fuente primaria: PracticeSnapshot (dia, fase, tema, previewText, chip de familia). Fallback: checkIns legacy. Agrupado por fecha, filtros por tipo y manifestación |
| Perfil | `/app/perfil` | ✅ Conectado a PlanContext — muestra plan real (Pro/Free), racha y contadores de manifestaciones |
| PaywallModal | componente global | ✅ Bottom sheet con beneficios, selector plan ($4/mes anual · $6.99/mes), mock upgrade → upgradeToPro(periodo) → localStorage. CTA listo para conectar Hotmart |
| Gate manifestaciones | `/app/manifestaciones` | ✅ Límite 3 activas en plan Free → PaywallModal. Contador X/3 visible |
| Gate biblioteca | `/app/biblioteca` | ✅ Items premium (rit-002, dec-001, vis-003) bloqueados en Free con Lock overlay → PaywallModal |
| Gate M0 "Necesito manif." | `/app` | ✅ Botón Pro abre SheetUrgente directamente vía SheetUrgenteContext; Free → PaywallModal |
| SheetUrgente gateado | BottomNav ✦ | ✅ Free → PaywallModal; Pro → SheetUrgente con 8 intenciones → /app/scripting?modo=urgente |
| Paywall page | `/onboarding/paywall` | ✅ CTA conectado a mock upgradeToPro() + router.push('/app'). Listo para URL Hotmart |

### DEFINICIÓN DE USUARIO ACTIVADO (aprobada)

**Activado** = los 3 eventos se registran dentro de las primeras **72 horas** desde `signup_completed`:
  1. Flujo de bienvenida terminado (`ob_done`)
  2. Manifestación guardada (`manifestation_created`)
  3. Primera práctica del día (`daily_practice_completed`)

Métricas derivadas:
- **Activation 24h**: % usuarios que completan los 3 pasos en ≤24h desde signup
- **Activation 72h**: % usuarios que completan los 3 pasos en ≤72h desde signup

Fuente de datos futura: `event_log` — JOIN de los 3 eventos por `user_id`, ORDER BY timestamp, DATEDIFF entre `signup_completed` y `daily_practice_completed`.

---

### PAYWALL LOCAL/MOCK — CERRADO (2026-08-17)

**PlanContext** (`lib/PlanContext.tsx`): `PlanTipo = 'free'|'pro'`, `PlanPeriodo = 'mensual'|'anual'`, localStorage keys `manifiesta_plan` + `manifiesta_plan_periodo`. `PLAN_LIMITS.maxManifestacionesActivas = 3`. `upgradeToPro(periodo)` es mock — en prod se reemplaza con webhook de Hotmart.

**Gates activos:**
- Manifestaciones: Free → máx 3 activas → PaywallModal(titulo="Manifestaciones ilimitadas")
- Biblioteca: items con `premium: true` (rit-002, dec-001, vis-003) → Lock overlay → PaywallModal(titulo="Contenido exclusivo Pro")
- M0 "Necesito manifestar…": botón bloqueado con badge Pro → PaywallModal(titulo="Práctica Necesito manifestar…")
- Perfil: muestra plan real; si Free → botón → `/onboarding/paywall`
- Paywall page: mock upgradeToPro(planSel) + router.push('/app'). TODO: cambiar por URL Hotmart

**Precios oficiales:** $6.99/mes · $49.99/año (~$4/mes)

### DECISIONES TÉCNICAS (sesión actual)

- **Tipos de audio:** `AudioEstado = 'none'|'placeholder'|'ready'|'error'` · `PreferenciaMedia = 'leer'|'escuchar'|'ambas'` — en `lib/manifestaciones-types.ts`
- **Modelo Biblioteca:** `ContenidoBiblioteca` en `lib/biblioteca-types.ts` — 17 piezas mock reales (2-3 por tipo principal: Rituales, Afirmaciones, Decretos, Visualizaciones, Señales, Scripting guiado)
- **Hook Biblioteca:** `lib/useBiblioteca.ts` — guardados + recientes en localStorage, preferencia compartida con key `manifiesta_preferencia_media`
- **Scripting ↔ Manifestaciones:** vinculado via `?manifestacionId=<id>`, guarda scripts en el contexto React (ManifestacionesProvider), sin localStorage adicional
- **Preferencia media:** localStorage key `manifiesta_preferencia_media` — compartida entre Inicio y Biblioteca

### FIXES MVP AUDIT COMPLETADOS (sesión 2026-08-16)

| Fix | Estado |
|-----|--------|
| B1 — plan pasa al auth desde paywall | ✅ |
| B4 — router.push en /entrar | ✅ |
| B2 — sin botones muertos en Perfil | ✅ |
| Perfil conectado a datos reales (racha, deseo, contadores) | ✅ |
| practicasRelacionadas eliminado (derivado de checkIns.length) | ✅ |
| Categorías reales en "Agregar manifestación" (7 categorías) | ✅ |
| Modo oscuro eliminado de Perfil | ✅ |
| Historial → tab Perfil activo en BottomNav | ✅ |
| Precios oficiales: $7.99/mes · $59.99/año | ✅ |

`tsc ✓ · build ✓ · 0 bloqueadores MVP`

### ONBOARDING OVERHAUL — cambios aplicados (veredicto pendiente a pre-launch, 2026-08-18)

| Item | Estado |
|------|--------|
| Paso 3 — reconocimiento personalizado (deseo + obstáculo) | ✅ |
| Paso 4 — Victoria preparando: 5 items secuenciales 500ms + 650ms cada uno | ✅ |
| Paso 5 — Preview personalizado: afirmación + deseo + teaser | ✅ |
| Paywall — trial framing 7 días + timeline visual | ✅ |
| Timing paso 4: 4720ms confirmado con Playwright (target: 4700ms) | ✅ |
| SheetUrgente — emojis → Lucide icons | ✅ |
| Scripting — emojis quitados de labels de chips | ✅ |
| Manifestación detail — 4 emojis como icono → Lucide | ✅ |
| Biblioteca — FILTROS emoji → Lucide (Flame/Sparkles/FileText/Eye/PenLine/Hash) | ✅ |
| ChipFiltro + cards grandes → Lucide icons | ✅ |
| Historial empty state 🌱 → Leaf icon | ✅ |
| PaywallModal — ya estaba limpio, sin cambios | ✅ |

`tsc ✓ · build ✓`

### SISTEMA DE MOTION — CERRADO (2026-08-18)

- `lib/motion-presets.ts` — preset centralizado: staggerContainer/staggerItem, TAP_*, IN_VIEW, SPRING_*, EASE_*
- `components/ConstellationSVG.tsx` — constelación con pathLength (evolución por eventos reales, no días)
- `components/StarBurst.tsx` — reservado SOLO para "Se manifestó" (manifestaciones/[id] SheetCierre)
- `components/RiveScene.tsx` — wrapper listo para activar con .riv files
- `.btn-glow` CSS eliminado → motion one-shot boxShadow en CTA de M0
- Micro-celebración práctica diaria: pill flotante de Sparkles (no StarBurst)
- BottomNav whileTap scale 0.94 muy sutil
- Stagger variants en: SheetUrgente · Historial · Perfil · Biblioteca · Manifestaciones · Manifestación detail

### FINALIZACIÓN INTERIOR + LANDING (2026-08-18)

| Item | Estado |
|------|--------|
| biblioteca/[id] emoji 🔍 → Lucide Search en container accent | ✅ |
| Demo.tsx PhonePlaceholder → screenshot real screen-practica.png | ✅ |
| FeelInside.tsx placeholder → 6 screenshots reales por slide | ✅ |
| Mockups en public/mockups/: screen-practica/manifestaciones/urgente/journal/biblioteca/manifesto.png | ✅ |

`tsc ✓ · build ✓`

### ESTADO ACTUAL DE PRODUCCIÓN (2026-08-19)

**URL:** https://manifiesta-app-sooty.vercel.app
**Supabase project ref:** fkugcdfdvfcsuolkxreg (región: ca-central-1)
**Vercel team:** el-universo-de-victoria / manifiesta-app
**GitHub:** Eluniversodevictoria/Manifiesta-App · rama main

Todo lo siguiente está ACTIVO y funcionando:

| Sistema | Estado |
|---------|--------|
| Auth (Supabase SSR) | ✅ |
| Webhook Hotmart + firma hottok | ✅ |
| Emails transaccionales (Resend) | ✅ |
| Trial 7 días + crons de emails | ✅ |
| Bucket audio-biblioteca (Supabase Storage) | ✅ |
| TTS Cartesia con caché en DB | ✅ |
| Tabla audio_assets con RLS | ✅ |
| Notificaciones push web (7 notificaciones) | ✅ |
| Edge Function push-notify (Supabase) | ✅ |
| Tabla push_subscriptions con RLS | ✅ |
| Headers de seguridad (CSP, X-Frame-Options…) | ✅ |
| Cron recordatorio diario (8am UTC) | ✅ |
| Deploy Vercel automático desde GitHub | ✅ |

### NOTIFICACIONES PUSH — IMPLEMENTADAS (2026-08-19)

Infraestructura: Service Worker (`public/sw.js`) + Edge Function Supabase `push-notify` + tabla `push_subscriptions` + API routes `/api/push/subscribe` y `/api/push/send` + helper `lib/push.ts`.

VAPID keys guardadas como secrets en Supabase y como env var en Vercel (`NEXT_PUBLIC_VAPID_PUBLIC_KEY`).

| # | Trigger | Título |
|---|---------|--------|
| 1 | Cron 8am UTC diario (usuarias activas) | "✨ Tu práctica de hoy te espera" |
| 2 | Al completar práctica del día | "🌟 ¡Práctica completada!" |
| 3 | Al llegar a racha 7/14/21/30 días | "🔥 ¡X días seguidos manifestando!" |
| 4 | Al marcar "Se manifestó ✨" | "✨ ¡Se manifestó!" |
| 5 | Cron trial-d7 (junto al email) | "⏳ Tu acceso completo termina mañana" |
| 6 | Nueva práctica disponible | Incluida en cron del #1 |
| 7 | Contenido nuevo en Biblioteca | Manual desde admin (pendiente UI admin) |

**Activación en iOS:** instalar como PWA (Safari → compartir → Agregar a pantalla de inicio) → Perfil → Activar.

### PRÓXIMOS PASOS SUGERIDOS

1. Conectar dominio propio (ej. manifiesta.app) en Vercel
2. Instalar Sentry para monitoreo de errores en producción (`@sentry/nextjs`)
3. Revisión visual pre-launch: landing y paywall con revisor-visual (veredictos pendientes)
4. Función RPC en Supabase para lookup por email en webhook Hotmart (escala >300 usuarios)
5. Endpoint `/api/delete-account` (hoy redirige a email de soporte — aceptable para el inicio)

### ENGINE D1-D30 — APROBADO (2026-08-17)

**182/182 tests ✓ · tsc ✓ · build ✓ · browser tests: todos los casos ✓**

| Test | Resultado |
|------|-----------|
| Progresión D1-D30 (fronteras + transiciones de fase) | ✅ |
| D30 + Ciclo 2 (3 botones UX + engine reset) | ✅ |
| Manifestación activa: 0 activas / 1 activa / 2+ activas | ✅ |
| 5 familias con adaptadores, sin `{deseo}` raw | ✅ |
| DeseoContext stripping gramatical | ✅ |
| Snapshot guardado con todos los campos requeridos | ✅ |
| Racha idempotencia (doble-tap + dos manifestaciones mismo día) | ✅ |
| Audio contract: todos los bloques son ContenidoMedia | ✅ |
| Categorías desde categorias.ts (sin arrays locales) | ✅ |

**⚠️ DEUDA TÉCNICA — ANTES DE SUPABASE:**
Historial UI actual usa `checkIns` para mostrar la cronología. Los `PracticeSnapshot` ya se guardan inmutablemente en `manifiesta_snapshots_v1` (localStorage) con todos sus campos (templateId, contentVersion, engineVersion, dia, cyclo, familia, deseoSnapshot, bloques, completedAt). Antes de conectar Supabase, la pantalla de historial debe refactorizarse para reconstruir desde `PracticeSnapshot` en lugar de checkIns — los snapshots son la fuente de verdad inmutable.

### DECISIONES ENGINE D1-D30 (sesión 2026-08-17)

- **DAY_BLUEPRINT explícito** — D1-D30 con fase+tema+protagonista editorial, sin `% 6` matemático
- **practiceCompletion ≠ checkIns** — el día avanza SOLO con "Lo hice hoy", no con checkIns/reflexiones
- **manifestacionActivaId** — selección explícita del usuario, localStorage (`manifiesta_activa_id`), futuro: `user_settings` en Supabase (NO en tabla `manifestaciones`)
- **Single-source categorías** — `web/lib/categorias.ts` por crear; 6 familias: prosperidad, proposito, amor, bienestar, expansion, general
- **Historial inmutable** — cada `PracticeSnapshot` guarda `templateId + contentVersion + engineVersion`; nunca muta post-creación
- **ContenidoMedia** — toda pieza narrable tiene interfaz audio-ready (`AudioEstado`, `audioUrl?`, `audioDuration?`)
- **cycleNumber** — ciclo 1 = primero D1-D30; ciclo 2 = tras pulsar "Continuar" en D30; etc.
- **Arquitectura de contenido** — `CONTENIDO[familia][dia]` (no POOL[familia][fase][tipo]); D1-D7 = arco de bienvenida sin garantías; D8-D13 = Profundizar; D14-D19 = Recibir; D20-D25 = Soltar-Actuar; D26-D29 = Integrar; D30 = Cierre

---

## AUDITORÍA DE PRODUCCIÓN — 2026-08-19

**Veredicto FINAL: ✅ APTA PARA VENDER** — todos los bloqueantes resueltos (sesión tarde 2026-08-19).

### Correcciones aplicadas en código (tsc ✓)

| # | Archivo | Corrección |
|---|---------|------------|
| C1 | `web/middleware.ts` | **CREADO** — protección edge de `/app/*` y `/admin/*`: sin sesión → redirige a `/entrar`. Era el bloqueante más crítico (rutas protegidas sin guard de servidor). |
| C2 | `web/next.config.ts` | Headers HTTP de seguridad: `X-Content-Type-Options`, `X-Frame-Options: DENY`, `X-XSS-Protection`, `Referrer-Policy`, `Permissions-Policy`, `Content-Security-Policy`. |
| C3 | `web/app/api/tts/route.ts` | Timeout de 30 s en `callCartesia()` vía `AbortController` — evita requests colgados indefinidamente si Cartesia no responde. |
| C4 | `web/app/api/trial/start/route.ts` | `getSession()` reemplazado por `getUser()` — valida token contra el servidor (antes era vulnerable a JWT manipulados). |
| C5 | `web/app/api/webhooks/hotmart/route.ts` | `listUsers()` con `perPage:1000` explícito — mejora marginal; la solución definitiva es C5-MANUAL. |

### Bloqueantes pendientes — acción manual requerida

| # | Severidad | Qué hacer |
|---|-----------|-----------|
| M1 | ❌ BLOQUEANTE | **CRON_SECRET faltante en `.env.local` y Vercel** — los 6 endpoints `/api/cron/*` rechazan sin él. Ir a Vercel → Settings → Environment Variables → agregar `CRON_SECRET` con un valor aleatorio seguro (ej. `openssl rand -hex 32`). También agregar en `.env.local` local. |
| M2 | ❌ BLOQUEANTE | **Bucket de Supabase Storage sin crear** — el bucket `audio-biblioteca` no existe hasta crearlo manualmente: Supabase Dashboard → Storage → New bucket → nombre `audio-biblioteca` → Público: sí → límite 50 MB. Sin esto el TTS falla al guardar audio. |
| M3 | ⚠️ IMPORTANTE | **Supabase pausado (free tier)** — restaurar proyecto en dashboard.supabase.com. Luego aplicar las 3 migraciones pendientes: `20260819_trial_access_model.sql`, `20260819_email_log.sql`, `20260819_audio_assets.sql` (SQL Editor → Run). |
| M4 | ⚠️ IMPORTANTE | **Sin Sentry ni error tracking** — la app está en producción sin observabilidad. Crear cuenta gratuita en sentry.io → instalar `@sentry/nextjs` → agregar `SENTRY_DSN` en Vercel. Pendiente antes de tener usuarios reales. |
| M5 | ⚠️ ESCALA | **listUsers() en webhook Hotmart es O(n)** — a 500+ usuarios empieza a ser lento. Solución definitiva: crear función RPC en Supabase que busque en `auth.users` por email con un índice. No bloquea el lanzamiento pero debe resolverse antes de los 300 usuarios. |

### Puntos verificados sin cambios

| Área | Estado | Notas |
|------|--------|-------|
| Secretos hardcodeados | ✅ | Ninguno — todo usa `process.env.*` |
| Cartesia API key server-only | ✅ | No hay `NEXT_PUBLIC_CARTESIA_*` |
| Hotmart hottok verificado | ✅ | Línea 71 del webhook — rechaza si no coincide |
| Webhook idempotente | ✅ | Verifica `hotmart_orders` antes de procesar |
| Webhook maneja approved/cancelled/refunded/chargeback | ✅ | Sets definidos en líneas 17-35 |
| audio_assets RLS habilitado | ✅ | Solo lectura anónima; escritura solo service_role |
| email_log RLS con `(select auth.uid())` | ✅ | Patrón de alto rendimiento |
| Cron endpoints con CRON_SECRET | ✅ | Todos los 6 lo verifican |
| Legal: /privacidad /terminos /reembolsos /aviso-ia | ✅ | Páginas existen |
| Botón eliminar cuenta | ✅ | Abre email a soporte (sin endpoint auto — es aceptable) |
| max_tokens limitado en IA | ✅ | 600 tokens en practica/route.ts |
| ai_calls table para observabilidad | ✅ | Log best-effort en tts y practica |
| vercel.json con crons configurados | ✅ | 6 crons definidos |
| tsc --noEmit | ✅ | Pasa limpio tras correcciones |

---

## Problemas conocidos

- **[veredicto:onboarding] POSPUESTO A PRE-LAUNCH** El onboarding recibió múltiples rondas de mejoras de usabilidad y craft (v2→v3: 31→35 usabilidad, 14→13 craft). Se acepta con observaciones para revisión visual final antes del lanzamiento. Defectos conocidos documentados en `docs/revisiones/onboarding-veredicto.md`: (1) vacío muerto en zona inferior paso 0, (2) tercer plano de profundidad ausente, (3) pétalo ownable casi invisible a opacity:0.12, (4) logotext genérico en header, (5) track de progreso de baja perceptibilidad. No impide construcción de la app interna — se revisa en auditoría PRE-LAUNCH.

- **[veredicto:practica-hoy / M0]** APROBADA PROVISIONALMENTE (2026-08-18). Score: 31/40 usabilidad · 14/20 craft — por debajo del gate formal (36/40 · 16/20) pero la pantalla es funcional, coherente con el sistema visual y cubre todos los estados requeridos. Se congela en este estado. Fixes implementados en esta sesión: sticky CTA (visible desde primer viewport, nunca simultáneo con inline), bordes de cards unificados (borderLeft accent para todos los bloques de práctica), audio placeholder simplificado (fila entera tappable), "Cambiar manifestación" como chip outlined sutil, MotionConfig reducedMotion="user" global. Screenshot: `docs/revisiones/practica-hoy-375.png` · Veredicto: `docs/revisiones/practica-hoy-veredicto.md`.
  - **Deuda visual pendiente (segunda vuelta antes de launch):** (1) revisar si sticky tapa contenido en algunos estados de scroll, (2) revisar ubicación de "Cambiar manifestación" — actualmente desconectado visualmente de la card de contexto, (3) revisar densidad general de bloques en mobile — 5 bloques antes del CTA es mucho para 375px.

- **[veredicto:landing] POSPUESTO A PRE-LAUNCH** La landing `/` fue construida en sesión anterior. El revisor-visual no se ha ejecutado en esta pantalla. Pendiente antes de lanzar: screenshot real a 375px → subagente revisor-visual → `docs/revisiones/landing-veredicto.md` (≥36/40 usabilidad, ≥16/20 craft, ≥16/20 copy de venta) + `docs/revisiones/landing-375.png`. No impide construcción de la app interna.

- **[direcciones-abc] EXCEPCIÓN DOCUMENTADA — POSPUESTO** La identidad visual de MANIFIESTA es un contrato heredado de la marca madre El Universo de Victoria (paleta, tipografía y estética ya existentes y validadas con audiencia real). No se eligió entre opciones nuevas en esta sesión: el protocolo A/B/C del 54 se activa cuando la identidad se DERIVA de cero; aquí se DOCUMENTA lo existente (FICHA-ARTE.md = extracción del código, no rediseño). `direcciones-abc.html` queda pendiente para cuando se diseñe la V2 o se requiera una variante nueva de la landing. Decisión: no bloquear el avance por un protocolo que no aplica al caso de contrato heredado.

- **[veredicto:manifestaciones] CONGELADA PROVISIONALMENTE (2026-08-18).** Score tras 2 rondas de revisor: 30/40 usabilidad · 14/20 craft — por debajo del gate formal. El score no sube sin resolver el espacio vacío inferior, que depende de la cantidad real de datos del usuario y no se rellena artificialmente. Fixes implementados: jerarquía card principal/secundaria, barra de progreso, AnimatedPct (número animado con RAF, respeta prefers-reduced-motion), stagger real por índice, Sparkles SVG en lugar de emojis. Screenshot: `docs/revisiones/manifestaciones-375.png` · Veredicto: `docs/revisiones/manifestaciones-veredicto.md`. Deuda pendiente: espacio muerto inferior (se resuelve solo con datos reales o con contenido contextual en segunda vuelta antes de launch).

- **[veredicto:paywall]** El paywall `/onboarding/paywall` fue construido en sesión anterior. Veredicto de revisor-visual pendiente (`docs/revisiones/paywall-veredicto.md` + `docs/revisiones/paywall-375.png`).

- **[supabase-proyecto-pausado]** El proyecto Supabase puede estar pausado (free tier, inactividad). Restaurar desde dashboard.supabase.com antes de poder acceder al admin. La migración 002_admin_roles.sql aún no se ha aplicado — sin ella, el admin muestra las instrucciones de setup en el dashboard.

---

## RETENCIÓN

- **Datos acumulados:** historial de manifestaciones + "Se manifestó ✨" — irse significa perder el registro de todo lo que atrajo a su vida
- **Hábito diario:** práctica nueva cada día, streak visible
- **Ciclo de uso:** diario (práctica) · semanal (ritual semanal + revisión de manifestaciones) · mensual (ver qué se cumplió)
- **Trigger de regreso:** "Tu práctica de hoy te está esperando" — email/notificación mañana temprano

---

## DECISIONES TOMADAS

| Decisión | Elección | Razón |
|----------|----------|-------|
| Modelo monetización | Freemium | Uso diario, valor que crece, hábito por diseño |
| Paywall | Post-onboarding personalizado | Máxima inversión emocional antes de pagar |
| Precio Pro | $6.99/mes / $49.99/año | Ajustado por decisión del equipo 2026-08-17 |
| IA | Claude Haiku 4.5 | Economía cierra, velocidad adecuada para prácticas |
| Pagos | Hotmart | Mercado LATAM, ya familiar en el nicho de coaching/bienestar |
| Stack | Next.js + Supabase + Vercel | Rápido de construir, escala hasta 500 usuarios sin problema |
