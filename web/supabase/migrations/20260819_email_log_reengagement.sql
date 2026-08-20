-- Migración: agrega 'reengagement_inactiva' al CHECK constraint de email_log
-- Ejecutar en Supabase SQL Editor

ALTER TABLE email_log
  DROP CONSTRAINT IF EXISTS email_log_email_tipo_check;

ALTER TABLE email_log
  ADD CONSTRAINT email_log_email_tipo_check
  CHECK (email_tipo IN (
    'trial_d1','trial_d3','trial_d5','trial_d7',
    'subscription_activated','cancellation','refund',
    'trial_expired','winback_trial','winback_cancelled',
    'reengagement_inactiva'
  ));

-- Índice adicional para la consulta de cooldown periódico
CREATE INDEX IF NOT EXISTS idx_email_log_user_tipo_created
  ON email_log (user_id, email_tipo, created_at DESC)
  WHERE status = 'sent';
