'use client';

// RuletaFAB — botón flotante de la Ruleta de Premios.
// Visible solo cuando hay un giro disponible (no se ha usado en las últimas 24h).
// Se oculta tras el giro y reaparece cuando el cooldown termina.

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Gift } from 'lucide-react';

export function RuletaFAB() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const check = useCallback(async () => {
    // No mostrar si ya estamos en la página de ruleta
    if (pathname.startsWith('/app/ruleta')) {
      setVisible(false);
      return;
    }
    try {
      const res = await fetch('/api/ruleta/historial');
      if (!res.ok) return;
      const data = await res.json();
      setVisible(!data.blocked);
    } catch {
      // Sin conexión — no mostrar
    }
  }, [pathname]);

  useEffect(() => {
    check();
    // Re-verificar cuando el usuario vuelve a la pestaña
    const onVisible = () => { if (document.visibilityState === 'visible') check(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [check]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          key="ruleta-fab"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', damping: 18, stiffness: 320 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => router.push('/app/ruleta')}
          aria-label="Girar la ruleta de premios"
          className="fixed z-40 flex flex-col items-center gap-1 [touch-action:manipulation]"
          style={{
            right: '16px',
            bottom: 'calc(80px + env(safe-area-inset-bottom))',
          }}
        >
          {/* Etiqueta */}
          <motion.span
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: 'color-mix(in oklab, var(--accent) 12%, transparent)',
              color: 'var(--accent)',
              border: '1px solid color-mix(in oklab, var(--accent) 25%, transparent)',
            }}
          >
            ¡Gira hoy!
          </motion.span>

          {/* Botón circular */}
          <motion.div
            animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', repeatDelay: 2 }}
            className="flex size-14 items-center justify-center rounded-full shadow-lg"
            style={{
              background: 'linear-gradient(135deg, var(--accent) 0%, color-mix(in oklab, var(--accent) 70%, var(--accent-2, var(--accent))) 100%)',
              boxShadow: '0 4px 20px color-mix(in oklab, var(--accent) 45%, transparent)',
            }}
          >
            <Gift size={24} color="white" strokeWidth={1.8} />
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
