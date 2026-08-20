import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { enviarEmail, getUserEmail, yaEnviadoEnDias } from '@/lib/email/send';
import { emailReengagementInactiva } from '@/lib/email/templates';
import { sendPushNotification } from '@/lib/push';

// Cron: diario — re-engagement para usuarias activas sin práctica en 3+ días
// Cooldown: no se envía si ya recibió este email en los últimos 7 días
// Personalización: incluye el deseo activo si está disponible en DB

const DIAS_INACTIVA = 3;
const COOLDOWN_DIAS = 7;

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const secret = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const corte = new Date(Date.now() - DIAS_INACTIVA * 86_400_000).toISOString();

  // Usuarias con acceso activo cuya última práctica fue hace 3+ días
  // (o que nunca han hecho una práctica y se registraron hace 3+ días)
  const { data: candidatas, error } = await admin
    .from('user_settings')
    .select(`
      user_id,
      manifestacion_activa_id,
      manifestaciones!user_settings_manifestacion_activa_fk (
        deseo
      )
    `)
    .in('access_status', ['trial_active', 'paid_active']);

  if (error) {
    console.error('[reengagement] error cargando usuarias:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!candidatas || candidatas.length === 0) {
    return NextResponse.json({ procesadas: 0, enviadas: 0 });
  }

  // Para cada candidata verificamos la última práctica
  const { data: snapshots } = await admin
    .from('practice_snapshots')
    .select('user_id, completed_at')
    .in('user_id', candidatas.map((u: { user_id: string }) => u.user_id))
    .order('completed_at', { ascending: false });

  // Última práctica por usuaria
  const ultimaPractica = new Map<string, string>();
  for (const s of snapshots ?? []) {
    if (!ultimaPractica.has(s.user_id)) {
      ultimaPractica.set(s.user_id, s.completed_at);
    }
  }

  let enviadas = 0;
  let pushEnviadas = 0;

  for (const row of candidatas) {
    const userId = row.user_id as string;
    const ultima = ultimaPractica.get(userId);

    // Inactiva si: nunca practicó O su última práctica fue hace 3+ días
    const esInactiva = !ultima || ultima < corte;
    if (!esInactiva) continue;

    // Cooldown: no enviar si ya recibió este email en los últimos 7 días
    const yaRecibio = await yaEnviadoEnDias(userId, 'reengagement_inactiva', COOLDOWN_DIAS);
    if (yaRecibio) continue;

    // Deseo activo (puede ser null si no tiene manifestación vinculada)
    const manifRows = row.manifestaciones as unknown as { deseo: string }[] | null;
    const deseo = Array.isArray(manifRows) && manifRows.length > 0
      ? manifRows[0].deseo
      : undefined;

    // Enviar email personalizado
    const user = await getUserEmail(userId);
    if (user) {
      const tpl = emailReengagementInactiva(user.name, deseo);
      const ok = await enviarEmail({
        to: user.email,
        subject: tpl.subject,
        html: tpl.html,
        tipo: 'reengagement_inactiva',
        userId,
      });
      if (ok) enviadas++;
    }

    // Enviar push si tiene suscripción activa (best-effort, no bloquea)
    try {
      await sendPushNotification({
        title: deseo
          ? `Tu práctica sobre "${deseo.slice(0, 35)}" te espera ✨`
          : '✨ Tu práctica del día te está esperando',
        body: 'Unos minutos de práctica hacen la diferencia. ¿Empezamos?',
        url: '/app',
        user_ids: [userId],
      });
      pushEnviadas++;
    } catch {
      // push falla silenciosamente — no afecta el email
    }
  }

  console.log(`[reengagement] emails enviados: ${enviadas} / push: ${pushEnviadas}`);
  return NextResponse.json({ ok: true, enviadas, pushEnviadas });
}
