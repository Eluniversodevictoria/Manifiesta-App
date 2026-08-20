// GET /api/cron/pregenerar-audios — pre-genera audios editoriales de Biblioteca
// Protegido con CRON_SECRET. Llámalo manualmente o añade a vercel.json.
// Es idempotente: si el hash no cambió y está ready, se salta.

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { CATALOGO } from '@/lib/biblioteca-types';

const CARTESIA_API_KEY  = process.env.CARTESIA_API_KEY;
const CARTESIA_VOICE_ID = process.env.CARTESIA_VOICE_ID ?? '3597a26f-80ef-4bd5-8101-9699bc764917';
const AUDIO_BUCKET      = 'audio-biblioteca';
const MAX_PER_RUN       = 20; // límite por ejecución para no exceder timeouts de Vercel

function hashText(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return h >>> 0;
}

async function callCartesia(transcript: string): Promise<ArrayBuffer> {
  const ctrl = new AbortController();
  const tid  = setTimeout(() => ctrl.abort(), 45_000);
  try {
    const res = await fetch('https://api.cartesia.ai/tts/bytes', {
      method: 'POST',
      signal: ctrl.signal,
      headers: {
        'X-API-Key': CARTESIA_API_KEY!,
        'Cartesia-Version': '2024-06-10',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model_id: 'sonic-2',
        transcript,
        voice: { mode: 'id', id: CARTESIA_VOICE_ID },
        output_format: { container: 'mp3', encoding: 'mp3', sample_rate: 44100 },
        language: 'es',
      }),
    });
    if (!res.ok) throw new Error(`Cartesia ${res.status}: ${await res.text()}`);
    return res.arrayBuffer();
  } finally {
    clearTimeout(tid);
  }
}

export async function GET(req: NextRequest) {
  const secret = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  if (!CARTESIA_API_KEY) {
    return NextResponse.json({ error: 'CARTESIA_API_KEY no configurada' }, { status: 500 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const stats = { cached: 0, generated: 0, error: 0 };
  const errors: string[] = [];

  const items = CATALOGO.slice(0, MAX_PER_RUN);

  for (const item of items) {
    const transcript = item.textContent.trim().slice(0, 1000);
    const textHash   = hashText(transcript);

    const { data: existing } = await admin
      .from('audio_assets')
      .select('audio_status')
      .eq('content_id', item.id)
      .eq('audio_text_hash', textHash)
      .maybeSingle();

    if (existing?.audio_status === 'ready') {
      stats.cached++;
      continue;
    }

    await admin.from('audio_assets').upsert(
      {
        content_id:      item.id,
        content_type:    'biblioteca',
        audio_text_hash: textHash,
        audio_status:    'generating',
        voice_id:        CARTESIA_VOICE_ID,
        provider:        'cartesia',
        updated_at:      new Date().toISOString(),
      },
      { onConflict: 'content_id,audio_text_hash' },
    );

    let audioBuffer: ArrayBuffer;
    try {
      audioBuffer = await callCartesia(transcript);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      await admin.from('audio_assets').update({
        audio_status: 'error',
        error_message: msg,
        updated_at: new Date().toISOString(),
      }).eq('content_id', item.id).eq('audio_text_hash', textHash);
      stats.error++;
      errors.push(`${item.id}: ${msg}`);
      continue;
    }

    const storagePath = `${item.id}/${textHash}.mp3`;
    const { error: uploadErr } = await admin.storage
      .from(AUDIO_BUCKET)
      .upload(storagePath, audioBuffer, { contentType: 'audio/mpeg', upsert: true });

    if (uploadErr) {
      await admin.from('audio_assets').update({
        audio_status: 'error',
        error_message: uploadErr.message,
        updated_at: new Date().toISOString(),
      }).eq('content_id', item.id).eq('audio_text_hash', textHash);
      stats.error++;
      errors.push(`${item.id}: storage ${uploadErr.message}`);
      continue;
    }

    const { data: urlData } = admin.storage.from(AUDIO_BUCKET).getPublicUrl(storagePath);

    await admin.from('audio_assets').update({
      audio_status:  'ready',
      audio_url:     urlData.publicUrl,
      generated_at:  new Date().toISOString(),
      updated_at:    new Date().toISOString(),
      error_message: null,
    }).eq('content_id', item.id).eq('audio_text_hash', textHash);

    stats.generated++;
    await new Promise(r => setTimeout(r, 600)); // evitar rate-limit
  }

  const remaining = CATALOGO.length - MAX_PER_RUN;
  return NextResponse.json({
    ok: true,
    stats,
    errors,
    total: CATALOGO.length,
    processed: items.length,
    remaining: remaining > 0 ? remaining : 0,
    note: remaining > 0 ? `Faltan ${remaining} ítems. Vuelve a llamar para continuar.` : 'Catálogo completo.',
  });
}
