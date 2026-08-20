-- Agrega columna para cachear el contenido generado por IA en cada giro de la ruleta.
-- Evita regenerar si la usuaria vuelve a ver su premio.

ALTER TABLE public.ruleta_giros
  ADD COLUMN IF NOT EXISTS contenido_generado TEXT;
