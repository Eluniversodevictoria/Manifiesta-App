'use client';

// §4 MECANISMO — La Práctica de Victoria: 3 pasos visuales 01/02/03
// Numeración en champagne, iconos en acento, fondo crema suave.

import { motion } from 'motion/react';
import { Sparkles, PenLine, Eye } from 'lucide-react';
import { SectionShell, useReveal, VIEWPORT_ONCE } from './ui';

export interface MecanismoProps {
  id?: string;
}

const PASOS = [
  {
    num: '01',
    titulo: 'Desea',
    icono: Sparkles,
    lead: 'Cuéntale a Victoria qué quieres manifestar',
    detalle:
      'No eliges una afirmación genérica. Escribes lo que realmente quieres atraer a tu vida y qué está pasando contigo alrededor de ese deseo.',
  },
  {
    num: '02',
    titulo: 'Practica',
    icono: PenLine,
    lead: 'Recibe algo creado para ti',
    detalle:
      'Victoria prepara una práctica combinando afirmación, scripting, ritual y una acción para hoy. No tienes que decidir qué técnica hacer. Abres MANIFIESTA y está lista.',
  },
  {
    num: '03',
    titulo: 'Observa',
    icono: Eye,
    lead: 'Guarda lo que empieza a cambiar',
    detalle:
      'Tus prácticas, pensamientos y avances quedan conectados con cada manifestación. Puedes volver y ver tu proceso sin empezar de cero cada día.',
  },
];

export function Mecanismo({ id }: MecanismoProps) {
  const { contenedor, item } = useReveal();

  return (
    <SectionShell id={id} elevacion="base" ariaLabel="La Práctica de Victoria">
      <motion.div
        variants={contenedor}
        initial={false}
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="mx-auto max-w-xl"
      >
        <motion.div variants={item} className="mb-10 text-center">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--champagne)' }}
          >
            La Práctica de Victoria
          </p>
          <h2
            className="text-balance text-3xl font-bold leading-tight md:text-4xl"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            Tú traes el deseo.{' '}
            <span style={{ color: 'var(--accent)' }}>Victoria prepara el resto.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Un proceso sencillo para dejar de saltar entre técnicas y empezar a manifestar de una forma que se sienta tuya.
          </p>
        </motion.div>

        <div className="flex flex-col gap-6">
          {PASOS.map((paso, i) => {
            const Icono = paso.icono;
            return (
              <motion.div
                key={paso.num}
                variants={item}
                className="flex gap-5 rounded-[var(--radius-card)] p-5"
                style={{ background: 'var(--surface)', boxShadow: 'var(--shadow-1)' }}
              >
                <div className="shrink-0 text-right">
                  <span
                    className="block text-lg font-bold tabular-nums leading-none"
                    style={{ color: 'var(--champagne)', fontFamily: 'var(--font-display)' }}
                  >
                    {paso.num}
                  </span>
                  <div
                    className="mt-2 flex size-9 items-center justify-center rounded-full"
                    style={{ background: 'var(--chip-bg)' }}
                  >
                    <Icono size={16} color="var(--accent)" aria-hidden="true" />
                  </div>
                </div>
                <div>
                  <p
                    className="text-base font-semibold leading-snug"
                    style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
                  >
                    {paso.lead}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {paso.detalle}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Cierre emocional */}
        <motion.div
          variants={item}
          className="mt-10 rounded-[var(--radius-card)] p-6 text-center"
          style={{ background: 'var(--surface-rose)' }}
        >
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            Y cuando eso que estabas esperando finalmente llegue…
          </p>
          <p
            className="mt-3 text-xl font-bold"
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}
          >
            ✨ Se manifestó
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Lo marcas. Lo celebras. Queda guardado como parte de tu historia.
          </p>
        </motion.div>
      </motion.div>
    </SectionShell>
  );
}
