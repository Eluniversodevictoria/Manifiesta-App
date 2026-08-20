'use client';

// §6 ASÍ SE SIENTE POR DENTRO — carrusel de teléfono único, estilo Abunda.
// UN frame protagonista · el screenshot interior cambia por slide.
// Placeholders vacíos hasta tener los screenshots reales de la app rediseñada.

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionShell, useReveal, VIEWPORT_ONCE } from './ui';

export interface FeelInsideProps {
  id?: string;
}

const SLIDES = [
  {
    kicker: 'TU PRÁCTICA',
    headline: 'Tu práctica de hoy — para leer, o para escucharla con la voz de Victoria.',
    screen: 'Tu práctica de hoy',
    img: '/mockups/screen-practica.png',
  },
  {
    kicker: 'TUS DESEOS',
    headline: 'Todo lo que estás manifestando, sin perder de vista tu proceso.',
    screen: 'Mis manifestaciones',
    img: '/mockups/screen-manifestaciones.png',
  },
  {
    kicker: 'PARA ESE MOMENTO',
    headline: 'Cuando algo no puede esperar a mañana, cuéntaselo a Victoria.',
    screen: 'Necesito manifestar…',
    img: '/mockups/screen-urgente.png',
  },
  {
    kicker: 'HABLA CON VICTORIA',
    headline: 'Cuéntale dónde estás. Victoria escucha, acompaña y te da lo que necesitas.',
    screen: 'Chat con Victoria',
    img: '/mockups/screen-practica.png',
  },
  {
    kicker: 'PARA EXPLORAR',
    headline: 'Rituales, visualizaciones y scripting. Contenido nuevo cada semana.',
    screen: 'Biblioteca',
    img: '/mockups/screen-biblioteca.png',
  },
  {
    kicker: 'TU HISTORIA',
    headline: 'Revisa todo lo que hiciste para llegar hasta aquí. Tu proceso, completo.',
    screen: 'Mi historial',
    img: '/mockups/m-historial.png',
  },
  {
    kicker: 'EL MOMENTO',
    headline: 'Guarda ese momento en el que dejó de ser un deseo.',
    screen: 'Se manifestó ✨',
    img: '/mockups/screen-manifesto.png',
  },
];

const AUTOPLAY_MS = 5500;
const SWIPE_THRESHOLD = 40;

export function FeelInside({ id }: FeelInsideProps) {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const { contenedor, item } = useReveal();
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (d: 1 | -1) => {
      setDir(d);
      setCurrent((p) => (p + d + SLIDES.length) % SLIDES.length);
      setPaused(true);
    },
    [],
  );

  const goTo = useCallback(
    (i: number) => {
      setDir(i > current ? 1 : -1);
      setCurrent(i);
      setPaused(true);
    },
    [current],
  );

  // Autoplay
  useEffect(() => {
    if (paused || reduce) return;
    const t = setInterval(() => {
      setDir(1);
      setCurrent((p) => (p + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, reduce]);

  // Resume after 8 s de inactividad
  useEffect(() => {
    if (!paused) return;
    const t = setTimeout(() => setPaused(false), 8000);
    return () => clearTimeout(t);
  }, [paused, current]);

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD) go(delta < 0 ? 1 : -1);
    touchX.current = null;
  };

  // Variantes del screenshot interior
  const screenVariants = {
    enter: (d: 1 | -1) => ({
      opacity: 0,
      x: reduce ? 0 : d * 24,
    }),
    center: { opacity: 1, x: 0 },
    exit: (d: 1 | -1) => ({
      opacity: 0,
      x: reduce ? 0 : d * -24,
    }),
  };

  const slide = SLIDES[current];

  return (
    <SectionShell id={id} elevacion="base" ariaLabel="Pantallas de MANIFIESTA">
      <motion.div
        variants={contenedor}
        initial={false}
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="mx-auto max-w-xl"
      >
        {/* Encabezado */}
        <motion.div variants={item} className="mb-10 text-center">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--champagne)' }}
          >
            Así se siente por dentro
          </p>
          <h2
            className="text-balance text-3xl font-bold leading-tight md:text-4xl"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            Victoria recuerda hacia{' '}
            <span style={{ color: 'var(--accent)' }}>dónde quieres ir.</span>
          </h2>
          <p className="mt-3 text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            No empiezas de cero cada vez que abres la app.
          </p>
        </motion.div>

        {/* Carrusel — mobile: columna / desktop: fila */}
        <motion.div
          variants={item}
          className="flex flex-col items-center gap-8 md:flex-row md:items-center md:gap-12"
        >
          {/* ── Zona del teléfono ── */}
          {/* El wrapper da espacio a las flechas sin desbordarse */}
          <div
            className="relative w-full flex-shrink-0"
            style={{ maxWidth: 320 }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Frame del teléfono — 76% del wrapper, centrado */}
            <div
              className="relative mx-auto overflow-hidden"
              style={{
                width: '76%',
                aspectRatio: '9 / 19',
                borderRadius: 32,
                background: 'var(--surface)',
                border: '1px solid color-mix(in oklab, var(--text-tertiary) 16%, transparent)',
                boxShadow: '0 20px 56px -12px rgb(36 25 29 / 0.11)',
              }}
            >
              {/* Screenshot interior — cambia con cada slide */}
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={current}
                  custom={dir}
                  variants={screenVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={SLIDES[current].img}
                    alt={SLIDES[current].screen}
                    width={375}
                    height={812}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Flecha izquierda */}
            <button
              type="button"
              aria-label="Pantalla anterior"
              onClick={() => go(-1)}
              className="absolute top-1/2 flex items-center justify-center rounded-full transition-opacity hover:opacity-80"
              style={{
                left: 0,
                transform: 'translateY(-50%)',
                width: 36,
                height: 36,
                background: 'var(--surface)',
                border: '1px solid color-mix(in oklab, var(--text-tertiary) 22%, transparent)',
                boxShadow: 'var(--shadow-1)',
              }}
            >
              <ChevronLeft size={18} color="var(--text-secondary)" aria-hidden="true" />
            </button>

            {/* Flecha derecha */}
            <button
              type="button"
              aria-label="Pantalla siguiente"
              onClick={() => go(1)}
              className="absolute top-1/2 flex items-center justify-center rounded-full transition-opacity hover:opacity-80"
              style={{
                right: 0,
                transform: 'translateY(-50%)',
                width: 36,
                height: 36,
                background: 'var(--surface)',
                border: '1px solid color-mix(in oklab, var(--text-tertiary) 22%, transparent)',
                boxShadow: 'var(--shadow-1)',
              }}
            >
              <ChevronRight size={18} color="var(--text-secondary)" aria-hidden="true" />
            </button>
          </div>

          {/* ── Copy del slide ── */}
          <div className="w-full text-center md:flex-1 md:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={`copy-${current}`}
                initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduce ? 0 : -10 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                <p
                  className="mb-2 text-xs font-semibold uppercase tracking-widest"
                  style={{ color: 'var(--champagne)' }}
                >
                  {slide.kicker}
                </p>
                <p
                  className="text-lg font-semibold leading-snug md:text-xl"
                  style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
                >
                  {slide.headline}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div
              className="mt-6 flex justify-center gap-2 md:justify-start"
              role="tablist"
              aria-label="Navegar entre pantallas"
            >
              {SLIDES.map((s, i) => (
                <button
                  key={s.screen}
                  type="button"
                  role="tab"
                  aria-selected={i === current}
                  aria-label={s.screen}
                  onClick={() => goTo(i)}
                  className="rounded-full"
                  style={{
                    width: i === current ? 20 : 6,
                    height: 6,
                    background:
                      i === current
                        ? 'var(--accent)'
                        : 'color-mix(in oklab, var(--text-tertiary) 28%, transparent)',
                    transition: 'width 0.3s ease, background 0.3s ease',
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </SectionShell>
  );
}
