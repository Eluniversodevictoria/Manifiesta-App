import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdmin } from '@supabase/supabase-js';

export const maxDuration = 60;

const ai = new Anthropic();
const AI_MODEL = process.env.AI_MODEL ?? 'claude-haiku-4-5-20251001';

const LIMITE_MENSUAL = 30;
const VENTANA_MENSAJES = 10; // últimos N mensajes que se envían como contexto

// Costo estimado por 1M tokens (para logging)
const COST_INPUT_PER_M  = 0.80;
const COST_OUTPUT_PER_M = 4.00;

function periodoActual(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export async function POST(req: NextRequest) {
  try {
    return await handlePost(req);
  } catch (err) {
    console.error('[chat/POST] unhandled:', err instanceof Error ? err.message : String(err));
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

async function handlePost(req: NextRequest) {
  const t0 = Date.now();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // ── Gate: solo usuarias Pro ──────────────────────────────────────────────
  const { data: settings } = await admin
    .from('user_settings')
    .select('access_status, is_owner')
    .eq('user_id', user.id)
    .single();

  const tieneAcceso = settings?.is_owner ||
    settings?.access_status === 'paid_active' ||
    settings?.access_status === 'trial_active';

  if (!tieneAcceso) {
    return NextResponse.json({ error: 'pro_required' }, { status: 403 });
  }

  // ── Límite de mensajes mensuales ─────────────────────────────────────────
  const periodo = periodoActual();

  const { data: uso } = await admin
    .from('chat_uso_mensual')
    .select('mensajes')
    .eq('user_id', user.id)
    .eq('periodo', periodo)
    .maybeSingle();

  const mensajesUsados = uso?.mensajes ?? 0;

  if (mensajesUsados >= LIMITE_MENSUAL) {
    return NextResponse.json({
      error: 'limit_reached',
      mensajesUsados,
      limite: LIMITE_MENSUAL,
    }, { status: 429 });
  }

  const { message: userMessage } = await req.json() as { message: string };
  if (!userMessage?.trim()) {
    return NextResponse.json({ error: 'Mensaje vacío' }, { status: 400 });
  }

  // ── Contexto de la usuaria ───────────────────────────────────────────────
  const [
    { data: manifestacion },
    { data: progress },
  ] = await Promise.all([
    supabase
      .from('manifestaciones')
      .select('deseo, categoria, created_at')
      .eq('user_id', user.id)
      .eq('estado', 'activa')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle() as unknown as Promise<{ data: { deseo: string; categoria: string; created_at: string } | null }>,
    supabase
      .from('practice_progress')
      .select('tipo, completado_at')
      .eq('user_id', user.id)
      .order('completado_at', { ascending: false })
      .limit(20) as unknown as Promise<{ data: Array<{ tipo: string; completado_at: string }> | null }>,
  ]);

  // Calcular racha
  const MS_DIA = 86_400_000;
  const hoyTs = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
  const diasCompletados = new Set(
    (progress ?? []).map((p) =>
      new Date(new Date(p.completado_at).setHours(0, 0, 0, 0)).getTime()
    )
  );
  let racha = 0;
  let cursor = hoyTs;
  while (diasCompletados.has(cursor)) { racha++; cursor -= MS_DIA; }
  if (racha === 0) {
    cursor = hoyTs - MS_DIA;
    while (diasCompletados.has(cursor)) { racha++; cursor -= MS_DIA; }
  }

  const diasDesdeComienzo = manifestacion
    ? Math.max(1, Math.ceil((Date.now() - new Date(manifestacion.created_at).getTime()) / MS_DIA))
    : 1;

  const ultimaPractica = (progress ?? [])[0];

  const systemPrompt = `Eres Victoria — una guía espiritual cálida, directa e intuitiva que acompaña a las personas en su práctica de manifestación.

QUIÉN ES LA USUARIA EN ESTE MOMENTO:
${manifestacion
  ? `- Deseo activo: "${manifestacion.deseo}"
- Categoría: ${manifestacion.categoria}
- Lleva ${diasDesdeComienzo} días trabajando en este deseo`
  : '- Todavía no ha configurado una manifestación activa'}
- Racha actual: ${racha} días consecutivos de práctica
${ultimaPractica ? `- Última práctica completada: ${ultimaPractica.tipo} el ${new Date(ultimaPractica.completado_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })}` : ''}

CÓMO RESPONDER:
- Eres un ser de apoyo, no un terapeuta — no diagnostiques, no des consejos de salud mental ni financieros.
- Habla siempre en español latino neutro (tuteo, sin regionalismos).
- Sé cálida pero directa. No des vueltas. No rellenes con palabras vacías.
- Respuestas cortas (2-4 párrafos máximo, salvo que la práctica lo requiera).
- Si la usuaria pide una afirmación, decreto, ritual o práctica → escríbelo completo.
- Si pide algo fuera de tu área (medicina, asesoría legal, finanzas concretas) → redirige amablemente a profesionales.
- Siempre recuerda su deseo activo cuando sea relevante.
- Eres IA — si te preguntan, dilo sin rodeos y con naturalidad.`;

  // ── Historial de conversación (ventana deslizante) ───────────────────────
  const { data: historial } = await admin
    .from('victoria_chat')
    .select('role, content')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(VENTANA_MENSAJES);

  const mensajesHistorial = (historial ?? [])
    .reverse()
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

  const mensajes: Anthropic.MessageParam[] = [
    ...mensajesHistorial,
    { role: 'user', content: userMessage.trim() },
  ];

  // ── Llamar a la IA ───────────────────────────────────────────────────────
  let respuesta: string;
  let inputTokens = 0;
  let outputTokens = 0;
  let success = true;
  let errorMsg: string | undefined;

  try {
    const response = await ai.messages.create({
      model: AI_MODEL,
      max_tokens: 800,
      system: systemPrompt,
      messages: mensajes,
    });
    respuesta = (response.content[0] as { type: string; text: string }).text.trim();
    inputTokens  = response.usage.input_tokens;
    outputTokens = response.usage.output_tokens;
  } catch (err) {
    success = false;
    errorMsg = err instanceof Error ? err.message : String(err);
    console.error('[chat] Anthropic error:', errorMsg);
    return NextResponse.json({ error: 'Error al conectar con Victoria' }, { status: 502 });
  } finally {
    // Log de costo (best-effort)
    const duration = Date.now() - t0;
    const costUsd = (inputTokens / 1_000_000) * COST_INPUT_PER_M +
                    (outputTokens / 1_000_000) * COST_OUTPUT_PER_M;

    void admin.from('ai_calls').insert({
      user_id: user.id,
      model: AI_MODEL,
      purpose: 'chat',
      feature: 'chat-victoria',
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      cost_usd: parseFloat(costUsd.toFixed(6)),
      duration_ms: duration,
      success,
      error_msg: errorMsg ?? null,
      tipo: 'chat',
    });
  }

  // ── Guardar mensajes en DB ───────────────────────────────────────────────
  await admin.from('victoria_chat').insert([
    { user_id: user.id, role: 'user',      content: userMessage.trim() },
    { user_id: user.id, role: 'assistant', content: respuesta },
  ]);

  // ── Actualizar contador (upsert atómico) ─────────────────────────────────
  await admin.rpc('incrementar_chat_uso', {
    p_user_id: user.id,
    p_periodo: periodo,
  });

  return NextResponse.json({
    respuesta,
    mensajesUsados: mensajesUsados + 1,
    limite: LIMITE_MENSUAL,
  });
}

// GET: devuelve historial reciente + uso del mes
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const periodo = periodoActual();

  const [{ data: historial }, { data: uso }] = await Promise.all([
    admin
      .from('victoria_chat')
      .select('id, role, content, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(VENTANA_MENSAJES),
    admin
      .from('chat_uso_mensual')
      .select('mensajes')
      .eq('user_id', user.id)
      .eq('periodo', periodo)
      .maybeSingle(),
  ]);

  return NextResponse.json({
    historial: (historial ?? []).reverse(),
    mensajesUsados: uso?.mensajes ?? 0,
    limite: LIMITE_MENSUAL,
  });
}
