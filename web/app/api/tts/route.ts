import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const CARTESIA_API_KEY = process.env.CARTESIA_API_KEY;
const CARTESIA_VOICE_ID = process.env.CARTESIA_VOICE_ID ?? '3597a26f-80ef-4bd5-8101-9699bc764917';
const CARTESIA_VERSION = '2024-06-10';
const CARTESIA_MODEL = 'sonic-2';

export async function POST(req: NextRequest) {
  try {
    if (!CARTESIA_API_KEY) {
      return NextResponse.json({ error: 'TTS no configurado' }, { status: 500 });
    }

    // Verificar auth
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { text } = await req.json() as { text: string };
    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Texto vacío' }, { status: 400 });
    }

    // Limitar longitud para controlar costos
    const transcript = text.trim().slice(0, 1000);

    const cartesiaRes = await fetch('https://api.cartesia.ai/tts/bytes', {
      method: 'POST',
      headers: {
        'X-API-Key': CARTESIA_API_KEY,
        'Cartesia-Version': CARTESIA_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model_id: CARTESIA_MODEL,
        transcript,
        voice: {
          mode: 'id',
          id: CARTESIA_VOICE_ID,
        },
        output_format: {
          container: 'mp3',
          encoding: 'mp3',
          sample_rate: 44100,
        },
        language: 'es',
      }),
    });

    if (!cartesiaRes.ok) {
      const errText = await cartesiaRes.text();
      console.error('[tts] Cartesia error:', cartesiaRes.status, errText);
      return NextResponse.json({ error: 'Error al generar audio' }, { status: 502 });
    }

    const audioBuffer = await cartesiaRes.arrayBuffer();

    // Loguear (best-effort)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any).from('ai_calls').insert({
      user_id: user.id,
      model: `cartesia/${CARTESIA_MODEL}`,
      purpose: 'tts',
      input_tokens: Math.ceil(transcript.length / 4),
      output_tokens: 0,
      duration_ms: 0,
      success: true,
    }).then(() => {}).catch(() => {});

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'private, max-age=86400',
      },
    });
  } catch (err) {
    console.error('[tts/route]', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
