'use client';

import { useState, useTransition } from 'react';
import { updateUserPlan } from '../_actions';
import type { AdminUser as User } from '@/lib/supabase/admin-queries';

export function UserTable({ users }: { users: User[] }) {
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  const filtered = search.trim()
    ? users.filter((u) => u.email.toLowerCase().includes(search.toLowerCase()))
    : users;

  function handlePlan(userId: string, plan: 'free' | 'pro', periodo: 'mensual' | 'anual') {
    startTransition(async () => {
      const result = await updateUserPlan(userId, plan, periodo);
      setFeedback((prev) => ({ ...prev, [userId]: result.ok ? '✓ Actualizado' : `Error: ${result.error}` }));
      setEditing(null);
      setTimeout(() => setFeedback((prev) => { const n = { ...prev }; delete n[userId]; return n; }), 3000);
    });
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="search"
          placeholder="Buscar por email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            maxWidth: 380,
            padding: '0.55rem 0.85rem',
            fontSize: 13,
            border: '1px solid color-mix(in oklab, var(--text-tertiary) 28%, transparent)',
            borderRadius: 8,
            background: 'var(--surface)',
            color: 'var(--text-primary)',
            outline: 'none',
          }}
        />
        <span style={{ marginLeft: '1rem', fontSize: 12, color: 'var(--text-tertiary)' }}>
          {filtered.length} usuario{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {['Email', 'Plan', 'Período', 'Manifestaciones', 'Check-ins', 'Registrado', 'Acciones'].map((h) => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.user_id}>
                <td style={td}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: u.is_owner ? 600 : 400 }}>
                    {u.email}
                  </span>
                  {u.is_owner && (
                    <span style={{ marginLeft: 6, fontSize: 10, background: 'color-mix(in oklab, var(--accent) 12%, transparent)', color: 'var(--accent)', padding: '1px 5px', borderRadius: 4 }}>
                      owner
                    </span>
                  )}
                </td>
                <td style={td}>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 6,
                    background: u.plan === 'pro' ? 'color-mix(in oklab, var(--accent) 12%, transparent)' : 'color-mix(in oklab, var(--text-tertiary) 10%, transparent)',
                    color: u.plan === 'pro' ? 'var(--accent)' : 'var(--text-tertiary)',
                  }}>
                    {u.plan.toUpperCase()}
                  </span>
                </td>
                <td style={{ ...td, color: 'var(--text-tertiary)' }}>{u.plan_periodo ?? '—'}</td>
                <td style={{ ...td, textAlign: 'right' }}>{u.manifestaciones_activas}</td>
                <td style={{ ...td, textAlign: 'right' }}>{u.check_ins_total}</td>
                <td style={{ ...td, color: 'var(--text-tertiary)', fontSize: 12, whiteSpace: 'nowrap' }}>
                  {new Date(u.registered_at).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' })}
                </td>
                <td style={td}>
                  {feedback[u.user_id] ? (
                    <span style={{ fontSize: 12, color: 'var(--accent)' }}>{feedback[u.user_id]}</span>
                  ) : editing === u.user_id ? (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      <button onClick={() => handlePlan(u.user_id, 'pro', 'mensual')} disabled={isPending} style={btnSmall}>Pro/mes</button>
                      <button onClick={() => handlePlan(u.user_id, 'pro', 'anual')} disabled={isPending} style={btnSmall}>Pro/año</button>
                      <button onClick={() => handlePlan(u.user_id, 'free', 'mensual')} disabled={isPending} style={{ ...btnSmall, opacity: 0.6 }}>Free</button>
                      <button onClick={() => setEditing(null)} style={{ ...btnSmall, background: 'transparent', border: 'none', color: 'var(--text-tertiary)' }}>✕</button>
                    </div>
                  ) : (
                    <button onClick={() => setEditing(u.user_id)} style={btnSmall}>
                      Cambiar plan
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const th: React.CSSProperties = {
  textAlign: 'left', padding: '0.5rem 0.75rem',
  background: 'var(--surface)',
  borderBottom: '1px solid color-mix(in oklab, var(--text-tertiary) 18%, transparent)',
  fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em',
  color: 'var(--text-tertiary)', fontWeight: 600, whiteSpace: 'nowrap',
};
const td: React.CSSProperties = {
  padding: '0.6rem 0.75rem',
  borderBottom: '1px solid color-mix(in oklab, var(--text-tertiary) 10%, transparent)',
  color: 'var(--text-primary)',
};
const btnSmall: React.CSSProperties = {
  fontSize: 12, padding: '3px 10px', borderRadius: 6, cursor: 'pointer',
  background: 'color-mix(in oklab, var(--accent) 10%, transparent)',
  border: '1px solid color-mix(in oklab, var(--accent) 30%, transparent)',
  color: 'var(--accent)', fontWeight: 600,
};
