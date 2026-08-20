-- Tabla para metadatos de audio generado (editorial y personalizado)
create table if not exists public.audio_assets (
  id uuid primary key default gen_random_uuid(),
  content_id text not null,          -- id del contenido (ej: 'rit-001') o práctica personalizada
  content_type text not null default 'biblioteca', -- 'biblioteca' | 'practica'
  audio_url text,                    -- URL pública o firmada en Supabase Storage
  audio_status text not null default 'none', -- none|generating|ready|error|outdated
  audio_duration_sec integer,
  audio_text_hash bigint not null,   -- hash del texto fuente para detectar cambios
  voice_id text not null default 'en-us-female-1',
  provider text not null default 'cartesia',
  generated_at timestamptz,
  error_message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Índice para lookup rápido
create unique index if not exists audio_assets_content_hash_idx
  on public.audio_assets (content_id, audio_text_hash);

-- RLS: audio editorial es público (lectura para todos); escritura solo desde servidor
alter table public.audio_assets enable row level security;

create policy "audio_assets_read_all" on public.audio_assets
  for select using (true);

-- Sin política de escritura desde cliente — solo server-side (service_role)

-- ──────────────────────────────────────────────────────────────────────────
-- PENDIENTE MANUAL (hacer en el Dashboard de Supabase → Storage → New bucket):
--   Nombre:           audio-biblioteca
--   Público:          sí (URLs directas sin firma)
--   Límite de archivo: 50 MB
-- ──────────────────────────────────────────────────────────────────────────
