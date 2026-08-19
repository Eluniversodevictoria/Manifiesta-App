'use client';

// Firma decorativa de MANIFIESTA — pocos elementos, usados con intención.
// Rosa Victoria para el ✦ principal; champagne para los secundarios.

import type { CSSProperties } from 'react';

interface DestelloProps {
  x: string;
  y: string;
  size?: number;
  opacity?: number;
  delay?: number;
  duration?: number;
  variant?: 'star4' | 'cross';
  color?: string;
}

function Destello({
  x,
  y,
  size = 12,
  opacity = 0.35,
  delay = 0,
  duration = 7,
  variant = 'star4',
  color = 'var(--accent)',
}: DestelloProps) {
  const style: CSSProperties = {
    position: 'absolute',
    left: x,
    top: y,
    width: size,
    height: size,
    opacity,
    animation: `floatDecor ${duration}s ease-in-out ${delay}s infinite`,
    pointerEvents: 'none',
    color,
  };

  if (variant === 'cross') {
    return (
      <svg aria-hidden="true" className="decor" style={style} viewBox="0 0 14 14" fill="none">
        <line x1="7" y1="0" x2="7" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="0" y1="7" x2="14" y2="7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="decor" style={style} viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 0 L11.8 8.2 L20 10 L11.8 11.8 L10 20 L8.2 11.8 L0 10 L8.2 8.2 Z" />
    </svg>
  );
}

// Hero — tres elementos máximo
export function DecorativosHero() {
  return (
    <>
      <Destello x="87%" y="12%" size={14} opacity={0.30} delay={0}   duration={8} variant="star4" color="var(--accent)" />
      <Destello x="6%"  y="22%" size={9}  opacity={0.22} delay={2.5} duration={9} variant="cross" color="var(--champagne)" />
      <Destello x="82%" y="55%" size={8}  opacity={0.18} delay={4}   duration={7} variant="star4" color="var(--champagne)" />
    </>
  );
}

// CtaFinal — sobre fondo rose pálido
export function DecorativosCtaFinal() {
  return (
    <>
      <Destello x="8%"  y="15%" size={12} opacity={0.25} delay={0}   duration={9} variant="star4" color="var(--accent)" />
      <Destello x="90%" y="30%" size={8}  opacity={0.18} delay={2}   duration={7} variant="cross" color="var(--champagne)" />
    </>
  );
}
