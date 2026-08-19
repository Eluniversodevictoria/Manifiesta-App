import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient as createAdmin } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { enviarEmail, getUserEmail } from '@/lib/email/send';
import { emailTrialD1 } from '@/lib/email/templates';

// POST /api/trial/start
// Arranca el trial de 7 días. Idempotente: si ya existe trial_started_at, no modifica nada.
// Dispara email T1 (D1) al arrancar.
export async function POST() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autenticada' }, { status: 401 });
  }

  const userId = session.user.id;
  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Verificar si ya existe — no reiniciar trial
  const { data: existing } = await admin
    .from('user_settings')
    .select('trial_started_at, access_status')
    .eq('user_id', userId)
    .maybeSingle();

  if (existing?.trial_started_at) {
    return NextResponse.json({ ok: true, alreadyStarted: true });
  }

  const now = new Date();
  const trialEndsAt = new Date(now.getTime() + 7 * 86_400_000);

  await admin.from('user_settings').upsert({
    user_id: userId,
    access_status: 'trial_active',
    trial_started_at: now.toISOString(),
    trial_ends_at: trialEndsAt.toISOString(),
    plan_periodo: null,
    hotmart_subscription_id: null,
    preferencia_media: 'leer',
    is_owner: false,
    updated_at: now.toISOString(),
  }, { onConflict: 'user_id', ignoreDuplicates: false });

  // Email D1 — best-effort, no bloquea la respuesta
  const user = await getUserEmail(userId);
  if (user) {
    const tpl = emailTrialD1(user.name);
    void enviarEmail({
      to: user.email,
      subject: tpl.subject,
      html: tpl.html,
      tipo: 'trial_d1',
      userId,
    });
  }

  return NextResponse.json({ ok: true, trialEndsAt: trialEndsAt.toISOString() });
}
