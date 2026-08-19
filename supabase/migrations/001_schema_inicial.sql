-- ============================================================
-- MANIFIESTA con Victoria — Esquema inicial
-- Ejecutar en Supabase SQL Editor (una sola vez)
-- ============================================================

-- Extensión UUID
create extension if not exists "pgcrypto";

-- ── ENUMS ──────────────────────────────────────────────────

create type plan_tipo as enum ('free', 'pro');
create type plan_periodo as enum ('mensual', 'anual');
create type manifestacion_estado as enum ('activa', 'manifestada', 'pausada', 'archivada');
create type preferencia_media as enum ('leer', 'escuchar', 'ambas');
create type script_modo as enum ('libre', 'guiado', 'urgente');

-- ── USER SETTINGS ──────────────────────────────────────────

create table public.user_settings (
  user_id               uuid primary key references auth.users(id) on delete cascade,
  plan                  plan_tipo not null default 'free',
  plan_periodo          plan_periodo,
  plan_activado_at      timestamptz,
  manifestacion_activa_id uuid,            -- FK se añade tras crear la tabla manifestaciones
  preferencia_media     preferencia_media not null default 'leer',
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

alter table public.user_settings enable row level security;

create policy "user_settings: leer propio"
  on public.user_settings for select
  using ((select auth.uid()) = user_id);

create policy "user_settings: insertar propio"
  on public.user_settings for insert
  with check ((select auth.uid()) = user_id);

create policy "user_settings: actualizar propio"
  on public.user_settings for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ── MANIFESTACIONES ────────────────────────────────────────

create table public.manifestaciones (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  deseo           text not null,
  categoria       text not null,
  estado          manifestacion_estado not null default 'activa',
  color           text not null default '#C4748A',
  icono           text not null default '✦',
  fecha_inicio    date not null default current_date,
  fecha_manifestada date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index manifestaciones_user_id_idx on public.manifestaciones (user_id);
create index manifestaciones_user_estado_idx on public.manifestaciones (user_id, estado);

alter table public.manifestaciones enable row level security;

create policy "manifestaciones: leer propias"
  on public.manifestaciones for select
  using ((select auth.uid()) = user_id);

create policy "manifestaciones: insertar propias"
  on public.manifestaciones for insert
  with check ((select auth.uid()) = user_id);

create policy "manifestaciones: actualizar propias"
  on public.manifestaciones for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "manifestaciones: eliminar propias"
  on public.manifestaciones for delete
  using ((select auth.uid()) = user_id);

-- FK diferida: user_settings.manifestacion_activa_id → manifestaciones.id
alter table public.user_settings
  add constraint user_settings_manifestacion_activa_fk
  foreign key (manifestacion_activa_id)
  references public.manifestaciones(id)
  on delete set null;

-- ── PRACTICE PROGRESS ──────────────────────────────────────

create table public.practice_progress (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  manifestacion_id    uuid not null references public.manifestaciones(id) on delete cascade,
  dia_actual          int not null default 1 check (dia_actual >= 1),
  ciclo               int not null default 1 check (ciclo >= 1),
  racha_actual        int not null default 0 check (racha_actual >= 0),
  racha_maxima        int not null default 0 check (racha_maxima >= 0),
  ultima_practica_date date,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (user_id, manifestacion_id)
);

create index practice_progress_user_id_idx on public.practice_progress (user_id);
create index practice_progress_manifestacion_idx on public.practice_progress (manifestacion_id);

alter table public.practice_progress enable row level security;

create policy "practice_progress: leer propio"
  on public.practice_progress for select
  using ((select auth.uid()) = user_id);

create policy "practice_progress: insertar propio"
  on public.practice_progress for insert
  with check ((select auth.uid()) = user_id);

create policy "practice_progress: actualizar propio"
  on public.practice_progress for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ── PRACTICE SNAPSHOTS (inmutable) ─────────────────────────

create table public.practice_snapshots (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  manifestacion_id    uuid not null references public.manifestaciones(id) on delete cascade,
  dia                 int not null,
  ciclo               int not null default 1,
  familia             text not null,
  template_id         text not null,
  content_version     text not null,
  engine_version      text not null,
  deseo_snapshot      text not null,
  bloques             jsonb not null default '[]',
  completed_at        timestamptz not null,
  created_at          timestamptz not null default now()
);

create index practice_snapshots_user_id_idx on public.practice_snapshots (user_id);
create index practice_snapshots_manifestacion_idx on public.practice_snapshots (manifestacion_id);
create index practice_snapshots_completed_at_idx on public.practice_snapshots (user_id, completed_at desc);

alter table public.practice_snapshots enable row level security;

create policy "practice_snapshots: leer propios"
  on public.practice_snapshots for select
  using ((select auth.uid()) = user_id);

create policy "practice_snapshots: insertar propios"
  on public.practice_snapshots for insert
  with check ((select auth.uid()) = user_id);

-- No update ni delete — los snapshots son inmutables

-- ── CHECK-INS (inmutable) ───────────────────────────────────

create table public.check_ins (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users(id) on delete cascade,
  manifestacion_id      uuid not null references public.manifestaciones(id) on delete cascade,
  practice_snapshot_id  uuid references public.practice_snapshots(id) on delete set null,
  date                  date not null,
  nota                  text,
  created_at            timestamptz not null default now()
);

create index check_ins_user_id_idx on public.check_ins (user_id);
create index check_ins_manifestacion_date_idx on public.check_ins (manifestacion_id, date desc);

alter table public.check_ins enable row level security;

create policy "check_ins: leer propios"
  on public.check_ins for select
  using ((select auth.uid()) = user_id);

create policy "check_ins: insertar propios"
  on public.check_ins for insert
  with check ((select auth.uid()) = user_id);

-- ── SCRIPTS / JOURNALING ───────────────────────────────────

create table public.scripts (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  manifestacion_id  uuid references public.manifestaciones(id) on delete set null,
  contenido         text not null default '',
  modo              script_modo not null default 'libre',
  intencion         text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index scripts_user_id_idx on public.scripts (user_id);
create index scripts_manifestacion_idx on public.scripts (manifestacion_id);

alter table public.scripts enable row level security;

create policy "scripts: leer propios"
  on public.scripts for select
  using ((select auth.uid()) = user_id);

create policy "scripts: insertar propios"
  on public.scripts for insert
  with check ((select auth.uid()) = user_id);

create policy "scripts: actualizar propios"
  on public.scripts for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "scripts: eliminar propios"
  on public.scripts for delete
  using ((select auth.uid()) = user_id);

-- ── BIBLIOTECA: GUARDADOS ──────────────────────────────────

create table public.biblioteca_guardados (
  user_id        uuid not null references auth.users(id) on delete cascade,
  contenido_id   text not null,
  created_at     timestamptz not null default now(),
  primary key (user_id, contenido_id)
);

create index biblioteca_guardados_user_id_idx on public.biblioteca_guardados (user_id);

alter table public.biblioteca_guardados enable row level security;

create policy "biblioteca_guardados: leer propios"
  on public.biblioteca_guardados for select
  using ((select auth.uid()) = user_id);

create policy "biblioteca_guardados: insertar propios"
  on public.biblioteca_guardados for insert
  with check ((select auth.uid()) = user_id);

create policy "biblioteca_guardados: eliminar propios"
  on public.biblioteca_guardados for delete
  using ((select auth.uid()) = user_id);

-- ── BIBLIOTECA: RECIENTES ──────────────────────────────────

create table public.biblioteca_recientes (
  user_id        uuid not null references auth.users(id) on delete cascade,
  contenido_id   text not null,
  visto_at       timestamptz not null default now(),
  primary key (user_id, contenido_id)
);

create index biblioteca_recientes_user_id_idx on public.biblioteca_recientes (user_id, visto_at desc);

alter table public.biblioteca_recientes enable row level security;

create policy "biblioteca_recientes: leer propios"
  on public.biblioteca_recientes for select
  using ((select auth.uid()) = user_id);

create policy "biblioteca_recientes: upsert propios"
  on public.biblioteca_recientes for insert
  with check ((select auth.uid()) = user_id);

create policy "biblioteca_recientes: actualizar propios"
  on public.biblioteca_recientes for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ── EVENT LOG ──────────────────────────────────────────────

create table public.event_log (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  event_name    text not null,
  properties    jsonb,
  created_at    timestamptz not null default now()
);

create index event_log_user_id_idx on public.event_log (user_id);
create index event_log_event_name_idx on public.event_log (event_name);
create index event_log_created_at_idx on public.event_log (user_id, created_at desc);

alter table public.event_log enable row level security;

create policy "event_log: leer propios"
  on public.event_log for select
  using ((select auth.uid()) = user_id);

create policy "event_log: insertar propios"
  on public.event_log for insert
  with check ((select auth.uid()) = user_id);

-- ── AI CALLS ───────────────────────────────────────────────

create table public.ai_calls (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  model             text not null,
  input_tokens      int not null default 0,
  output_tokens     int not null default 0,
  cost_usd          numeric(10,6) not null default 0,
  purpose           text not null,
  manifestacion_id  uuid references public.manifestaciones(id) on delete set null,
  created_at        timestamptz not null default now()
);

create index ai_calls_user_id_idx on public.ai_calls (user_id);
create index ai_calls_created_at_idx on public.ai_calls (user_id, created_at desc);

alter table public.ai_calls enable row level security;

create policy "ai_calls: leer propios"
  on public.ai_calls for select
  using ((select auth.uid()) = user_id);

create policy "ai_calls: insertar propios"
  on public.ai_calls for insert
  with check ((select auth.uid()) = user_id);

-- ── TRIGGER: crear user_settings al registrarse ────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── TRIGGER: updated_at automático ────────────────────────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at_user_settings
  before update on public.user_settings
  for each row execute function public.set_updated_at();

create trigger set_updated_at_manifestaciones
  before update on public.manifestaciones
  for each row execute function public.set_updated_at();

create trigger set_updated_at_practice_progress
  before update on public.practice_progress
  for each row execute function public.set_updated_at();

create trigger set_updated_at_scripts
  before update on public.scripts
  for each row execute function public.set_updated_at();
