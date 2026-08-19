import { type NextRequest, NextResponse } from 'next/server';

const SUPABASE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Sin credenciales de Supabase (dev sin .env.local): pasar todo sin tocar
  if (!SUPABASE_CONFIGURED) {
    return NextResponse.next({ request });
  }

  const { updateSession } = await import('@/lib/supabase/middleware');
  const { supabaseResponse, user } = await updateSession(request);

  // Rutas que requieren sesión activa
  const protectedPrefixes = ['/app', '/admin'];
  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));

  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/entrar';
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirigir usuario ya logueado fuera de /entrar
  if (pathname === '/entrar' && user) {
    const appUrl = request.nextUrl.clone();
    appUrl.pathname = '/app';
    appUrl.search = '';
    return NextResponse.redirect(appUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
