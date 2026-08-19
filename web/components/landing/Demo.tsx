'use client';

// §2 DEMO VISUAL — screenshot real de la pantalla principal (M0) de MANIFIESTA.

import { motion } from 'motion/react';
import { SectionShell, useReveal, VIEWPORT_ONCE } from './ui';

export interface DemoProps {
  id?: string;
}

function PhoneScreen() {
  return (
    <div
      className="overflow-hidden border"
      style={{
        borderRadius: 28,
        borderColor: 'color-mix(in oklab, var(--text-tertiary) 20%, transparent)',
        boxShadow: '0 24px 64px -16px rgb(36 25 29 / 0.10)',
        maxWidth: 280,
        margin: '0 auto',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/mockups/screen-practica.png"
        alt="Tu práctica diaria en MANIFIESTA"
        width={375}
        height={812}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
    </div>
  );
}

export function Demo({ id }: DemoProps) {
  const { contenedor, item } = useReveal();

  return (
    <SectionShell id={id} elevacion="base" ariaLabel="Así se ve una práctica en MANIFIESTA">
      <motion.div
        variants={contenedor}
        initial={false}
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="mx-auto max-w-xl"
      >
        {/* Copy */}
        <motion.div variants={item} className="mb-8 text-center">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--champagne)' }}
          >
            Así se ve una práctica
          </p>
          <h2
            className="text-balance text-2xl font-bold leading-tight md:text-3xl"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            Tu deseo entra.{' '}
            <span style={{ color: 'var(--accent)' }}>Tu práctica sale lista.</span>
          </h2>
          <p className="mt-3 text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Cuéntale a Victoria qué quieres manifestar y ella convierte ese deseo en una práctica creada para ese momento.
          </p>
          {/* Píldoras de componentes */}
          <p
            className="mt-3 text-xs font-medium"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Afirmación · Scripting · Ritual · Acción para hoy
          </p>
        </motion.div>

        <motion.div variants={item}>
          <PhoneScreen />
        </motion.div>

        {/* Caption discreta debajo del frame */}
        <motion.p
          variants={item}
          className="mt-5 text-center text-xs leading-relaxed"
          style={{ color: 'var(--text-tertiary)' }}
        >
          Creada desde lo que tú quieres manifestar. No desde una lista genérica.
        </motion.p>
      </motion.div>
    </SectionShell>
  );
}
