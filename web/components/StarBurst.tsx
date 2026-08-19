'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

interface Particle {
  id:    number;
  angle: number;
  dist:  number;
  color: string;
  size:  number;
  delay: number;
}

const COLORS = [
  'var(--accent)',
  'var(--accent-2)',
  'var(--champagne)',
  'var(--bg)',
] as const;

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function buildParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id:    i,
    angle: (360 / count) * i + randomBetween(-10, 10),
    dist:  randomBetween(60, 120),
    color: COLORS[i % COLORS.length],
    size:  randomBetween(5, 9),
    delay: randomBetween(0, 0.08),
  }));
}

interface Props {
  trigger: boolean;
  count?:  number;
}

export default function StarBurst({ trigger, count = 14 }: Props) {
  const reduced = useReducedMotion();
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!trigger || reduced) return;
    setParticles(buildParticles(count));
    const t = setTimeout(() => setParticles([]), 900);
    return () => clearTimeout(t);
  }, [trigger, count, reduced]);

  if (reduced || particles.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center"
    >
      <AnimatePresence>
        {particles.map(p => {
          const rad   = (p.angle * Math.PI) / 180;
          const tx    = Math.cos(rad) * p.dist;
          const ty    = Math.sin(rad) * p.dist;
          // 4-pointed star as SVG polygon
          const half  = p.size / 2;
          const thin  = p.size * 0.15;
          const pts   = `
            0,${-p.size} ${thin},${-thin}
            ${p.size},0  ${thin},${thin}
            0,${p.size}  ${-thin},${thin}
            ${-p.size},0 ${-thin},${-thin}
          `.trim();

          return (
            <motion.svg
              key={p.id}
              width={p.size * 2 + 4}
              height={p.size * 2 + 4}
              viewBox={`${-p.size - 2} ${-p.size - 2} ${p.size * 2 + 4} ${p.size * 2 + 4}`}
              style={{ position: 'absolute' }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.3, rotate: 0 }}
              animate={{ x: tx, y: ty, opacity: 0, scale: 1, rotate: randomBetween(60, 200) }}
              exit={{}}
              transition={{
                duration: 0.75,
                delay:    p.delay,
                ease:     [0.16, 1, 0.3, 1],
              }}
            >
              <polygon points={pts} fill={p.color} />
            </motion.svg>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
