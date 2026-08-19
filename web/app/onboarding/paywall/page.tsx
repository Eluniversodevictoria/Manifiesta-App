'use client';

// MANIFIESTA — Paywall post-onboarding (Fase 2 de la Secuencia Maestra)

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Check, Star, Sparkles } from 'lucide-react';
import { usePlan, PlanProvider, type PlanPeriodo } from '@/lib/PlanContext';

const HOTMART_MENSUAL = 'https://pay.hotmart.com/D107227544L?off=6ypur4wh';
const HOTMART_ANUAL   = 'https://pay.hotmart.com/D107227544L?off=at20rj67';

const DESEO_LABELS: Record<string, string> = {
  dinero:    'dinero y abundancia',
  trabajo:   'trabajo y éxito',
  amor:      'amor y relaciones',
  hogar:     'hogar y estabilidad',
  bienestar: 'salud y bienestar',
  viaje:     'viaje y libertad',
};

const FEATURES = [
  'Práctica diaria personalizada por Victoria',
  '"Necesito manifestar…" — práctica al instante',
  'Historial y seguimiento de lo manifestado',
];

function PaywallPageInner() {
  const [deseo, setDeseo] = useState('');
  const [planSel, setPlanSel] = useState<PlanPeriodo>('anual');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [errorForm, setErrorForm] = useState('');

  useEffect(() => {
    setDeseo(sessionStorage.getItem('ob_deseo') ?? '');
    setNombre(sessionStorage.getItem('ob_nombre') ?? '');
    setEmail(sessionStorage.getItem('ob_email') ?? '');
  }, []);

  const handleActivar = () => {
    if (!nombre.trim()) { setErrorForm('Escribe tu nombre.'); return; }
    if (!email.trim() || !email.includes('@')) { setErrorForm('Escribe un email válido.'); return; }
    setErrorForm('');
    const base = planSel === 'anual' ? HOTMART_ANUAL : HOTMART_MENSUAL;
    const url = `${base}&name=${encodeURIComponent(nombre.trim())}&email=${encodeURIComponent(email.trim())}`;
    window.location.href = url;
  };

  const deseoLabel = DESEO_LABELS[deseo] ?? deseo;

  return (
    <div
      className="flex min-h-dvh flex-col"
      style={{ background: 'var(--bg)', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}
    >
      {/* Header mínimo con marca */}
      <header className="flex h-14 items-center px-4">
        <a href="/" className="flex items-center gap-2 text-base font-semibold">
          <span aria-hidden="true" className="size-5 rounded-md bg-[var(--accent)]" />
          MANIFIESTA
        </a>
      </header>

      <main className="flex flex-1 flex-col items-center px-4 pb-[max(32px,env(safe-area-inset-bottom))]">
        {/* Headline personalizado con el deseo de la usuaria */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 w-full max-w-md text-center"
        >
          {/* Ícono de celebración */}
          <div
            className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl"
            style={{ background: 'color-mix(in oklab, var(--accent) 12%, transparent)' }}
          >
            <Sparkles size={28} color="var(--accent)" strokeWidth={1.5} />
          </div>

          <h1
            className="text-2xl font-bold leading-[1.15] tracking-[-0.02em] text-balance"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Tu práctica está lista.{' '}
            <span style={{ color: 'var(--accent)' }}>
              Empieza hoy con 7 días gratis.
            </span>
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
            Hoy US$0 con tarjeta. Cancela desde Hotmart antes del día 7 si no deseas continuar.
          </p>
        </motion.div>

        {/* Features — las 3 que más venden (02B anatomía) */}
        <motion.ul
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12 }}
          className="mt-6 w-full max-w-md space-y-3"
        >
          {FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex size-6 shrink-0 items-center justify-center rounded-full"
                style={{ background: 'color-mix(in oklab, var(--accent) 12%, transparent)' }}
              >
                <Check size={13} strokeWidth={2.5} color="var(--accent)" />
              </span>
              <span className="text-sm font-medium text-[var(--text-primary)]">{f}</span>
            </li>
          ))}
        </motion.ul>

        {/* Prueba social */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.22 }}
          className="mt-6 flex w-full max-w-md items-center gap-2 rounded-2xl px-4 py-3"
          style={{ background: 'color-mix(in oklab, var(--accent) 6%, transparent)' }}
        >
          <div className="flex gap-0.5" aria-hidden="true">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill="var(--accent)" color="var(--accent)" />
            ))}
          </div>
          <p className="text-xs font-medium text-[var(--text-secondary)]">
            "Victoria me ayudó a crear mi primera práctica real" — usuaria de El Universo de Victoria
          </p>
        </motion.div>

        {/* Selector de plan */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-6 w-full max-w-md space-y-3"
        >
          {/* Plan Anual — señuelo recomendado */}
          <button
            type="button"
            onClick={() => setPlanSel('anual')}
            className={`relative w-full rounded-2xl border-2 px-4 py-4 text-left transition-colors [touch-action:manipulation] ${
              planSel === 'anual'
                ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_8%,transparent)]'
                : 'border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface)]'
            }`}
          >
            {/* Badge MÁS POPULAR */}
            <span
              className="absolute -top-3 left-4 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.06em] text-white"
              style={{ background: 'var(--accent)' }}
            >
              Más popular
            </span>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-base font-semibold text-[var(--text-primary)]">Anual</p>
                <p className="text-xs text-[var(--text-secondary)]">Se cobra $49.99/año · 2 meses gratis</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
                  $4<span className="text-sm font-normal text-[var(--text-secondary)]">/mes</span>
                </p>
                <p className="text-xs text-[var(--text-tertiary)] line-through">$6.99/mes</p>
              </div>
            </div>
          </button>

          {/* Plan Mensual */}
          <button
            type="button"
            onClick={() => setPlanSel('mensual')}
            className={`w-full rounded-2xl border px-4 py-4 text-left transition-colors [touch-action:manipulation] ${
              planSel === 'mensual'
                ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_8%,transparent)]'
                : 'border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface)]'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-base font-semibold text-[var(--text-primary)]">Mensual</p>
              <p className="text-lg font-bold text-[var(--text-primary)]">
                $6.99<span className="text-xs font-normal text-[var(--text-secondary)]">/mes</span>
              </p>
            </div>
          </button>
        </motion.div>

        {/* Timeline de precios */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.38 }}
          className="mt-6 w-full max-w-md rounded-2xl px-4 py-4"
          style={{ background: 'color-mix(in oklab, var(--accent) 5%, transparent)' }}
        >
          <div className="flex items-start justify-between gap-2">
            {[
              { label: 'Hoy', sub: 'US$0' },
              { label: '7 días', sub: 'Acceso completo' },
              { label: 'Después', sub: planSel === 'anual' ? '$49.99/año' : '$6.99/mes' },
            ].map((item, i, arr) => (
              <div key={item.label} className="flex flex-1 items-start gap-0">
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <div
                    className="size-2.5 rounded-full"
                    style={{ background: i < 2 ? 'var(--accent)' : 'color-mix(in oklab, var(--text-tertiary) 40%, transparent)' }}
                  />
                  <p className="text-center text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {item.label}
                  </p>
                  <p className="text-center text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {item.sub}
                  </p>
                </div>
                {i < arr.length - 1 && (
                  <div
                    className="mt-1 h-px w-8 shrink-0"
                    style={{ background: 'color-mix(in oklab, var(--text-tertiary) 25%, transparent)', marginTop: '5px' }}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Captura de nombre y email */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.42 }}
          className="mt-5 w-full max-w-md space-y-3"
        >
          <p className="text-sm font-semibold text-[var(--text-primary)]">Guardamos tu acceso en Hotmart</p>
          <input
            type="text"
            placeholder="Tu nombre"
            value={nombre}
            onChange={e => { setNombre(e.target.value); setErrorForm(''); }}
            className="h-12 w-full rounded-2xl border px-4 text-base focus:outline-none"
            style={{ background: 'var(--surface)', borderColor: 'color-mix(in oklab, var(--text-tertiary) 30%, transparent)', color: 'var(--text-primary)' }}
          />
          <input
            type="email"
            placeholder="Tu email"
            value={email}
            onChange={e => { setEmail(e.target.value); setErrorForm(''); }}
            className="h-12 w-full rounded-2xl border px-4 text-base focus:outline-none"
            style={{ background: 'var(--surface)', borderColor: 'color-mix(in oklab, var(--text-tertiary) 30%, transparent)', color: 'var(--text-primary)' }}
          />
          {errorForm && <p className="text-xs" style={{ color: 'var(--error)' }}>{errorForm}</p>}
        </motion.div>

        {/* CTA principal */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.52 }}
          className="mt-4 w-full max-w-md space-y-3"
        >
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={handleActivar}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-base font-semibold text-white shadow-[0_8px_30px_color-mix(in_oklab,var(--accent)_28%,transparent)] [touch-action:manipulation]"
          >
            <Sparkles size={16} strokeWidth={2} />
            Continuar a mi prueba gratis
          </motion.button>

          <p className="text-center text-xs text-[var(--text-tertiary)]">
            Checkout seguro por Hotmart · Cancela antes del día 7, sin cobros
          </p>
        </motion.div>
      </main>
    </div>
  );
}

export default function PaywallPage() {
  return (
    <PlanProvider>
      <PaywallPageInner />
    </PlanProvider>
  );
}
