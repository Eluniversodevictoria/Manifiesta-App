import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminNav } from './_components/AdminNav';

export const metadata = { title: 'Admin · MANIFIESTA' };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/entrar?next=/admin');

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'monospace', color: 'var(--text-primary)' }}>
        <h1 style={{ color: 'var(--accent)', fontSize: 18 }}>⚠ Admin no configurado</h1>
        <p style={{ marginTop: '1rem' }}>
          Añade <code>ADMIN_EMAIL=tu@email.com</code> a <code>.env.local</code> y reinicia el servidor.
        </p>
      </div>
    );
  }

  if (user.email !== adminEmail) redirect('/');

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', background: 'var(--bg)' }}>
      <AdminNav userEmail={user.email ?? ''} />
      <main style={{ flex: 1, padding: '2rem', overflow: 'auto', maxWidth: 1100 }}>
        {children}
      </main>
    </div>
  );
}
