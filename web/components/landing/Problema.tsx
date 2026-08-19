'use client';

// §3 PROBLEMA — sin fear marketing, sin urgencia artificial.
// Copy narrativo: reconocimiento empático del patrón familiar.

import { motion } from 'motion/react';
import { SectionShell, useReveal, VIEWPORT_ONCE } from './ui';

export interface ProblemaProps {
  id?: string;
}

export function Problema({ id }: ProblemaProps) {
  const { contenedor, item } = useReveal();

  const frases = [
    'Has guardado afirmaciones.',
    'Has probado rituales.',
    'Has hecho scripting.',
    'Has visto videos que te inspiran durante unos minutos.',
  ];

  return (
    <SectionShell id={id} elevacion="base" ariaLabel="El problema">
      <motion.div
        variants={contenedor}
        initial={false}
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="mx-auto max-w-xl"
      >
        <motion.div variants={item} className="mb-8">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--champagne)' }}
          >
            El problema no es tu deseo
          </p>
          <h2
            className="text-balance text-3xl font-bold leading-tight md:text-4xl"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            Has aprendido mucho sobre manifestación.{' '}
            <span style={{ color: 'var(--accent)' }}>Ahora necesitas una forma de practicarla.</span>
          </h2>
        </motion.div>

        <motion.div variants={item} className="mb-6 space-y-3">
          {frases.map((frase, i) => (
            <p
              key={i}
              className="flex items-start gap-3 text-base leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span
                className="mt-1.5 block size-1.5 shrink-0 rounded-full"
                style={{ background: 'var(--champagne)' }}
                aria-hidden="true"
              />
              {frase}
            </p>
          ))}
        </motion.div>

        <motion.div variants={item} className="space-y-3">
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Pero cuando llega un nuevo día, vuelve la misma pregunta:
          </p>
          <div
            className="rounded-[var(--radius-card)] p-5"
            style={{ background: 'var(--surface)', boxShadow: 'var(--shadow-1)' }}
          >
            <p
              className="text-lg font-medium italic leading-snug"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
            >
              "¿Qué hago hoy para lo que yo quiero manifestar?"
            </p>
          </div>
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            No necesitas encontrar otra técnica.
          </p>
          <p
            className="text-base font-medium leading-relaxed"
            style={{ color: 'var(--text-primary)' }}
          >
            Necesitas una práctica que empiece por tu deseo.
          </p>
        </motion.div>
      </motion.div>
    </SectionShell>
  );
}
