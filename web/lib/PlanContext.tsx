'use client';

// PlanContext — estado de acceso basado en trial de 7 días + suscripción
// Estados: trial_active | paid_active | trial_expired | subscription_inactive
// Acceso completo: trial_active | paid_active
// Gate (paywall): trial_expired | subscription_inactive
//
// En producción, el estado real viene del webhook de Hotmart + Supabase.
// En LOCAL/MOCK: el trial arranca cuando el usuario llega a la app por primera vez.

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type AccesoEstado = 'trial_active' | 'paid_active' | 'trial_expired' | 'subscription_inactive';
export type PlanPeriodo = 'mensual' | 'anual';

const TRIAL_DIAS = 7;
const KEY_TRIAL_START = 'manifiesta_trial_start';
const KEY_ACCESO = 'manifiesta_acceso';
const KEY_PERIODO = 'manifiesta_plan_periodo';

interface PlanContextValue {
  acceso: AccesoEstado;
  /** true cuando la usuaria puede usar todas las funciones */
  hasAccess: boolean;
  /** true si está en período de prueba activo */
  isTrial: boolean;
  /** días restantes del trial (0 si no aplica) */
  diasTrialRestantes: number;
  planPeriodo: PlanPeriodo | null;
  /** Llamado desde el webhook de Hotmart cuando el pago se confirma */
  activarSuscripcion: (periodo: PlanPeriodo) => void;
  /** Dev-only: resetea al estado inicial */
  resetAcceso: () => void;
}

const PlanContext = createContext<PlanContextValue>({
  acceso: 'trial_active',
  hasAccess: true,
  isTrial: true,
  diasTrialRestantes: TRIAL_DIAS,
  planPeriodo: null,
  activarSuscripcion: () => {},
  resetAcceso: () => {},
});

function calcularEstado(trialStart: number | null, savedAcceso: string | null): AccesoEstado {
  if (savedAcceso === 'paid_active') return 'paid_active';
  if (savedAcceso === 'subscription_inactive') return 'subscription_inactive';

  if (!trialStart) return 'trial_active';
  const diasTranscurridos = Math.floor((Date.now() - trialStart) / (1000 * 60 * 60 * 24));
  return diasTranscurridos < TRIAL_DIAS ? 'trial_active' : 'trial_expired';
}

export function PlanProvider({ children }: { children: ReactNode }) {
  const [acceso, setAcceso] = useState<AccesoEstado>('trial_active');
  const [planPeriodo, setPlanPeriodo] = useState<PlanPeriodo | null>(null);
  const [trialStart, setTrialStart] = useState<number | null>(null);

  useEffect(() => {
    const savedAcceso = localStorage.getItem(KEY_ACCESO);
    const savedPeriodo = localStorage.getItem(KEY_PERIODO) as PlanPeriodo | null;
    let savedTrialStart = localStorage.getItem(KEY_TRIAL_START)
      ? Number(localStorage.getItem(KEY_TRIAL_START))
      : null;

    // Iniciar trial si es primera vez
    if (!savedTrialStart && savedAcceso !== 'paid_active') {
      savedTrialStart = Date.now();
      localStorage.setItem(KEY_TRIAL_START, String(savedTrialStart));
    }

    setTrialStart(savedTrialStart);
    if (savedPeriodo) setPlanPeriodo(savedPeriodo);
    setAcceso(calcularEstado(savedTrialStart, savedAcceso));
  }, []);

  const diasTrialRestantes = trialStart
    ? Math.max(0, TRIAL_DIAS - Math.floor((Date.now() - trialStart) / (1000 * 60 * 60 * 24)))
    : TRIAL_DIAS;

  const activarSuscripcion = (periodo: PlanPeriodo) => {
    setPlanPeriodo(periodo);
    setAcceso('paid_active');
    localStorage.setItem(KEY_ACCESO, 'paid_active');
    localStorage.setItem(KEY_PERIODO, periodo);
  };

  const resetAcceso = () => {
    localStorage.removeItem(KEY_ACCESO);
    localStorage.removeItem(KEY_PERIODO);
    localStorage.removeItem(KEY_TRIAL_START);
    const newStart = Date.now();
    localStorage.setItem(KEY_TRIAL_START, String(newStart));
    setTrialStart(newStart);
    setPlanPeriodo(null);
    setAcceso('trial_active');
  };

  const hasAccess = acceso === 'trial_active' || acceso === 'paid_active';
  const isTrial = acceso === 'trial_active';

  return (
    <PlanContext.Provider value={{ acceso, hasAccess, isTrial, diasTrialRestantes, planPeriodo, activarSuscripcion, resetAcceso }}>
      {children}
    </PlanContext.Provider>
  );
}

export const usePlan = () => useContext(PlanContext);

// Compatibilidad: alias para código que aún no fue migrado
// isPro = hasAccess (durante el trial también tienen acceso completo)
export function usePlanCompat() {
  const ctx = usePlan();
  return { ...ctx, isPro: ctx.hasAccess, plan: ctx.hasAccess ? (ctx.planPeriodo ?? 'pro') : 'free' };
}
