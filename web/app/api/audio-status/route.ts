import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Lectura pública — usa anon key (RLS permite select para todos)
function createAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const content_id = searchParams.get('content_id');
  const text_hash = searchParams.get('text_hash');

  if (!content_id || !text_hash) {
    return NextResponse.json(
      { error: 'Faltan parámetros: content_id y text_hash son requeridos' },
      { status: 400 },
    );
  }

  const hashNum = Number(text_hash);
  if (!Number.isFinite(hashNum)) {
    return NextResponse.json({ error: 'text_hash inválido' }, { status: 400 });
  }

  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from('audio_assets')
      .select('audio_status, audio_url, audio_duration_sec')
      .eq('content_id', content_id)
      .eq('audio_text_hash', hashNum)
      .single();

    if (error || !data) {
      return NextResponse.json({ status: 'none' });
    }

    return NextResponse.json({
      status: data.audio_status,
      audioUrl: data.audio_url ?? undefined,
      audioDurationSec: data.audio_duration_sec ?? undefined,
    });
  } catch (err) {
    console.error('[audio-status]', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
