'use client';

// RiveScene — wrapper para los 3 momentos de marca de MANIFIESTA.
// Ahora: fallback CSS/motion puro. Cuando los .riv estén listos:
// 1. npm add @rive-app/react-canvas
// 2. Descomentar los bloques "RIVE ACTIVO" y comentar los fallbacks.

import { motion, useReducedMotion } from 'motion/react';
import ConstellationSVG from './ConstellationSVG';

export type RiveEscena =
  | 'victoria-preparando'
  | 'constelacion'
  | 'se-manifesto';

interface Props {
  escena: RiveEscena;
  className?: string;
}

export default function RiveScene({ escena, className }: Props) {
  const reduced = useReducedMotion();

  // ── RIVE ACTIVO (descomentar cuando los archivos .riv estén en /public/rive/) ──
  // import { useRive } from '@rive-app/react-canvas';
  // const { RiveComponent } = useRive({ src: `/rive/${escena}.riv`, autoplay: true });
  // return <RiveComponent className={className} />;

  // ── FALLBACK CSS/MOTION ────────────────────────────────────────────────────────
  if (escena === 'victoria-preparando') {
    return (
      <div className={className} aria-hidden="true">
        <ConstellationSVG width={280} height={140} opacity={0.28} delay={0.4} />
      </div>
    );
  }

  if (escena === 'constelacion') {
    return (
      <div className={`relative ${className ?? ''}`} aria-hidden="true">
        <ConstellationSVG width={320} height={180} opacity={0.35} delay={0.2} />
        {/* Estrella central pulsante */}
        <motion.div
          className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: 'var(--champagne)' }}
          animate={reduced ? {} : { scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    );
  }

  // 'se-manifesto'
  return (
    <div className={`relative flex items-center justify-center ${className ?? ''}`} aria-hidden="true">
      {/* Halo de luz expandiéndose */}
      <motion.div
        className="absolute rounded-full"
        style={{ background: 'radial-gradient(circle, color-mix(in oklab, var(--accent) 30%, transparent), transparent 70%)', width: 160, height: 160 }}
        initial={{ scale: 0.4, opacity: 0 }}
        animate={reduced ? { scale: 1, opacity: 1 } : { scale: [0.4, 1.4], opacity: [0, 0.6, 0] }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* Estrella central */}
      <motion.div
        className="relative z-10 size-10 rounded-full"
        style={{ background: 'color-mix(in oklab, var(--accent) 20%, transparent)', border: '1px solid color-mix(in oklab, var(--accent) 40%, transparent)' }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.2 }}
      />
    </div>
  );
}
