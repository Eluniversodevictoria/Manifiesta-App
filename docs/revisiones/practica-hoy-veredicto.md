Veredicto: NO LISTA
Usabilidad: 31/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A

# VEREDICTO revisor-visual — practica-hoy (M0)
Fecha: 2026-08-18 14:30
Screenshot: docs/revisiones/practica-hoy-375.png
Usabilidad: 31/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

---

## Detalle por heurística (Usabilidad /40)

| H | Criterio | Puntaje | Nota |
|---|----------|---------|------|
| 1 | Estado del sistema | 3 | Spinner en CTA, toast undo, sticky CTA comunican estado. La racha "0 días" no da feedback de qué hacer. |
| 2 | Lenguaje del usuario | 4 | 100% español, sin jerga técnica, CTAs en primera persona del mundo de la usuaria. |
| 3 | Control y libertad | 4 | Toast "Deshacer" verificado en código (4s grace period), chip "Cambiar manifestación" visible. |
| 4 | Consistencia y estándares | 3 | Tres tratamientos de borde en cards: sin borde (intención), borde perimetral (contexto), border-left (afirmación/acción). Intencional por jerarquía pero visible a ojo no entrenado. |
| 5 | Prevención de errores | 3 | CTA habilitado por defecto (correcto), disabled:opacity-70 durante celebrando, sticky e inline nunca simultáneos. |
| 6 | Reconocer vs recordar | 3 | Todo el contenido visible, toggle Leer/Escuchar/Ambas con estado persisted en localStorage. |
| 7 | Flexibilidad | 3 | Preferencia de media guardada en localStorage. Sin atajos de teclado (irrelevante en móvil). |
| 8 | Estético y minimalista | 2 | Sticky CTA flota SOBRE la card de afirmación en el primer viewport tapando el control de audio. 6+ bloques de contenido antes del CTA inline generan densidad perceptible sin buscarla. |
| 9 | Errores con solución | 3 | "Guardando…" con spinner, undo con acción clara. Sin estados de error visibles en este screenshot. |
| 10 | Ayuda contextual | 3 | Empty state con CTA (código verificado). Kicker "APERTURA · BIENVENIDA AL PROCESO" contextualiza el día 1. |

**TOTAL USABILIDAD: 31/40** (gate requiere ≥36 — FALLA)

---

## Detalle por eje (Craft /20)

| Eje | Criterio | Puntaje | Nota |
|-----|----------|---------|------|
| 1 | Jerarquía | 3 | 4 niveles legibles: h1 display → kicker uppercase → cuerpo serif italic → label/caption. Máx 3 tamaños por pantalla cumplido. |
| 2 | Profundidad | 3 | 3 niveles de superficie: --bg base, --surface cards, --surface-2/accent-tinted hundido. Sombras con tinte rosa en cards de contexto y CTA. |
| 3 | Identidad ownable | 3 | Paleta rosa empolvado + Playfair Display + kickers con champagne + ✦ decorativo. No intercambiable con app de IA genérica. No es clon de Capítulo ni Umbral. |
| 4 | Movimiento | 3 | Stagger de entrada verificado (delays 0.04→0.38s), conteo animado racha (useAnimatedNumber), CycleArc con strokeDashoffset, whileTap 0.97, AnimatePresence en modales/completado. Falta: celebración real (Lottie/partículas) al completar — solo spring de card. MotionConfig reducedMotion="user" en layout global según changelog. |
| 5 | Encaje óptico | 2 | Sticky CTA aparece sobre la card de afirmación en el primer viewport, ocultando el botón de audio. El número "1" dentro del arco circular está centrado ópticamente. Radios consistentes por nivel. El chip "Cambiar manifestación" flotante a la derecha sin ancla visual izquierda se siente huérfano. |

**TOTAL CRAFT: 14/20** (gate requiere ≥16 — FALLA)

---

## Gate de carga cognitiva

- [x] ≤4-5 ítems antes de scroll — FALLA LEVE: 5 bloques de contenido en el primer viewport (contexto, toggle, intención, afirmación + sticky CTA encima)
- [x] ≤4 opciones por decisión — OK (3 en el toggle)
- [x] Una acción primaria por pantalla — OK (Lo hice hoy)
- [x] Sin recordar de otra pantalla — OK
- [x] Sin >5-7 campos — OK (no hay forms)
- [x] Texto ≤3-4 líneas por bloque — OK
- [x] Qué sigue es obvio — OK
- [x] Cero elementos fake-interactivos — FALLA: botón "Escuchar" activo cuando audioEstado='none'

2 fallas — no alcanza el umbral crítico de 4, pero se reporta como defecto.

---

## TOP DEFECTOS (ordenados por impacto)

1. **[Sticky CTA / primer viewport]** El botón "Lo hice hoy" flotante aparece encima de la card de afirmación, tapando el control de audio "Escuchar" antes de que la usuaria haga scroll → ajustar rootMargin del IntersectionObserver a `0px 0px 200px 0px` para que el sticky aparezca solo cuando el CTA inline está más lejos del borde inferior, dando espacio a la afirmación completa.

2. **[Header / racha]** Badge "0 días" visible al abrir la app en día 1 o tras un día sin práctica — desincentiva en el momento más importante (apertura) → ocultar el badge cuando racha===0 y reemplazar con chip "¡Primer día!" o simplemente no renderizar el contador hasta racha≥1.

3. **[Cards de audio / botón "Escuchar"]** El botón "Escuchar" aparece activo (color acento, tappable) cuando audioEstado==='none', prometiendo una acción que no responde. Un usuario cualquiera lo nota al primer tap → cuando audioEstado==='none', mostrar el botón en estado deshabilitado con label "Audio próximamente" en --text-tertiary, o no renderizarlo.

4. **[CTA inline / celebración]** Al completar "Lo hice hoy" el feedback es un card con spring animation. No hay Lottie de partículas ni vibración háptica — el hito emocional más importante de la app diaria queda con feedback de nivel formulario → añadir Lottie de partículas rosas (~300ms, loop:false) + `navigator.vibrate(200)` condicional al confirmar la práctica.

5. **[Chip "Cambiar manifestación"]** El chip outlined aparece alineado a la derecha sin elemento que lo ancle visualmente a la izquierda, creando un bloque flotante que no tiene relación visual clara con la card de contexto de abajo → moverlo dentro de la card de contexto (DÍA 1 DE 30) como acción secundaria discreta en su esquina superior derecha, o alinearlo al inicio del contenedor.
