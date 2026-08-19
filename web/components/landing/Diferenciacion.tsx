'use client';

// §5 DIFERENCIACIÓN — genérico vs hecho para ti, sin tabla SaaS.

import { motion } from 'motion/react';
import { SectionShell, useReveal, VIEWPORT_ONCE } from './ui';

export interface DiferenciacionProps {
  id?: string;
}

export function Diferenciacion({ id }: DiferenciacionProps) {
  const { contenedor, item } = useReveal();

  return (
    <SectionShell id={id} elevacion="base" ariaLabel="Qué hace diferente a MANIFIESTA">
      <motion.div
        variants={contenedor}
        initial={false}
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="mx-auto max-w-xl"
      >
        <motion.div variants={item} className="mb-8 text-center">
          <h2
            className="text-balance text-3xl font-bold leading-tight md:text-4xl"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            No recibes otra afirmación bonita.
          </h2>
          <p
            className="mt-3 text-lg font-medium"
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}
          >
            Recibes una práctica creada para lo que tú quieres.
          </p>
        </motion.div>

        {/* Contraste genérico vs personal */}
        <motion.div variants={item} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Genérico */}
          <div
            className="rounded-[var(--radius-card)] p-5"
            style={{
              background: 'var(--surface)',
              border: '1px solid color-mix(in oklab, var(--text-tertiary) 20%, transparent)',
            }}
          >
            <p
              className="mb-3 text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Una app de afirmaciones
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              "Tienes todo lo que necesitas para triunfar."
            </p>
            <p className="mt-2 text-xs italic" style={{ color: 'var(--text-tertiary)' }}>
              Creada para cualquiera. Podría ser para ti o para otra persona. No se sabe.
            </p>
          </div>

          {/* Personal */}
          <div
            className="rounded-[var(--radius-card)] p-5"
            style={{
              background: 'color-mix(in oklab, var(--accent) 6%, var(--surface))',
              border: '1px solid color-mix(in oklab, var(--accent) 18%, transparent)',
            }}
          >
            <p
              className="mb-3 text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: 'var(--accent)' }}
            >
              MANIFIESTA
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
              "Estoy abierta a reconocer y recibir oportunidades que estén a la altura de lo que puedo aportar."
            </p>
            <p className="mt-2 text-xs italic" style={{ color: 'var(--text-secondary)' }}>
              Creada a partir de tu deseo exacto. No de una lista genérica.
            </p>
          </div>
        </motion.div>

        {/* Copy narrativo */}
        <motion.div variants={item} className="mt-8 space-y-4 text-center">
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Una app de afirmaciones puede darte una frase sobre dinero.
          </p>
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            Victoria puede saber que estás manifestando:
          </p>
          <div
            className="mx-auto max-w-sm rounded-[var(--radius-card)] p-5"
            style={{ background: 'var(--surface-rose)' }}
          >
            <p
              className="text-base italic leading-relaxed"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
            >
              "Conseguir mis primeros tres clientes para poder sentir que mi negocio realmente puede funcionar."
            </p>
          </div>
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Y partir de ahí.
          </p>
        </motion.div>

        {/* Cierre */}
        <motion.div variants={item} className="mt-10 text-center">
          <div
            className="mx-auto inline-block rounded-full px-6 py-3"
            style={{ background: 'var(--surface-2)' }}
          >
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              MANIFIESTA no empieza preguntando:{' '}
              <span style={{ color: 'var(--text-tertiary)' }}>"¿Qué afirmación quieres escuchar?"</span>
            </p>
            <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Empieza preguntando:{' '}
              <span style={{ color: 'var(--accent)' }}>"¿Qué quieres manifestar?"</span>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </SectionShell>
  );
}
