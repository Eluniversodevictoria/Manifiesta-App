'use client';

// InstalarApp — guía para añadir MANIFIESTA a la pantalla de inicio
// Muestra los pasos correctos según el sistema operativo detectado.
// Usada en: fin de onboarding + Perfil.

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Share, Plus, MoreVertical, Download, ChevronDown, ChevronUp } from 'lucide-react';

type OS = 'ios' | 'android' | 'other';

function detectOS(): OS {
  if (typeof navigator === 'undefined') return 'other';
  const ua = navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios';
  if (/android/i.test(ua)) return 'android';
  return 'other';
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true)
  );
}

// ── Paso individual ──────────────────────────────────────────────────────────

function Paso({
  numero,
  icon,
  texto,
}: {
  numero: number;
  icon: React.ReactNode;
  texto: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="flex size-8 items-center justify-center rounded-full flex-shrink-0 text-sm font-bold"
        style={{ background: 'color-mix(in oklab, var(--accent) 12%, transparent)', color: 'var(--accent)' }}
      >
        {numero}
      </div>
      <div className="flex-1 pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          {icon}
          <span className="text-sm leading-snug" style={{ color: 'var(--text-primary)' }}>
            {texto}
          </span>
        </div>
      </div>
    </div>
  );
}

function IconChip({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-lg px-2 py-1 text-xs font-semibold flex-shrink-0"
      style={{ background: 'var(--surface)', color: 'var(--accent)', border: '1px solid color-mix(in oklab, var(--accent) 20%, transparent)' }}
    >
      {children}
    </span>
  );
}

// ── Contenido según OS ────────────────────────────────────────────────────────

function PasosIOS() {
  return (
    <div className="flex flex-col gap-4">
      <Paso
        numero={1}
        icon={<IconChip><Share size={13} strokeWidth={2} /></IconChip>}
        texto={<>Toca el botón <strong>Compartir</strong> en Safari (la flecha que apunta hacia arriba, en la barra de abajo)</>}
      />
      <Paso
        numero={2}
        icon={<IconChip><Plus size={13} strokeWidth={2.5} /></IconChip>}
        texto={<>Desplázate en el menú y toca <strong>&quot;Añadir a pantalla de inicio&quot;</strong></>}
      />
      <Paso
        numero={3}
        icon={null}
        texto={<>Escribe <strong>MANIFIESTA</strong> como nombre (o déjalo como está) y toca <strong>Añadir</strong></>}
      />
      <div
        className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
        style={{ background: 'color-mix(in oklab, var(--accent) 7%, transparent)', color: 'var(--text-secondary)' }}
      >
        ✦ Desde ahora se abre como una app real: sin barra del navegador, a pantalla completa.
      </div>
    </div>
  );
}

function PasosAndroid() {
  return (
    <div className="flex flex-col gap-4">
      <Paso
        numero={1}
        icon={<IconChip><MoreVertical size={13} strokeWidth={2} /></IconChip>}
        texto={<>Toca el menú de los <strong>3 puntos</strong> (arriba a la derecha en Chrome)</>}
      />
      <Paso
        numero={2}
        icon={<IconChip><Download size={13} strokeWidth={2} /></IconChip>}
        texto={<>Toca <strong>&quot;Añadir a pantalla de inicio&quot;</strong> o <strong>&quot;Instalar app&quot;</strong></>}
      />
      <Paso
        numero={3}
        icon={null}
        texto={<>Confirma tocando <strong>Añadir</strong> o <strong>Instalar</strong> en el cuadro que aparece</>}
      />
      <div
        className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
        style={{ background: 'color-mix(in oklab, var(--accent) 7%, transparent)', color: 'var(--text-secondary)' }}
      >
        ✦ También puede aparecer un banner automático invitándote a instalarla — acéptalo si aparece.
      </div>
    </div>
  );
}

function PasosOther() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          En iPhone (Safari)
        </p>
        <PasosIOS />
      </div>
      <div>
        <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          En Android (Chrome)
        </p>
        <PasosAndroid />
      </div>
    </div>
  );
}

// ── Sheet (modal) ─────────────────────────────────────────────────────────────

export function InstalarAppSheet({ onClose }: { onClose: () => void }) {
  const [os, setOS] = useState<OS>('other');
  const [already, setAlready] = useState(false);

  useEffect(() => {
    setOS(detectOS());
    setAlready(isStandalone());
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(34,20,26,0.45)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        role="dialog" aria-modal="true" aria-label="Añadir a pantalla de inicio"
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl px-6 pt-6 overflow-y-auto"
        style={{
          background: 'var(--bg)',
          maxHeight: '85dvh',
          paddingBottom: 'calc(32px + env(safe-area-inset-bottom))',
          boxShadow: '0 -12px 40px rgba(34,20,26,0.18)',
        }}
      >
        <div className="mx-auto mb-5 h-1 w-10 rounded-full" style={{ background: 'var(--surface-2)' }} />
        <button
          type="button" onClick={onClose}
          className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full [touch-action:manipulation]"
          style={{ background: 'var(--surface)' }}
          aria-label="Cerrar"
        >
          <X size={16} color="var(--text-secondary)" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          {/* Icon preview */}
          <div
            className="size-16 rounded-2xl mb-3 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #D48898 0%, #B06080 100%)' }}
          >
            <span className="text-2xl text-white select-none" aria-hidden="true">✦</span>
          </div>
          <h2 className="text-xl font-bold text-center" style={{ color: 'var(--text-primary)' }}>
            Añade MANIFIESTA a tu pantalla de inicio
          </h2>
          <p className="text-sm text-center mt-1.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {already
              ? '¡Ya la tienes instalada! La próxima vez ábrela desde tu pantalla de inicio.'
              : 'Ábrela como una app real — sin barra del navegador, directo a tu práctica.'}
          </p>
        </div>

        {!already && (
          os === 'ios' ? <PasosIOS />
          : os === 'android' ? <PasosAndroid />
          : <PasosOther />
        )}

        <button
          type="button" onClick={onClose}
          className="mt-6 w-full py-4 rounded-2xl font-semibold text-base [touch-action:manipulation]"
          style={{ background: 'var(--surface)', color: 'var(--text-primary)' }}
        >
          {already ? 'Perfecto ✦' : 'Lo hago luego'}
        </button>
      </motion.div>
    </>
  );
}

// ── Auto-prompt de primera vez (para AppShell) ────────────────────────────────
// Se muestra una sola vez, 3s después de que el usuario entra a la app
// y solo si no está en modo standalone ya.

export function InstalarAppAutoPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Solo si no está ya instalada y no se ha mostrado antes
    const KEY = 'manifiesta_install_prompt_shown';
    if (isStandalone()) return;
    if (localStorage.getItem(KEY)) return;
    const id = setTimeout(() => {
      setShow(true);
      localStorage.setItem(KEY, '1');
    }, 3_500);
    return () => clearTimeout(id);
  }, []);

  return (
    <AnimatePresence>
      {show && <InstalarAppSheet onClose={() => setShow(false)} />}
    </AnimatePresence>
  );
}

// ── Inline collapsible (para Perfil) ─────────────────────────────────────────

export function InstalarAppInline() {
  const [expanded, setExpanded] = useState(false);
  const [os, setOS] = useState<OS>('other');
  const [already, setAlready] = useState(false);

  useEffect(() => {
    setOS(detectOS());
    setAlready(isStandalone());
  }, []);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)' }}>
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center gap-3 px-4 py-4 [touch-action:manipulation]"
        aria-expanded={expanded}
      >
        <div
          className="flex size-9 items-center justify-center rounded-xl flex-shrink-0"
          style={{ background: 'color-mix(in oklab, var(--accent) 12%, transparent)' }}
        >
          <Download size={18} color="var(--accent)" strokeWidth={2} />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
            Añadir a pantalla de inicio
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            {already ? 'Ya instalada ✦' : 'Ábrir como app, sin navegador'}
          </p>
        </div>
        {expanded
          ? <ChevronUp size={16} color="var(--text-tertiary)" />
          : <ChevronDown size={16} color="var(--text-tertiary)" />}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-4 pb-5 pt-1">
              {already ? (
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  ¡MANIFIESTA ya está en tu pantalla de inicio! Ábrela desde ahí para la experiencia completa.
                </p>
              ) : os === 'ios' ? (
                <PasosIOS />
              ) : os === 'android' ? (
                <PasosAndroid />
              ) : (
                <PasosOther />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
