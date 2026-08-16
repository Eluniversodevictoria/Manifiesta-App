# ESTADO — MANIFIESTA con Victoria

> Última actualización: 2026-08-16 · Fase: VALIDACIÓN COMPLETA → Lista para construir

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
| Pro | $7.99/mes | Prácticas diarias ilimitadas · "Necesito manifestar..." ilimitado · Biblioteca completa · Historial completo · Rituales semanales · Journaling ilimitado |
| Anual | $59.99/año (~$5/mes) | Todo Pro + ahorro de ~37% · Se muestra como "$5/mes" con total anual visible |

**Precio base:** $7.99/mes / $59.99/año — rango validado contra competidores reales del nicho (I Am $4.99, Manifestive $8.99, ThinkUp $7.99). Ajustado para LATAM donde $12 genera fricción psicológica alta.

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
- Audio / meditaciones guiadas
- Notificaciones push (web, no nativa)
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

- [ ] Fase 1: Página de ventas (landing)
- [ ] Fase 2: Onboarding + Paywall
- [ ] Fase 3: Login / Auth
- [ ] Fase 4: App interna (práctica diaria, mis manifestaciones, biblioteca, journaling)
- [ ] Fase 5: Integración Hotmart + Resend
- [ ] Fase 6: Backoffice básico
- [ ] Gate de seguridad → publicar

**Fase actual:** Lista para iniciar Fase 1 — Página de ventas

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
| Precio Pro | $12/mes / $97/año | Nicho bienestar LATAM, audiencia propia reduce sensibilidad al precio |
| IA | Claude Haiku 4.5 | Economía cierra, velocidad adecuada para prácticas |
| Pagos | Hotmart | Mercado LATAM, ya familiar en el nicho de coaching/bienestar |
| Stack | Next.js + Supabase + Vercel | Rápido de construir, escala hasta 500 usuarios sin problema |
