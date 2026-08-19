'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Plus, ChevronRight, Sparkles, ChevronDown, Lock,
  Star, Heart, Leaf, Banknote, Briefcase, Home, Plane, Gift,
  type LucideIcon,
} from 'lucide-react';
import { useManifestaciones } from '@/lib/ManifestacionesContext';
import { staggerContainer, staggerItem, TAP_CARD } from '@/lib/motion-presets';
import { CATEGORIAS_MANIFESTACIONES } from '@/lib/categorias';
import type { Manifestacion } from '@/lib/manifestaciones-types';
import { usePlan } from '@/lib/PlanContext';

const EASE = [0.16, 1, 0.3, 1] as const;

// Iconos SVG por categoría (sin emojis)
const ICONO_CAT: Record<string, LucideIcon> = {
  Dinero: Banknote, Amor: Heart, Salud: Leaf, Propósito: Star,
  Trabajo: Briefcase, Hogar: Home, Viajes: Plane, Otro: Gift,
};

// Porcentaje de días completados en el ciclo actual
function progresoCiclo(completedDays: number[]): number {
  return Math.round((completedDays.length / 30) * 100);
}

// Número héroe animado — respeta prefers-reduced-motion via prop
function AnimatedPct({ value, reduced }: { value: number; reduced: boolean }) {
  const [display, setDisplay] = useState(reduced ? value : 0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) { setDisplay(value); return; }
    const start = performance.now();
    const duration = 700;
    const from = 0;
    const to = value;
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setDisplay(Math.round(from + (to - from) * ease));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value, reduced]);

  return <span className="tabular-nums">{display}%</span>;
}

// ── Card principal (manifestación activa destacada) ───────────────────────
function CardPrincipal({ item, getProgress, index, reduced }: {
  item: Manifestacion;
  getProgress: (id: string) => { currentDay: number; completedDays: number[]; cycleComplete: boolean };
  index: number;
  reduced: boolean;
}) {
  const router = useRouter();
  const prog = getProgress(item.id);
  const pct = progresoCiclo(prog.completedDays);
  const IcoA = ICONO_CAT[item.categoria] ?? Star;

  return (
    <motion.button
      layout
      type="button"
      onClick={() => router.push(`/app/manifestaciones/${item.id}`)}
      whileTap={{ scale: 0.985 }}
      className="flex w-full flex-col rounded-[var(--radius-card)] p-5 text-left [touch-action:manipulation]"
      style={{
        background: 'var(--surface-rose)',
        border: '1px solid color-mix(in oklab, var(--accent) 18%, transparent)',
        boxShadow: 'var(--shadow-1)',
      }}
    >
      {/* Fila superior: ícono + texto + chevron */}
      <div className="flex w-full items-start gap-3">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-xl"
          style={{ background: 'var(--chip-bg)' }}
          aria-hidden="true"
        >
          <IcoA size={18} color="var(--accent)" strokeWidth={1.8} />
        </span>
        <div className="flex-1 min-w-0">
          <p
            className="text-base font-semibold leading-snug"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            {item.deseo}
          </p>
          {item.descripcion ? (
            <p className="mt-0.5 line-clamp-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
              {item.descripcion}
            </p>
          ) : null}
        </div>
        <ChevronRight size={16} color="var(--text-tertiary)" className="mt-0.5 shrink-0" aria-hidden="true" />
      </div>

      {/* Barra de progreso */}
      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            {prog.cycleComplete ? 'Ciclo completado' : `Día ${prog.currentDay} de 30`}
          </span>
          <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
            <AnimatedPct value={pct} reduced={reduced} />
          </span>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full"
          style={{ background: 'color-mix(in oklab, var(--accent) 14%, transparent)' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--accent)' }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: EASE }}
          />
        </div>
      </div>
    </motion.button>
  );
}

// ── Card secundaria (otras activas) ──────────────────────────────────────
function CardActiva({ item, getProgress, index, reduced }: {
  item: Manifestacion;
  getProgress: (id: string) => { currentDay: number; completedDays: number[]; cycleComplete: boolean };
  index: number;
  reduced: boolean;
}) {
  const router = useRouter();
  const prog = getProgress(item.id);
  const pct = progresoCiclo(prog.completedDays);
  const IcoA = ICONO_CAT[item.categoria] ?? Star;

  return (
    <motion.button
      layout
      type="button"
      onClick={() => router.push(`/app/manifestaciones/${item.id}`)}
      whileTap={{ scale: 0.98 }}
      className="flex w-full items-center gap-3 rounded-[var(--radius-card)] p-4 text-left [touch-action:manipulation]"
      style={{
        background: 'var(--surface)',
        border: '1px solid color-mix(in oklab, var(--text-tertiary) 16%, transparent)',
      }}
    >
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-xl"
        style={{ background: 'var(--chip-bg)' }}
        aria-hidden="true"
      >
        <IcoA size={16} color="var(--accent)" strokeWidth={1.8} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
          {item.deseo}
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          <div
            className="h-1 flex-1 overflow-hidden rounded-full"
            style={{ background: 'color-mix(in oklab, var(--accent) 14%, transparent)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'var(--accent)' }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.7, ease: EASE }}
            />
          </div>
          <span className="shrink-0 text-xs" style={{ color: 'var(--text-tertiary)' }}>
            <AnimatedPct value={pct} reduced={reduced} />
          </span>
        </div>
      </div>
      <ChevronRight size={15} color="var(--text-tertiary)" className="shrink-0" aria-hidden="true" />
    </motion.button>
  );
}

// ── Card manifestado (logro emocional) ───────────────────────────────────
function CardManifestado({ item }: { item: Manifestacion }) {
  const router = useRouter();
  const IcoA = ICONO_CAT[item.categoria] ?? Star;

  return (
    <motion.button
      layout
      type="button"
      onClick={() => router.push(`/app/manifestaciones/${item.id}`)}
      whileTap={{ scale: 0.98 }}
      className="flex w-full items-center gap-3 rounded-[var(--radius-card)] px-4 py-3.5 text-left [touch-action:manipulation]"
      style={{
        background: 'var(--success-bg)',
        border: '1px solid var(--success-border)',
      }}
    >
      {/* Estrella de logro */}
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-xl"
        style={{ background: 'color-mix(in oklab, var(--success) 12%, transparent)' }}
        aria-hidden="true"
      >
        <IcoA size={14} color="var(--success)" strokeWidth={1.8} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          {item.deseo}
        </p>
        {item.cierre?.fechaOcurrencia && (
          <p className="text-xs" style={{ color: 'var(--success)' }}>
            Manifestado · {item.cierre.fechaOcurrencia}
          </p>
        )}
      </div>
      <span
        className="flex size-6 shrink-0 items-center justify-center"
        aria-hidden="true"
      >
        <Sparkles size={14} color="var(--success)" strokeWidth={1.8} />
      </span>
    </motion.button>
  );
}

// ── Pantalla ──────────────────────────────────────────────────────────────
export default function ManifestacionesPage() {
  const { manifestaciones, add, getProgress } = useManifestaciones();
  const prefersReduced = useReducedMotion() ?? false;
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nuevoDeseo, setNuevoDeseo] = useState('');
  const [categoriaSelId, setCategoriaSelId] = useState<string>('Dinero');
  const [mostrarCats, setMostrarCats] = useState(false);

  const activos   = manifestaciones.filter((m) => m.estado === 'activo');
  const manifestados = manifestaciones.filter((m) => m.estado === 'manifestado');

  const catSel = CATEGORIAS_MANIFESTACIONES.find((c) => c.id === categoriaSelId) ?? CATEGORIAS_MANIFESTACIONES[0];

  const handleAgregar = () => {
    setMostrarForm(true);
  };

  const agregarDeseo = () => {
    if (!nuevoDeseo.trim()) return;
    add({
      deseo: nuevoDeseo.trim(),
      categoria: catSel.id,
      categoriaEmoji: catSel.emoji,
      descripcion: '',
      fechaInicio: new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }),
      estado: 'activo',
      ultimoCheckIn: 'Hoy',
    });
    setNuevoDeseo('');
    setCategoriaSelId('Dinero');
    setMostrarCats(false);
    setMostrarForm(false);
  };

  // Primera activa = protagonista; las demás = lista secundaria
  const [principal, ...secundarias] = activos;

  return (
    <>
    <div className="flex min-h-dvh flex-col pb-28">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="px-5 pt-6 pb-4"
      >
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
        >
          Mis deseos
        </h1>
        <p className="mt-0.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Lo que estás atrayendo a tu vida
        </p>
      </motion.div>

      <div className="flex flex-col gap-6 px-5">

        {/* ── EMPTY STATE ─────────────────────────────────────────────── */}
        {manifestaciones.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="flex flex-col items-center gap-4 rounded-[var(--radius-card)] py-14 text-center"
            style={{ background: 'var(--surface)' }}
          >
            <span
              className="flex size-14 items-center justify-center rounded-full"
              style={{ background: 'var(--chip-bg)' }}
              aria-hidden="true"
            >
              <Sparkles size={24} color="var(--accent)" strokeWidth={1.5} />
            </span>
            <div>
              <p className="text-base font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                Tu lista está en blanco
              </p>
              <p className="mt-1 px-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Escribe tu primer deseo y Victoria prepara tu práctica.
              </p>
            </div>
          </motion.div>
        )}

        {/* ── ACTIVAS ─────────────────────────────────────────────────── */}
        {activos.length > 0 && (
          <div className="flex flex-col gap-3">
            {/* Kicker de sección */}
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25, delay: 0.04, ease: EASE }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                Atrayendo ahora
              </p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                {activos.length} activos
              </p>
            </motion.div>

            {/* Cards con stagger orquestado */}
            <motion.div
              variants={staggerContainer(0.07, 0.05)}
              initial={prefersReduced ? false : 'hidden'}
              animate="show"
              className="flex flex-col gap-3"
            >
              {principal && (
                <motion.div variants={prefersReduced ? {} : staggerItem}>
                  <CardPrincipal item={principal} getProgress={getProgress} index={0} reduced={prefersReduced} />
                </motion.div>
              )}
              {secundarias.map(m => (
                <motion.div key={m.id} variants={prefersReduced ? {} : staggerItem}>
                  <CardActiva item={m} getProgress={getProgress} index={1} reduced={prefersReduced} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* ── AÑADIR NUEVO ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.12, ease: EASE }}
        >
          <AnimatePresence mode="wait">
            {!mostrarForm ? (
              <motion.button
                  key="btn"
                  type="button"
                  onClick={handleAgregar}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex w-full items-center gap-2 rounded-[var(--radius-card)] px-4 py-3.5 [touch-action:manipulation]"
                  style={{
                    background: 'var(--surface)',
                    border: '1px dashed color-mix(in oklab, var(--accent) 30%, transparent)',
                  }}
                >
                  <span
                    className="flex size-7 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: 'color-mix(in oklab, var(--accent) 10%, transparent)' }}
                    aria-hidden="true"
                  >
                    <Plus size={14} color="var(--accent)" strokeWidth={2.5} />
                  </span>
                  <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
                    Agregar nuevo deseo
                  </span>
                </motion.button>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="rounded-[var(--radius-card)] p-4"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid color-mix(in oklab, var(--accent) 25%, transparent)',
                }}
              >
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                  ¿Qué quieres atraer?
                </p>
                <input
                  type="text"
                  value={nuevoDeseo}
                  onChange={(e) => setNuevoDeseo(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && agregarDeseo()}
                  placeholder="Ej. Un viaje a Europa este año…"
                  className="mb-3 w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                  style={{
                    background: 'var(--bg)',
                    color: 'var(--text-primary)',
                    border: '1px solid color-mix(in oklab, var(--text-tertiary) 22%, transparent)',
                  }}
                  autoFocus
                />

                {/* Selector de categoría */}
                <div className="relative mb-3">
                  <button
                    type="button"
                    onClick={() => setMostrarCats((v) => !v)}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm [touch-action:manipulation]"
                    style={{
                      background: 'var(--bg)',
                      color: 'var(--text-primary)',
                      border: '1px solid color-mix(in oklab, var(--text-tertiary) 22%, transparent)',
                    }}
                  >
                    <span aria-hidden="true">{catSel.emoji}</span>
                    <span className="flex-1 text-left font-medium">{catSel.label}</span>
                    <ChevronDown
                      size={14}
                      color="var(--text-tertiary)"
                      style={{ transform: mostrarCats ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }}
                    />
                  </button>
                  <AnimatePresence>
                    {mostrarCats && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 right-0 z-10 mt-1 overflow-hidden rounded-xl"
                        style={{
                          background: 'var(--surface)',
                          border: '1px solid color-mix(in oklab, var(--text-tertiary) 20%, transparent)',
                          boxShadow: 'var(--shadow-2)',
                        }}
                      >
                        {CATEGORIAS_MANIFESTACIONES.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => { setCategoriaSelId(c.id); setMostrarCats(false); }}
                            className="flex w-full items-center gap-2 px-3 py-2.5 text-sm [touch-action:manipulation]"
                            style={{
                              color: c.id === categoriaSelId ? 'var(--accent)' : 'var(--text-primary)',
                              background: c.id === categoriaSelId ? 'color-mix(in oklab, var(--accent) 8%, transparent)' : 'transparent',
                            }}
                          >
                            <span aria-hidden="true">{c.emoji}</span>
                            <span className="font-medium">{c.label}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setMostrarForm(false); setNuevoDeseo(''); }}
                    className="flex-1 rounded-xl py-2.5 text-xs font-medium [touch-action:manipulation]"
                    style={{ background: 'var(--bg)', color: 'var(--text-secondary)' }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={agregarDeseo}
                    disabled={!nuevoDeseo.trim()}
                    className="flex-1 rounded-xl py-2.5 text-xs font-semibold text-white [touch-action:manipulation] disabled:opacity-40"
                    style={{ background: 'var(--accent)' }}
                  >
                    Agregar
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── MANIFESTADOS ─────────────────────────────────────────────── */}
        {manifestados.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.18 }}
            className="flex flex-col gap-3"
          >
            {/* Separador de sección */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1" style={{ background: 'color-mix(in oklab, var(--text-tertiary) 16%, transparent)' }} />
              <span className="flex items-center gap-1.5">
                <Sparkles size={11} color="var(--success)" strokeWidth={2} aria-hidden="true" />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                  Se manifestó
                </span>
                <Sparkles size={11} color="var(--success)" strokeWidth={2} aria-hidden="true" />
              </span>
              <div className="h-px flex-1" style={{ background: 'color-mix(in oklab, var(--text-tertiary) 16%, transparent)' }} />
            </div>

            {manifestados.map((m) => (
              <CardManifestado key={m.id} item={m} />
            ))}
          </motion.div>
        )}

      </div>
    </div>

    </>
  );
}
