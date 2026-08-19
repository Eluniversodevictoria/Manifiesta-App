// motion-presets.ts — Sistema canónico de animaciones de MANIFIESTA
// Premium, contenida, no lúdica. Respeta prefers-reduced-motion vía useReducedMotion().
// USO: importar las variantes/configs relevantes; NO pegar delays inline dispersos.

import type { Variants, Transition, ViewportOptions } from 'motion/react';

// ── Easing ────────────────────────────────────────────────────────────────────
export const EASE_SMOOTH = [0.16, 1, 0.3, 1] as const;
export const EASE_OUT    = [0.0, 0.0, 0.2, 1] as const;

// ── Spring presets ─────────────────────────────────────────────────────────────
export const SPRING_POP: Transition    = { type: 'spring', stiffness: 420, damping: 24 };
export const SPRING_GENTLE: Transition = { type: 'spring', stiffness: 280, damping: 26 };
export const SPRING_FLOAT: Transition  = { type: 'spring', stiffness: 180, damping: 20 };

// ── Reveal principal — fade+subida ─────────────────────────────────────────────
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.36, ease: EASE_SMOOTH } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.28, ease: EASE_OUT } },
};

// ── Spring pop — logros, checks, ícono de celebración ─────────────────────────
export const springPop: Variants = {
  hidden: { scale: 0.6, opacity: 0 },
  show:   { scale: 1,   opacity: 1, transition: SPRING_POP },
};

// ── Stagger — padre orquesta hijos con variants ────────────────────────────────
export function staggerContainer(
  staggerChildren = 0.07,
  delayChildren   = 0
): Variants {
  return {
    hidden: {},
    show:   { transition: { staggerChildren, delayChildren } },
  };
}

// Hijo estándar del stagger (usa variants="staggerItem" en motion.div)
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE_SMOOTH } },
};

// Hijo compacto para listas densas (cards de historial, biblioteca)
export const staggerItemSmall: Variants = {
  hidden: { opacity: 0, y: 6 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.24, ease: EASE_SMOOTH } },
};

// ── whileInView config — scroll reveals (una vez, 60px antes del borde) ────────
export const IN_VIEW: ViewportOptions = { once: true, margin: '-60px' };
export const IN_VIEW_EARLY: ViewportOptions = { once: true, margin: '-20px' };

// ── Tap feedback estándar para botones ────────────────────────────────────────
export const TAP_BUTTON   = { scale: 0.97 } as const;
export const TAP_CARD     = { scale: 0.985 } as const;
export const TAP_CHIP     = { scale: 0.94 } as const;
