'use client';

import { useReducedMotion } from 'motion/react';
import { motion } from 'motion/react';

interface Star { cx: number; cy: number }
interface Edge { from: number; to: number }

const STARS: Star[] = [
  { cx: 60,  cy: 30  },
  { cx: 140, cy: 55  },
  { cx: 210, cy: 20  },
  { cx: 250, cy: 90  },
  { cx: 170, cy: 130 },
  { cx: 90,  cy: 110 },
];
const EDGES: Edge[] = [
  { from: 0, to: 1 },
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  { from: 3, to: 4 },
  { from: 4, to: 5 },
  { from: 5, to: 0 },
];

interface Props {
  width?:   number;
  height?:  number;
  opacity?: number;
  color?:   string;
  delay?:   number;
  className?: string;
}

export default function ConstellationSVG({
  width   = 300,
  height  = 160,
  opacity = 0.22,
  color   = 'var(--champagne)',
  delay   = 0.3,
  className,
}: Props) {
  const reduced = useReducedMotion();

  const scaleX = width  / 300;
  const scaleY = height / 160;
  const stars  = STARS.map(s => ({ cx: s.cx * scaleX, cy: s.cy * scaleY }));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      aria-hidden="true"
      style={{ opacity }}
    >
      {/* Lines drawn via pathLength */}
      {EDGES.map((e, i) => {
        const a = stars[e.from];
        const b = stars[e.to];
        return (
          <motion.path
            key={`line-${i}`}
            d={`M ${a.cx} ${a.cy} L ${b.cx} ${b.cy}`}
            stroke={color}
            strokeWidth={0.8}
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={reduced
              ? { pathLength: 1, opacity: 0.6 }
              : { pathLength: 1, opacity: 0.6 }
            }
            transition={reduced
              ? { duration: 0 }
              : {
                  pathLength: { delay: delay + i * 0.18, duration: 0.7, ease: 'easeInOut' },
                  opacity:    { delay: delay + i * 0.18, duration: 0.3 },
                }
            }
          />
        );
      })}

      {/* Star dots — spring pop */}
      {stars.map((s, i) => (
        <motion.circle
          key={`star-${i}`}
          cx={s.cx}
          cy={s.cy}
          r={i === 0 ? 3 : 2}
          fill={color}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: i === 0 ? 1 : 0.75 }}
          transition={reduced
            ? { duration: 0 }
            : {
                type:      'spring',
                stiffness: 380,
                damping:   20,
                delay:     delay + i * 0.12,
              }
          }
          style={{ originX: `${s.cx}px`, originY: `${s.cy}px` }}
        />
      ))}
    </svg>
  );
}
