import { createClient } from '@/lib/supabase/server';
import { adminGetMetrics } from '@/lib/supabase/admin-queries';
import type { Json } from '@/lib/supabase/database.types';
import { StatCard } from '../_components/StatCard';
import { NoData } from '../_components/NoData';

type Metrics = {
  pro_users: number;
  pro_mensual: number;
  pro_anual: number;
  total_users: number;
  hotmart_orders_total: number;
  hotmart_mrr_usd: number;
  hotmart_revenue_total_usd: number;
  users_new_30d: number;
};

function asM(j: Json | null): Metrics | null {
  if (!j || typeof j !== 'object' || Array.isArray(j)) return null;
  return j as unknown as Metrics;
}

function fmt(n: number | undefined | null, dec = 0) {
  if (n === undefined || n === null) return '—';
  return n.toLocaleString('es-MX', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

export default async function VentasPage() {
  const supabase = await createClient();
  const { data: raw } = await adminGetMetrics(supabase);
  const m = asM(raw);

  const hotmartConectado = m && m.hotmart_orders_total > 0;

  return (
    <div>
      <h1 style={h1}>Ventas y negocio</h1>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={sTitle}>Suscripciones activas (datos reales)</h2>
        <div style={grid3}>
          <StatCard label="Usuarios Pro" value={m ? fmt(m.pro_users) : null} accent />
          <StatCard label="Pro mensual" value={m ? fmt(m.pro_mensual) : null} />
          <StatCard label="Pro anual" value={m ? fmt(m.pro_anual) : null} />
        </div>
        <div style={{ ...grid3, marginTop: '0.75rem' }}>
          <StatCard label="Nuevos (30 días)" value={m ? fmt(m.users_new_30d) : null} />
          <StatCard label="Conversión global" value={m && m.total_users ? `${Math.round((m.pro_users / m.total_users) * 100)}%` : null} />
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={sTitle}>Ingresos Hotmart</h2>
        {hotmartConectado ? (
          <div style={grid3}>
            <StatCard label="MRR este mes (USD)" value={`$${fmt(m!.hotmart_mrr_usd, 2)}`} accent />
            <StatCard label="Ingresos totales (USD)" value={`$${fmt(m!.hotmart_revenue_total_usd, 2)}`} />
            <StatCard label="Órdenes aprobadas" value={fmt(m!.hotmart_orders_total)} />
          </div>
        ) : (
          <NoData reason="Webhook de Hotmart pendiente. Ruta: POST /api/webhooks/hotmart — crea el endpoint y configura el HOTTOK." />
        )}
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={sTitle}>Pendiente de integrar</h2>
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid color-mix(in oklab, var(--text-tertiary) 14%, transparent)',
            borderRadius: 12,
            padding: '1.25rem',
            fontSize: 13,
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
          }}
        >
          <p style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Hotmart webhook</p>
          <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
            <li>Crear <code>POST /api/webhooks/hotmart/route.ts</code></li>
            <li>Verificar firma con <code>HOTTOK</code> (nunca exponer al cliente)</li>
            <li>Insertar en <code>hotmart_orders</code> y actualizar <code>user_settings.plan</code></li>
            <li>Conectar en el panel de Hotmart → Integraciones → Webhook</li>
          </ul>
          <p style={{ fontWeight: 600, margin: '1rem 0 0.5rem', color: 'var(--text-primary)' }}>Resend (emails transaccionales)</p>
          <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
            <li>Email de bienvenida tras <code>PURCHASE_APPROVED</code></li>
            <li>Email de acceso / link de login</li>
            <li>Dunning si pago falla</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

const h1: React.CSSProperties = { fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2rem' };
const sTitle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' };
const grid3: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' };
