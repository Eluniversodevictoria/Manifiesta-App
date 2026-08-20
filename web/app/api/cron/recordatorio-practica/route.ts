import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendPushNotification } from '@/lib/push';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Cron: 8am diario — notifica con el deseo real de cada usuaria
export async function GET(req: NextRequest) {
  const secret = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  // Usuarias activas con su manifestación activa y el deseo
  const { data: usuarias, error } = await supabaseAdmin
    .from('user_settings')
    .select('user_id, manifestacion_activa_id')
    .in('access_status', ['trial_active', 'paid_active']);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!usuarias || usuarias.length === 0) return NextResponse.json({ sent: 0 });

  // Agrupar: las que tienen manifestación activa y las que no
  const conManifestacion = usuarias.filter((u) => u.manifestacion_activa_id);
  const sinManifestacion = usuarias.filter((u) => !u.manifestacion_activa_id);

  let enviadas = 0;

  // Notificación genérica para las que no tienen manifestación activa
  if (sinManifestacion.length > 0) {
    await sendPushNotification({
      title: '✨ Tu práctica de hoy te espera',
      body: 'Victoria tiene algo especial preparado para ti hoy.',
      url: '/app',
      user_ids: sinManifestacion.map((u) => u.user_id),
    });
    enviadas += sinManifestacion.length;
  }

  // Notificación personalizada — de a una por manifestación distinta
  if (conManifestacion.length > 0) {
    const manifestacionIds = [...new Set(conManifestacion.map((u) => u.manifestacion_activa_id as string))];

    const { data: manifestaciones } = await supabaseAdmin
      .from('manifestaciones')
      .select('id, deseo')
      .in('id', manifestacionIds);

    const deseoMap = new Map((manifestaciones ?? []).map((m) => [m.id, m.deseo as string]));

    // Agrupar usuarias por su deseo para enviar en lote cuando coinciden
    const grupos = new Map<string, string[]>();
    for (const u of conManifestacion) {
      const deseo = deseoMap.get(u.manifestacion_activa_id!) ?? '';
      const key = deseo.slice(0, 60); // truncar para agrupar similares
      if (!grupos.has(key)) grupos.set(key, []);
      grupos.get(key)!.push(u.user_id);
    }

    for (const [deseo, userIds] of grupos.entries()) {
      const deseoCorto = deseo.length > 40 ? deseo.slice(0, 37) + '…' : deseo;
      await sendPushNotification({
        title: '✨ Victoria tiene lista tu práctica de hoy',
        body: deseoCorto
          ? `Para manifestar: "${deseoCorto}"`
          : 'Tu práctica personalizada te espera.',
        url: '/app',
        user_ids: userIds,
      });
      enviadas += userIds.length;
    }
  }

  return NextResponse.json({ sent: enviadas });
}
