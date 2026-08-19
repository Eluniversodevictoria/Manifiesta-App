import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { enviarEmail, getUserEmail } from '@/lib/email/send';
import { emailWinbackCancelada } from '@/lib/email/templates';

// GET /api/cron/winback-cancelled — D+7 después de que canceló la suscripción
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
  // cancelled_at hace 7 días (±6h)
  const from = new Date(now.getTime() - (7 * 86_400_000 + 6 * 3_600_000));
  const to = new Date(now.getTime() - (7 * 86_400_000 - 6 * 3_600_000));

  const { data: usuarios } = await admin
    .from('user_settings')
    .select('user_id')
    .eq('access_status', 'subscription_inactive')
    .gte('cancelled_at', from.toISOString())
    .lte('cancelled_at', to.toISOString());

  let enviados = 0;
  for (const { user_id } of usuarios ?? []) {
    const user = await getUserEmail(user_id);
    if (!user) continue;
    const tpl = emailWinbackCancelada(user.name);
    const ok = await enviarEmail({
      to: user.email,
      subject: tpl.subject,
      html: tpl.html,
      tipo: 'winback_cancelled',
      userId: user_id,
    });
    if (ok) enviados++;
  }

  return NextResponse.json({ ok: true, enviados });
}
