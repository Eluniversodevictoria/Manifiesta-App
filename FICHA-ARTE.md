# FICHA DE DIRECCIÓN DE ARTE — MANIFIESTA con Victoria

> **Fuente de referencia canónica.** Toda pantalla nueva, componente o ajuste visual se deriva
> de este documento. El hook de diseño (`post-edit-diseno.sh`) valida contra los valores aquí.
> Origen: extraído del código real en 2026-08-17. No rediseñar sin actualizar esta ficha.

---

## 1. IDENTIDAD VISUAL EN UNA FRASE

**MANIFIESTA** es delicada, cálida y femenina — como un diario personal ilustrado en rosa empolvado.
El blanco pétalo es la pantalla; el rosa aparece donde hay acción o energía; el verde salvia
celebra cuando algo se manifiesta.

---

## 2. PALETA — TOKENS EXACTOS (`tokens.css`)

### Superficies (mayoría de la pantalla)
| Token | Hex | Uso |
|-------|-----|-----|
| `--bg` | `#FEF7F8` | Fondo base de toda pantalla — blanco pétalo (no blanco puro, no crema) |
| `--surface` | `#FFEBF0` | Chips, cards elevadas, sheets, superficie que contrasta con `--bg` |
| `--surface-2` | `#F5E8EC` | Wells, placeholders, inputs, anillos de progreso (fondo) |

### Texto
| Token | Hex | Uso |
|-------|-----|-----|
| `--text-primary` | `#22141A` | Cuerpo principal — carbón con tinte rosado-vino |
| `--text-secondary` | `#7A5060` | Subtítulos, descripciones — mauve cálido |
| `--text-tertiary` | `#A87888` | Labels, kickers, contadores, metadata — rosa mauve |

### Marca
| Token | Hex | Uso |
|-------|-----|-----|
| `--accent` | `#C4748A` | EL color de la marca — CTAs, kickers, checks, hairlines, acento en titulares |
| `--accent-2` | `#DDA8B8` | Solo halos de fondo, mesh del hero, gradientes sutiles |
| Champagne | `#C9A96E` | Máx 2 puntos por pantalla — micro-detalle (✦ decorativo, estrella) |

### Semánticos (no decorativos)
| Token | Hex | Uso |
|-------|-----|-----|
| `--success` | `#4a7c59` | Verde salvia — "Se manifestó ✨", checkmarks de logro |
| `--error` | `#b91c1c` | Rojo oscuro — errores, sin ser alarmista |
| `--warning` | `#b45309` | Ámbar oscuro — contenido próximo a vencer |

### Mezclas derivadas (patrón recurrente en el código)
```css
/* Fondo tintado de acento — chips, iconos de sección, gates */
color-mix(in oklab, var(--accent) 8-12%, transparent)

/* Borde sutil de acento */
color-mix(in oklab, var(--accent) 20-25%, transparent)

/* Borde neutro estándar */
color-mix(in oklab, var(--text-tertiary) 16-20%, transparent)

/* Separador de lista */
color-mix(in oklab, var(--text-tertiary) 14%, transparent)
```

> **Regla 60-30-10:** 60% `--bg`, 30% `--surface`/neutros, 10% `--accent`.
> El rosa no es el fondo — es la firma que aparece donde hay energía.

---

## 3. TIPOGRAFÍA

### Familias
| Variable | Familia | Rol |
|----------|---------|-----|
| `--font-display` | `'Playfair Display', Georgia, serif` | Titulares, intenciones del día, nombres de manifestaciones, momentos emocionales |
| `--font-body` | `'DM Sans', 'Segoe UI', sans-serif` | Todo el cuerpo — labels, botones, copy de UI |

### Jerarquía de tamaños (escala Tailwind, nunca arbitrarios)
| Nivel | Clase | Px equiv. | Peso | Uso |
|-------|-------|-----------|------|-----|
| Display | `text-xl` / `text-2xl` / `text-3xl` | 20-30px | `font-bold` (700) | Intención del día, titulares de pantalla héroe |
| Title | `text-lg` / `text-xl` | 18-20px | `font-bold` / `font-semibold` (600-700) | Títulos de sección, nombres de manifestación |
| Body | `text-base` / `text-sm` | 14-16px | `font-medium` / `font-normal` (400-500) | Texto de lectura — mínimo 14px siempre |
| Label | `text-xs` | 12px | `font-semibold` (600) + `uppercase tracking-[0.06em]` | Kickers, chips de fase, etiquetas de sección |
| Caption | `text-xs` | 12px | `font-medium` (500) | Contadores, metadata, fechas |

> **Regla:** máximo 3 tamaños visibles por pantalla. Titulares display con `font-family: var(--font-display)`.
> Afirmaciones en display van en *italic*. Kickers van en `uppercase tracking-[0.06em]`.

---

## 4. RADIOS DE BORDE

| Token / Clase | Valor | Aplicación |
|---|---|---|
| `--radius-card` | `28px` (`rounded-[var(--radius-card)]`) | Cards principales, hero cards, detalle bloques de práctica |
| `--radius-button` | `100px` pill (`rounded-[var(--radius-button)]`) | CTAs primarios, botón "Lo hice hoy", PaywallModal CTA |
| `rounded-2xl` | `16px` | Cards secundarias, filas de lista, opciones de plan, modales internos |
| `rounded-xl` | `12px` | Iconos contenedor, inputs, selector de categoría |
| `rounded-full` | `9999px` | Badges, chips pequeños, toggles, BottomNav ✦, avatares |
| `rounded-lg` | `8px` | Chips de texto, badges de texto |
| `rounded-t-3xl` | `24px` | Sheets bottom (rounded-t solo) |

> **Regla de consistencia:** todas las cards de una pantalla usan el mismo radio. No mezclar
> `--radius-card` con `rounded-2xl` en el mismo nivel de jerarquía visual.

---

## 5. SOMBRAS

| Token | Valor | Uso |
|-------|-------|-----|
| `--shadow-1` | `0 2px 10px rgb(196 116 138 / 0.22)` | Cards seleccionadas, picker activo, elevación sutil |
| `--shadow-2` | `0 20px 52px -12px rgb(196 116 138 / 0.18)` | Dropdowns, modales, tooltips |
| CTA accent | `0 8px 28px color-mix(in oklab, var(--accent) 28%, transparent)` | Botón primario con fondo acento |
| Hero card | `0 12px 32px color-mix(in oklab, var(--accent) 30%, transparent)` | Card de intención del día |
| ✦ central | `0 6px 24px color-mix(in oklab, var(--accent) 35%, transparent)` | BottomNav botón central |
| Sheet | `0 -8px 40px rgba(34,20,26,0.14)` | Bottom sheets (sombra hacia arriba) |

> Las sombras siempre tienen **tinte rosado** (basadas en `--accent`), nunca sombra gris neutra.

---

## 6. SUPERFICIES Y PROFUNDIDAD

Tres niveles de superficie que crean profundidad:

```
NIVEL 0 — Base:      --bg        #FEF7F8   (fondo de pantalla)
NIVEL 1 — Elevado:   --surface   #FFEBF0   (cards, chips, sheets)
NIVEL 2 — Hundido:   --surface-2 #F5E8EC   (wells, inputs, anillos de fondo)
```

Profundidad adicional: la card de intención del día usa `background: var(--accent)` con texto blanco — es el único elemento que rompe la paleta neutra para crear jerarquía máxima.

---

## 7. ICONOGRAFÍA

- **Librería exclusiva:** Lucide React — `strokeWidth` entre `1.5` y `2.5` según contexto
- **Tamaños estándar:** `size={13}` kickers inline · `size={15}` filas de lista · `size={16-18}` acciones · `size={20}` tabs · `size={28}` estados vacíos
- **Contenedor de ícono:** `flex size-8 items-center justify-center rounded-xl` con `background: color-mix(in oklab, var(--accent) 10-12%, transparent)` — para iconos de sección
- **Color activo:** `var(--accent)` o `fill="var(--accent)"` para estados seleccionados/llenos
- **Color inactivo:** `var(--text-secondary)` o `var(--text-tertiary)`
- **Emojis como íconos:** permitidos SOLO en categorías de manifestación (contexto semántico de contenido, no de UI). Prohibidos en botones, tabs, chips de interfaz.
- **Símbolo de marca:** `✦` — decorativo, en blanco sobre acento o en acento sobre blanco. No es un ícono de Lucide.

---

## 8. SPACING — ESCALA Y REGLAS

**Escala permitida:** `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64` (px / Tailwind equivalente).
Ningún valor fuera de esta escala en clases Tailwind.

| Distancia | Tailwind | Uso |
|-----------|----------|-----|
| Dentro de un chip/badge | `px-2 py-0.5` o `px-3 py-1` | Chips pequeños |
| Gap entre elementos relacionados | `gap-2` (8px) | Ítems de una lista inline |
| Gap entre secciones relacionadas | `gap-3` (12px) | Cards en una sección |
| Gap entre secciones distintas | `gap-4` / `gap-5` (16-20px) | Bloques de práctica |
| Padding horizontal de pantalla | `px-5` (20px) | Margen lateral estándar de toda pantalla |
| Padding interno de card | `p-4` / `p-5` (16-20px) | Interior de cards principales |
| Separación entre secciones grandes | `mb-5` / `mb-6` (20-24px) | Entre header y contenido |

> **Regla:** `interno ≤ externo`. El padding dentro de un elemento siempre es igual o menor
> que la separación entre elementos. Márgenes laterales idénticos en toda la pantalla.

---

## 9. ESTILO DE COMPONENTES CLAVE

### Cards de práctica (nivel principal)
```
background: var(--surface) o var(--accent) para hero
border: 1px solid color-mix(in oklab, var(--text-tertiary) 16%, transparent)
border-radius: var(--radius-card)  /* 28px */
padding: p-4 o p-5
```

### Cards de lista (manifestaciones, biblioteca)
```
background: var(--surface)
border: 1px solid color-mix(in oklab, var(--text-tertiary) 16%, transparent)
border-radius: var(--radius-card)
gap interno: gap-3, align-items: start
```

### Botón CTA primario
```
background: var(--accent)
color: white
border-radius: var(--radius-button)  /* pill */
height: h-12 (48px) o h-13 (52px)
font: text-base font-semibold
shadow: 0 8px 28px color-mix(in oklab, var(--accent) 28%, transparent)
whileTap: scale(0.97)
```

### Botón secundario / ghost
```
background: var(--bg)
color: var(--text-secondary)
border-radius: rounded-xl
height: h-10
font: text-xs font-medium
```

### Chips de kicker (etiqueta de sección)
```
text-xs font-semibold uppercase tracking-[0.06em]
color: var(--accent) o var(--text-secondary)
con ícono Lucide a la izquierda (size=13)
```

### Badge de conteo / fase
```
rounded-full px-1.5 py-0.5 text-xs font-bold
background: color-mix(in oklab, var(--accent) 12%, transparent)
color: var(--accent)
```

### Filas de configuración (Perfil)
```
height: py-3.5 (14px vertical)
padding: px-4
border-bottom: 1px solid color-mix(in oklab, var(--text-tertiary) 14%, transparent)
ícono en contenedor size-8 rounded-xl
```

### Inputs de texto
```
background: var(--bg)
border: 1px solid color-mix(in oklab, var(--text-tertiary) 22%, transparent)
border-radius: rounded-xl
padding: px-3 py-2.5
focus: outline-none (sin ring default de Tailwind)
```

### Toggles
```
width: w-12 (48px), height: h-6 (24px)
border-radius: rounded-full
ON: background var(--accent)
OFF: background color-mix(in oklab, var(--text-tertiary) 30%, transparent)
thumb: size-4 bg-white rounded-full, top-1, transición 200ms
```

### Bottom sheets
```
border-radius: rounded-t-3xl (top only)
background: var(--bg)
padding-bottom: max(32px, env(safe-area-inset-bottom))
handle: h-1 w-10 rounded-full color-mix(var(--text-tertiary) 30%)
z-index: z-50, backdrop z-40 con rgba(0,0,0,0.45)
spring: stiffness 340, damping 30
```

---

## 10. ANIMACIÓN — BASELINE NO NEGOCIABLE

| Tipo | Valores |
|------|---------|
| Tap feedback | `whileTap={{ scale: 0.97 }}` — respuesta <150ms |
| Entrada de pantalla | `initial: opacity 0 + y 8-16` → `animate: opacity 1 + y 0`, 350-450ms |
| Stagger entre elementos | `delay: 0.04 + i*0.03` por elemento |
| Transiciones de estado | 200-300ms, easing `[0.16, 1, 0.3, 1]` (spring-like ease-out) |
| Spring para sheets/modals | `type:'spring', stiffness:340, damping:30` |
| `prefers-reduced-motion` | Respetado con `@media` en CSS y `motion/react` |

---

## 11. LAYOUT MOBILE — REGLAS

- **Contenedor base:** `min-h-dvh flex flex-col` — nunca `min-h-full`
- **Nav al fondo:** `fixed bottom-0`, contenido con `pb-[calc(68px+env(safe-area-inset-bottom))]`
- **Ancho:** 375px diseño base; sin scroll horizontal jamás
- **Touch targets:** mínimo 44px (botones con `py-3+` o `h-11+`)
- **Safe areas:** `env(safe-area-inset-bottom)` en nav y sheets
- **`[touch-action:manipulation]`** en TODOS los elementos interactivos — elimina el delay de 300ms en mobile

---

## 12. CONSISTENCIA VISUAL — QUÉ HACE QUE MANIFIESTA SE VEA COMO UNA SOLA APP

1. **Una sola paleta sin modo oscuro.** El color siempre parte de `--bg #FEF7F8`. No hay dark mode.
2. **El rosa aparece solo donde hay acción o energía.** Fondo de pantalla = blanco pétalo; accent = solo en CTAs, kickers, iconos activos.
3. **Sombras con tinte rosa.** Ninguna sombra es gris neutra — todas llevan `var(--accent)` o `rgba(34,20,26,...)`.
4. **Playfair Display para los momentos que importan.** Solo en titulares y texto de intención. El cuerpo va siempre en DM Sans.
5. **Radio consistente por nivel.** Cards principales = `--radius-card (28px)`. Contenedores secundarios = `rounded-2xl`. Iconos = `rounded-xl`. Pills = `rounded-full`. Nunca mezclar en el mismo nivel.
6. **Kickers siempre en uppercase + tracking + color acento.** Son la firma visual de los encabezados de sección.
7. **Tap → scale(0.97).** Toda acción táctil responde visualmente, sin excepción.
8. **Profundidad en 3 niveles.** Nunca fondo plano de un solo color — siempre bg / surface / surface-2 diferenciados.
9. **Verde `#4a7c59` solo cuando algo se manifiesta.** No decorativo. Solo semántico.
10. **Champagne `#C9A96E` máx 2 puntos por pantalla.** Solo el símbolo ✦ o una estrella decorativa.

---

## 13. DIRECCIÓN DE ARTE — PALABRAS QUE LA DEFINEN

**Femenino · Delicado · Cálido · Íntimo · Como un diario espiritual ilustrado**

- No maximalista, no minimalista duro. Medio: calidez con estructura.
- No neón, no glass morphism, no gradientes de colores saturados.
- No modo oscuro. La app vive en luz suave de mañana.
- El contenido llena la pantalla con valor — nunca pantalla vacía o placeholder sin contexto.

---

*Última actualización: 2026-08-17 · Extraído de código real · No modificar sin consenso de dirección*
