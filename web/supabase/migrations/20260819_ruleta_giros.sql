-- ============================================================
-- MANIFIESTA — Ruleta de Premios
-- Ejecutar en Supabase SQL Editor (una sola vez)
-- ============================================================

-- Tabla: un registro por cada giro
CREATE TABLE IF NOT EXISTS public.ruleta_giros (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  premio_id        TEXT NOT NULL,
  premio_nombre    TEXT NOT NULL,
  premio_descripcion TEXT NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ruleta_giros_user_created
  ON public.ruleta_giros (user_id, created_at DESC);

ALTER TABLE public.ruleta_giros ENABLE ROW LEVEL SECURITY;

-- Políticas: el usuario solo ve/inserta sus propios giros
CREATE POLICY "ruleta: leer propios" ON public.ruleta_giros
  FOR SELECT USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "ruleta: insertar propios" ON public.ruleta_giros
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

-- GRANT explícito — sin esto la RLS puede estar bien pero el insert falla en silencio
GRANT SELECT, INSERT ON public.ruleta_giros TO authenticated;

-- ── RPC de admin ───────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.admin_get_ruleta_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE result JSONB;
BEGIN
  IF NOT public.is_owner() THEN
    RAISE EXCEPTION 'Acceso denegado: se requiere is_owner';
  END IF;

  SELECT jsonb_build_object(
    'total_giros',     (SELECT COUNT(*) FROM public.ruleta_giros),
    'usuarios_unicos', (SELECT COUNT(DISTINCT user_id) FROM public.ruleta_giros),
    'giros_hoy',       (SELECT COUNT(*) FROM public.ruleta_giros WHERE created_at >= current_date),
    'premios', (
      SELECT COALESCE(jsonb_agg(p ORDER BY p->>'veces' DESC), '[]'::jsonb)
      FROM (
        SELECT jsonb_build_object(
          'premio_id',     premio_id,
          'premio_nombre', premio_nombre,
          'veces',         COUNT(*)
        ) AS p
        FROM public.ruleta_giros
        GROUP BY premio_id, premio_nombre
      ) sub
    )
  ) INTO result;

  RETURN result;
END;
$$;
