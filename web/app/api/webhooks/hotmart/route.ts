import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Eventos Hotmart que activan o revocan acceso
const EVENTOS_APROBADO = new Set([
  'PURCHASE_APPROVED',
  'PURCHASE_REACTIVATED',
  'SUBSCRIPTION_REACTIVATED',
]);
const EVENTOS_REVOCADO = new Set([
  'PURCHASE_REFUNDED',
  'PURCHASE_CANCELLED',
  'PURCHASE_CHARGEBACK',
  'SUBSCRIPTION_CANCELLED',
]);

interface HotmartPayload {
  hottok?: string;
  event: string;
  data: {
    buyer: { email: string; name?: string };
    purchase: {
      transaction: string;
      offer?: { code?: string };
      recurrence_number?: number;
    };
    product?: { id?: string };
    subscription?: { plan?: { recurrenceType?: string } };
    commissions?: { value?: { amount?: number; currency?: { code?: string } } }[];
  };
}

export async function POST(req: NextRequest) {
  const supabaseAdmin = getSupabaseAdmin();
  const resend = new Resend(process.env.RESEND_API_KEY);
  const HOTTOK = process.env.HOTMART_HOTTOK ?? '';
  const PRODUCT_ID = process.env.HOTMART_PRODUCT_ID ?? '';
  const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'MANIFIESTA <manifiesta.app@mail.com>';
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://manifiesta.app';

  let body: HotmartPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
  }

  // 1. Verificar hottok
  const token = req.headers.get('x-hotmart-hottok') ?? body.hottok ?? '';
  if (!HOTTOK || token !== HOTTOK) {
    return NextResponse.json({ error: 'Firma inválida' }, { status: 401 });
  }

  const { event, data } = body;
  const email = data?.buyer?.email?.toLowerCase().trim();
  const transactionId = data?.purchase?.transaction;

  if (!email || !transactionId) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
  }

  const esAprobado = EVENTOS_APROBADO.has(event);
  const esRevocado = EVENTOS_REVOCADO.has(event);
  if (!esAprobado && !esRevocado) {
    // Evento no relevante — aceptamos y salimos
    return NextResponse.json({ ok: true, ignored: true });
  }

  // 2. Determinar periodo
  const recurrenceType = data.subscription?.plan?.recurrenceType ?? '';
  const planPeriodo = recurrenceType.toLowerCase().includes('annual') ? 'anual' : 'mensual';

  // 3. Idempotencia — si ya procesamos este transactionId, salimos
  const { data: existing } = await supabaseAdmin
    .from('hotmart_orders')
    .select('id, status')
    .eq('hotmart_order_id', transactionId)
    .maybeSingle();

  if (existing && existing.status === (esAprobado ? 'approved' : 'refunded')) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  // 4. Buscar usuario por email
  const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
  const authUser = usersData?.users?.find(u => u.email?.toLowerCase() === email);

  // 5. Registrar orden
  await supabaseAdmin.from('hotmart_orders').upsert({
    hotmart_order_id: transactionId,
    buyer_email: email,
    buyer_name: data.buyer.name ?? null,
    user_id: authUser?.id ?? null,
    product_id: PRODUCT_ID || String(data.product?.id ?? ''),
    offer_code: data.purchase.offer?.code ?? null,
    plan_periodo: planPeriodo,
    amount_usd: data.commissions?.[0]?.value?.amount ?? 0,
    currency: data.commissions?.[0]?.value?.currency?.code ?? 'USD',
    status: esAprobado ? 'approved' : 'refunded',
    event_type: event,
    hotmart_payload: data,
  }, { onConflict: 'hotmart_order_id' });

  // 6. Actualizar plan del usuario (si existe la cuenta)
  if (authUser) {
    await supabaseAdmin.from('user_settings').upsert({
      user_id: authUser.id,
      plan: esAprobado ? 'pro' : 'free',
      plan_periodo: esAprobado ? planPeriodo : null,
      plan_activado_at: esAprobado ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
  }

  // 7. Email de bienvenida (solo en primera compra aprobada)
  const esNueva = !existing && esAprobado && (data.purchase.recurrence_number ?? 1) === 1;
  if (esNueva && process.env.RESEND_API_KEY) {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: '✨ ¡Tu acceso a MANIFIESTA está activo!',
      html: emailBienvenida(data.buyer.name ?? 'amor', APP_URL),
    }).catch(() => {}); // best-effort
  }

  return NextResponse.json({ ok: true });
}

function emailBienvenida(nombre: string, appUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="es">
<body style="font-family:Georgia,serif;background:#FEF7F8;margin:0;padding:40px 20px;color:#22141A;">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;padding:40px;border:1px solid #F2C4C4;">
    <h1 style="font-size:26px;color:#C4748A;margin:0 0 16px;">✨ ¡Ya eres parte de MANIFIESTA!</h1>
    <p style="font-size:16px;line-height:1.6;margin:0 0 24px;">
      Hola ${nombre},<br><br>
      Tu acceso está activo. Victoria te espera dentro con tu primera práctica del día. ✨
    </p>
    <a href="${appUrl}/entrar"
       style="display:inline-block;background:#C4748A;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-size:16px;font-weight:600;">
      Entrar a MANIFIESTA
    </a>
    <p style="font-size:13px;color:#A87888;margin:32px 0 0;line-height:1.5;">
      Si tienes dudas, escríbenos a
      <a href="mailto:manifiesta.app@mail.com" style="color:#C4748A;">manifiesta.app@mail.com</a>
      — respondemos en menos de 24 horas.
    </p>
    <p style="font-size:12px;color:#A87888;margin:16px 0 0;">
      Puedes gestionar tu suscripción en tu portal de Hotmart en cualquier momento.
    </p>
  </div>
</body>
</html>`;
}
