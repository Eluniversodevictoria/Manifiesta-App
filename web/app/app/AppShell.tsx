'use client';

// AppShell — shell de la app interna.
// Gate GLOBAL de acceso: si trial_expired o subscription_inactive → paywall completo.
// No hay gates adicionales pantalla por pantalla.

import { type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BottomNav } from './BottomNav';
import { SheetUrgente } from './SheetUrgente';
import { ManifestacionesProvider } from '@/lib/ManifestacionesContext';
import { PlanProvider, usePlan } from '@/lib/PlanContext';
import { SheetUrgenteProvider, useSheetUrgente } from '@/lib/SheetUrgenteContext';
import { PaywallModal } from '@/components/PaywallModal';
import { FirstTimeTour } from '@/components/FirstTimeTour';

// ── Pantalla de carga mínima ───────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div
      className="flex min-h-dvh items-center justify-center"
      style={{ background: 'var(--bg)' }}
    >
      <div
        className="flex flex-col items-center gap-3"
        aria-label="Cargando"
        aria-live="polite"
      >
        <div
          className="flex size-12 items-center justify-center rounded-2xl text-xl text-white"
          style={{ background: 'var(--accent)' }}
          aria-hidden="true"
        >
          ✦
        </div>
        <div
          className="h-1 w-16 overflow-hidden rounded-full"
          style={{ background: 'color-mix(in oklab, var(--accent) 16%, transparent)' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--accent)' }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Inner shell con gate ──────────────────────────────────────────────────
function AppShellInner({ children }: { children: ReactNode }) {
  const { abierto, cerrar } = useSheetUrgente();
  const { hasAccess, loading } = usePlan();

  if (loading) return <LoadingScreen />;

  return (
    <div
      className="flex min-h-dvh flex-col"
      style={{ background: 'var(--bg)', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}
    >
      {hasAccess ? (
        <>
          <div className="flex flex-1 flex-col pb-[calc(68px+env(safe-area-inset-bottom))]">
            {children}
          </div>
          <BottomNav />
          <SheetUrgente abierto={abierto} onCerrar={cerrar} />
          <FirstTimeTour />
        </>
      ) : (
        // Gate global: trial vencido o suscripción inactiva
        <AnimatePresence>
          <PaywallModal
            abierto
            onCerrar={() => {}} // no se puede cerrar — es el gate
            titulo="Elige tu plan para continuar"
            descripcion="Tu período de prueba ha terminado. Elige un plan para seguir manifestando."
            forzado
          />
        </AnimatePresence>
      )}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <PlanProvider>
      <ManifestacionesProvider>
        <SheetUrgenteProvider>
          <AppShellInner>{children}</AppShellInner>
        </SheetUrgenteProvider>
      </ManifestacionesProvider>
    </PlanProvider>
  );
}
