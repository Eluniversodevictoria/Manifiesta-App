import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import {
  procesarSolicitudEditorial,
  decidirModo,
  buildPromptManifestacion,
  mensajeVictoriaEditorial,
  type NivelPlan,
  type ContenidoIA,
} from '@/lib/biblioteca-ai';

const client = new Anthropic();
const AI_MODEL = process.env.AI_MODEL ?? 'claude-haiku-4-5-20251001';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json() as {
      tema: string;
      recientesIds?: string[];
    };

    const { tema, recientesIds = [] } = body;

    // Leer plan SIEMPRE del servidor — nunca confiar en el cliente
    const { data: settingsRow } = await supabase
      .from('user_settings')
      .select('plan')
      .eq('user_id', user.id)
      .single();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const plan: NivelPlan = ((settingsRow as any)?.plan as NivelPlan) ?? 'free';

    // Contar generaciones IA de hoy desde la DB (no confiar en el cliente)
    const hoyInicio = new Date();
    hoyInicio.setHours(0, 0, 0, 0);
    const { count: generacionesHoy } = await supabase
      .from('ai_calls')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('purpose', 'manifestar')
      .gte('created_at', hoyInicio.toISOString());

    if (!tema || tema.trim().length < 3) {
      return NextResponse.json({ error: 'Tema muy corto' }, { status: 400 });
    }

    // 1. Siempre buscar sugerencias editoriales
    const { sugerencias, area } = procesarSolicitudEditorial(
      { tema: tema.trim() },
      recientesIds
    );

    // 2. Decidir si generar con IA
    const modo = decidirModo(sugerencias, plan, generacionesHoy ?? 0);

    if (modo === 'editorial') {
      return NextResponse.json({
        modo: 'editorial',
        sugerenciasEditoriales: sugerencias,
        mensajeVictoria: mensajeVictoriaEditorial(tema, sugerencias.length),
        area,
      });
    }

    // 3. Modo IA — llamar a Claude
    const prompt = buildPromptManifestacion(tema.trim(), area);
    const start = Date.now();

    const message = await client.messages.create({
      model: AI_MODEL,
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    });

    const durationMs = Date.now() - start;
    const rawText = message.content[0].type === 'text' ? message.content[0].text : '';

    let parsed: (ContenidoIA & { mensajeVictoria: string }) | null = null;
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
    } catch {
      // fallback a editorial
    }

    // Loguear (best-effort)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any).from('ai_calls').insert({
      user_id: user.id,
      model: AI_MODEL,
      purpose: 'manifestar',
      input_tokens: message.usage.input_tokens,
      output_tokens: message.usage.output_tokens,
      duration_ms: durationMs,
      success: !!parsed,
    }).then(() => {}).catch(() => {});

    if (!parsed) {
      // Fallback elegante: devolver editorial con mensaje de Victoria
      return NextResponse.json({
        modo: 'editorial',
        sugerenciasEditoriales: sugerencias,
        mensajeVictoria: mensajeVictoriaEditorial(tema, sugerencias.length),
        area,
      });
    }

    return NextResponse.json({
      modo: 'ia',
      sugerenciasEditoriales: sugerencias,
      contenidoIA: {
        afirmacion: parsed.afirmacion,
        decreto: parsed.decreto,
        accionConcreta: parsed.accionConcreta,
        preguntaReflexion: parsed.preguntaReflexion,
      },
      mensajeVictoria: parsed.mensajeVictoria,
      area,
    });
  } catch (err) {
    console.error('[manifestar/route]', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
