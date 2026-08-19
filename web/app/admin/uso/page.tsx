import { createClient } from '@/lib/supabase/server';
import { adminGetFunnelStats } from '@/lib/supabase/admin-queries';
import type { Json } from '@/lib/supabase/database.types';
import { StatCard } from '../_components/StatCard';
import { NoData } from '../_components/NoData';

type FunnelStats = {
  registrados: number;
  ob_done: number;
  manifestation_created: number;
  daily_practice_done: number;
  pro_converted: number;
  event_counts: Array<{ event: string; count: number }> | null;
  dau_last_14: Array<{ day: string; users: number }> | null;
};

function asF(j: Json | null): FunnelStats | null {
  if (!j || typeof j !== 'object' || Array.isArray(j)) return null;
  return j as unknown as FunnelStats;
}

function pct(num: number, den: number) {
  if (!den) return '—';
  return `${Math.round((num / den) * 100)}%`;
}

export default async function UsoPage() {
  const supabase = await createClient();
  const { data: raw } = await adminGetFunnelStats(supabase);
  const f = asF(raw);

  return (
    <div>
      <h1 style={h1}>Uso y funnel</h1>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={sTitle}>Funnel de activación</h2>
        <div style={grid4}>
          <StatCard label="Registrados" value={f ? f.registrados.toLocaleString() : null} />
          <StatCard label="Onboarding completado" value={f ? `${f.ob_done} (${pct(f.ob_done, f.registrados)})` : null} />
          <StatCard label="Manifestación creada" value={f ? `${f.manifestation_created} (${pct(f.manifestation_created, f.registrados)})` : null} />
          <StatCard label="Primera práctica" value={f ? `${f.daily_practice_done} (${pct(f.daily_practice_done, f.registrados)})` : null} />
          <StatCard label="Convertidos a Pro" value={f ? `${f.pro_converted} (${pct(f.pro_converted, f.registrados)})` : null} accent />
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={sTitle}>DAU — usuarios activos por día (14 días)</h2>
        {f?.dau_last_14 && f.dau_last_14.length > 0 ? (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={th}>Día</th>
                <th style={th}>Usuarios activos</th>
              </tr>
            </thead>
            <tbody>
              {[...f.dau_last_14].reverse().map((row) => (
                <tr key={row.day}>
                  <td style={td}>{new Date(row.day).toLocaleDateString('es-MX', { weekday: 'short', month: 'short', day: 'numeric' })}</td>
                  <td style={td}>{row.users}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <NoData reason="Aún no hay check-ins registrados en la base de datos." />
        )}
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={sTitle}>Todos los eventos (conteo)</h2>
        {f?.event_counts && f.event_counts.length > 0 ? (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={th}>Evento</th>
                <th style={th}>Ocurrencias</th>
              </tr>
            </thead>
            <tbody>
              {f.event_counts.map((ev) => (
                <tr key={ev.event}>
                  <td style={td}><code style={{ fontSize: 12 }}>{ev.event}</code></td>
                  <td style={td}>{Number(ev.count).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <NoData reason="No hay eventos en event_log todavía." />
        )}
      </section>
    </div>
  );
}

const h1: React.CSSProperties = { fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2rem' };
const sTitle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' };
const grid4: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' };
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 13 };
const th: React.CSSProperties = { textAlign: 'left', padding: '0.5rem 0.75rem', background: 'var(--surface)', borderBottom: '1px solid color-mix(in oklab, var(--text-tertiary) 18%, transparent)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-tertiary)', fontWeight: 600 };
const td: React.CSSProperties = { padding: '0.6rem 0.75rem', borderBottom: '1px solid color-mix(in oklab, var(--text-tertiary) 10%, transparent)', color: 'var(--text-primary)' };
