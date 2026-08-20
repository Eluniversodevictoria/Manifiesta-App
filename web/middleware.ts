import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// Rutas que requieren sesión activa
const RUTAS_PROTEGIDAS = ['/app', '/admin'];
// Rutas de auth — si ya hay sesión, redirigir a /app
const RUTAS_AUTH = ['/entrar', '/registrar', '/onboarding'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Refrescar tokens de Supabase y obtener usuario
  const { supabaseResponse, user } = await updateSession(request);

  // Rutas protegidas: si no hay sesión → redirigir a /entrar
  if (RUTAS_PROTEGIDAS.some((r) => pathname.startsWith(r))) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/entrar';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Rutas de auth: si ya hay sesión → redirigir a /app
  if (RUTAS_AUTH.some((r) => pathname.startsWith(r)) && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/app';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Excluir: archivos estáticos, _next, api routes (gestionan su propia auth)
     * Incluir: todas las rutas de la app
     */
    '/((?!_next/static|_next/image|favicon.ico|icons|mockups|images|fonts|api/).*)',
  ],
};
