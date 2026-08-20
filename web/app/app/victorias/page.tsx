'use client';

import { useManifestaciones } from '@/lib/ManifestacionesContext';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Sparkles, Star, ArrowLeft, Trophy, Heart, Leaf, Banknote, Briefcase, Home, Plane, Gift, type LucideIcon } from 'lucide-react';

const ICONO_CAT: Record<string, LucideIcon> = {
  Dinero: Banknote, Amor: Heart, Salud: Leaf, Propósito: Star,
  Trabajo: Briefcase, Hogar: Home, Viajes: Plane, Otro: Gift,
};

const FRASES = [
  'Lo que pides, el universo lo escucha.',
  'Cada victoria es prueba de que funciona.',
  'Tu fe lo trajo hasta aquí.',
  'El universo siempre dice sí.',
  'Ya lo lograste una vez. Lo lograrás de nuevo.',
];

export default function VictoriasPage() {
  const { manifestaciones } = useManifestaciones();
  const router = useRouter();

  const manifestadas = manifestaciones.filter((m) => m.estado === 'manifestado');
  const frase = FRASES[manifestadas.length % FRASES.length];

  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ background: 'var(--bg)' }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-20 flex items-center gap-3 px-4 py-4"
        style={{ background: 'var(--bg)', borderBottom: '1px solid color-mix(in oklab, var(--text-tertiary) 12%, transparent)' }}
      >
        <button
          onClick={() => router.back()}
          className="flex size-9 items-center justify-center rounded-xl"
          style={{ background: 'var(--surface)' }}
          aria-label="Volver"
        >
          <ArrowLeft size={18} color="var(--text-secondary)" />
        </button>
        <h1 className="flex-1 text-base font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
          Mis victorias
        </h1>
        {manifestadas.length > 0 && (
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold"
            style={{ background: 'color-mix(in oklab, var(--success) 12%, transparent)', color: 'var(--success)' }}
          >
            {manifestadas.length} {manifestadas.length === 1 ? 'logro' : 'logros'}
          </span>
        )}
      </div>

      <div className="flex-1 px-4 py-6 pb-28 flex flex-col gap-6">

        {/* Hero vacío */}
        {manifestadas.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center gap-4 pt-16 text-center"
          >
            <span
              className="flex size-20 items-center justify-center rounded-3xl"
              style={{ background: 'color-mix(in oklab, var(--accent) 10%, transparent)' }}
            >
              <Trophy size={36} color="var(--accent)" strokeWidth={1.5} />
            </span>
            <div>
              <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                Aquí vivirán tus victorias
              </p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Cuando marques un deseo como&nbsp;<em>"Se manifestó ✨"</em>, aparecerá aquí — para recordarte siempre que funciona.
              </p>
            </div>
            <button
              onClick={() => router.push('/app/manifestaciones')}
              className="mt-2 rounded-full px-6 py-3 text-sm font-semibold"
              style={{ background: 'var(--accent)', color: 'white' }}
            >
              Ver mis manifestaciones
            </button>
          </motion.div>
        )}

        {/* Frase inspiradora */}
        {manifestadas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl p-5 text-center"
            style={{
              background: `radial-gradient(ellipse 90% 80% at 50% 0%, var(--accent-2) 0%, transparent 70%), var(--surface)`,
              border: '1px solid color-mix(in oklab, var(--accent) 20%, transparent)',
            }}
          >
            <span style={{ color: 'var(--accent)', fontSize: 20 }} aria-hidden="true">✦</span>
            <p className="mt-2 text-sm font-medium italic leading-relaxed" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-display)' }}>
              &ldquo;{frase}&rdquo;
            </p>
            <p className="mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>— Victoria</p>
          </motion.div>
        )}

        {/* Grid de victorias */}
        {manifestadas.length > 0 && (
          <div className="flex flex-col gap-3">
            {manifestadas.map((m, i) => {
              const IcoA = ICONO_CAT[m.categoria] ?? Star;
              return (
                <motion.button
                  key={m.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                  onClick={() => router.push(`/app/manifestaciones/${m.id}`)}
                  className="w-full rounded-2xl p-4 text-left"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid color-mix(in oklab, var(--success) 25%, transparent)',
                    boxShadow: '0 2px 12px color-mix(in oklab, var(--success) 8%, transparent)',
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Icono categoría */}
                    <span
                      className="flex size-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: 'color-mix(in oklab, var(--success) 12%, transparent)' }}
                    >
                      <IcoA size={18} color="var(--success)" strokeWidth={1.8} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>
                        {m.deseo}
                      </p>
                      {m.cierre?.fechaOcurrencia && (
                        <p className="mt-0.5 text-xs" style={{ color: 'var(--success)' }}>
                          ✨ Manifestado · {m.cierre.fechaOcurrencia}
                        </p>
                      )}
                      {m.cierre?.comoLlego && (
                        <p className="mt-1.5 text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                          &ldquo;{m.cierre.comoLlego}&rdquo;
                        </p>
                      )}
                    </div>
                    <Sparkles size={16} color="var(--success)" strokeWidth={1.8} className="shrink-0 mt-0.5" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Invitación a seguir manifestando */}
        {manifestadas.length > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => router.push('/app/manifestaciones')}
            className="w-full rounded-2xl py-4 text-sm font-semibold"
            style={{
              background: 'color-mix(in oklab, var(--accent) 8%, transparent)',
              border: '1.5px dashed color-mix(in oklab, var(--accent) 30%, transparent)',
              color: 'var(--accent)',
            }}
          >
            + Agregar nuevo deseo
          </motion.button>
        )}
      </div>
    </div>
  );
}
