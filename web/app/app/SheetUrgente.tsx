'use client';

// SheetUrgente — bottom sheet del botón ✦ central
// Muestra "¿Qué necesitas manifestar hoy?" con intenciones rápidas
// Al elegir una → va a /app/scripting?modo=urgente&intencion=X

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { staggerContainer, staggerItem } from '@/lib/motion-presets';
import { X, Sparkles, Banknote, Zap, Heart, Wind, Leaf, Star, PenLine } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const INTENCIONES: { key: string; icon: LucideIcon; label: string }[] = [
  { key: 'dinero',        icon: Banknote, label: 'Atraer dinero'         },
  { key: 'oportunidad',   icon: Zap,      label: 'Una oportunidad'       },
  { key: 'amor',          icon: Heart,    label: 'Amor y conexión'       },
  { key: 'soltar',        icon: Wind,     label: 'Soltar algo'           },
  { key: 'salud',         icon: Leaf,     label: 'Salud y energía'       },
  { key: 'claridad',      icon: Sparkles, label: 'Claridad mental'       },
  { key: 'gratitud',      icon: Star,     label: 'Gratitud'              },
  { key: 'libre',         icon: PenLine,  label: 'Escribir libremente'   },
];

export function SheetUrgente({
  abierto,
  onCerrar,
}: {
  abierto: boolean;
  onCerrar: () => void;
}) {
  const router = useRouter();
  const reduced = useReducedMotion();

  const elegir = (key: string) => {
    onCerrar();
    setTimeout(() => {
      router.push(`/app/scripting?modo=urgente&intencion=${key}`);
    }, 220);
  };

  return (
    <AnimatePresence>
      {abierto && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(34, 20, 26, 0.45)' }}
            onClick={onCerrar}
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 34, mass: 0.9 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl px-5 pt-5 pb-10"
            style={{
              background: 'var(--surface)',
              boxShadow: '0 -8px 40px rgba(34,20,26,0.14)',
              paddingBottom: 'calc(2.5rem + env(safe-area-inset-bottom))',
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Manifestar ahora"
          >
            {/* Handle */}
            <div
              className="mx-auto mb-5 h-1 w-10 rounded-full"
              style={{ background: 'color-mix(in oklab, var(--text-tertiary) 30%, transparent)' }}
            />

            {/* Header */}
            <div className="mb-5 flex items-start justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <Sparkles size={16} color="var(--accent)" strokeWidth={1.8} aria-hidden="true" />
                  <span className="text-xs font-semibold uppercase tracking-[0.06em]" style={{ color: 'var(--accent)' }}>
                    Manifestar ahora
                  </span>
                </div>
                <h2
                  className="text-xl font-bold leading-snug tracking-[-0.02em]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  ¿Qué necesitas manifestar hoy?
                </h2>
              </div>
              <button
                type="button"
                onClick={onCerrar}
                className="flex size-8 items-center justify-center rounded-full [touch-action:manipulation]"
                style={{ background: 'color-mix(in oklab, var(--text-tertiary) 12%, transparent)' }}
                aria-label="Cerrar"
              >
                <X size={16} color="var(--text-secondary)" />
              </button>
            </div>

            {/* Intenciones */}
            <motion.div
              className="grid grid-cols-2 gap-2.5"
              variants={staggerContainer(0.05, 0.06)}
              initial={reduced ? false : 'hidden'}
              animate="show"
            >
              {INTENCIONES.map((item) => {
                const Icono = item.icon;
                return (
                  <motion.button
                    key={item.key}
                    type="button"
                    onClick={() => elegir(item.key)}
                    variants={reduced ? {} : staggerItem}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left [touch-action:manipulation]"
                    style={{
                      background: 'var(--bg)',
                      border: '1px solid color-mix(in oklab, var(--text-tertiary) 18%, transparent)',
                    }}
                  >
                    <span
                      className="flex size-8 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: 'color-mix(in oklab, var(--accent) 10%, transparent)' }}
                      aria-hidden="true"
                    >
                      <Icono size={15} color="var(--accent)" strokeWidth={1.8} />
                    </span>
                    <span className="text-xs font-medium leading-tight" style={{ color: 'var(--text-primary)' }}>
                      {item.label}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
