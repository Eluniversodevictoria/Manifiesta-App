'use client';

// §9 GARANTÍA — pequeña, clara, honesta.

import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import { SectionShell, useReveal, VIEWPORT_ONCE } from './ui';

export interface GarantiaProps {
  id?: string;
}

export function Garantia({ id }: GarantiaProps) {
  const { contenedor, item } = useReveal();

  return (
    <SectionShell id={id} elevacion="base" compacta ariaLabel="Garantía">
      <motion.div
        variants={contenedor}
        initial={false}
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="mx-auto max-w-md"
      >
        <motion.div
          variants={item}
          className="flex flex-col items-center gap-4 rounded-[var(--radius-card)] p-8 text-center"
          style={{
            background: 'var(--surface)',
            border: '1px solid color-mix(in oklab, var(--text-tertiary) 16%, transparent)',
            boxShadow: 'var(--shadow-1)',
          }}
        >
          <span
            className="flex size-14 items-center justify-center rounded-full"
            style={{ background: 'var(--chip-bg)' }}
            aria-hidden="true"
          >
            <ShieldCheck size={26} strokeWidth={1.6} color="var(--accent)" />
          </span>
          <h2
            className="text-xl font-bold"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            Pruébalo primero.
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Tu primera práctica es gratis para que puedas conocer MANIFIESTA antes de decidir.
            Si después eliges continuar, cuentas con 7 días de garantía según la política de reembolso aplicable.
          </p>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Respaldada por la política de reembolso de Hotmart — 7 días
          </p>
        </motion.div>
      </motion.div>
    </SectionShell>
  );
}
