-- email_log: registro idempotente de emails enviados
CREATE TABLE IF NOT EXISTS email_log (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_address TEXT NOT NULL,
  email_tipo    TEXT NOT NULL CHECK (email_tipo IN (
    'trial_d1','trial_d3','trial_d5','trial_d7',
    'subscription_activated','cancellation','refund',
    'trial_expired','winback_trial','winback_cancelled'
  )),
  status        TEXT NOT NULL CHECK (status IN ('sent','failed')),
  error_msg     TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_log_user_tipo_status
  ON email_log (user_id, email_tipo, status);

-- RLS: solo lectura del propio usuario; escritura solo desde service role
ALTER TABLE email_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "email_log_own_read" ON email_log
  FOR SELECT USING ((select auth.uid()) = user_id);

-- cancelled_at en user_settings (para win-back post-cancelación)
ALTER TABLE user_settings
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;
