'use client';

// §8 PRICING — simple, premium, sin anchoring falso.
// Anual primero. Precios reales. Sin stack de valores inventados.

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { CheckCustom, CtaButton, CtaButtonOutline, Hairline, SectionShell, useReveal, VIEWPORT_ONCE } from './ui';

export interface OfertaProps {
  ctaLabel?: string;
  ctaHref?: string;
  id?: string;
}

function CountUpPrice({ value }: { value: string }) {
  const match = value.match(/^([^\d]*)(\d+\.?\d*)(.*)$/);
  const prefix = match ? match[1] : '';
  const num = match ? parseFloat(match[2]) : 0;
  const suffix = match ? match[3] : '';
  const decimals = (match?.[2] ?? '').includes('.') ? (match![2].split('.')[1]?.length ?? 0) : 0;

  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [displayed, setDisplayed] = useState('0');

  useEffect(() => {
    if (!inView) return;
    const duration = 900;
    const start = Date.now();
    const raf = requestAnimationFrame(function tick() {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed((num * eased).toFixed(decimals));
      if (progress < 1) requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [inView, num, decimals]);

  return <span ref={ref}>{prefix}{displayed}{suffix}</span>;
}

const FEATURES_ANUAL = [
  'Práctica diaria: afirmación, scripting, ritual y acción concreta',
  'Audio guiado con la voz de Victoria',
  '"Necesito manifestar…" para cuando algo no puede esperar',
  'Manifestaciones activas con seguimiento de tu proceso',
  'Biblioteca de rituales, visualizaciones y scripting',
  'Historial completo de tu práctica',
  'Contenido nuevo cada semana — rituales, prácticas y más',
  'Se manifestó ✨ — marca el momento en que llegó',
];


export function Oferta({ ctaLabel = 'Empezar mis 7 días gratis', ctaHref = '/onboarding', id = 'oferta' }: OfertaProps) {
  const { contenedor, item } = useReveal();

  return (
    <SectionShell id={id} elevacion="base" ariaLabel="Planes y precios">
      <motion.div
        variants={contenedor}
        initial={false}
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
      >
        <motion.div variants={item} className="mx-auto mb-10 max-w-lg text-center">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--champagne)' }}
          >
            Pruébalo gratis
          </p>
          <h2
            className="text-balance text-3xl font-bold leading-tight md:text-4xl"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            7 días con Victoria.{' '}
            <span style={{ color: 'var(--accent)' }}>Después decides.</span>
          </h2>
          <p className="mt-3 text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Durante 7 días tienes acceso completo a MANIFIESTA para descubrir cómo se siente tener prácticas creadas alrededor de tus propios deseos.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-2xl grid-cols-1 items-start gap-6 md:grid-cols-2">
          {/* ANUAL — destacado */}
          <motion.div variants={item} className="relative md:-translate-y-2">
            <span
              className="absolute left-1/2 z-10 -translate-x-1/2 rounded-full border px-4 py-1 text-xs font-semibold"
              style={{
                top: -12,
                borderColor: 'color-mix(in oklab, var(--accent) 25%, transparent)',
                background: 'var(--accent)',
                color: 'white',
              }}
            >
              Más popular
            </span>
            <Hairline emphasis surface="surface" className="shadow-[0_12px_36px_color-mix(in_oklab,var(--accent)_10%,transparent)]">
              <div className="rounded-[var(--radius-card)] p-6 md:p-8" style={{ background: 'var(--surface)' }}>
                <h3
                  className="text-base font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Anual
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span
                    className="text-5xl font-bold tabular-nums leading-none"
                    style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
                  >
                    <CountUpPrice value="$49.99" />
                  </span>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>/año</span>
                </div>
                <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Menos de $0.14 al día · Se cobra después de tus 7 días gratis
                </p>
                <ul className="mt-6 flex flex-col gap-3">
                  {FEATURES_ANUAL.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm leading-snug" style={{ color: 'var(--text-primary)' }}>
                      <CheckCustom />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <CtaButton href={ctaHref} fullMobile>
                    {ctaLabel}
                  </CtaButton>
                </div>
              </div>
            </Hairline>
          </motion.div>

          {/* MENSUAL */}
          <motion.div
            variants={item}
            className="rounded-[var(--radius-card)] border p-6 md:p-8"
            style={{
              background: 'var(--surface)',
              borderColor: 'color-mix(in oklab, var(--text-tertiary) 20%, transparent)',
              boxShadow: 'var(--shadow-1)',
            }}
          >
            <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              Mensual
            </h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span
                className="text-5xl font-bold tabular-nums leading-none"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
              >
                <CountUpPrice value="$6.99" />
              </span>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>/mes</span>
            </div>
            <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
              Se cobra después de tus 7 días gratis · Cancela cuando quieras
            </p>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Acceso completo a MANIFIESTA con la flexibilidad de mes a mes.
            </p>
            <div className="mt-6">
              <CtaButtonOutline href={ctaHref} fullMobile>
                {ctaLabel}
              </CtaButtonOutline>
            </div>
          </motion.div>
        </div>

        {/* Aviso de trial — visible, no en letra pequeña */}
        <motion.p
          variants={item}
          className="mx-auto mt-8 max-w-sm text-center text-sm leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          Hoy $0 con tarjeta. Cancela desde Hotmart antes del día 7 si no deseas continuar.
        </motion.p>
      </motion.div>
    </SectionShell>
  );
}
