'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Eye, EyeOff, ArrowLeft, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      aria-hidden="true"
      style={{
        '--g-b': 'rgb(66,133,244)',
        '--g-g': 'rgb(52,168,83)',
        '--g-y': 'rgb(251,188,5)',
        '--g-r': 'rgb(234,67,53)',
      } as React.CSSProperties}
    >
      <path fill="var(--g-b)" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.616Z"/>
      <path fill="var(--g-g)" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"/>
      <path fill="var(--g-y)" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"/>
      <path fill="var(--g-r)" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"/>
    </svg>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px" style={{ background: 'color-mix(in oklab, var(--text-tertiary) 30%, transparent)' }} />
      <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>o</span>
      <div className="flex-1 h-px" style={{ background: 'color-mix(in oklab, var(--text-tertiary) 30%, transparent)' }} />
    </div>
  );
}

function EntrarContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') ?? 'gratis';
  const next = searchParams.get('next') ?? '/app';
  const urlError = searchParams.get('error');

  const [modo, setModo] = useState<'principal' | 'email'>('principal');
  const [esLogin, setEsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verPass, setVerPass] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(urlError === 'auth' ? 'Hubo un problema al iniciar sesión. Intenta de nuevo.' : '');
  const [exito, setExito] = useState('');

  const supabase = createClient();

  const planLabel: Record<string, string> = {
    gratis: 'prueba gratuita',
    mensual: 'plan mensual',
    anual: 'plan anual',
  };

  const handleGoogle = async () => {
    setCargando(true);
    setError('');
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (oauthError) {
      setError('No se pudo conectar con Google. Intenta con email.');
      setCargando(false);
    }
    // Si no hay error, la página redirige a Google — no hace falta setCargando(false)
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError('Ingresa tu email.'); return; }
    if (password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres.'); return; }

    setCargando(true);
    setError('');

    if (esLogin) {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        // Anti-enumeración: mismo mensaje para email inexistente o contraseña incorrecta
        setError('Email o contraseña incorrectos.');
        setCargando(false);
        return;
      }
      window.location.href = next;
    } else {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('Email o contraseña incorrectos.');
        } else {
          setError('No se pudo crear la cuenta. Intenta de nuevo.');
        }
        setCargando(false);
        return;
      }
      window.location.href = next;
      setCargando(false);
    }
  };

  const EASE = [0.16, 1, 0.3, 1] as const;

  return (
    <div
      className="flex min-h-dvh flex-col"
      style={{ background: 'var(--bg)', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}
    >
      <header className="flex h-14 items-center px-4">
        {modo === 'email' && (
          <button
            type="button"
            onClick={() => { setModo('principal'); setError(''); setExito(''); }}
            aria-label="Volver"
            className="flex size-9 items-center justify-center rounded-full [touch-action:manipulation]"
            style={{ background: 'color-mix(in oklab, var(--text-tertiary) 12%, transparent)' }}
          >
            <ArrowLeft size={18} color="var(--text-secondary)" />
          </button>
        )}
        <a href="/" className="flex items-center gap-2 text-sm font-semibold ml-auto">
          <span aria-hidden="true" className="size-5 rounded-md" style={{ background: 'var(--accent)' }} />
          MANIFIESTA
        </a>
      </header>

      <main className="flex flex-1 flex-col items-center px-4 pb-[max(32px,env(safe-area-inset-bottom))]">
        <AnimatePresence mode="wait">

          {modo === 'principal' && (
            <motion.div
              key="principal"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="flex w-full max-w-sm flex-1 flex-col justify-center gap-0"
            >
              <div className="mb-8 flex flex-col items-center text-center gap-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 22 }}
                  className="flex size-14 items-center justify-center rounded-2xl"
                  style={{ background: 'color-mix(in oklab, var(--accent) 12%, transparent)' }}
                >
                  <Sparkles size={26} color="var(--accent)" strokeWidth={1.5} />
                </motion.div>
                <div>
                  <h1
                    className="text-2xl font-bold leading-tight tracking-tight"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Empieza tu {planLabel[plan] ?? 'prueba'}
                  </h1>
                  <p className="mt-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Tu práctica te está esperando
                  </p>
                </div>
              </div>

              <motion.button
                type="button"
                onClick={handleGoogle}
                disabled={cargando}
                whileTap={{ scale: 0.97 }}
                className="flex h-13 w-full items-center justify-center gap-3 rounded-2xl border text-base font-semibold transition-colors [touch-action:manipulation] disabled:opacity-60"
                style={{
                  background: 'var(--surface)',
                  borderColor: 'color-mix(in oklab, var(--text-tertiary) 30%, transparent)',
                  color: 'var(--text-primary)',
                }}
              >
                {cargando
                  ? <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  : <GoogleIcon />
                }
                Continuar con Google
              </motion.button>

              <div className="my-5"><Divider /></div>

              <motion.button
                type="button"
                onClick={() => setModo('email')}
                whileTap={{ scale: 0.97 }}
                className="flex h-13 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] text-base font-semibold [touch-action:manipulation]"
                style={{
                  background: 'var(--accent)',
                  color: 'white',
                  boxShadow: '0 8px 28px color-mix(in oklab, var(--accent) 28%, transparent)',
                }}
              >
                <Mail size={17} strokeWidth={2} />
                Continuar con email
              </motion.button>

              <p className="mt-6 text-center text-xs" style={{ color: 'var(--text-secondary)' }}>
                ¿Ya tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => { setModo('email'); setEsLogin(true); }}
                  className="font-semibold underline-offset-2 hover:underline [touch-action:manipulation]"
                  style={{ color: 'var(--accent)' }}
                >
                  Entra aquí
                </button>
              </p>

              <p className="mt-8 text-center text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                Al continuar aceptas los{' '}
                <a href="/terminos" className="underline underline-offset-2">Términos de uso</a>
                {' '}y la{' '}
                <a href="/privacidad" className="underline underline-offset-2">Política de privacidad</a>
              </p>
            </motion.div>
          )}

          {modo === 'email' && (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="flex w-full max-w-sm flex-1 flex-col justify-center"
            >
              <h1
                className="mb-1.5 text-2xl font-bold leading-tight tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {esLogin ? 'Bienvenida de vuelta' : 'Crea tu cuenta'}
              </h1>
              <p className="mb-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {esLogin ? 'Entra con tu email y contraseña' : 'Solo necesitas email y contraseña'}
              </p>

              {/* Éxito: email de confirmación enviado */}
              <AnimatePresence>
                {exito && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-4 rounded-2xl p-4 text-sm"
                    style={{
                      background: 'color-mix(in oklab, var(--success) 10%, transparent)',
                      color: 'var(--success)',
                    }}
                    role="status"
                  >
                    {exito}
                  </motion.div>
                )}
              </AnimatePresence>

              {!exito && (
                <form onSubmit={handleEmail} noValidate className="flex flex-col gap-3">
                  <div>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      autoFocus
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      placeholder="tu@email.com"
                      className="h-13 w-full rounded-2xl border px-4 text-base transition-colors focus:outline-none"
                      style={{
                        background: 'var(--surface)',
                        borderColor: error ? 'color-mix(in oklab, var(--accent) 55%, transparent)' : 'color-mix(in oklab, var(--text-tertiary) 30%, transparent)',
                        color: 'var(--text-primary)',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                      onBlur={(e) => (e.target.style.borderColor = error
                        ? 'color-mix(in oklab, var(--accent) 55%, transparent)'
                        : 'color-mix(in oklab, var(--text-tertiary) 30%, transparent)')}
                    />
                  </div>

                  <div className="relative">
                    <label htmlFor="password" className="sr-only">Contraseña</label>
                    <input
                      id="password"
                      type={verPass ? 'text' : 'password'}
                      autoComplete={esLogin ? 'current-password' : 'new-password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      placeholder={esLogin ? 'Tu contraseña' : 'Mínimo 8 caracteres'}
                      className="h-13 w-full rounded-2xl border px-4 pr-12 text-base transition-colors focus:outline-none"
                      style={{
                        background: 'var(--surface)',
                        borderColor: error ? 'color-mix(in oklab, var(--accent) 55%, transparent)' : 'color-mix(in oklab, var(--text-tertiary) 30%, transparent)',
                        color: 'var(--text-primary)',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                      onBlur={(e) => (e.target.style.borderColor = error
                        ? 'color-mix(in oklab, var(--accent) 55%, transparent)'
                        : 'color-mix(in oklab, var(--text-tertiary) 30%, transparent)')}
                    />
                    <button
                      type="button"
                      onClick={() => setVerPass((v) => !v)}
                      aria-label={verPass ? 'Ocultar contraseña' : 'Ver contraseña'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 flex size-8 items-center justify-center rounded-lg [touch-action:manipulation]"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      {verPass ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-xs"
                        style={{ color: 'var(--error)' }}
                        role="alert"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    disabled={cargando || !email.trim() || !password}
                    whileTap={{ scale: 0.97 }}
                    className="mt-1 flex h-13 w-full items-center justify-center rounded-[var(--radius-button)] text-base font-semibold transition-opacity [touch-action:manipulation] disabled:opacity-50"
                    style={{
                      background: 'var(--accent)',
                      color: 'white',
                      boxShadow: '0 8px 28px color-mix(in oklab, var(--accent) 28%, transparent)',
                    }}
                  >
                    {cargando
                      ? <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      : esLogin ? 'Entrar' : 'Crear mi cuenta'
                    }
                  </motion.button>
                </form>
              )}

              <p className="mt-5 text-center text-xs" style={{ color: 'var(--text-secondary)' }}>
                {esLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
                <button
                  type="button"
                  onClick={() => { setEsLogin((v) => !v); setError(''); setExito(''); }}
                  className="font-semibold underline-offset-2 hover:underline [touch-action:manipulation]"
                  style={{ color: 'var(--accent)' }}
                >
                  {esLogin ? 'Regístrate' : 'Entra aquí'}
                </button>
              </p>

              <div className="mt-6">
                <Divider />
                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={cargando}
                  className="mt-4 flex h-12 w-full items-center justify-center gap-3 rounded-2xl border text-sm font-medium [touch-action:manipulation] disabled:opacity-60"
                  style={{
                    background: 'var(--surface)',
                    borderColor: 'color-mix(in oklab, var(--text-tertiary) 30%, transparent)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <GoogleIcon />
                  Continuar con Google
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

export default function EntrarPage() {
  return (
    <Suspense>
      <EntrarContent />
    </Suspense>
  );
}
