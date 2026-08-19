'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/admin',          label: 'Dashboard' },
  { href: '/admin/ventas',   label: 'Ventas' },
  { href: '/admin/usuarios', label: 'Usuarios' },
  { href: '/admin/uso',      label: 'Uso' },
  { href: '/admin/ia',       label: 'Costos IA' },
  { href: '/admin/avisos',   label: 'Avisos' },
];

export function AdminNav({ userEmail }: { userEmail: string }) {
  const path = usePathname();

  return (
    <aside
      style={{
        width: 200,
        minHeight: '100dvh',
        borderRight: '1px solid color-mix(in oklab, var(--text-tertiary) 18%, transparent)',
        background: 'color-mix(in oklab, var(--bg) 96%, var(--accent) 4%)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 0',
        flexShrink: 0,
      }}
    >
      <div style={{ padding: '0 1.25rem 1.5rem' }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
          }}
        >
          MANIFIESTA
        </p>
        <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>Admin</p>
      </div>

      <nav style={{ flex: 1 }}>
        {NAV.map((item) => {
          const active =
            item.href === '/admin' ? path === '/admin' : path.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'block',
                padding: '0.55rem 1.25rem',
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                color: active ? 'var(--accent)' : 'var(--text-secondary)',
                background: active
                  ? 'color-mix(in oklab, var(--accent) 8%, transparent)'
                  : 'transparent',
                borderRight: active ? '2px solid var(--accent)' : '2px solid transparent',
                textDecoration: 'none',
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid color-mix(in oklab, var(--text-tertiary) 14%, transparent)' }}>
        <p style={{ fontSize: 11, color: 'var(--text-tertiary)', wordBreak: 'break-all' }}>
          {userEmail}
        </p>
        <a
          href="/api/auth/signout"
          style={{ fontSize: 11, color: 'var(--accent)', textDecoration: 'none', display: 'block', marginTop: 6 }}
        >
          Cerrar sesión
        </a>
      </div>
    </aside>
  );
}
