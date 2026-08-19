'use client';

// §7 CTA EMOCIONAL — sección con aire, fondo rose pálido, sin agresividad.

import { motion } from 'motion/react';
import { CtaButton, useReveal, VIEWPORT_ONCE } from './ui';
import { DecorativosCtaFinal } from './Decorativos';

export interface CtaEmocionalProps {
  ctaLabel: string;
  ctaHref: string;
  id?: string;
}

export function CtaEmocional({ ctaLabel, ctaHref, id = 'cta-emocional' }: CtaEmocionalProps) {
  const { contenedor, item } = useReveal();

  return (
    <section
      id={id}
      aria-label="Empieza tu práctica"
      className="relative overflow-hidden py-20 md:py-28"
      style={{ background: 'var(--surface-rose)' }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <DecorativosCtaFinal />
      </div>

      <motion.div
        variants={contenedor}
        initial={false}
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="relative mx-auto flex max-w-lg flex-col items-center px-5 text-center"
      >
        <motion.h2
          variants={item}
          className="text-balance text-3xl font-bold leading-tight md:text-4xl"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
        >
          Hay algo que quieres manifestar{' '}
          <span style={{ color: 'var(--accent)' }}>ahora mismo.</span>
        </motion.h2>

        <motion.div variants={item} className="mt-6 max-w-sm space-y-3">
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Quizá llevas meses pensándolo.
          </p>
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Quizá apareció esta semana.
          </p>
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            O quizá es algo que nunca le has contado a nadie.
          </p>
          <p
            className="pt-2 text-base font-medium leading-relaxed"
            style={{ color: 'var(--text-primary)' }}
          >
            Cuéntaselo a Victoria. Ella convierte ese deseo en algo que puedes practicar hoy.
          </p>
        </motion.div>

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
