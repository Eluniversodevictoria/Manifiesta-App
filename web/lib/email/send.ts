// send.ts — función central de envío de emails
// Server-side only. Incluye: logging, idempotencia, error handling, retry.

import { createClient } from '@supabase/supabase-js';
import { getGmailTransport, FROM } from './gmail';

export type EmailTipo =
  | 'trial_d1'
  | 'trial_d3'
  | 'trial_d5'
  | 'trial_d7'
  | 'subscription_activated'
  | 'cancellation'
  | 'refund'
  | 'trial_expired'
  | 'winback_trial'
  | 'winback_cancelled'
  | 'reengagement_inactiva'
  | 'dunning'
  | 'recovery_access';

interface SendOptions {
  to: string;
  subject: string;
  html: string;
  tipo: EmailTipo;
  userId: string;
}

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Verifica si ya se envió este tipo de email para este usuario (idempotencia — one-shot)
async function yaEnviado(userId: string, tipo: EmailTipo): Promise<boolean> {
  const admin = getAdmin();
  const { data } = await admin
    .from('email_log')
    .select('id')
    .eq('user_id', userId)
    .eq('email_tipo', tipo)
    .eq('status', 'sent')
    .maybeSingle();
  return !!data;
}

// Verifica si ya se envió este tipo de email en los últimos N días (cooldown periódico)
export async function yaEnviadoEnDias(userId: string, tipo: EmailTipo, dias: number): Promise<boolean> {
  const admin = getAdmin();
  const desde = new Date(Date.now() - dias * 86_400_000).toISOString();
  const { data } = await admin
    .from('email_log')
    .select('id')
    .eq('user_id', userId)
    .eq('email_tipo', tipo)
    .eq('status', 'sent')
    .gte('created_at', desde)
    .maybeSingle();
  return !!data;
}

async function registrar(
  userId: string,
  emailAddress: string,
  tipo: EmailTipo,
  status: 'sent' | 'failed',
  error?: string
) {
  const admin = getAdmin();
  await admin.from('email_log').insert({
    user_id: userId,
    email_address: emailAddress,
    email_tipo: tipo,
    status,
    error_msg: error ?? null,
  });
}

// Envío con retry (2 intentos) + log automático
export async function enviarEmail(opts: SendOptions): Promise<boolean> {
  const { to, subject, html, tipo, userId } = opts;

  // Idempotencia: si ya se envió, salir sin error
  if (await yaEnviado(userId, tipo)) {
    console.log(`[email] ${tipo} ya enviado a ${to} — skip`);
    return true;
  }

  // Intentar hasta 2 veces
  for (let intento = 1; intento <= 2; intento++) {
    try {
      const transport = getGmailTransport();
      await transport.sendMail({ from: FROM, to, subject, html });
      await registrar(userId, to, tipo, 'sent');
      console.log(`[email] ✓ ${tipo} → ${to}`);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[email] ✗ ${tipo} intento ${intento}: ${msg}`);
      if (intento === 2) {
        await registrar(userId, to, tipo, 'failed', msg);
      }
    }
  }
  return false;
}

// Helper: obtener email del usuario desde auth.users
export async function getUserEmail(userId: string): Promise<{ email: string; name: string } | null> {
  const admin = getAdmin();
  const { data } = await admin.auth.admin.getUserById(userId);
  if (!data?.user?.email) return null;
  const name = data.user.user_metadata?.full_name
    ?? data.user.user_metadata?.name
    ?? data.user.email.split('@')[0];
  return { email: data.user.email, name };
}
