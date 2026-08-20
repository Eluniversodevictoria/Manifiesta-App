-- RPC: buscar user_id en auth.users por email con índice nativo
-- Reemplaza listUsers() O(n) en el webhook de Hotmart.
-- auth.users ya tiene índice en email (Supabase lo crea automáticamente).
-- SECURITY DEFINER para poder leer auth.users desde el contexto service_role.

CREATE OR REPLACE FUNCTION get_user_id_by_email(p_email text)
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = auth, public
STABLE
AS $$
  SELECT id
  FROM auth.users
  WHERE lower(email) = lower(p_email)
  LIMIT 1;
$$;

-- Solo service_role y postgres pueden ejecutar esta función
REVOKE ALL ON FUNCTION get_user_id_by_email(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_user_id_by_email(text) TO service_role;
