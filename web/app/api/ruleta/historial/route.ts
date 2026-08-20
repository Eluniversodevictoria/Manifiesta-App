import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdmin } from '@supabase/supabase-js';

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const [{ data: history }, { data: lastSpin }] = await Promise.all([
    admin
      .from('ruleta_giros')
      .select('id, premio_id, premio_nombre, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
    admin
      .from('ruleta_giros')
      .select('created_at')
      .eq('user_id', user.id)
      .gte('created_at', new Date(Date.now() - 24 * 3_600_000).toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const blocked = !!lastSpin;
  const nextAt = blocked
    ? new Date(new Date(lastSpin!.created_at).getTime() + 24 * 3_600_000).toISOString()
    : null;

  return NextResponse.json({ history: history ?? [], blocked, nextAt });
}
