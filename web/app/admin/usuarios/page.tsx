import { createClient } from '@/lib/supabase/server';
import { adminGetUsers } from '@/lib/supabase/admin-queries';
import { NoData } from '../_components/NoData';
import { UserTable } from './_components/UserTable';

export default async function UsuariosPage() {
  const supabase = await createClient();
  const { data: users, error } = await adminGetUsers(supabase);

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
        Usuarios
      </h1>
      <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: '1.5rem' }}>
        Gestiona planes directamente. La búsqueda filtra en cliente (sin request extra).
      </p>

      {error ? (
        <NoData reason={`Error al cargar usuarios: ${error.message}`} />
      ) : !users || users.length === 0 ? (
        <NoData reason="No hay usuarios registrados todavía, o is_owner no está configurado en tu cuenta." />
      ) : (
        <UserTable users={users} />
      )}
    </div>
  );
}
