-- ── Chat con Victoria ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.victoria_chat (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role        TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.victoria_chat ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON public.victoria_chat TO authenticated;

CREATE POLICY "chat_select_own"
  ON public.victoria_chat FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "chat_insert_own"
  ON public.victoria_chat FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE INDEX IF NOT EXISTS idx_victoria_chat_user_created
  ON public.victoria_chat (user_id, created_at DESC);

-- ── Contador de uso mensual ───────────────────────────────────────────────────
-- Evita full-scan a victoria_chat cada request

CREATE TABLE IF NOT EXISTS public.chat_uso_mensual (
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  periodo     TEXT NOT NULL,          -- 'YYYY-MM'
  mensajes    INT NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, periodo)
);

ALTER TABLE public.chat_uso_mensual ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.chat_uso_mensual TO authenticated;

CREATE POLICY "uso_select_own"
  ON public.chat_uso_mensual FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

-- Solo el service_role puede escribir (el backend lo actualiza)
-- authenticated no tiene INSERT/UPDATE → forzado desde servidor

-- ── Mejora tabla ai_calls: más campos para tracking preciso ──────────────────

ALTER TABLE public.ai_calls
  ADD COLUMN IF NOT EXISTS model       TEXT,
  ADD COLUMN IF NOT EXISTS purpose     TEXT,
  ADD COLUMN IF NOT EXISTS input_tokens  INT,
  ADD COLUMN IF NOT EXISTS output_tokens INT,
  ADD COLUMN IF NOT EXISTS chars_tts   INT,
  ADD COLUMN IF NOT EXISTS cost_usd    NUMERIC(10,6),
  ADD COLUMN IF NOT EXISTS feature     TEXT,
  ADD COLUMN IF NOT EXISTS success     BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS duration_ms INT,
  ADD COLUMN IF NOT EXISTS error_msg   TEXT;

CREATE INDEX IF NOT EXISTS idx_ai_calls_user_created
  ON public.ai_calls (user_id, created_at DESC);

-- ── RPC: incremento atómico del contador de chat ─────────────────────────────

CREATE OR REPLACE FUNCTION public.incrementar_chat_uso(
  p_user_id UUID,
  p_periodo  TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.chat_uso_mensual (user_id, periodo, mensajes, updated_at)
  VALUES (p_user_id, p_periodo, 1, NOW())
  ON CONFLICT (user_id, periodo)
  DO UPDATE SET
    mensajes   = public.chat_uso_mensual.mensajes + 1,
    updated_at = NOW();
END;
$$;
