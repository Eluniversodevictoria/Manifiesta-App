'use client';

// PlanContext — fuente de verdad: Supabase (backend) + localStorage como cache efímero
// Estados: trial_active | paid_active | trial_expired | subscription_inactive
// Acceso completo: trial_active | paid_active
// Gate (paywall): trial_expired | subscription_inactive
//
// REGLAS:
//  • El trial arranca en el servidor la PRIMERA vez (POST /api/trial/start).
//  • localStorage guarda el resultado del último fetch para evitar flash vacío en re-renders.
//  • Hotmart webhook actualiza Supabase; el frontend relee en cada montaje y en foco.
//  • Un reset local nunca reinicia el trial — el servidor lo ignora si ya existe.

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';

export type AccesoEstado = 'trial_active' | 'paid_active' | 'trial_expired' | 'subscription_inactive';
export type PlanPeriodo = 'mensual' | 'anual';

// Cache key — solo para evitar flash en re-montajes; el backend siempre gana
const CACHE_KEY = 'manifiesta_acceso_cache';

interface AccesoCache {
  acceso: AccesoEstado;
  planPeriodo: PlanPeriodo | null;
  diasTrialRestantes: number;
  ts: number; // timestamp del fetch, ms
}

interface PlanContextValue {
  acceso: AccesoEstado;
  hasAccess: boolean;
  isTrial: boolean;
  diasTrialRestantes: number;
  planPeriodo: PlanPeriodo | null;
  loading: boolean;
  refetch: () => Promise<void>;
  /** Dev-only — no reinicia el trial del servidor */
  resetAcceso: () => void;
}

const PlanContext = createContext<PlanContextValue>({
  acceso: 'trial_active',
  hasAccess: true,
  isTrial: true,
  diasTrialRestantes: 7,
  planPeriodo: null,
  loading: true,
  refetch: async () => {},
  resetAcceso: () => {},
});

// ── Leer cache local ──────────────────────────────────────────────────────
function readCache(): AccesoCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AccesoCache;
  } catch { return null; }
}

function writeCache(data: AccesoCache) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch {}
}

function clearCache() {
  try { localStorage.removeItem(CACHE_KEY); } catch {}
}

// ── Derivar días restantes desde trial_ends_at ISO ───────────────────────
function calcDiasRestantes(trialEndsAt: string | null): number {
  if (!trialEndsAt) return 0;
  const diff = new Date(trialEndsAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86_400_000));
}

export function PlanProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Omit<PlanContextValue, 'loading' | 'refetch' | 'resetAcceso'>>(() => {
    // Seed desde cache para evitar flash
    const cache = readCache();
    return {
      acceso: cache?.acceso ?? 'trial_active',
      hasAccess: true,
      isTrial: true,
      diasTrialRestantes: cache?.diasTrialRestantes ?? 7,
      planPeriodo: cache?.planPeriodo ?? null,
    };
  });
  const [loading, setLoading] = useState(true);

  const fetchAcceso = useCallback(async () => {
    const supabase = createClient();

    // 1. Verificar sesión activa
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      // No logueada → asumimos trial_active hasta que se loguee
      setLoading(false);
      return;
    }

    // 2. Leer user_settings desde Supabase (con RLS: solo puede leer la propia fila)
    const { data: settings } = await supabase
      .from('user_settings')
      .select('access_status, plan_periodo, trial_ends_at')
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (!settings) {
      // Primera entrada: pedir al servidor que arranque el trial
      await fetch('/api/trial/start', { method: 'POST' });
      // Re-leer tras el arranque
      const { data: fresh } = await supabase
        .from('user_settings')
        .select('access_status, plan_periodo, trial_ends_at')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (fresh) applySettings(fresh);
      setLoading(false);
      return;
    }

    applySettings(settings);
    setLoading(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function applySettings(s: {
    access_status: string | null;
    plan_periodo: string | null;
    trial_ends_at: string | null;
  }) {
    const acceso = (s.access_status as AccesoEstado) ?? 'trial_active';
    const planPeriodo = (s.plan_periodo as PlanPeriodo) ?? null;
    const diasTrialRestantes = calcDiasRestantes(s.trial_ends_at);

    const next = {
      acceso,
      hasAccess: acceso === 'trial_active' || acceso === 'paid_active',
      isTrial: acceso === 'trial_active',
      diasTrialRestantes,
      planPeriodo,
    };
    setState(next);
    writeCache({ ...next, ts: Date.now() });
  }

  useEffect(() => {
    void fetchAcceso();

    // Re-fetch cuando la ventana recupera el foco (usuario vuelve de Hotmart)
    const onFocus = () => { void fetchAcceso(); };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchAcceso]);

  // Dev helper — limpia cache local sin tocar el servidor
  const resetAcceso = useCallback(() => {
    clearCache();
    void fetchAcceso();
  }, [fetchAcceso]);

  return (
    <PlanContext.Provider value={{ ...state, loading, refetch: fetchAcceso, resetAcceso }}>
      {children}
    </PlanContext.Provider>
  );
}

export const usePlan = () => useContext(PlanContext);

// Alias de compatibilidad
export function usePlanCompat() {
  const ctx = usePlan();
  return { ...ctx, isPro: ctx.hasAccess, plan: ctx.hasAccess ? (ctx.planPeriodo ?? 'pro') : 'free' };
}
