// Queries de admin — se ejecutan en Server Components y Server Actions.
// El casting explícito evita que los tipos de RPC con args opcionales
// queden como `undefined` en el resolver de @supabase/supabase-js v2.
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Json } from './database.types';

// El tipo exacto de SupabaseClient varía según los 3 genéricos de la DB; usamos `any`
// solo en los límites de esta capa para evitar propagación al resto del codebase.
function rpc<T>(client: any, fn: string, args?: Record<string, unknown>) {
  return (client.rpc(fn, args ?? {}) as Promise<{ data: T | null; error: { message: string } | null }>);
}

export function adminGetMetrics(client: any) {
  return rpc<Json>(client, 'admin_get_metrics');
}

export function adminGetAiStats(client: any) {
  return rpc<Json>(client, 'admin_get_ai_stats');
}

export function adminGetFunnelStats(client: any) {
  return rpc<Json>(client, 'admin_get_funnel_stats');
}

export type AdminUser = {
  user_id: string;
  email: string;
  plan: 'free' | 'pro';
  plan_periodo: 'mensual' | 'anual' | null;
  plan_activado_at: string | null;
  is_owner: boolean;
  manifestaciones_activas: number;
  check_ins_total: number;
  registered_at: string;
};

export function adminGetUsers(client: any, searchQuery?: string | null) {
  return rpc<AdminUser[]>(client, 'admin_get_users', { search_query: searchQuery ?? null });
}

export type AdminEvent = {
  id: string;
  user_id: string;
  event_name: string;
  properties: Json | null;
  created_at: string;
};

export function adminGetEvents(client: any, limitN = 100, nameFilter?: string | null) {
  return rpc<AdminEvent[]>(client, 'admin_get_events', { limit_n: limitN, name_filter: nameFilter ?? null });
}

export type RuletaStats = {
  total_giros: number;
  usuarios_unicos: number;
  giros_hoy: number;
  premios: Array<{ premio_id: string; premio_nombre: string; veces: number }>;
};

export function adminGetRuletaStats(client: any) {
  return rpc<RuletaStats>(client, 'admin_get_ruleta_stats');
}

export function adminUpdateUserPlan(
  client: any,
  targetUserId: string,
  newPlan: 'free' | 'pro',
  newPeriodo: 'mensual' | 'anual',
) {
  return rpc<void>(client, 'admin_update_user_plan', {
    target_user_id: targetUserId,
    new_plan: newPlan,
    new_periodo: newPeriodo,
  });
}
