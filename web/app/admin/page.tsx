import { createClient } from '@/lib/supabase/server';
import { adminGetMetrics, adminGetRuletaStats, type RuletaStats } from '@/lib/supabase/admin-queries';
import type { Json } from '@/lib/supabase/database.types';
import { StatCard } from './_components/StatCard';
import { NoData } from './_components/NoData';

type Metrics = {
  total_users: number;
  pro_users: number;
  free_users: number;
  pro_mensual: number;
  pro_anual: number;
  total_manifestaciones: number;
  manifestaciones_activas: number;
  manifestadas: number;
  total_check_ins: number;
  check_ins_hoy: number;
  check_ins_7d: number;
  total_ai_calls: number;
  ai_cost_total_usd: number;
  ai_cost_30d_usd: number;
  events_today: number;
  events_7d: number;
  hotmart_orders_total: number;
  hotmart_mrr_usd: number;
  hotmart_revenue_total_usd: number;
  users_new_7d: number;
  users_new_30d: number;
  activation_ob_done: number;
  activation_manifestation_created: number;
  activation_daily_practice: number;
};

function asMetrics(j: Json | null): Metrics | null {
  if (!j || typeof j !== 'object' || Array.isArray(j)) return null;
  return j as unknown as Metrics;
}

function fmt(n: number | undefined | null, decimals = 0): string {
  if (n === undefined || n === null) return '—';
  return n.toLocaleString('es-MX', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function pct(num: number | undefined | null, den: number | undefined | null): string {
  if (!num || !den || den === 0) return '—';
  return `${Math.round((num / den) * 100)}%`;
}

function asRuleta(j: Json | null): RuletaStats | null {
  if (!j || typeof j !== 'object' || Array.isArray(j)) return null;
  return j as unknown as RuletaStats;
}

export default async function AdminDashboard() {
  const supabase = await createClient();
  const [{ data: raw, error }, { data: ruletaRaw }] = await Promise.all([
    adminGetMetrics(supabase),
    adminGetRuletaStats(supabase),
  ]);
  const ruleta = asRuleta(ruletaRaw);
  const m = asMetrics(raw);

  const setupNeeded = error?.message?.includes('is_owner') || error?.message?.includes('denegado');

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
        Dashboard
      </h1>
      <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: '2rem' }}>
        {new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      {setupNeeded && (
        <div style={{ background: 'color-mix(in oklab, var(--accent) 8%, transparent)', border: '1px solid color-mix(in oklab, var(--accent) 30%, transparent)', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1.5rem', fontSize: 13, color: 'var(--text-primary)' }}>
          <strong>Configura tu acceso admin:</strong> corre la migración <code>002_admin_roles.sql</code> en Supabase y ejecuta:
          <br /><br />
          <code style={{ display: 'block', background: 'color-mix(in oklab, var(--bg) 80%, transparent)', padding: '0.5rem', borderRadius: 6, fontFamily: 'monospace', fontSize: 12 }}>
            UPDATE user_settings SET is_owner = true WHERE user_id = (SELECT id FROM auth.users WHERE email = &apos;TU_EMAIL&apos;);
          </code>
        </div>
      )}

      {error && !setupNeeded && (
        <div style={{ background: 'color-mix(in oklab, var(--accent) 6%, var(--surface))', border: '1px solid color-mix(in oklab, var(--text-tertiary) 30%, transparent)', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1.5rem', fontSize: 13, color: 'var(--text-primary)' }}>
          Error al cargar métricas: {error.message}
        </div>
      )}

      {/* Usuarios */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={sectionTitle}>Usuarios</h2>
        <div style={grid4}>
          <StatCard label="Total registrados" value={m ? fmt(m.total_users) : null} />
          <StatCard label="Pro activos" value={m ? fmt(m.pro_users) : null} accent />
          <StatCard label="Free" value={m ? fmt(m.free_users) : null} />
          <StatCard label="Nuevos (7 días)" value={m ? fmt(m.users_new_7d) : null} />
        </div>
      </section>

      {/* Activación */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={sectionTitle}>Activación</h2>
        <div style={grid4}>
          <StatCard label="Completaron onboarding" value={m ? fmt(m.activation_ob_done) : null}
            sub={m ? `${pct(m.activation_ob_done, m.total_users)} del total` : undefined} />
          <StatCard label="Crearon manifestación" value={m ? fmt(m.activation_manifestation_created) : null}
            sub={m ? `${pct(m.activation_manifestation_created, m.total_users)} del total` : undefined} />
          <StatCard label="Primera práctica" value={m ? fmt(m.activation_daily_practice) : null}
            sub={m ? `${pct(m.activation_daily_practice, m.total_users)} del total` : undefined} />
          <StatCard label="Conversión Free → Pro" value={m ? pct(m.pro_users, m.total_users) : null} />
        </div>
      </section>

      {/* Práctica */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={sectionTitle}>Práctica diaria</h2>
        <div style={grid4}>
          <StatCard label="Check-ins hoy" value={m ? fmt(m.check_ins_hoy) : null} />
          <StatCard label="Check-ins (7 días)" value={m ? fmt(m.check_ins_7d) : null} />
          <StatCard label="Total histórico" value={m ? fmt(m.total_check_ins) : null} />
          <StatCard label="Manifestaciones activas" value={m ? fmt(m.manifestaciones_activas) : null} />
        </div>
      </section>

      {/* Ventas */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={sectionTitle}>Ventas (Hotmart)</h2>
        {m && m.hotmart_orders_total === 0 ? (
          <NoData reason="Webhook de Hotmart pendiente de conectar. Tabla hotmart_orders lista en la DB." />
        ) : (
          <div style={grid4}>
            <StatCard label="Órdenes aprobadas" value={m ? fmt(m.hotmart_orders_total) : null} />
            <StatCard label="MRR este mes (USD)" value={m ? `$${fmt(m.hotmart_mrr_usd, 2)}` : null} accent />
            <StatCard label="Ingresos totales (USD)" value={m ? `$${fmt(m.hotmart_revenue_total_usd, 2)}` : null} />
            <StatCard label="Pro mensual / anual" value={m ? `${fmt(m.pro_mensual)} / ${fmt(m.pro_anual)}` : null} />
          </div>
        )}
      </section>

      {/* Ruleta */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={sectionTitle}>Ruleta de Premios</h2>
        {!ruleta ? (
          <NoData reason="Ejecuta la migración 20260819_ruleta_giros.sql para activar la Ruleta." />
        ) : (
          <>
            <div style={{ ...grid4, marginBottom: '0.75rem' }}>
              <StatCard label="Giros totales" value={fmt(ruleta.total_giros)} />
              <StatCard label="Usuarias que giraron" value={fmt(ruleta.usuarios_unicos)} />
              <StatCard label="Giros hoy" value={fmt(ruleta.giros_hoy)} accent />
            </div>
            {ruleta.premios.length > 0 && (
              <div style={{ background: 'var(--surface)', borderRadius: 12, padding: '0.75rem 1rem' }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Premios ganados
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {ruleta.premios.map((p) => (
                    <div key={p.premio_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: 'var(--text-primary)' }}>
                      <span>{p.premio_nombre}</span>
                      <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{fmt(p.veces)}×</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* IA */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={sectionTitle}>Costos IA</h2>
        <div style={grid4}>
          <StatCard label="Llamadas totales" value={m ? fmt(m.total_ai_calls) : null} />
          <StatCard label="Costo total (USD)" value={m ? `$${fmt(m.ai_cost_total_usd, 4)}` : null} />
          <StatCard label="Costo últimos 30 días" value={m ? `$${fmt(m.ai_cost_30d_usd, 4)}` : null} />
          <StatCard label="Eventos hoy" value={m ? fmt(m.events_today) : null} />
        </div>
      </section>
    </div>
  );
}

const sectionTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  marginBottom: '0.75rem',
};

const grid4: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
  gap: '0.75rem',
};
