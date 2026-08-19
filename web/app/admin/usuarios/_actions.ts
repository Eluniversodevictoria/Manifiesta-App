'use server';

import { createClient } from '@/lib/supabase/server';
import { adminUpdateUserPlan as rpcUpdateUserPlan } from '@/lib/supabase/admin-queries';
import { headers } from 'next/headers';

function adminEmailFromEnv(): string | undefined {
  return process.env.ADMIN_EMAIL;
}

async function assertAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const adminEmail = adminEmailFromEnv();
  if (!adminEmail) throw new Error('ADMIN_EMAIL no configurado');
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== adminEmail) throw new Error('Acceso denegado');
}

export async function updateUserPlan(
  targetUserId: string,
  plan: 'free' | 'pro',
  periodo: 'mensual' | 'anual',
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    // Consume headers to make this a dynamic function
    await headers();
    const supabase = await createClient();
    await assertAdmin(supabase);

    const { error } = await rpcUpdateUserPlan(supabase, targetUserId, plan, periodo);

    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Error desconocido' };
  }
}
