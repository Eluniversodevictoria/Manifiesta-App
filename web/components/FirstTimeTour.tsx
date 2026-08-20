'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

const TOUR_KEY = 'manifiesta_tour_done';

const PASOS = [
  {
    target: 'practica',
    titulo: 'Tu práctica de hoy',
    descripcion: 'Victoria la preparó especialmente para ti. Lee o escucha cada bloque a tu ritmo.',
    posicion: 'abajo',
  },
  {
    target: 'checkin',
    titulo: 'Lo hice hoy',
    descripcion: 'Toca aquí cuando termines tu práctica. Así construyes tu racha diaria.',
    posicion: 'arriba',
  },
  {
    target: 'urgente',
    titulo: 'Necesito manifestar ahora',
    descripcion: 'Cuando algo te pesa o quieres atraer algo urgente, aquí está Victoria.',
    posicion: 'arriba',
  },
  {
    target: 'biblioteca',
    titulo: 'Tu biblioteca',
    descripcion: 'Rituales, afirmaciones y visualizaciones para cualquier momento del día.',
    posicion: 'arriba',
  },
];

interface Rect { top: number; left: number; width: number; height: number }

function getRect(selector: string): Rect | null {
  const el = document.querySelector(`[data-tour="${selector}"]`);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

export function FirstTimeTour() {
  const [paso, setPaso] = useState(0);
  const [visible, setVisible] = useState(false);
  const [rect, setRect] = useState<Rect | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(TOUR_KEY)) return;
    // Esperar a que el DOM esté pintado
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  const actualizarRect = useCallback(() => {
    if (!visible) return;
    const r = getRect(PASOS[paso].target);
    setRect(r);
  }, [paso, visible]);

  useEffect(() => {
    actualizarRect();
    window.addEventListener('resize', actualizarRect);
    return () => window.removeEventListener('resize', actualizarRect);
  }, [actualizarRect]);

  const cerrar = useCallback(() => {
    localStorage.setItem(TOUR_KEY, '1');
    setVisible(false);
  }, []);

  const siguiente = useCallback(() => {
    if (paso < PASOS.length - 1) {
      setPaso((p) => p + 1);
    } else {
      cerrar();
    }
  }, [paso, cerrar]);

  if (!visible || !rect) return null;

  const PAD = 8;
  const top = rect.top - PAD;
  const left = rect.left - PAD;
  const width = rect.width + PAD * 2;
  const height = rect.height + PAD * 2;

  const esUltimo = paso === PASOS.length - 1;
  const infoPaso = PASOS[paso];
  const posAbajo = infoPaso.posicion === 'abajo';

  // Posición del tooltip
  const tooltipTop = posAbajo
    ? rect.top + rect.height + PAD + 16
    : rect.top - PAD - 16;
  const tooltipLeft = Math.max(16, Math.min(left, window.innerWidth - 280 - 16));

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Overlay oscuro con "agujero" sobre el elemento */}
          <motion.div
            key={`overlay-${paso}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto fixed inset-0 z-[900]"
            style={{
              background: `
                radial-gradient(ellipse at 50% 50%, transparent 0%, transparent 100%) no-repeat,
                rgba(0,0,0,0.62)
              `,
            }}
            onClick={cerrar}
          >
            {/* Recorte transparente sobre el elemento */}
            <motion.div
              key={`spot-${paso}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute rounded-2xl"
              style={{
                top,
                left,
                width,
                height,
                boxShadow: `0 0 0 9999px rgba(0,0,0,0.62)`,
                border: '2px solid var(--accent)',
                background: 'transparent',
                pointerEvents: 'none',
              }}
            />
          </motion.div>

          {/* Tooltip */}
          <motion.div
            key={`tip-${paso}`}
            initial={{ opacity: 0, y: posAbajo ? 8 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="pointer-events-auto fixed z-[901] w-[calc(100vw-32px)] max-w-[300px] rounded-2xl p-4 shadow-xl"
            style={{
              top: tooltipTop,
              left: tooltipLeft,
              background: 'var(--bg)',
              border: '1px solid color-mix(in oklab, var(--accent) 28%, transparent)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Flecha */}
            <div
              className="absolute h-3 w-3 rotate-45"
              style={{
                [posAbajo ? 'top' : 'bottom']: '-7px',
                left: Math.min(
                  Math.max(rect.left + rect.width / 2 - tooltipLeft - 6, 16),
                  260
                ),
                background: 'var(--bg)',
                border: posAbajo
                  ? '1px solid color-mix(in oklab, var(--accent) 28%, transparent)'
                  : '1px solid color-mix(in oklab, var(--accent) 28%, transparent)',
                borderRight: posAbajo ? 'none' : undefined,
                borderBottom: posAbajo ? 'none' : undefined,
                borderLeft: !posAbajo ? 'none' : undefined,
                borderTop: !posAbajo ? 'none' : undefined,
              }}
            />

            {/* Encabezado */}
            <div className="mb-1 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold" style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
                {infoPaso.titulo}
              </p>
              <button
                type="button"
                onClick={cerrar}
                className="flex size-6 shrink-0 items-center justify-center rounded-full [touch-action:manipulation]"
                style={{ background: 'color-mix(in oklab, var(--text-tertiary) 12%, transparent)' }}
                aria-label="Omitir tour"
              >
                <X size={12} color="var(--text-tertiary)" />
              </button>
            </div>

            <p className="mb-3 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {infoPaso.descripcion}
            </p>

            {/* Controles */}
            <div className="flex items-center justify-between gap-2">
              {/* Puntos de progreso */}
              <div className="flex gap-1.5">
                {PASOS.map((_, i) => (
                  <span
                    key={i}
                    className="block h-1.5 rounded-full transition-all duration-200"
                    style={{
                      width: i === paso ? 16 : 6,
                      background: i === paso
                        ? 'var(--accent)'
                        : 'color-mix(in oklab, var(--text-tertiary) 30%, transparent)',
                    }}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                {!esUltimo && (
                  <button
                    type="button"
                    onClick={cerrar}
                    className="rounded-xl px-3 py-1.5 text-xs [touch-action:manipulation]"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    Omitir
                  </button>
                )}
                <button
                  type="button"
                  onClick={siguiente}
                  className="rounded-xl px-3 py-1.5 text-xs font-semibold [touch-action:manipulation]"
                  style={{ background: 'var(--accent)', color: '#fff' }}
                >
                  {esUltimo ? '¡Entendido!' : 'Siguiente'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
