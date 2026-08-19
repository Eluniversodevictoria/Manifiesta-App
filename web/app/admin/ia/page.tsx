import { createClient } from '@/lib/supabase/server';
import { adminGetAiStats } from '@/lib/supabase/admin-queries';
import type { Json } from '@/lib/supabase/database.types';
import { StatCard } from '../_components/StatCard';
import { NoData } from '../_components/NoData';

type AiStats = {
  by_model: Array<{ model: string; calls: number; input_tokens: number; output_tokens: number; cost_usd: number }> | null;
  by_purpose: Array<{ purpose: string; calls: number; cost_usd: number }> | null;
  daily_last_30: Array<{ day: string; calls: number; cost_usd: number }> | null;
};

function asA(j: Json | null): AiStats | null {
  if (!j || typeof j !== 'object' || Array.isArray(j)) return null;
  return j as unknown as AiStats;
}

function fmt(n: number | undefined | null, dec = 0) {
  if (n === undefined || n === null) return '—';
  return n.toLocaleString('es-MX', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

export default async function IaPage() {
  const supabase = await createClient();
  const { data: raw } = await adminGetAiStats(supabase);
  const a = asA(raw);

  const totalCost = a?.by_model?.reduce((s, r) => s + r.cost_usd, 0) ?? null;
  const totalCalls = a?.by_model?.reduce((s, r) => s + r.calls, 0) ?? null;
  const totalTokens = a?.by_model?.reduce((s, r) => s + r.input_tokens + r.output_tokens, 0) ?? null;

  const hasData = a?.by_model && a.by_model.length > 0;

  return (
    <div>
      <h1 style={h1}>Costos de IA</h1>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={sTitle}>Totales históricos</h2>
        <div style={grid3}>
          <StatCard label="Llamadas totales" value={hasData ? fmt(totalCalls) : null} />
          <StatCard label="Costo total (USD)" value={hasData ? `$${fmt(totalCost, 4)}` : null} accent />
          <StatCard label="Tokens totales" value={hasData ? fmt(totalTokens) : null} />
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={sTitle}>Por modelo</h2>
        {hasData ? (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={th}>Modelo</th>
                <th style={th}>Llamadas</th>
                <th style={th}>Tokens entrada</th>
                <th style={th}>Tokens salida</th>
                <th style={th}>Costo (USD)</th>
              </tr>
            </thead>
            <tbody>
              {a!.by_model!.map((r) => (
                <tr key={r.model}>
                  <td style={td}><code style={{ fontSize: 12 }}>{r.model}</code></td>
                  <td style={td}>{fmt(r.calls)}</td>
                  <td style={td}>{fmt(r.input_tokens)}</td>
                  <td style={td}>{fmt(r.output_tokens)}</td>
                  <td style={{ ...td, fontWeight: 600, color: 'var(--accent)' }}>${fmt(r.cost_usd, 4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <NoData reason="Aún no hay llamadas de IA registradas en ai_calls. Se registran automáticamente cuando se generan prácticas." />
        )}
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={sTitle}>Por propósito</h2>
        {a?.by_purpose && a.by_purpose.length > 0 ? (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={th}>Propósito</th>
                <th style={th}>Llamadas</th>
                <th style={th}>Costo (USD)</th>
              </tr>
            </thead>
            <tbody>
              {a.by_purpose.map((r) => (
                <tr key={r.purpose}>
                  <td style={td}>{r.purpose}</td>
                  <td style={td}>{fmt(r.calls)}</td>
                  <td style={td}>${fmt(r.cost_usd, 4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <NoData reason="Sin datos de propósito todavía." />
        )}
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={sTitle}>Últimos 30 días (por día)</h2>
        {a?.daily_last_30 && a.daily_last_30.length > 0 ? (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={th}>Día</th>
                <th style={th}>Llamadas</th>
                <th style={th}>Costo (USD)</th>
              </tr>
            </thead>
            <tbody>
              {[...a.daily_last_30].reverse().map((r) => (
                <tr key={r.day}>
                  <td style={td}>{new Date(r.day).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })}</td>
                  <td style={td}>{fmt(r.calls)}</td>
                  <td style={td}>${fmt(r.cost_usd, 4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <NoData reason="Sin llamadas en los últimos 30 días." />
        )}
      </section>
    </div>
  );
}

const h1: React.CSSProperties = { fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2rem' };
const sTitle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' };
const grid3: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' };
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 13 };
const th: React.CSSProperties = { textAlign: 'left', padding: '0.5rem 0.75rem', background: 'var(--surface)', borderBottom: '1px solid color-mix(in oklab, var(--text-tertiary) 18%, transparent)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-tertiary)', fontWeight: 600 };
const td: React.CSSProperties = { padding: '0.6rem 0.75rem', borderBottom: '1px solid color-mix(in oklab, var(--text-tertiary) 10%, transparent)', color: 'var(--text-primary)' };
