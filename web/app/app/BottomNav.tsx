'use client';

// BottomNav — 5 tabs con botón ✦ central elevado
// Inicio · Manifestaciones · ✦ · Biblioteca · Perfil

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Heart, BookOpen, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useSheetUrgente } from '@/lib/SheetUrgenteContext';

const TABS_IZQ = [
  { href: '/app',                  label: 'Inicio',         Icon: Sparkles },
  { href: '/app/manifestaciones',  label: 'Manif.',         Icon: Heart    },
] as const;

const TABS_DER = [
  { href: '/app/biblioteca',       label: 'Biblioteca',     Icon: BookOpen },
  { href: '/app/perfil',           label: 'Perfil',         Icon: User     },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const { abrir } = useSheetUrgente();

  const esActivo = (href: string) => {
    if (href === '/app') return pathname === '/app';
    if (href === '/app/perfil') return pathname.startsWith('/app/perfil') || pathname.startsWith('/app/historial');
    return pathname.startsWith(href);
  };

  return (
    <>
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center border-t px-1"
      style={{
        background: 'var(--surface)',
        borderColor: 'color-mix(in oklab, var(--text-tertiary) 18%, transparent)',
        height: '64px',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* Tabs izquierda */}
      {TABS_IZQ.map(({ href, label, Icon }) => {
        const activo = esActivo(href);
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            aria-current={activo ? 'page' : undefined}
            className="flex flex-1 flex-col items-center justify-center gap-1 py-2 [touch-action:manipulation]"
          >
            <motion.span
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="flex size-9 items-center justify-center rounded-xl transition-colors duration-150"
              style={{ background: activo ? 'color-mix(in oklab, var(--accent) 12%, transparent)' : 'transparent' }}
            >
              <Icon size={20} strokeWidth={activo ? 2 : 1.6} color={activo ? 'var(--accent)' : 'var(--text-tertiary)'} />
            </motion.span>
            <span className="text-xs font-medium leading-none" style={{ color: activo ? 'var(--accent)' : 'var(--text-tertiary)' }}>
              {label}
            </span>
          </Link>
        );
      })}

      {/* Botón central ✦ */}
      <div className="flex flex-1 items-center justify-center">
        <motion.button
          type="button"
          onClick={abrir}
          aria-label="Manifestar ahora"
          whileTap={{ scale: 0.93 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          className="flex size-14 -translate-y-3 items-center justify-center rounded-full shadow-lg [touch-action:manipulation]"
          style={{
            background: 'var(--accent)',
            boxShadow: '0 6px 24px color-mix(in oklab, var(--accent) 35%, transparent)',
          }}
        >
          <span className="text-xl leading-none text-white select-none" aria-hidden="true">✦</span>
        </motion.button>
      </div>

      {/* Tabs derecha */}
      {TABS_DER.map(({ href, label, Icon }) => {
        const activo = esActivo(href);
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            aria-current={activo ? 'page' : undefined}
            data-tour={href === '/app/biblioteca' ? 'biblioteca' : undefined}
            className="flex flex-1 flex-col items-center justify-center gap-1 py-2 [touch-action:manipulation]"
          >
            <motion.span
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="flex size-9 items-center justify-center rounded-xl transition-colors duration-150"
              style={{ background: activo ? 'color-mix(in oklab, var(--accent) 12%, transparent)' : 'transparent' }}
            >
              <Icon size={20} strokeWidth={activo ? 2 : 1.6} color={activo ? 'var(--accent)' : 'var(--text-tertiary)'} />
            </motion.span>
            <span className="text-xs font-medium leading-none" style={{ color: activo ? 'var(--accent)' : 'var(--text-tertiary)' }}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
    </>
  );
}
