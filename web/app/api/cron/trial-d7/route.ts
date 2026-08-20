import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { enviarEmail, getUserEmail } from '@/lib/email/send';
import { emailTrialD7 } from '@/lib/email/templates';
import { sendPushNotification } from '@/lib/push';

// GET /api/cron/trial-d7 — día 7: aviso de que expira mañana
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
  const from = new Date(now.getTime() - (6 * 86_400_000 + 6 * 3_600_000));
  const to = new Date(now.getTime() - (6 * 86_400_000 - 6 * 3_600_000));

  const { data: usuarios } = await admin
    .from('user_settings')
    .select('user_id')
    .eq('access_status', 'trial_active')
    .gte('trial_started_at', from.toISOString())
    .lte('trial_started_at', to.toISOString());

  let enviados = 0;
  const userIds: string[] = [];

  for (const { user_id } of usuarios ?? []) {
    const user = await getUserEmail(user_id);
    if (!user) continue;
    const tpl = emailTrialD7(user.name);
    const ok = await enviarEmail({
      to: user.email,
      subject: tpl.subject,
      html: tpl.html,
      tipo: 'trial_d7',
      userId: user_id,
    });
    if (ok) { enviados++; userIds.push(user_id); }
  }

  // Push complementario al email
  if (userIds.length > 0) {
    await sendPushNotification({
      title: '⏳ Tu acceso completo termina mañana',
      body: 'No pierdas tu práctica diaria con Victoria.',
      url: '/onboarding/paywall',
      user_ids: userIds,
    });
  }

  return NextResponse.json({ ok: true, enviados });
}
