import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { enviarEmail, getUserEmail } from '@/lib/email/send';
import {
  emailSuscripcionActivada,
  emailCancelacion,
  emailReembolso,
} from '@/lib/email/templates';

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

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
const EVENTOS_CANCELACION = new Set([
  'PURCHASE_CANCELLED',
  'SUBSCRIPTION_CANCELLED',
]);
const EVENTOS_REEMBOLSO = new Set([
  'PURCHASE_REFUNDED',
  'PURCHASE_CHARGEBACK',
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
      subscription_id?: string;
    };
    product?: { id?: string };
    subscription?: {
      plan?: { recurrenceType?: string };
      subscriber?: { code?: string };
    };
    commissions?: { value?: { amount?: number; currency?: { code?: string } } }[];
  };
}

export async function POST(req: NextRequest) {
  const supabaseAdmin = getSupabaseAdmin();
  const HOTTOK = process.env.HOTMART_HOTTOK ?? '';
  const PRODUCT_ID = process.env.HOTMART_PRODUCT_ID ?? '';

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
    return NextResponse.json({ ok: true, ignored: true });
  }

  // 2. Periodo
  const recurrenceType = data.subscription?.plan?.recurrenceType ?? '';
  const planPeriodo: 'mensual' | 'anual' = recurrenceType.toLowerCase().includes('annual') ? 'anual' : 'mensual';

  // 3. Idempotencia
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
  const authUser = usersData?.users?.find((u) => u.email?.toLowerCase() === email);

  // 5. Registrar orden
  const subscriptionId = data.purchase?.subscription_id ?? data.subscription?.subscriber?.code ?? null;
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

  // 6. Actualizar acceso en user_settings
  if (authUser) {
    if (esAprobado) {
      await supabaseAdmin.from('user_settings').upsert({
        user_id: authUser.id,
        access_status: 'paid_active',
        plan_periodo: planPeriodo,
        hotmart_subscription_id: subscriptionId,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
    } else {
      await supabaseAdmin.from('user_settings').upsert({
        user_id: authUser.id,
        access_status: 'subscription_inactive',
        plan_periodo: null,
        hotmart_subscription_id: null,
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
    }
  }

  // 7. Emails — best-effort, no bloquea respuesta a Hotmart
  if (authUser) {
    const user = await getUserEmail(authUser.id);
    const nombre = user?.name ?? data.buyer.name ?? 'amor';
    const emailTo = user?.email ?? email;
    const uid = authUser.id;

    if (esAprobado) {
      const esNueva = !existing && (data.purchase.recurrence_number ?? 1) === 1;
      if (esNueva) {
        const tpl = emailSuscripcionActivada(nombre, planPeriodo);
        void enviarEmail({ to: emailTo, subject: tpl.subject, html: tpl.html, tipo: 'subscription_activated', userId: uid });
      }
    } else if (EVENTOS_CANCELACION.has(event)) {
      const tpl = emailCancelacion(nombre);
      void enviarEmail({ to: emailTo, subject: tpl.subject, html: tpl.html, tipo: 'cancellation', userId: uid });
    } else if (EVENTOS_REEMBOLSO.has(event)) {
      const tpl = emailReembolso(nombre);
      void enviarEmail({ to: emailTo, subject: tpl.subject, html: tpl.html, tipo: 'refund', userId: uid });
    }
  } else {
    // Usuario no existe todavía (compró antes de registrarse) — email con nombre de Hotmart
    const nombre = data.buyer.name ?? 'amor';
    if (esAprobado) {
      const tpl = emailSuscripcionActivada(nombre, planPeriodo);
      // No tenemos userId — usamos el email como identificador provisional
      const transport = (await import('@/lib/email/gmail')).getGmailTransport();
      const { FROM } = await import('@/lib/email/gmail');
      await transport.sendMail({ from: FROM, to: email, subject: tpl.subject, html: tpl.html }).catch(() => {});
    }
  }

  return NextResponse.json({ ok: true });
}
