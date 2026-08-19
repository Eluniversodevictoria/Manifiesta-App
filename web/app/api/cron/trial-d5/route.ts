import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { enviarEmail, getUserEmail } from '@/lib/email/send';
import { emailTrialD5 } from '@/lib/email/templates';

// GET /api/cron/trial-d5
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
  const from = new Date(now.getTime() - (5 * 86_400_000 + 6 * 3_600_000));
  const to = new Date(now.getTime() - (5 * 86_400_000 - 6 * 3_600_000));

  const { data: usuarios } = await admin
    .from('user_settings')
    .select('user_id')
    .eq('access_status', 'trial_active')
    .gte('trial_started_at', from.toISOString())
    .lte('trial_started_at', to.toISOString());

  let enviados = 0;
  for (const { user_id } of usuarios ?? []) {
    const user = await getUserEmail(user_id);
    if (!user) continue;
    const tpl = emailTrialD5(user.name);
    const ok = await enviarEmail({
      to: user.email,
      subject: tpl.subject,
      html: tpl.html,
      tipo: 'trial_d5',
      userId: user_id,
    });
    if (ok) enviados++;
  }

  return NextResponse.json({ ok: true, enviados });
}
