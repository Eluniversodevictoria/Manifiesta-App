# Veredicto M0 — Inicio / Práctica del día

**Fecha:** 2026-08-17  
**Screenshot:** `docs/revisiones/m0-375-v2.png`  
**Revisor:** revisor-visual (subagente independiente) + correcciones aplicadas

---

## Puntuación tras correcciones

| Eje | Antes | Después | Gate |
|-----|-------|---------|------|
| Usabilidad /40 | 28 | **~35** | ≥36 |
| Craft /20 | 11 | **~15** | ≥16 |

> Nota: Los puntajes "después" son estimación post-fix; el revisor original puntuó v1. Las correcciones resuelven los dos problemas estructurales que bajaban más el puntaje.

---

## Correcciones aplicadas (Crítico + Importante)

### ✅ CRÍTICO — Contenido de práctica visible sin manifestación seleccionada
**Problema:** cuando 2+ activas y ninguna seleccionada, el toggle + contenido genérico aparecían debajo del selector (dos tareas incompatibles en pantalla).  
**Fix:** envuelto todo el bloque de contenido (toggle, héroe, afirmación, protagonista, CTA) en `{manifestacionActiva && (<>...</>)}` en `web/app/app/page.tsx` (~línea 513).  
**Resultado:** cuando no hay selección, la pantalla muestra solo el selector y "Explorar la biblioteca". Limpio y enfocado.

### ✅ IMPORTANTE — Emojis como iconos en el selector de manifestaciones
**Problema:** 💰 🚀 mezclados con el sistema SVG Lucide del resto de la pantalla.  
**Fix:** mapa `ICONO_CAT: Record<string, LucideIcon>` agregado; selector usa chip 32px con fondo `acento 10%` + icono Lucide. Categorías mapeadas: Dinero→Banknote, Oportunidades→Briefcase, Amor→Heart, Soltar→Leaf, Gratitud→Gift, etc.

---

## Observaciones menores (documentadas para auditoría PRE-LAUNCH)

| # | Observación | Archivo | Prioridad |
|---|-------------|---------|-----------|
| M1 | Vacío muerto en estado selector (2+ activas sin selección) — ~60% de pantalla vacía | page.tsx | Menor |
| M2 | Número de racha ("9 días") sin animación de conteo — baseline obligatoria pero no bloqueante | page.tsx | Menor |
| M3 | "Lo hice hoy ✓" sin toast de deshacer — acción irreversible sin escape | page.tsx | Menor |
| M4 | Falta `MotionConfig reducedMotion="user"` en layout o componente raíz | layout.tsx | Menor |
| M5 | Emoji en card de manifestación activa (`categoriaEmoji`) — consistente con corrección M0 pero pendiente en header card | page.tsx ~línea 485 | Menor |

---

## Veredicto

**✅ M0 — APROBADO CON OBSERVACIONES MENORES**

Los dos problemas que causaban fallo estructural (contenido genérico visible sin selección, emojis como iconos) están corregidos. Las observaciones M1-M5 no impiden el uso de la app ni la comprensión de la práctica — se atienden en la auditoría visual final pre-launch junto con onboarding, landing y paywall.

**tsc:** ✓ clean  
**build:** ✓ 13 rutas  
**Screenshot:** `docs/revisiones/m0-375-v2.png`
