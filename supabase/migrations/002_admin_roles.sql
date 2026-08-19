-- ============================================================
-- MANIFIESTA con Victoria — Admin roles + RPC functions
-- Ejecutar en Supabase SQL Editor (una sola vez, después de 001)
-- ============================================================

-- ── is_owner en user_settings ──────────────────────────────

alter table public.user_settings
  add column if not exists is_owner boolean not null default false;

-- ── Hotmart orders (arquitectura lista, sin datos por ahora) ─

create table if not exists public.hotmart_orders (
  id                uuid primary key default gen_random_uuid(),
  hotmart_order_id  text not null unique,
  buyer_email       text not null,
  buyer_name        text,
  user_id           uuid references auth.users(id) on delete set null,
  product_id        text not null,
  offer_code        text,
  plan_periodo      plan_periodo,
  amount_usd        numeric(10,2) not null default 0,
  currency          text not null default 'USD',
  status            text not null default 'approved', -- approved | refunded | cancelled | chargeback
  event_type        text not null,                    -- PURCHASE_APPROVED | PURCHASE_REFUNDED …
  hotmart_payload   jsonb,
  created_at        timestamptz not null default now()
);

create index if not exists hotmart_orders_buyer_email_idx on public.hotmart_orders (buyer_email);
create index if not exists hotmart_orders_user_id_idx     on public.hotmart_orders (user_id);
create index if not exists hotmart_orders_created_at_idx  on public.hotmart_orders (created_at desc);
create index if not exists hotmart_orders_status_idx      on public.hotmart_orders (status);

alter table public.hotmart_orders enable row level security;
-- Sin políticas de usuario final — solo accesible vía RPC admin

-- ── Función auxiliar: ¿es owner el caller? ────────────────

create or replace function public.is_owner()
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(
    (select is_owner from public.user_settings where user_id = (select auth.uid())),
    false
  );
$$;

-- ── admin_get_metrics ──────────────────────────────────────

create or replace function public.admin_get_metrics()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  if not public.is_owner() then
    raise exception 'Acceso denegado: se requiere is_owner';
  end if;

  select jsonb_build_object(
    'total_users',          (select count(*) from public.user_settings),
    'pro_users',            (select count(*) from public.user_settings where plan = 'pro'),
    'free_users',           (select count(*) from public.user_settings where plan = 'free'),
    'pro_mensual',          (select count(*) from public.user_settings where plan = 'pro' and plan_periodo = 'mensual'),
    'pro_anual',            (select count(*) from public.user_settings where plan = 'pro' and plan_periodo = 'anual'),
    'total_manifestaciones', (select count(*) from public.manifestaciones),
    'manifestaciones_activas', (select count(*) from public.manifestaciones where estado = 'activa'),
    'manifestadas',         (select count(*) from public.manifestaciones where estado = 'manifestada'),
    'total_check_ins',      (select count(*) from public.check_ins),
    'check_ins_hoy',        (select count(*) from public.check_ins where date = current_date),
    'check_ins_7d',         (select count(*) from public.check_ins where date >= current_date - 7),
    'total_scripts',        (select count(*) from public.scripts),
    'total_ai_calls',       (select count(*) from public.ai_calls),
    'ai_cost_total_usd',    (select coalesce(sum(cost_usd), 0) from public.ai_calls),
    'ai_cost_30d_usd',      (select coalesce(sum(cost_usd), 0) from public.ai_calls where created_at >= now() - interval '30 days'),
    'ai_tokens_total',      (select coalesce(sum(input_tokens + output_tokens), 0) from public.ai_calls),
    'events_today',         (select count(*) from public.event_log where created_at >= current_date),
    'events_7d',            (select count(*) from public.event_log where created_at >= now() - interval '7 days'),
    'hotmart_orders_total', (select count(*) from public.hotmart_orders where status = 'approved'),
    'hotmart_mrr_usd',      (select coalesce(sum(amount_usd), 0) from public.hotmart_orders where status = 'approved' and created_at >= date_trunc('month', now())),
    'hotmart_revenue_total_usd', (select coalesce(sum(amount_usd), 0) from public.hotmart_orders where status = 'approved'),
    'users_new_7d',         (select count(*) from public.user_settings where created_at >= now() - interval '7 days'),
    'users_new_30d',        (select count(*) from public.user_settings where created_at >= now() - interval '30 days'),
    'activation_ob_done',   (select count(distinct user_id) from public.event_log where event_name = 'ob_done'),
    'activation_manifestation_created', (select count(distinct user_id) from public.event_log where event_name = 'manifestation_created'),
    'activation_daily_practice', (select count(distinct user_id) from public.event_log where event_name = 'daily_practice_completed')
  ) into result;

  return result;
end;
$$;

-- ── admin_get_users ────────────────────────────────────────

create or replace function public.admin_get_users(search_query text default null)
returns table (
  user_id          uuid,
  email            text,
  plan             plan_tipo,
  plan_periodo     plan_periodo,
  plan_activado_at timestamptz,
  is_owner         boolean,
  manifestaciones_activas bigint,
  check_ins_total  bigint,
  registered_at    timestamptz
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_owner() then
    raise exception 'Acceso denegado: se requiere is_owner';
  end if;

  return query
    select
      us.user_id,
      au.email::text,
      us.plan,
      us.plan_periodo,
      us.plan_activado_at,
      us.is_owner,
      (select count(*) from public.manifestaciones m
         where m.user_id = us.user_id and m.estado = 'activa'),
      (select count(*) from public.check_ins ci
         where ci.user_id = us.user_id),
      au.created_at
    from public.user_settings us
    join auth.users au on au.id = us.user_id
    where
      search_query is null
      or au.email ilike '%' || search_query || '%'
    order by au.created_at desc
    limit 200;
end;
$$;

-- ── admin_update_user_plan ─────────────────────────────────

create or replace function public.admin_update_user_plan(
  target_user_id uuid,
  new_plan       plan_tipo,
  new_periodo    plan_periodo default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_owner() then
    raise exception 'Acceso denegado: se requiere is_owner';
  end if;

  update public.user_settings
  set
    plan             = new_plan,
    plan_periodo     = case when new_plan = 'pro' then coalesce(new_periodo, 'mensual'::plan_periodo) else null end,
    plan_activado_at = case when new_plan = 'pro' then now() else null end,
    updated_at       = now()
  where user_id = target_user_id;

  if not found then
    raise exception 'Usuario no encontrado: %', target_user_id;
  end if;
end;
$$;

-- ── admin_set_owner ────────────────────────────────────────

create or replace function public.admin_set_owner(
  target_user_id uuid,
  new_value      boolean
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_owner() then
    raise exception 'Acceso denegado: se requiere is_owner';
  end if;

  update public.user_settings
  set is_owner = new_value, updated_at = now()
  where user_id = target_user_id;
end;
$$;

-- ── admin_get_ai_stats ─────────────────────────────────────

create or replace function public.admin_get_ai_stats()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare result jsonb;
begin
  if not public.is_owner() then
    raise exception 'Acceso denegado: se requiere is_owner';
  end if;

  select jsonb_build_object(
    'by_model', (
      select jsonb_agg(r order by r->>'cost_usd' desc)
      from (
        select jsonb_build_object(
          'model', model,
          'calls', count(*),
          'input_tokens', sum(input_tokens),
          'output_tokens', sum(output_tokens),
          'cost_usd', sum(cost_usd)
        ) as r
        from public.ai_calls
        group by model
      ) sub
    ),
    'by_purpose', (
      select jsonb_agg(r order by r->>'cost_usd' desc)
      from (
        select jsonb_build_object(
          'purpose', purpose,
          'calls', count(*),
          'cost_usd', sum(cost_usd)
        ) as r
        from public.ai_calls
        group by purpose
      ) sub
    ),
    'daily_last_30', (
      select jsonb_agg(r order by r->>'day')
      from (
        select jsonb_build_object(
          'day', date_trunc('day', created_at)::date,
          'calls', count(*),
          'cost_usd', sum(cost_usd)
        ) as r
        from public.ai_calls
        where created_at >= now() - interval '30 days'
        group by date_trunc('day', created_at)::date
      ) sub
    )
  ) into result;

  return result;
end;
$$;

-- ── admin_get_events ───────────────────────────────────────

create or replace function public.admin_get_events(
  limit_n     int     default 100,
  name_filter text    default null
)
returns table (
  id         uuid,
  user_id    uuid,
  event_name text,
  properties jsonb,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_owner() then
    raise exception 'Acceso denegado: se requiere is_owner';
  end if;

  return query
    select el.id, el.user_id, el.event_name, el.properties, el.created_at
    from public.event_log el
    where name_filter is null or el.event_name ilike '%' || name_filter || '%'
    order by el.created_at desc
    limit limit_n;
end;
$$;

-- ── admin_get_funnel_stats ─────────────────────────────────

create or replace function public.admin_get_funnel_stats()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare result jsonb;
begin
  if not public.is_owner() then
    raise exception 'Acceso denegado: se requiere is_owner';
  end if;

  select jsonb_build_object(
    'registrados',          (select count(*) from public.user_settings),
    'ob_done',              (select count(distinct user_id) from public.event_log where event_name = 'ob_done'),
    'manifestation_created',(select count(distinct user_id) from public.event_log where event_name = 'manifestation_created'),
    'daily_practice_done',  (select count(distinct user_id) from public.event_log where event_name = 'daily_practice_completed'),
    'pro_converted',        (select count(*) from public.user_settings where plan = 'pro'),
    'event_counts', (
      select jsonb_agg(r order by r->>'count' desc)
      from (
        select jsonb_build_object('event', event_name, 'count', count(*)) as r
        from public.event_log
        group by event_name
      ) sub
    ),
    'dau_last_14', (
      select jsonb_agg(r order by r->>'day')
      from (
        select jsonb_build_object(
          'day', date_trunc('day', created_at)::date,
          'users', count(distinct user_id)
        ) as r
        from public.check_ins
        where date >= current_date - 14
        group by date_trunc('day', created_at)::date
      ) sub
    )
  ) into result;

  return result;
end;
$$;

-- ── Comentario de setup ────────────────────────────────────
-- Después de correr esta migración, ejecuta:
--
--   UPDATE public.user_settings
--   SET is_owner = true
--   WHERE user_id = (
--     SELECT id FROM auth.users WHERE email = 'TU_EMAIL@ejemplo.com'
--   );
--
-- Esto habilita el acceso a todos los RPC admin para tu cuenta.
