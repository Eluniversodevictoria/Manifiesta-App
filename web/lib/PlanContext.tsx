'use client';

// PlanContext — plan FREE/PRO en LOCAL/MOCK (sin Supabase)
// upgradeToPro() simula la compra; cuando Hotmart llegue, se llama
// desde el webhook y se persiste en DB, no en localStorage.

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export type PlanTipo = 'free' | 'pro';
export type PlanPeriodo = 'mensual' | 'anual';

// Límites del plan free
export const PLAN_LIMITS = {
  maxManifestacionesActivas: 3,
} as const;

interface PlanContextValue {
  plan: PlanTipo;
  isPro: boolean;
  planPeriodo: PlanPeriodo | null;
  /** Mock: activa el plan localmente. En prod se llama desde el webhook de Hotmart. */
  upgradeToPro: (periodo: PlanPeriodo) => void;
  /** Mock dev-only: vuelve a free para probar los gates */
  resetToFree: () => void;
}

const PlanContext = createContext<PlanContextValue>({
  plan: 'free',
  isPro: false,
  planPeriodo: null,
  upgradeToPro: () => {},
  resetToFree: () => {},
});

const KEY_PLAN = 'manifiesta_plan';
const KEY_PERIODO = 'manifiesta_plan_periodo';

export function PlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<PlanTipo>('free');
  const [planPeriodo, setPlanPeriodo] = useState<PlanPeriodo | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(KEY_PLAN) as PlanTipo | null;
    const savedPeriodo = localStorage.getItem(KEY_PERIODO) as PlanPeriodo | null;
    if (saved === 'pro') setPlan('pro');
    if (savedPeriodo) setPlanPeriodo(savedPeriodo);
  }, []);

  const upgradeToPro = useCallback((periodo: PlanPeriodo) => {
    setPlan('pro');
    setPlanPeriodo(periodo);
    localStorage.setItem(KEY_PLAN, 'pro');
    localStorage.setItem(KEY_PERIODO, periodo);
  }, []);

  const resetToFree = useCallback(() => {
    setPlan('free');
    setPlanPeriodo(null);
    localStorage.removeItem(KEY_PLAN);
    localStorage.removeItem(KEY_PERIODO);
  }, []);

  return (
    <PlanContext.Provider value={{ plan, isPro: plan === 'pro', planPeriodo, upgradeToPro, resetToFree }}>
      {children}
    </PlanContext.Provider>
  );
}

export const usePlan = () => useContext(PlanContext);
