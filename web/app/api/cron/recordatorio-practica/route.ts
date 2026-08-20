import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendPushNotification } from '@/lib/push';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Cron: 8am diario — notifica a usuarias con acceso activo que no hayan completado práctica hoy
// La app guarda práctica en localStorage, no en DB — enviamos la notificación a todas las activas
// y dejamos que quien ya la hizo la ignore
export async function GET(req: NextRequest) {
  const secret = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  // Usuarias con acceso activo (trial o paid)
  const { data: usuarias, error } = await supabaseAdmin
    .from('user_settings')
    .select('user_id')
    .in('access_status', ['trial_active', 'paid_active']);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!usuarias || usuarias.length === 0) return NextResponse.json({ sent: 0 });

  const userIds = usuarias.map((u: { user_id: string }) => u.user_id);

  await sendPushNotification({
    title: '✨ Tu práctica de hoy te espera',
    body: 'Victoria tiene algo especial preparado para ti hoy.',
    url: '/app',
    user_ids: userIds,
  });

  return NextResponse.json({ sent: userIds.length });
}
