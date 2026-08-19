'use client';

// §11 CIERRE — fondo rose suave, emocional, con aire.

import { motion } from 'motion/react';
import { CtaButton, useReveal, VIEWPORT_ONCE } from './ui';

export interface CtaFinalProps {
  ctaLabel: string;
  ctaHref: string;
  id?: string;
}

export function CtaFinal({ ctaLabel, ctaHref, id = 'cta-final' }: CtaFinalProps) {
  const { contenedor, item } = useReveal();

  return (
    <section
      id={id}
      aria-label="Cierre"
      className="py-20 md:py-28"
      style={{ background: 'var(--surface-rose)' }}
    >
      <motion.div
        variants={contenedor}
        initial={false}
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="mx-auto flex max-w-lg flex-col items-center px-5 text-center"
      >
        <motion.h2
          variants={item}
          className="text-balance text-3xl font-bold leading-tight md:text-4xl"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
        >
          Lo que quieres ya está en tu mente.
        </motion.h2>

        <motion.p
          variants={item}
          className="mt-4 text-lg font-medium"
          style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}
        >
          Ahora dale un lugar en tu vida.
        </motion.p>

        <motion.p
          variants={item}
          className="mt-4 max-w-sm text-base leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          Cuéntale a Victoria qué quieres manifestar y descubre qué práctica ha preparado para ti.
        </motion.p>

        <motion.div variants={item} className="mt-8 w-full sm:w-auto">
          <CtaButton href={ctaHref} alto={56}>
            {ctaLabel}
          </CtaButton>
        </motion.div>

        <motion.p
          variants={item}
          className="mt-3 text-xs leading-relaxed"
          style={{ color: 'var(--text-tertiary)' }}
        >
          Hoy $0 · Cancela antes del día 7 si no deseas continuar
        </motion.p>
      </motion.div>
    </section>
  );
}
