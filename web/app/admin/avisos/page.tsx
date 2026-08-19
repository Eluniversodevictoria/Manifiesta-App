import { createClient } from '@/lib/supabase/server';
import { adminGetEvents } from '@/lib/supabase/admin-queries';
import { NoData } from '../_components/NoData';

export default async function AvisosPage() {
  const supabase = await createClient();

  const { data: errores } = await adminGetEvents(supabase, 50, 'error');
  const { data: recientes } = await adminGetEvents(supabase, 30);

  return (
    <div>
      <h1 style={h1}>Avisos y errores</h1>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={sTitle}>Eventos de error (últimos 50)</h2>
        {errores && errores.length > 0 ? (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={th}>Fecha</th>
                <th style={th}>Evento</th>
                <th style={th}>User ID</th>
                <th style={th}>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {errores.map((ev) => (
                <tr key={ev.id}>
                  <td style={{ ...td, fontSize: 12, color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
                    {new Date(ev.created_at).toLocaleString('es-MX', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style={td}><code style={{ fontSize: 12, color: 'var(--accent)' }}>{ev.event_name}</code></td>
                  <td style={{ ...td, fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>
                    {ev.user_id.slice(0, 8)}…
                  </td>
                  <td style={{ ...td, fontSize: 12 }}>
                    {ev.properties ? JSON.stringify(ev.properties).slice(0, 120) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <NoData reason="No hay eventos con 'error' en event_log. Buen signo." />
        )}
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={sTitle}>Últimos 30 eventos (cualquier tipo)</h2>
        {recientes && recientes.length > 0 ? (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={th}>Fecha</th>
                <th style={th}>Evento</th>
                <th style={th}>User ID</th>
              </tr>
            </thead>
            <tbody>
              {recientes.map((ev) => (
                <tr key={ev.id}>
                  <td style={{ ...td, fontSize: 12, color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
                    {new Date(ev.created_at).toLocaleString('es-MX', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style={td}><code style={{ fontSize: 12 }}>{ev.event_name}</code></td>
                  <td style={{ ...td, fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>
                    {ev.user_id.slice(0, 8)}…
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <NoData reason="No hay eventos registrados todavía." />
        )}
      </section>
    </div>
  );
}

const h1: React.CSSProperties = { fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2rem' };
const sTitle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' };
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 13 };
const th: React.CSSProperties = { textAlign: 'left', padding: '0.5rem 0.75rem', background: 'var(--surface)', borderBottom: '1px solid color-mix(in oklab, var(--text-tertiary) 18%, transparent)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-tertiary)', fontWeight: 600 };
const td: React.CSSProperties = { padding: '0.6rem 0.75rem', borderBottom: '1px solid color-mix(in oklab, var(--text-tertiary) 10%, transparent)', color: 'var(--text-primary)' };
