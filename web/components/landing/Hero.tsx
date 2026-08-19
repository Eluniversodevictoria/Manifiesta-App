'use client';

// §1 HERO — limpio, emocional, con aire. Fondo marfil, titulares en espresso.
// Rosa Victoria SOLO en la frase estratégica del headline y en el CTA.

import type { ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { CtaButton } from './ui';
import { DecorativosHero } from './Decorativos';

export interface HeroProps {
  appName: string;
  logo?: ReactNode;
  loginHref?: string;
  loginLabel?: string;
  ctaLabel: string;
  ctaHref: string;
  socialProof?: ReactNode;
  visual?: ReactNode;
  id?: string;
}

export function Hero({
  appName,
  logo,
  loginHref,
  loginLabel = 'Entrar',
  ctaLabel,
  ctaHref,
  socialProof,
  visual,
  id = 'hero',
}: HeroProps) {
  const reduce = useReducedMotion();

  const EASE = [0.16, 1, 0.3, 1] as const;
  const contenedor: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: reduce ? 0 : 0.10 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0.2 : 0.55, ease: EASE } },
  };

  return (
    <section id={id} className="relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Decorativos — pocos, con intención */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <DecorativosHero />
      </div>

      {/* Gradiente radial muy sutil — solo en la zona superior */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(600px 400px at 60% 0%, color-mix(in oklab, var(--accent-2) 22%, transparent) 0%, transparent 70%)',
        }}
      />

      <div className="mx-auto w-full max-w-5xl px-5">
        {/* Header */}
        <header className="flex h-16 items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-2 text-sm font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            {logo ?? (
              <span
                aria-hidden="true"
                className="flex size-7 items-center justify-center rounded-full text-[11px] font-bold text-white"
                style={{ background: 'var(--accent)' }}
              >
                M
              </span>
            )}
            {appName}
          </a>
          {loginHref && (
            <a
              href={loginHref}
              className="px-2 py-3 text-sm font-medium"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {loginLabel}
            </a>
          )}
        </header>

        {/* Contenido del hero */}
        <motion.div
          variants={contenedor}
          initial="hidden"
          animate="visible"
          className="mx-auto flex max-w-2xl flex-col items-center pb-16 pt-12 text-center md:pb-20 md:pt-16"
        >
          {/* Eyebrow */}
          <motion.p
            variants={item}
            className="mb-5 text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--champagne)' }}
          >
            Manifestación hecha para ti
          </motion.p>

          {/* H1 — espresso + una frase en rosa */}
          <motion.h1
            variants={item}
            className="text-balance text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            Lo que quieres manifestar merece algo{' '}
            <span style={{ color: 'var(--accent)' }}>hecho para ti.</span>
          </motion.h1>

          {/* Subtítulo — neutro oscuro, sin rosa */}
          <motion.p
            variants={item}
            className="mt-5 max-w-lg text-lg leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Cuéntale a Victoria qué quieres atraer y recibe una práctica creada alrededor de ese deseo:
            afirmación, scripting, ritual y una acción para hoy.
          </motion.p>

          {/* CTA */}
          <motion.div variants={item} className="mt-8 w-full sm:w-auto">
            <CtaButton href={ctaHref} alto={56}>
              {ctaLabel}
            </CtaButton>
          </motion.div>

          {/* Micro-copy */}
          {socialProof && (
            <motion.div
              variants={item}
              className="mt-3 text-xs"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {socialProof}
            </motion.div>
          )}

          {/* Visual */}
          {visual && (
            <motion.div
              variants={item}
              className="mt-12 w-full max-w-md"
            >
              <div
                className="overflow-hidden rounded-[28px] border"
                style={{
                  borderColor: 'color-mix(in oklab, var(--text-tertiary) 16%, transparent)',
                  boxShadow: 'var(--shadow-2)',
                }}
              >
                {visual}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
