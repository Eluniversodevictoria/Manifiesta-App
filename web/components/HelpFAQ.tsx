'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, X, ChevronDown, ChevronUp } from 'lucide-react';

const FAQS = [
  {
    q: '¿Cómo funciona la práctica diaria?',
    a: 'Cada día Victoria te prepara una práctica personalizada según el deseo que estás manifestando. Incluye una afirmación, una visualización, scripting y una acción concreta. Solo tienes que leerla o escucharla, y al terminar presionar "Lo hice hoy" para registrar tu racha.',
  },
  {
    q: '¿Puedo tener más de un deseo activo?',
    a: 'Con el plan gratuito puedes guardar hasta 3 deseos. Con Pro puedes tener todos los que quieras. La práctica diaria se genera para el deseo que tengas marcado como activo — puedes cambiarlo en cualquier momento desde la pantalla de Inicio.',
  },
  {
    q: '¿Qué pasa si me salto un día?',
    a: 'No hay problema. Tu racha se reinicia, pero todo tu historial y tus manifestaciones se conservan. La práctica de hoy siempre te estará esperando cuando estés lista para volver.',
  },
  {
    q: '¿Cómo marco una manifestación como cumplida?',
    a: 'Entra a la manifestación desde la pantalla "Mis deseos", desliza hacia abajo hasta encontrar el botón "Se manifestó ✨" y confírmalo. Se moverá a tu lista de manifestaciones cumplidas como un registro de todo lo que has atraído.',
  },
  {
    q: '¿Qué incluye el plan Pro?',
    a: 'Deseos ilimitados, prácticas diarias ilimitadas, el botón "Necesito manifestar ahora" para situaciones urgentes, acceso completo a la biblioteca de rituales, decretos y afirmaciones, historial ilimitado y journaling vinculado a cada manifestación.',
  },
  {
    q: '¿Puedo cancelar mi suscripción en cualquier momento?',
    a: 'Sí. Puedes cancelar desde tu cuenta en Hotmart cuando quieras. Seguirás teniendo acceso hasta que termine el período que pagaste y no se te cobrará de nuevo.',
  },
  {
    q: '¿Cómo activo las notificaciones para recordar mi práctica?',
    a: 'Ve a tu Perfil y busca la opción "Activar notificaciones". Si usas la app desde el celular, primero instálala en tu pantalla de inicio (en Safari: botón de compartir → "Agregar a pantalla de inicio") y luego actívalas desde Perfil.',
  },
  {
    q: '¿Mis datos están seguros?',
    a: 'Sí. Tu información está guardada de forma segura con Supabase, que cumple estándares internacionales de seguridad. Solo tú puedes ver tus manifestaciones y tu historial. Si alguna vez quieres eliminar tu cuenta, escríbenos desde Perfil → "Eliminar mi cuenta".',
  },
];

export function HelpFAQ() {
  const [abierto, setAbierto] = useState(false);
  const [expandido, setExpandido] = useState<number | null>(null);

  return (
    <>
      {/* ── Botón flotante ── */}
      <motion.button
        type="button"
        aria-label="Ayuda"
        onClick={() => setAbierto(true)}
        whileTap={{ scale: 0.92 }}
        className="fixed right-4 z-40 flex size-11 items-center justify-center rounded-full shadow-lg [touch-action:manipulation]"
        style={{
          bottom: 'calc(76px + env(safe-area-inset-bottom))',
          background: 'var(--surface)',
          border: '1.5px solid color-mix(in oklab, var(--accent) 25%, transparent)',
        }}
      >
        <HelpCircle size={20} color="var(--accent)" strokeWidth={1.8} />
      </motion.button>

      {/* ── Panel ── */}
      <AnimatePresence>
        {abierto && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50"
              style={{ background: 'rgba(34,20,26,0.45)' }}
              onClick={() => setAbierto(false)}
              aria-hidden="true"
            />

            {/* Sheet */}
            <motion.div
              key="sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 38 }}
              className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-[28px]"
              style={{
                background: 'var(--bg)',
                maxHeight: '88dvh',
                paddingBottom: 'env(safe-area-inset-bottom)',
              }}
              role="dialog"
              aria-label="Preguntas frecuentes"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="h-1 w-10 rounded-full" style={{ background: 'var(--surface-2)' }} />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3">
                <p className="text-base font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                  Preguntas frecuentes
                </p>
                <button
                  type="button"
                  onClick={() => setAbierto(false)}
                  aria-label="Cerrar"
                  className="flex size-8 items-center justify-center rounded-full [touch-action:manipulation]"
                  style={{ background: 'var(--surface)' }}
                >
                  <X size={16} color="var(--text-secondary)" strokeWidth={2} />
                </button>
              </div>

              {/* Lista de preguntas */}
              <div className="overflow-y-auto px-5 pb-6">
                <div className="flex flex-col divide-y" style={{ borderColor: 'color-mix(in oklab, var(--text-tertiary) 15%, transparent)' }}>
                  {FAQS.map((faq, i) => (
                    <div key={i}>
                      <button
                        type="button"
                        onClick={() => setExpandido(expandido === i ? null : i)}
                        className="flex w-full items-center justify-between gap-3 py-4 text-left [touch-action:manipulation]"
                      >
                        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          {faq.q}
                        </span>
                        {expandido === i
                          ? <ChevronUp size={16} color="var(--accent)" strokeWidth={2} className="shrink-0" />
                          : <ChevronDown size={16} color="var(--text-tertiary)" strokeWidth={2} className="shrink-0" />
                        }
                      </button>
                      <AnimatePresence initial={false}>
                        {expandido === i && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: [0.25, 0, 0.35, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="pb-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                              {faq.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
