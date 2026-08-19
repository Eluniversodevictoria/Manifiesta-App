'use client';

// MANIFIESTA — Historial personal
// Fuente primaria: PracticeSnapshot (dia, fase, tema, familia, bloques)
// Fallback: checkIns legacy (pre-engine), scripts, reflexiones, cierres

import { useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { staggerContainer, staggerItemSmall } from '@/lib/motion-presets';
import {
  CheckCircle2, PenLine, MessageSquare, Sparkles, Star,
  ChevronRight, Zap, Leaf,
} from 'lucide-react';
import Link from 'next/link';
import { useManifestaciones } from '@/lib/ManifestacionesContext';
import {
  derivarHistorial,
  derivarResumen,
  agruparHistorial,
  type ActividadHistorial,
  type TipoActividad,
} from '@/lib/historial-utils';

const EASE = [0.16, 1, 0.3, 1] as const;

// ── Chip de fase — usa los tokens del sistema ────────────────────────────
// Apertura/Cierre → acento principal · Integrar/completar → success · resto → accent-2
type FaseVariant = 'accent' | 'accent-2' | 'success';

const FASE_VARIANT: Record<string, FaseVariant> = {
  Apertura:        'accent',
  Profundizar:     'accent-2',
  Recibir:         'accent-2',
  'Soltar-Actuar': 'accent-2',
  Integrar:        'success',
  Cierre:          'accent',
};

function getFaseStyle(fase: string): { bg: string; color: string } {
  const v = FASE_VARIANT[fase] ?? 'accent';
  if (v === 'success') return {
    bg: 'var(--success-bg)',
    color: 'var(--success)',
  };
  if (v === 'accent-2') return {
    bg: 'color-mix(in oklab, var(--accent-2) 20%, transparent)',
    color: 'var(--text-secondary)',
  };
  return {
    bg: 'var(--chip-bg)',
    color: 'var(--accent)',
  };
}

// ── Filtros ───────────────────────────────────────────────────────────────
type FiltroTipo = 'todo' | 'practica' | 'script' | 'reflexion' | 'manifestacion';

const FILTROS: { key: FiltroTipo; label: string }[] = [
  { key: 'todo',          label: 'Todo' },
  { key: 'practica',      label: 'Prácticas' },
  { key: 'script',        label: 'Scripting' },
  { key: 'reflexion',     label: 'Reflexiones' },
  { key: 'manifestacion', label: 'Manifestaciones' },
];

function tipoMatchFiltro(tipo: TipoActividad, filtro: FiltroTipo): boolean {
  if (filtro === 'todo') return true;
  if (filtro === 'practica') return tipo === 'practica' || tipo === 'practica_legacy';
  if (filtro === 'script') return tipo === 'script';
  if (filtro === 'reflexion') return tipo === 'reflexion';
  if (filtro === 'manifestacion') return tipo === 'manifestacion_creada' || tipo === 'manifestacion_cumplida';
  return true;
}

// ── Ícono por tipo de actividad ───────────────────────────────────────────
function IconActividad({ tipo }: { tipo: TipoActividad }) {
  if (tipo === 'practica' || tipo === 'practica_legacy') {
    return (
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-full"
        style={{ background: 'color-mix(in oklab, var(--accent) 12%, transparent)' }}
      >
        <CheckCircle2 size={16} color="var(--accent)" strokeWidth={1.8} />
      </div>
    );
  }
  if (tipo === 'script') {
    return (
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-full"
        style={{ background: 'color-mix(in oklab, var(--text-tertiary) 12%, transparent)' }}
      >
        <PenLine size={15} color="var(--text-secondary)" strokeWidth={1.8} />
      </div>
    );
  }
  if (tipo === 'reflexion') {
    return (
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-full"
        style={{ background: 'color-mix(in oklab, var(--text-tertiary) 12%, transparent)' }}
      >
        <MessageSquare size={15} color="var(--text-secondary)" strokeWidth={1.8} />
      </div>
    );
  }
  if (tipo === 'manifestacion_cumplida') {
    return (
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-full"
        style={{ background: 'color-mix(in oklab, var(--accent) 18%, transparent)' }}
      >
        <Star size={16} color="var(--accent)" fill="var(--accent)" strokeWidth={0} />
      </div>
    );
  }
  return (
    <div
      className="flex size-9 shrink-0 items-center justify-center rounded-full"
      style={{ background: 'color-mix(in oklab, var(--accent) 10%, transparent)' }}
    >
      <Sparkles size={15} color="var(--accent)" strokeWidth={1.8} />
    </div>
  );
}

// ── Item de actividad ─────────────────────────────────────────────────────
function ItemActividad({
  item,
  esUltimo,
}: {
  item: ActividadHistorial;
  esUltimo: boolean;
}) {
  const esMilestone =
    item.tipo === 'manifestacion_cumplida' || item.tipo === 'manifestacion_creada';
  const snap = item.snapshot;

  return (
    <motion.div
      variants={staggerItemSmall}
      className="flex gap-3"
    >
      <IconActividad tipo={item.tipo} />

      <div
        className={`flex-1 min-w-0 pb-4 ${esUltimo ? '' : 'border-b'}`}
        style={{ borderColor: 'color-mix(in oklab, var(--text-tertiary) 12%, transparent)' }}
      >
        {/* Fila título + fecha */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">

            {/* Chip de fase (solo para snapshots) */}
            {snap && (
              <div className="mb-1 flex items-center gap-1.5">
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold uppercase tracking-wide"
                  style={(() => { const s = getFaseStyle(snap.fase); return { background: s.bg, color: s.color }; })()}
                >
                  <Zap size={9} strokeWidth={2.5} aria-hidden="true" />
                  {snap.fase}
                </span>
                {snap.cycleNumber > 1 && (
                  <span
                    className="rounded-full px-2 py-1 text-xs font-bold"
                    style={{ background: 'color-mix(in oklab, var(--accent) 10%, transparent)', color: 'var(--accent)' }}
                  >
                    Ciclo {snap.cycleNumber}
                  </span>
                )}
              </div>
            )}

            {/* Título */}
            <p
              className={`leading-snug ${esMilestone ? 'text-base font-semibold' : 'text-sm font-medium'}`}
              style={{
                color: 'var(--text-primary)',
                fontFamily: esMilestone ? 'var(--font-display)' : 'inherit',
              }}
            >
              {item.titulo}
            </p>

            {/* Tema (desde snapshot) */}
            {snap && (
              <p className="mt-0.5 text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                {snap.tema}
              </p>
            )}

            {/* Descripción legacy o preview del snapshot */}
            {!snap && item.descripcion && (
              <p
                className="mt-0.5 text-sm leading-relaxed line-clamp-2"
                style={{
                  color: 'var(--text-secondary)',
                  fontStyle: item.tipo === 'reflexion' ? 'italic' : 'normal',
                }}
              >
                {item.descripcion}
              </p>
            )}

            {/* Preview de texto del bloque protagonista */}
            {snap?.previewText && (
              <p
                className="mt-1 text-[12px] leading-relaxed line-clamp-2 italic"
                style={{ color: 'var(--text-tertiary)' }}
              >
                "{snap.previewText}"
              </p>
            )}

            {/* Enlace a manifestación */}
            {item.manifestacionId && (
              <Link
                href={`/app/manifestaciones/${item.manifestacionId}`}
                className="mt-1.5 inline-flex items-center gap-1 text-[12px] font-medium [touch-action:manipulation]"
                style={{ color: 'var(--accent)' }}
              >
                {item.manifestacionEmoji && (
                  <span aria-hidden="true" className="text-xs">{item.manifestacionEmoji}</span>
                )}
                <span className="line-clamp-1 max-w-44">{item.manifestacionNombre}</span>
                <ChevronRight size={10} strokeWidth={2.5} />
              </Link>
            )}
          </div>

          {/* Fecha relativa */}
          <span
            className="shrink-0 text-xs mt-0.5"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {item.fechaDisplay}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Stat card del resumen ─────────────────────────────────────────────────
function StatCard({ valor, label }: { valor: number; label: string }) {
  return (
    <div
      className="flex flex-col gap-0.5 rounded-2xl px-4 py-3"
      style={{
        background: 'var(--surface)',
        border: '1px solid color-mix(in oklab, var(--text-tertiary) 14%, transparent)',
      }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="text-[24px] font-bold tracking-tight"
        style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
      >
        {valor}
      </motion.span>
      <span className="text-xs leading-tight" style={{ color: 'var(--text-tertiary)' }}>
        {label}
      </span>
    </div>
  );
}

// ── Página ────────────────────────────────────────────────────────────────
export default function HistorialPage() {
  const reduced = useReducedMotion();
  const { manifestaciones, snapshots } = useManifestaciones();
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>('todo');
  const [filtroManifId, setFiltroManifId] = useState<string | null>(null);

  const historialCompleto = useMemo(
    () => derivarHistorial(manifestaciones, snapshots),
    [manifestaciones, snapshots]
  );

  const resumen = useMemo(
    () => derivarResumen(manifestaciones, snapshots),
    [manifestaciones, snapshots]
  );

  const filtrado = useMemo(() => {
    let items = historialCompleto;
    if (filtroTipo !== 'todo') {
      items = items.filter((i) => tipoMatchFiltro(i.tipo, filtroTipo));
    }
    if (filtroManifId) {
      items = items.filter((i) => i.manifestacionId === filtroManifId);
    }
    return items;
  }, [historialCompleto, filtroTipo, filtroManifId]);

  const grupos = useMemo(() => agruparHistorial(filtrado), [filtrado]);

  const manifestacionesParaFiltro = manifestaciones.filter(
    (m) => m.estado === 'activo' || m.estado === 'manifestado'
  );

  return (
    <div className="flex min-h-dvh flex-col" style={{ background: 'var(--bg)' }}>

      {/* ── HEADER ── */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="px-5 pt-6 pb-4"
      >
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
        >
          Mi historial
        </h1>
        <p className="mt-0.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Tu camino dentro de MANIFIESTA
        </p>
      </motion.div>

      {/* ── RESUMEN ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.06, ease: EASE }}
        className="grid grid-cols-2 gap-2.5 px-5 pb-4"
      >
        <StatCard valor={resumen.diasConPracticaEsteMes} label="días con práctica este mes" />
        <StatCard valor={resumen.totalPracticas} label="prácticas completadas" />
        <StatCard valor={resumen.totalScripts} label="scripts escritos" />
        <StatCard valor={resumen.manifestacionesCumplidas} label="manifestaciones cumplidas" />
      </motion.div>

      {/* ── FILTROS DE TIPO ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.22, delay: 0.1 }}
        className="flex gap-2 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [-webkit-overflow-scrolling:touch]"
        role="group"
        aria-label="Filtrar actividad"
      >
        {FILTROS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => { setFiltroTipo(f.key); setFiltroManifId(null); }}
            className="flex shrink-0 h-8 items-center rounded-full border px-3 text-sm font-medium [touch-action:manipulation]"
            style={{
              background: filtroTipo === f.key ? 'var(--accent)' : 'var(--surface)',
              borderColor:
                filtroTipo === f.key
                  ? 'var(--accent)'
                  : 'color-mix(in oklab, var(--text-tertiary) 25%, transparent)',
              color: filtroTipo === f.key ? 'white' : 'var(--text-secondary)',
            }}
          >
            {f.label}
          </button>
        ))}
      </motion.div>

      {/* ── FILTRO POR MANIFESTACIÓN (solo si hay 2+) ── */}
      {manifestacionesParaFiltro.length > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.13 }}
          className="flex gap-2 overflow-x-auto px-5 pb-3 [scrollbar-width:none]"
          role="group"
          aria-label="Filtrar por manifestación"
        >
          <button
            type="button"
            onClick={() => setFiltroManifId(null)}
            className="flex shrink-0 h-7 items-center rounded-full border px-2.5 text-[12px] font-medium [touch-action:manipulation]"
            style={{
              background: !filtroManifId
                ? 'color-mix(in oklab, var(--accent) 10%, transparent)'
                : 'transparent',
              borderColor: 'color-mix(in oklab, var(--text-tertiary) 20%, transparent)',
              color: !filtroManifId ? 'var(--accent)' : 'var(--text-tertiary)',
            }}
          >
            Todas
          </button>
          {manifestacionesParaFiltro.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setFiltroManifId(filtroManifId === m.id ? null : m.id)}
              className="flex shrink-0 h-7 items-center gap-1 rounded-full border px-2.5 text-[12px] font-medium [touch-action:manipulation]"
              style={{
                background:
                  filtroManifId === m.id
                    ? 'color-mix(in oklab, var(--accent) 10%, transparent)'
                    : 'transparent',
                borderColor: 'color-mix(in oklab, var(--text-tertiary) 20%, transparent)',
                color: filtroManifId === m.id ? 'var(--accent)' : 'var(--text-tertiary)',
              }}
            >
              <span aria-hidden="true">{m.categoriaEmoji}</span>
              <span className="max-w-36 truncate">
                {m.deseo.length > 22 ? m.deseo.slice(0, 22) + '…' : m.deseo}
              </span>
            </button>
          ))}
        </motion.div>
      )}

      {/* ── TIMELINE ── */}
      <div className="flex-1 overflow-y-auto px-5 pb-32">
        <AnimatePresence mode="wait">
          {filtrado.length === 0 ? (
            <motion.div
              key="vacio"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-3 py-20 text-center"
            >
              <div
                className="flex size-14 items-center justify-center rounded-2xl"
                style={{ background: 'color-mix(in oklab, var(--accent) 10%, transparent)' }}
                aria-hidden="true"
              >
                <Leaf size={28} color="var(--accent)" strokeWidth={1.5} />
              </div>
              <p
                className="text-base font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                {filtroTipo === 'todo'
                  ? 'Tu historial está vacío'
                  : 'Sin actividad en esta categoría'}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                {filtroTipo === 'todo'
                  ? 'Completa tu primera práctica y aparecerá aquí.'
                  : 'Prueba el filtro "Todo" para ver toda tu actividad.'}
              </p>
              {filtroTipo !== 'todo' && (
                <button
                  type="button"
                  onClick={() => { setFiltroTipo('todo'); setFiltroManifId(null); }}
                  className="mt-2 text-sm font-medium [touch-action:manipulation]"
                  style={{ color: 'var(--accent)' }}
                >
                  Ver todo
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="contenido"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              {grupos.map((grupo, gi) => (
                <motion.section
                  key={grupo.label}
                  initial={reduced ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.26, delay: gi * 0.06, ease: EASE }}
                >
                  <h2
                    className="mb-3 text-[12px] font-semibold uppercase tracking-[0.05em]"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {grupo.label}
                  </h2>
                  <motion.div
                    className="flex flex-col"
                    variants={staggerContainer(0.045, 0)}
                    initial={reduced ? false : 'hidden'}
                    animate="show"
                  >
                    {grupo.actividades.map((item, ii) => (
                      <ItemActividad
                        key={item.id}
                        item={item}
                        esUltimo={ii === grupo.actividades.length - 1}
                      />
                    ))}
                  </motion.div>
                </motion.section>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
