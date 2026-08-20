/**
 * pre-genera los audios de Biblioteca usando Cartesia.
 * Nunca regenera si el hash del texto no cambió y ya hay audio ready.
 * Uso: node scripts/pregenerar-audios.mjs [--dry-run] [--limit N]
 */

import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ── Leer .env.local manualmente ───────────────────────────────────────────────
const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dir, '..', '.env.local');

function loadEnv(path) {
  try {
    const lines = readFileSync(path, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  } catch (e) {
    console.warn('No se pudo leer .env.local:', e.message);
  }
}
loadEnv(envPath);

const SUPABASE_URL   = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE   = process.env.SUPABASE_SERVICE_ROLE_KEY;
const CARTESIA_KEY   = process.env.CARTESIA_API_KEY;
const VOICE_ID       = process.env.CARTESIA_VOICE_ID ?? '3597a26f-80ef-4bd5-8101-9699bc764917';
const AUDIO_BUCKET   = 'audio-biblioteca';

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
if (!CARTESIA_KEY) {
  console.error('Falta CARTESIA_API_KEY');
  process.exit(1);
}

const args        = process.argv.slice(2);
const isDryRun    = args.includes('--dry-run');
const limitIdx    = args.indexOf('--limit');
const MAX_ITEMS   = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : Infinity;

const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

// ── Hash idéntico al del frontend (unsigned 32-bit DJB2) ──────────────────────
function hashText(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString();
}

async function callCartesia(transcript) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);
  try {
    const res = await fetch('https://api.cartesia.ai/tts/bytes', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'X-API-Key': CARTESIA_KEY,
        'Cartesia-Version': '2024-06-10',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model_id: 'sonic-2',
        transcript,
        voice: { mode: 'id', id: VOICE_ID },
        output_format: { container: 'mp3', encoding: 'mp3', sample_rate: 44100 },
        language: 'es',
      }),
    });
    if (!res.ok) throw new Error(`Cartesia ${res.status}: ${await res.text()}`);
    return Buffer.from(await res.arrayBuffer());
  } finally {
    clearTimeout(timeout);
  }
}

async function processItem(item, idx, total) {
  const transcript = item.textContent.trim().slice(0, 1000);
  const textHash   = hashText(transcript);

  // Verificar caché
  const { data: existing } = await admin
    .from('audio_assets')
    .select('audio_status, audio_url')
    .eq('content_id', item.id)
    .eq('audio_text_hash', textHash)
    .maybeSingle();

  if (existing?.audio_status === 'ready') {
    console.log(`  [${idx}/${total}] ${item.id} — ya en caché ✓`);
    return { status: 'cached' };
  }

  if (isDryRun) {
    console.log(`  [${idx}/${total}] ${item.id} — se generaría (dry-run)`);
    return { status: 'dry-run' };
  }

  // Marcar como generating
  await admin.from('audio_assets').upsert(
    {
      content_id:      item.id,
      content_type:    'biblioteca',
      audio_text_hash: textHash,
      audio_status:    'generating',
      voice_id:        VOICE_ID,
      provider:        'cartesia',
      updated_at:      new Date().toISOString(),
    },
    { onConflict: 'content_id,audio_text_hash' },
  );

  let audioBuffer;
  try {
    console.log(`  [${idx}/${total}] ${item.id} — generando...`);
    audioBuffer = await callCartesia(transcript);
  } catch (err) {
    await admin.from('audio_assets').update({
      audio_status: 'error',
      error_message: err.message,
      updated_at: new Date().toISOString(),
    }).eq('content_id', item.id).eq('audio_text_hash', textHash);
    console.error(`  [${idx}/${total}] ${item.id} — ERROR Cartesia:`, err.message);
    return { status: 'error', error: err.message };
  }

  // Subir a Storage
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
    console.error(`  [${idx}/${total}] ${item.id} — ERROR Storage:`, uploadErr.message);
    return { status: 'error', error: uploadErr.message };
  }

  const { data: urlData } = admin.storage.from(AUDIO_BUCKET).getPublicUrl(storagePath);

  await admin.from('audio_assets').update({
    audio_status:  'ready',
    audio_url:     urlData.publicUrl,
    generated_at:  new Date().toISOString(),
    updated_at:    new Date().toISOString(),
    error_message: null,
  }).eq('content_id', item.id).eq('audio_text_hash', textHash);

  console.log(`  [${idx}/${total}] ${item.id} — listo ✓  (${(audioBuffer.length / 1024).toFixed(0)} KB)`);
  return { status: 'generated', bytes: audioBuffer.length };
}

async function main() {
  // Importar CATALOGO dinámicamente compilando desde TS —
  // como el proyecto usa TypeScript puro, transpilamos al vuelo con tsx/ts-node si está disponible,
  // o extraemos los IDs y textos desde el archivo fuente con una heurística de parse.
  let items;
  try {
    // tsx instalado? úsalo
    const { execSync } = await import('child_process');
    const catalogJSON = execSync(
      'npx tsx --eval "import { CATALOGO } from \'./lib/biblioteca-types.ts\'; process.stdout.write(JSON.stringify(CATALOGO.map(c => ({ id: c.id, textContent: c.textContent }))))"',
      { cwd: join(__dir, '..'), encoding: 'utf8', timeout: 30_000 },
    );
    items = JSON.parse(catalogJSON);
  } catch {
    // Fallback: extraer con regex simple desde el archivo .ts
    console.warn('tsx no disponible, extrayendo con regex...');
    const src = readFileSync(join(__dir, '..', 'lib', 'biblioteca-types.ts'), 'utf8');
    const idRe  = /id:\s*'([^']+)'/g;
    const txtRe = /textContent:\s*`([\s\S]*?)`/g;
    const ids = [], texts = [];
    let m;
    while ((m = idRe.exec(src)) !== null)  ids.push(m[1]);
    while ((m = txtRe.exec(src)) !== null) texts.push(m[1].trim());
    items = ids.slice(0, texts.length).map((id, i) => ({ id, textContent: texts[i] }));
  }

  const total = Math.min(items.length, MAX_ITEMS);
  console.log(`\nPre-generando audios para ${total} ítems de biblioteca${isDryRun ? ' (DRY RUN)' : ''}...\n`);

  const stats = { cached: 0, generated: 0, error: 0, dryRun: 0 };

  for (let i = 0; i < total; i++) {
    const result = await processItem(items[i], i + 1, total);
    stats[result.status === 'dry-run' ? 'dryRun' : result.status]++;
    // Pausa para no saturar la API (máx ~2 req/s)
    if (result.status === 'generated') await new Promise(r => setTimeout(r, 600));
  }

  console.log('\n── Resumen ──────────────────────────────────');
  console.log(`  En caché ya:  ${stats.cached}`);
  console.log(`  Generados:    ${stats.generated}`);
  console.log(`  Errores:      ${stats.error}`);
  if (isDryRun) console.log(`  Dry-run:      ${stats.dryRun}`);
  console.log('────────────────────────────────────────────\n');
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
