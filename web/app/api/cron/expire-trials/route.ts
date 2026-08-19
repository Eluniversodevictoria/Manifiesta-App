import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { enviarEmail, getUserEmail } from '@/lib/email/send';
import { emailTrialExpirado } from '@/lib/email/templates';

// GET /api/cron/expire-trials — fallback de pg_cron; Vercel lo llama cada hora
export async function GET(req: NextRequest) {
  const secret = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Expirar trials vencidos
  const { data: expirados } = await admin
    .from('user_settings')
    .update({ access_status: 'trial_expired', updated_at: new Date().toISOString() })
    .eq('access_status', 'trial_active')
    .lt('trial_ends_at', new Date().toISOString())
    .select('user_id');

  // 2. Email de trial expirado a cada una
  let enviados = 0;
  for (const { user_id } of expirados ?? []) {
    const user = await getUserEmail(user_id);
    if (!user) continue;
    const tpl = emailTrialExpirado(user.name);
    const ok = await enviarEmail({
      to: user.email,
      subject: tpl.subject,
      html: tpl.html,
      tipo: 'trial_expired',
      userId: user_id,
    });
    if (ok) enviados++;
  }

  return NextResponse.json({ ok: true, expirados: expirados?.length ?? 0, enviados });
}
