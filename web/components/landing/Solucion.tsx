'use client';

// KIT DE LANDING — §4 SOLUCIÓN (blueprint: 55 §4)
// Vuelve al fondo BASE (el alivio también es visual). Kicker + título + el
// MECANISMO BAUTIZADO en su chip con <Accent> y hairline (uno de los 1-3 usos
// permitidos por vista) + Big Idea + EXACTAMENTE 3 pasos con number chip 44px
// (tupla en el tipo: ni 2 ni 4) + antes/después opcional. Pasos entran
// escalonados (whileInView + stagger, reduced-motion respetado).

import { motion } from 'motion/react';
import { Accent, Hairline, Kicker, SectionShell, useReveal, VIEWPORT_ONCE } from './ui';
import { MarkedCopy, warnCopy } from './MarkedCopy';

export interface PasoMecanismo {
  titulo: string;
  detalle: string;
}

export interface SolucionProps {
  kicker?: string;
  tituloMarked: string;
  mecanismo: string;
  bigIdeaMarked: string;
  pasos: [PasoMecanismo, PasoMecanismo, PasoMecanismo];
  antesDespues?: {
    labelAntes: string;
    antes: string;
    labelDespues: string;
    despues: string;
  };
  id?: string;
}

export function Solucion({
  kicker = 'EL MECANISMO',
  tituloMarked,
  mecanismo,
  bigIdeaMarked,
  pasos,
  antesDespues,
  id,
}: SolucionProps) {
  warnCopy('Solución → título', tituloMarked, 8);
  warnCopy('Solución → Big Idea', bigIdeaMarked, 30);
  pasos.forEach((p, i) => warnCopy(`Solución → paso ${i + 1}`, p.detalle, 14));
  const { contenedor, item } = useReveal();

  return (
    <SectionShell id={id} elevacion="base" ariaLabel="Cómo funciona">
      <motion.div
        variants={contenedor}
        initial={false}
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="mx-auto max-w-3xl"
      >
        <motion.div variants={item}>
          <Kicker>{kicker}</Kicker>
          <h2
            className="text-balance text-3xl font-bold leading-tight tracking-tight md:text-4xl"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            <MarkedCopy text={tituloMarked} />
          </h2>
        </motion.div>

        {/* Chip del mecanismo bautizado — hairline + <Accent> */}
        <motion.div variants={item} className="mt-4">
          <Hairline surface="bg" className="w-fit">
            <span className="block px-4 py-2 text-sm font-semibold">
              <Accent>{mecanismo}</Accent>
            </span>
          </Hairline>
        </motion.div>

        <motion.p
          variants={item}
          className="mt-5 max-w-xl text-base leading-relaxed md:text-lg"
          style={{ color: 'var(--text-secondary)' }}
        >
          <MarkedCopy text={bigIdeaMarked} />
        </motion.p>

        {/* Barra de progreso animada entre pasos — solo desktop */}
        <motion.div
          variants={item}
          className="relative mt-10 hidden h-0.5 md:block"
          style={{ background: 'color-mix(in oklab, var(--accent) 12%, transparent)', borderRadius: 2 }}
        >
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ background: 'var(--accent)', transformOrigin: 'left' }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>

        {/* 3 pasos: filas en mobile, 3 columnas en desktop */}
        <motion.ol
          variants={{
            visible: { transition: { staggerChildren: 0.13, delayChildren: 0.05 } },
            hidden: {},
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-6 grid grid-cols-1 gap-6 md:mt-0 md:-mt-2 md:grid-cols-3"
        >
          {pasos.map((p, i) => (
            <motion.li
              key={i}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="flex items-start gap-4 md:flex-col"
            >
              <motion.span
                aria-hidden="true"
                className="flex size-11 shrink-0 items-center justify-center rounded-full border text-base font-bold tabular-nums"
                style={{
                  borderColor: 'color-mix(in oklab, var(--accent) 22%, transparent)',
                  background: 'var(--chip-bg)',
                  color: 'var(--accent)',
                }}
                initial={{ scale: 0.7, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.13 + 0.1, duration: 0.35, type: 'spring', stiffness: 280, damping: 18 }}
              >
                {String(i + 1).padStart(2, '0')}
              </motion.span>
              <div className="pt-1 md:pt-0">
                <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{p.titulo}</h3>
                <p className="mt-1 text-sm leading-snug" style={{ color: 'var(--text-secondary)' }}>{p.detalle}</p>
              </div>
            </motion.li>
          ))}
        </motion.ol>

        {antesDespues && (
          <motion.div variants={item} className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-[var(--radius-card)] p-5" style={{ background: 'var(--surface-2)' }}>
              <p
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'var(--text-tertiary)' }}
              >
                {antesDespues.labelAntes}
              </p>
              <p className="mt-2 text-sm leading-snug" style={{ color: 'var(--text-secondary)' }}>
                {antesDespues.antes}
              </p>
            </div>
            <div
              className="rounded-[var(--radius-card)] p-5"
              style={{ background: 'color-mix(in oklab, var(--accent) 6%, transparent)' }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'var(--accent)' }}
              >
                {antesDespues.labelDespues}
              </p>
              <p className="mt-2 text-sm font-medium leading-snug" style={{ color: 'var(--text-primary)' }}>
                {antesDespues.despues}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </SectionShell>
  );
}
