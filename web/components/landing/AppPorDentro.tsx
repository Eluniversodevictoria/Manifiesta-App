'use client';

// KIT DE LANDING — §5 LA APP POR DENTRO (blueprint: 55 §5)

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CtaButton, Kicker, SectionShell, useReveal, VIEWPORT_ONCE } from './ui';
import { MarkedCopy, warnCopy, warnRango } from './MarkedCopy';

export interface FrameCarrusel {
  src?: string;
  alt?: string;
  label: string;
  nombrePantalla?: string;
}

export interface AppPorDentroProps {
  kicker?: string;
  tituloMarked: string;
  frames: FrameCarrusel[];
  ctaLabel: string;
  ctaHref: string;
  id?: string;
}

export function AppPorDentro({
  kicker = 'ASÍ SE VE POR DENTRO',
  tituloMarked,
  frames,
  ctaLabel,
  ctaHref,
  id,
}: AppPorDentroProps) {
  warnCopy('AppPorDentro → título', tituloMarked, 8);
  warnRango('AppPorDentro → frames', frames.length, 3, 5);
  const reduce = useReducedMotion();
  const { contenedor, item } = useReveal();
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activo, setActivo] = useState(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const idx = frameRefs.current.indexOf(e.target as HTMLDivElement);
            if (idx >= 0) setActivo(idx);
          }
        }
      },
      { root: scroller, threshold: 0.6 }
    );
    for (const f of frameRefs.current) {
      if (f) io.observe(f);
    }
    return () => io.disconnect();
  }, [frames.length]);

  const irA = (i: number): void => {
    frameRefs.current[i]?.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  };

  return (
    <SectionShell id={id} elevacion="elevada" ariaLabel="La app por dentro">
      <motion.div variants={contenedor} initial={false} whileInView="visible" viewport={VIEWPORT_ONCE}>
        <motion.div variants={item} className="mx-auto max-w-xl text-center">
          <Kicker>{kicker}</Kicker>
          <h2
            className="text-balance text-3xl font-bold leading-tight tracking-tight md:text-4xl"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            <MarkedCopy text={tituloMarked} />
          </h2>
        </motion.div>

        <motion.div variants={item} className="mt-10">
          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-[max(20px,calc(50%-125px))] pb-2 [scrollbar-width:none] [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] [&::-webkit-scrollbar]:hidden"
          >
            {frames.map((f, i) => (
              <div key={i} className="shrink-0 snap-center">
                <motion.div
                  ref={(el) => {
                    frameRefs.current[i] = el;
                  }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="relative aspect-[9/19.5] overflow-hidden shadow-[var(--shadow-2)]"
                  style={{ width: 250, borderRadius: 30, borderWidth: 5, borderColor: 'color-mix(in oklab, var(--text-primary) 90%, var(--accent))' }}
                >
                  {f.src ? (
                    <img
                      src={f.src}
                      alt={f.alt ?? f.label}
                      width={250}
                      height={542}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center border-2 border-dashed px-4"
                      style={{
                        borderColor: 'color-mix(in oklab, var(--text-tertiary) 40%, transparent)',
                        background: 'var(--surface-2)',
                      }}
                    >
                      <span className="text-center text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                        {f.nombrePantalla ?? f.label}
                      </span>
                    </div>
                  )}
                </motion.div>
                <p className="mt-3 text-center text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {f.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-center gap-2">
            {frames.map((f, i) => (
              <button
                key={i}
                type="button"
                onClick={() => irA(i)}
                aria-label={`Ir a: ${f.label}`}
                aria-current={activo === i ? 'true' : undefined}
                className="flex size-6 items-center justify-center [touch-action:manipulation]"
              >
                <span
                  className="size-2 rounded-full transition-colors duration-200"
                  style={{
                    background:
                      activo === i
                        ? 'var(--accent)'
                        : 'color-mix(in oklab, var(--text-tertiary) 30%, transparent)',
                  }}
                />
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="mt-10 flex justify-center">
          <CtaButton href={ctaHref}>{ctaLabel}</CtaButton>
        </motion.div>
      </motion.div>
    </SectionShell>
  );
}
