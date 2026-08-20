import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdmin } from '@supabase/supabase-js';

// Prize catalog — probabilities must sum to 1.0
const PREMIOS = [
  {
    id: 'ritual_lunar',
    nombre: 'Ritual Lunar',
    descripcion: 'Un ritual de luna llena exclusivo: 3 pasos para amplificar tu manifestación con la energía lunar. Guarda esta pantalla o anótalo para hacerlo esta noche.',
    prob: 0.12,
  },
  {
    id: 'afirmacion_vip',
    nombre: 'Afirmación VIP',
    descripcion: 'Tu afirmación personalizada de alta frecuencia, calibrada para tu deseo actual. Repítela 21 veces esta noche antes de dormir.',
    prob: 0.18,
  },
  {
    id: 'script_magico',
    nombre: 'Script Mágico',
    descripcion: 'Un script de scripting guiado de 5 minutos para conectar con tu deseo desde el sentimiento, no desde la mente.',
    prob: 0.15,
  },
  {
    id: 'decreto_especial',
    nombre: 'Decreto Especial',
    descripcion: 'Tu decreto de alta vibración del día. Pronúncialo en voz alta con convicción 3 veces al despertar mañana.',
    prob: 0.17,
  },
  {
    id: 'meditacion',
    nombre: 'Meditación Guiada',
    descripcion: 'Accede hoy a la meditación de manifestación de 10 minutos en tu biblioteca. Ideal para el momento antes de dormir.',
    prob: 0.12,
  },
  {
    id: 'mensaje_secreto',
    nombre: 'Mensaje Secreto',
    descripcion: 'El universo tiene un mensaje para ti hoy: "Lo que pides ya está en camino. Confía en el proceso y suelta el control."',
    prob: 0.16,
  },
  {
    id: 'sorpresa',
    nombre: 'Sorpresa Estelar',
    descripcion: '¡Premio especial! Acceso desbloqueado a un ritual de manifestación exclusivo. Revísalo en tu biblioteca esta semana.',
    prob: 0.07,
  },
  {
    id: 'joya_biblioteca',
    nombre: 'Joya de Biblioteca',
    descripcion: 'Has desbloqueado una pieza rara de la biblioteca: el ritual de los 33 días. Empiézalo mañana para ver resultados en un mes.',
    prob: 0.03,
  },
] as const;

function selectPrize(): (typeof PREMIOS)[number] {
  const rand = Math.random();
  let cumulative = 0;
  for (const p of PREMIOS) {
    cumulative += p.prob;
    if (rand < cumulative) return p;
  }
  return PREMIOS[0];
}

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  // Check 24h cooldown before inserting
  const since = new Date(Date.now() - 24 * 3_600_000).toISOString();
  const { data: lastSpin } = await admin
    .from('ruleta_giros')
    .select('created_at')
    .eq('user_id', user.id)
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lastSpin) {
    const nextAt = new Date(new Date(lastSpin.created_at).getTime() + 24 * 3_600_000).toISOString();
    return NextResponse.json({ blocked: true, nextAt });
  }

  // Server-side prize selection (prevents client manipulation)
  const premio = selectPrize();

  const { error } = await admin.from('ruleta_giros').insert({
    user_id: user.id,
    premio_id: premio.id,
    premio_nombre: premio.nombre,
    premio_descripcion: premio.descripcion,
  });

  if (error) {
    console.error('[ruleta/girar]', error.message);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }

  return NextResponse.json({
    premio: { id: premio.id, nombre: premio.nombre, descripcion: premio.descripcion },
  });
}
