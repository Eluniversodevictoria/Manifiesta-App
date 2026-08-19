'use client';

// PaywallModal — gate que aparece cuando trial_expired | subscription_inactive.
// Redirige a Hotmart para elegir plan mensual o anual.

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Sparkles } from 'lucide-react';
import { type PlanPeriodo } from '@/lib/PlanContext';

const HOTMART_MENSUAL = 'https://pay.hotmart.com/D107227544L?off=6ypur4wh';
const HOTMART_ANUAL   = 'https://pay.hotmart.com/D107227544L?off=at20rj67';

const EASE = [0.16, 1, 0.3, 1] as const;

const BENEFICIOS = [
  'Práctica diaria personalizada por Victoria',
  '"Necesito manifestar…" — práctica al instante',
  'Manifestaciones y biblioteca sin límites',
  'Historial completo de tu práctica',
];

interface PaywallModalProps {
  abierto: boolean;
  onCerrar: () => void;
  titulo?: string;
  descripcion?: string;
}

export function PaywallModal({
  abierto,
  onCerrar,
  titulo = 'Elige tu plan para continuar',
  descripcion = 'Tu período de prueba ha terminado.',
}: PaywallModalProps) {
  const [planSel, setPlanSel] = useState<PlanPeriodo>('anual');

  const handleActivar = () => {
    const url = planSel === 'anual' ? HOTMART_ANUAL : HOTMART_MENSUAL;
    window.location.href = url;
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.45)' }}
            onClick={onCerrar}
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-lg rounded-t-3xl px-5 pt-5"
            style={{ background: 'var(--bg)', paddingBottom: 'max(32px, env(safe-area-inset-bottom))' }}
            role="dialog"
            aria-modal="true"
            aria-label="Elegir plan"
          >
            {/* Handle */}
            <div
              className="mx-auto mb-5 h-1 w-10 rounded-full"
              style={{ background: 'color-mix(in oklab, var(--text-tertiary) 30%, transparent)' }}
            />

            {/* Header */}
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-2xl"
                  style={{ background: 'color-mix(in oklab, var(--accent) 12%, transparent)' }}
                >
                  <Sparkles size={20} color="var(--accent)" strokeWidth={1.8} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-base font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                    {titulo}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {descripcion}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onCerrar}
                className="flex size-8 shrink-0 items-center justify-center rounded-full [touch-action:manipulation]"
                style={{ background: 'color-mix(in oklab, var(--text-tertiary) 12%, transparent)' }}
                aria-label="Cerrar"
              >
                <X size={15} color="var(--text-secondary)" strokeWidth={2} />
              </button>
            </div>

            {/* Beneficios */}
            <ul className="mb-5 flex flex-col gap-2">
              {BENEFICIOS.map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <span
                    className="flex size-5 shrink-0 items-center justify-center rounded-full"
                    style={{ background: 'color-mix(in oklab, var(--accent) 12%, transparent)' }}
                    aria-hidden="true"
                  >
                    <Check size={11} strokeWidth={2.5} color="var(--accent)" />
                  </span>
                  <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{b}</span>
                </li>
              ))}
            </ul>

            {/* Selector de plan */}
            <div className="mb-4 flex flex-col gap-2">
              {/* Anual */}
              <button
                type="button"
                onClick={() => setPlanSel('anual')}
                className="relative flex items-center justify-between rounded-2xl border-2 px-4 py-3 text-left [touch-action:manipulation]"
                style={{
                  borderColor: planSel === 'anual' ? 'var(--accent)' : 'color-mix(in oklab, var(--text-tertiary) 28%, transparent)',
                  background: planSel === 'anual' ? 'color-mix(in oklab, var(--accent) 7%, transparent)' : 'var(--surface)',
                }}
              >
                <span
                  className="absolute left-3 rounded-full px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white"
                  style={{ background: 'var(--accent)', top: -10 }}
                >
                  Más popular · 2 meses gratis
                </span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Plan Anual</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>$49.99/año</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                    $4<span className="text-sm font-normal" style={{ color: 'var(--text-secondary)' }}>/mes</span>
                  </p>
                  <p className="text-xs line-through" style={{ color: 'var(--text-tertiary)' }}>$6.99/mes</p>
                </div>
              </button>

              {/* Mensual */}
              <button
                type="button"
                onClick={() => setPlanSel('mensual')}
                className="flex items-center justify-between rounded-2xl border px-4 py-3 text-left [touch-action:manipulation]"
                style={{
                  borderColor: planSel === 'mensual' ? 'var(--accent)' : 'color-mix(in oklab, var(--text-tertiary) 28%, transparent)',
                  background: planSel === 'mensual' ? 'color-mix(in oklab, var(--accent) 7%, transparent)' : 'var(--surface)',
                }}
              >
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Plan Mensual</p>
                <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  $6.99<span className="text-xs font-normal" style={{ color: 'var(--text-secondary)' }}>/mes</span>
                </p>
              </button>
            </div>

            {/* CTA */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={handleActivar}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] text-base font-semibold text-white [touch-action:manipulation]"
              style={{ background: 'var(--accent)', boxShadow: '0 8px 28px color-mix(in oklab, var(--accent) 28%, transparent)' }}
            >
              <Sparkles size={16} strokeWidth={2} />
              Continuar con plan {planSel === 'anual' ? 'Anual' : 'Mensual'}
            </motion.button>

            <p className="mt-2 text-center text-xs" style={{ color: 'var(--text-tertiary)' }}>
              Checkout seguro por Hotmart · Cancela cuando quieras
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
