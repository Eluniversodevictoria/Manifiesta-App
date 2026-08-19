'use client';

// §10 FAQ — accordion limpio, paleta espresso + rosa accent.

import { useId, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { SectionShell, useReveal, VIEWPORT_ONCE } from './ui';

export interface ItemFaq {
  pregunta: string;
  respuesta: string;
}

export interface FaqProps {
  titulo?: string;
  items: ItemFaq[];
  abiertoInicial?: number | null;
  id?: string;
}

export function Faq({
  titulo = 'Lo que quizá quieras saber',
  items,
  abiertoInicial = 0,
  id,
}: FaqProps) {
  const [abierto, setAbierto] = useState<number | null>(abiertoInicial);
  const reduce = useReducedMotion();
  const { contenedor, item } = useReveal();
  const baseId = useId();

  return (
    <SectionShell id={id} elevacion="base" ariaLabel="Preguntas frecuentes">
      <motion.div
        variants={contenedor}
        initial={false}
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="mx-auto max-w-xl"
      >
        <motion.div variants={item} className="mb-8">
          <h2
            className="text-balance text-3xl font-bold leading-tight md:text-4xl"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            {titulo}
          </h2>
        </motion.div>

        <motion.ul variants={item} className="flex flex-col">
          {items.map((it, i) => {
            const estaAbierto = abierto === i;
            const btnId = `${baseId}-faq-btn-${i}`;
            const panelId = `${baseId}-faq-panel-${i}`;
            return (
              <li
                key={i}
                style={{
                  borderBottom: '1px solid color-mix(in oklab, var(--text-tertiary) 20%, transparent)',
                }}
              >
                <button
                  type="button"
                  id={btnId}
                  aria-expanded={estaAbierto}
                  aria-controls={panelId}
                  onClick={() => setAbierto(estaAbierto ? null : i)}
                  className="flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left [touch-action:manipulation]"
                >
                  <span
                    className="text-sm font-semibold leading-snug transition-colors duration-150"
                    style={{ color: estaAbierto ? 'var(--accent)' : 'var(--text-primary)' }}
                  >
                    {it.pregunta}
                  </span>
                  <ChevronDown
                    size={18}
                    aria-hidden="true"
                    color={estaAbierto ? 'var(--accent)' : 'var(--text-tertiary)'}
                    className={`shrink-0 transition-transform duration-200 ease-out ${estaAbierto ? 'rotate-180' : ''}`}
                  />
                </button>
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  initial={false}
                  animate={{ height: estaAbierto ? 'auto' : 0, opacity: estaAbierto ? 1 : 0 }}
                  transition={{ duration: reduce ? 0 : 0.26, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p
                    className="pb-5 pr-8 text-sm leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {it.respuesta}
                  </p>
                </motion.div>
              </li>
            );
          })}
        </motion.ul>
      </motion.div>
    </SectionShell>
  );
}
