import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import {
  generarPractica,
  type ContenidoDia,
  type PracticaFamilia,
} from '@/lib/practica-engine';

const client = new Anthropic();
const AI_MODEL = process.env.AI_MODEL ?? 'claude-haiku-4-5-20251001';

const FASE_DESCRIPCION: Record<string, string> = {
  'Apertura': 'primera semana — el usuario está empezando, con curiosidad y algo de incertidumbre',
  'Profundizar': 'segunda semana — el usuario ya tiene práctica, está listo para ir más adentro',
  'Recibir': 'tercera semana — el usuario practica apertura y confianza',
  'Soltar-Actuar': 'cuarta semana — el usuario aprende a soltar el control y actuar desde claridad',
  'Integrar': 'penúltima semana — el usuario integra todo lo aprendido',
  'Cierre': 'día final — el usuario cierra el ciclo con reconocimiento',
};

export async function POST(req: NextRequest) {
  try {
    // Verificar auth
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar plan en servidor — nunca confiar en el cliente
    const { data: settingsRaw } = await supabase
      .from('user_settings')
      .select('access_status, is_owner')
      .eq('user_id', user.id)
      .maybeSingle();
    const settings = settingsRaw as { access_status?: string; is_owner?: boolean } | null;
    const tieneAcceso =
      settings?.is_owner ||
      settings?.access_status === 'paid_active' ||
      settings?.access_status === 'trial_active';
    if (!tieneAcceso) {
      return NextResponse.json({ error: 'plan_required', message: 'Se requiere plan activo para generar prácticas con IA.' }, { status: 403 });
    }

    const body = await req.json();
    const { dia, familia, deseoRaw } = body as {
      dia: number;
      familia: PracticaFamilia;
      deseoRaw: string;
    };

    if (!dia || !familia || !deseoRaw) {
      return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 });
    }

    // Generar base estática como fallback y contexto
    const base = generarPractica(dia, familia, deseoRaw);
    const faseDesc = FASE_DESCRIPCION[base.fase] ?? base.fase;

    const prompt = `Eres Victoria, guía espiritual cálida y directa. Personalizas prácticas de manifestación para una usuaria específica.

DESEO DE LA USUARIA: "${deseoRaw}"
DÍA DEL CICLO: ${dia} de 30
FASE: ${base.fase} (${faseDesc})
TEMA DEL DÍA: ${base.tema}
TIPO DE PRÁCTICA PRINCIPAL: ${base.protagonista}

Escribe en español, en segunda persona (tú/tu), tono cálido y directo — como hablaría Victoria en un audio personal.

Responde SOLO con JSON válido con esta estructura exacta:
{
  "intencion": "texto de 1-2 oraciones — la intención del día, específica para el deseo",
  "afirmacion": "afirmación de 1 oración en primera persona — que mencione o se relacione directamente con el deseo",
  "protagonistaBloque": "instrucción de 2-4 oraciones para la práctica principal (${base.protagonista}) — específica para el deseo",
  "accionConcreta": "acción específica de 1-2 oraciones — concreta y relacionada con el deseo"
}

REGLAS:
- Menciona o alude directamente al deseo en cada campo
- No uses placeholders como {deseo} — escribe el deseo real integrado naturalmente
- Mantén coherencia con la fase: ${faseDesc}
- La afirmación en primera persona ("Elijo...", "Soy...", "Tengo...", "Me permito...")
- El protagonistaBloque es una INSTRUCCIÓN de qué hacer, no un texto para leer
- Máximo 80 palabras por campo`;

    const start = Date.now();
    const message = await client.messages.create({
      model: AI_MODEL,
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }],
    });

    const durationMs = Date.now() - start;
    const inputTokens = message.usage.input_tokens;
    const outputTokens = message.usage.output_tokens;

    // Parsear respuesta
    const rawText = message.content[0].type === 'text' ? message.content[0].text : '';
    let parsed: {
      intencion: string;
      afirmacion: string;
      protagonistaBloque: string;
      accionConcreta: string;
    } | null = null;

    try {
      // Extraer JSON aunque venga con texto alrededor
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      }
    } catch {
      // fallback al contenido estático
    }

    // Loguear en Supabase (best-effort, no bloquea la respuesta)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any).from('ai_calls').insert({
      user_id: user.id,
      model: AI_MODEL,
      purpose: 'practica_diaria',
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      duration_ms: durationMs,
      success: !!parsed,
    }).then(() => {}).catch(() => {});

    if (!parsed) {
      // Fallback: devolver el contenido estático ya generado
      return NextResponse.json({ practica: base, source: 'fallback' });
    }

    // Construir ContenidoDia con los campos personalizados
    const practicaPersonalizada: ContenidoDia = {
      ...base,
      base: {
        intencion: { textContent: parsed.intencion, audioEstado: 'placeholder' },
        afirmacion: { textContent: parsed.afirmacion, audioEstado: 'placeholder' },
        protagonistaBloque: { textContent: parsed.protagonistaBloque, audioEstado: 'placeholder' },
        accionConcreta: { textContent: parsed.accionConcreta, audioEstado: 'placeholder' },
      },
    };

    return NextResponse.json({ practica: practicaPersonalizada, source: 'ai' });
  } catch (err) {
    console.error('[practica/route]', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
