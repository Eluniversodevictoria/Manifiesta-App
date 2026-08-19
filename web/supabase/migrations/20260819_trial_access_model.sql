-- ============================================================
-- Migración: modelo de acceso trial + suscripción (2026-08-19)
-- ============================================================

-- 1. Nuevas columnas en user_settings
ALTER TABLE user_settings
  ADD COLUMN IF NOT EXISTS access_status TEXT
    NOT NULL DEFAULT 'trial_active'
    CHECK (access_status IN ('trial_active','paid_active','trial_expired','subscription_inactive')),
  ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS hotmart_subscription_id TEXT;

-- 2. Índice para búsquedas por estado (webhook + cron)
CREATE INDEX IF NOT EXISTS idx_user_settings_access_status
  ON user_settings (access_status);

-- 3. Cron de Supabase: expirar trials vencidos (corre cada hora)
-- Si pg_cron no está habilitado, usar el endpoint /api/cron/expire-trials desde Vercel Cron.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.unschedule('expire-trials');
    PERFORM cron.schedule(
      'expire-trials',
      '0 * * * *',
      $cron$
        UPDATE user_settings
        SET access_status = 'trial_expired',
            updated_at = NOW()
        WHERE access_status = 'trial_active'
          AND trial_ends_at IS NOT NULL
          AND trial_ends_at < NOW();
      $cron$
    );
  END IF;
EXCEPTION WHEN OTHERS THEN
  -- pg_cron no disponible: ignorar, usar Vercel Cron en su lugar
  NULL;
END;
$$;

-- 4. Función helper: el frontend (BFF) puede llamar para leer el acceso actual
CREATE OR REPLACE FUNCTION get_my_access()
RETURNS TABLE (
  access_status TEXT,
  trial_ends_at TIMESTAMPTZ,
  plan_periodo TEXT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT access_status, trial_ends_at, plan_periodo
  FROM user_settings
  WHERE user_id = (SELECT auth.uid());
$$;
