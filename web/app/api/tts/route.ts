import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export const maxDuration = 60;

const CARTESIA_API_KEY = process.env.CARTESIA_API_KEY;
const CARTESIA_VOICE_ID = process.env.CARTESIA_VOICE_ID ?? '3597a26f-80ef-4bd5-8101-9699bc764917';
const CARTESIA_VERSION = '2024-06-10';
const CARTESIA_MODEL = 'sonic-2';
const AUDIO_BUCKET = 'audio-biblioteca';

// Hash idéntico al de la página de detalle (unsigned 32-bit)
function hashText(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return h >>> 0;
}

// Cliente con service_role para escritura y Storage (solo server-side)
function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(req: NextRequest) {
  try {
    if (!CARTESIA_API_KEY) {
      return NextResponse.json({ error: 'TTS no configurado' }, { status: 500 });
    }

    // Verificar auth con el cliente SSR (cookies de sesión)
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json() as { text: string; content_id?: string; voice_id?: string };
    const { text, content_id, voice_id } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Texto vacío' }, { status: 400 });
    }

    const transcript = text.trim().slice(0, 1000);
    const textHash = hashText(transcript);
    const voiceId = voice_id ?? CARTESIA_VOICE_ID;
    const admin = createAdminClient();

    // ── Persistencia: solo si se envía content_id ──────────────────────────
    if (content_id) {
      // 1. Buscar en DB
      const { data: existing } = await admin
        .from('audio_assets')
        .select('audio_url, audio_status')
        .eq('content_id', content_id)
        .eq('audio_text_hash', textHash)
        .single();

      if (existing?.audio_status === 'ready' && existing.audio_url) {
        return NextResponse.json({ audioUrl: existing.audio_url, cached: true });
      }

      if (existing?.audio_status === 'generating') {
        return NextResponse.json({ status: 'generating' });
      }

      // 2. Marcar como "generating" (lock optimista)
      await admin.from('audio_assets').upsert(
        {
          content_id,
          content_type: 'biblioteca',
          audio_text_hash: textHash,
          audio_status: 'generating',
          voice_id: voiceId,
          provider: 'cartesia',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'content_id,audio_text_hash' },
      );

      // 3. Llamar a Cartesia
      let audioBuffer: ArrayBuffer;
      try {
        audioBuffer = await callCartesia(transcript, voiceId);
      } catch (cartesiaErr) {
        const msg = cartesiaErr instanceof Error ? cartesiaErr.message : String(cartesiaErr);
        await admin.from('audio_assets').update({
          audio_status: 'error',
          error_message: msg,
          updated_at: new Date().toISOString(),
        }).eq('content_id', content_id).eq('audio_text_hash', textHash);
        console.error('[tts] Cartesia error:', msg);
        return NextResponse.json({ error: 'Error al generar audio' }, { status: 502 });
      }

      // 4. Subir a Storage
      const storagePath = `${content_id}/${textHash}.mp3`;
      const { error: uploadError } = await admin.storage
        .from(AUDIO_BUCKET)
        .upload(storagePath, audioBuffer, {
          contentType: 'audio/mpeg',
          upsert: true,
        });

      if (uploadError) {
        await admin.from('audio_assets').update({
          audio_status: 'error',
          error_message: uploadError.message,
          updated_at: new Date().toISOString(),
        }).eq('content_id', content_id).eq('audio_text_hash', textHash);
        console.error('[tts] Storage upload error:', uploadError.message);
        return NextResponse.json({ error: 'Error al guardar audio' }, { status: 500 });
      }

      // 5. Obtener URL pública
      const { data: publicUrlData } = admin.storage
        .from(AUDIO_BUCKET)
        .getPublicUrl(storagePath);

      const audioUrl = publicUrlData.publicUrl;

      // 6. Actualizar DB: ready
      await admin.from('audio_assets').update({
        audio_status: 'ready',
        audio_url: audioUrl,
        generated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        error_message: null,
      }).eq('content_id', content_id).eq('audio_text_hash', textHash);

      // Log (best-effort)
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

      return NextResponse.json({ audioUrl, cached: false });
    }

    // ── Sin content_id: flujo clásico (devuelve buffer directo) ───────────
    let audioBuffer: ArrayBuffer;
    try {
      audioBuffer = await callCartesia(transcript, voiceId);
    } catch (err) {
      console.error('[tts] Cartesia error:', err);
      return NextResponse.json({ error: 'Error al generar audio' }, { status: 502 });
    }

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

async function callCartesia(transcript: string, voiceId: string): Promise<ArrayBuffer> {
  // Timeout de 30 segundos para evitar requests colgados
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30_000);

  let cartesiaRes: Response;
  try {
    cartesiaRes = await fetch('https://api.cartesia.ai/tts/bytes', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'X-API-Key': CARTESIA_API_KEY!,
        'Cartesia-Version': CARTESIA_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model_id: CARTESIA_MODEL,
        transcript,
        voice: { mode: 'id', id: voiceId },
        output_format: { container: 'mp3', encoding: 'mp3', sample_rate: 44100 },
        language: 'es',
      }),
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!cartesiaRes.ok) {
    const errText = await cartesiaRes.text();
    throw new Error(`Cartesia ${cartesiaRes.status}: ${errText}`);
  }

  return cartesiaRes.arrayBuffer();
}
