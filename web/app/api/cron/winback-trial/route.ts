import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { enviarEmail, getUserEmail } from '@/lib/email/send';
import { emailWinbackTrial } from '@/lib/email/templates';

// GET /api/cron/winback-trial — D+3 después de que expiró el trial (sin convertir)
export async function GET(req: NextRequest) {
  const secret = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const now = new Date();
  // trial_ends_at hace 3 días (±6h)
  const from = new Date(now.getTime() - (3 * 86_400_000 + 6 * 3_600_000));
  const to = new Date(now.getTime() - (3 * 86_400_000 - 6 * 3_600_000));

  const { data: usuarios } = await admin
    .from('user_settings')
    .select('user_id')
    .eq('access_status', 'trial_expired')
    .gte('trial_ends_at', from.toISOString())
    .lte('trial_ends_at', to.toISOString());

  let enviados = 0;
  for (const { user_id } of usuarios ?? []) {
    const user = await getUserEmail(user_id);
    if (!user) continue;
    const tpl = emailWinbackTrial(user.name);
    const ok = await enviarEmail({
      to: user.email,
      subject: tpl.subject,
      html: tpl.html,
      tipo: 'winback_trial',
      userId: user_id,
    });
    if (ok) enviados++;
  }

  return NextResponse.json({ ok: true, enviados });
}
