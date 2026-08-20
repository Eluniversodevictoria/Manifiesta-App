'use client';

// MANIFIESTA — Biblioteca
// Catálogo navegable con búsqueda, filtros, editorial, "Necesito manifestar..." con IA

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { staggerContainer, staggerItem } from '@/lib/motion-presets';
import { Search, X, Bookmark, BookmarkCheck, Play, Clock, Flame, Sparkles, FileText, Eye, PenLine, Hash, BookOpen, Heart, Flower2, Wand2, ChevronRight, RefreshCw } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { RespuestaManifestacion } from '@/lib/biblioteca-ai';
import {
  CATALOGO,
  buscar,
  getByTipo,
  getDestacadoDelDia,
  TIPO_LABEL,
  type ContenidoBiblioteca,
  type TipoContenido,
} from '@/lib/biblioteca-types';
import { useBiblioteca } from '@/lib/useBiblioteca';

const EASE = [0.16, 1, 0.3, 1] as const;

// ── Filtros de tipo ───────────────────────────────────────────────────────
const FILTROS: { tipo: TipoContenido; label: string; icon: LucideIcon }[] = [
  { tipo: 'ritual',          label: 'Rituales',        icon: Flame    },
  { tipo: 'afirmacion',      label: 'Afirmaciones',    icon: Sparkles },
  { tipo: 'decreto',         label: 'Decretos',        icon: FileText },
  { tipo: 'visualizacion',   label: 'Visualizaciones', icon: Eye      },
  { tipo: 'journaling',      label: 'Journaling',      icon: BookOpen },
  { tipo: 'gratitud',        label: 'Gratitud',        icon: Heart    },
  { tipo: 'scripting-guiado',label: 'Scripting',       icon: PenLine  },
  { tipo: 'autoestima',      label: 'Autoestima',      icon: Flower2  },
  { tipo: 'senal',           label: 'Señales',         icon: Hash     },
];

const TIPO_ICON: Record<TipoContenido, LucideIcon> = Object.fromEntries(
  FILTROS.map((f) => [f.tipo, f.icon])
) as Record<TipoContenido, LucideIcon>;

// ── ManifestadorIA — banner interactivo "Necesito manifestar..." ─────────────
type EstadoManifestador = 'idle' | 'expandido' | 'cargando' | 'resultado';

function ManifestadorIA({
  recientes,
  onTapSugerencia,
}: {
  recientes: string[];
  onTapSugerencia: (id: string) => void;
}) {
  const [estado, setEstado] = useState<EstadoManifestador>('idle');
  const [tema, setTema] = useState('');
  const [resultado, setResultado] = useState<RespuestaManifestacion | null>(null);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const abrir = () => {
    setEstado('expandido');
    setTimeout(() => inputRef.current?.focus(), 120);
  };

  const cerrar = () => {
    setEstado('idle');
    setTema('');
    setResultado(null);
    setError(false);
  };

  const buscar = async () => {
    if (tema.trim().length < 3) return;
    setEstado('cargando');
    setError(false);
    try {
      const res = await fetch('/api/manifestar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tema: tema.trim(),
          recientesIds: recientes,
        }),
      });
      if (!res.ok) throw new Error('error');
      const data = await res.json() as RespuestaManifestacion;
      setResultado(data);
      setEstado('resultado');
    } catch {
      setError(true);
      setEstado('expandido');
    }
  };

  return (
    <motion.div
      layout
      className="overflow-hidden rounded-2xl"
      style={{
        background: 'var(--surface)',
        border: '1px solid color-mix(in oklab, var(--accent) 22%, transparent)',
      }}
    >
      {/* Banner tap-to-open */}
      {estado === 'idle' && (
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={abrir}
          className="flex w-full items-center gap-3 px-4 py-3.5 [touch-action:manipulation]"
        >
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-full"
            style={{ background: 'color-mix(in oklab, var(--accent) 14%, transparent)' }}
          >
            <Wand2 size={15} color="var(--accent)" strokeWidth={2} />
          </span>
          <span className="flex-1 text-left">
            <span className="block text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              ¿Qué necesitas manifestar?
            </span>
            <span className="block text-xs" style={{ color: 'var(--text-tertiary)' }}>
              Victoria te recomienda lo ideal para hoy
            </span>
          </span>
          <ChevronRight size={16} color="var(--text-tertiary)" strokeWidth={1.8} />
        </motion.button>
      )}

      {/* Input expandido */}
      {(estado === 'expandido' || estado === 'cargando') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4 pt-3 pb-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              <Wand2 size={14} color="var(--accent)" strokeWidth={2} />
              ¿Qué necesitas manifestar?
            </span>
            <button
              type="button"
              onClick={cerrar}
              className="flex size-6 items-center justify-center rounded-full [touch-action:manipulation]"
              style={{ background: 'color-mix(in oklab, var(--text-tertiary) 14%, transparent)' }}
              aria-label="Cerrar"
            >
              <X size={11} color="var(--text-secondary)" strokeWidth={2.5} />
            </button>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && buscar()}
            placeholder="ej. trabajo nuevo, amor propio, más dinero…"
            disabled={estado === 'cargando'}
            className="w-full rounded-xl bg-transparent px-3 py-2.5 text-sm focus:outline-none"
            style={{
              color: 'var(--text-primary)',
              border: '1px solid color-mix(in oklab, var(--accent) 30%, transparent)',
              background: 'color-mix(in oklab, var(--accent) 5%, var(--bg))',
            }}
          />
          {error && (
            <p className="mt-1.5 text-xs" style={{ color: 'var(--accent)' }}>
              Algo salió mal. Intenta de nuevo.
            </p>
          )}

          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={buscar}
            disabled={tema.trim().length < 3 || estado === 'cargando'}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold [touch-action:manipulation] disabled:opacity-40"
            style={{ background: 'var(--accent)', color: 'white' }}
          >
            {estado === 'cargando' ? (
              <>
                <RefreshCw size={13} strokeWidth={2.5} className="animate-spin" />
                Victoria está buscando…
              </>
            ) : (
              <>
                <Wand2 size={13} strokeWidth={2.5} />
                Encontrar prácticas
              </>
            )}
          </motion.button>
        </motion.div>
      )}

      {/* Resultado */}
      {estado === 'resultado' && resultado && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4 pt-3 pb-4"
        >
          {/* Header resultado */}
          <div className="mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--accent)' }}>
              <Wand2 size={12} strokeWidth={2.5} />
              {resultado.modo === 'ia' ? 'Creado por Victoria' : 'Recomendado para ti'}
            </span>
            <button
              type="button"
              onClick={cerrar}
              className="flex size-6 items-center justify-center rounded-full [touch-action:manipulation]"
              style={{ background: 'color-mix(in oklab, var(--text-tertiary) 14%, transparent)' }}
              aria-label="Cerrar"
            >
              <X size={11} color="var(--text-secondary)" strokeWidth={2.5} />
            </button>
          </div>

          {/* Mensaje de Victoria */}
          <p className="mb-3 text-sm italic leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            "{resultado.mensajeVictoria}"
          </p>

          {/* Contenido IA si aplica */}
          {resultado.modo === 'ia' && resultado.contenidoIA && (
            <div className="mb-4 flex flex-col gap-2.5">
              {[
                { label: 'Afirmación', texto: resultado.contenidoIA.afirmacion },
                { label: 'Decreto', texto: resultado.contenidoIA.decreto },
                { label: 'Acción de hoy', texto: resultado.contenidoIA.accionConcreta },
                { label: 'Reflexión', texto: resultado.contenidoIA.preguntaReflexion },
              ].map(({ label, texto }) => (
                <div
                  key={label}
                  className="rounded-xl px-3 py-2.5"
                  style={{ background: 'color-mix(in oklab, var(--accent) 7%, var(--bg))' }}
                >
                  <p className="mb-0.5 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--accent)' }}>
                    {label}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                    {texto}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Sugerencias editoriales */}
          {resultado.sugerenciasEditoriales.length > 0 && (
            <div>
              {resultado.modo === 'ia' && (
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                  También te recomiendo
                </p>
              )}
              <div className="flex flex-col gap-2">
                {resultado.sugerenciasEditoriales.map((item) => (
                  <motion.button
                    key={item.id}
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onTapSugerencia(item.id)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left [touch-action:manipulation]"
                    style={{
                      background: 'var(--bg)',
                      border: '1px solid color-mix(in oklab, var(--text-tertiary) 15%, transparent)',
                    }}
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-xl" style={{ background: 'color-mix(in oklab, var(--accent) 10%, transparent)' }} aria-hidden="true">
                      {(() => { const TIco = TIPO_ICON[item.tipo]; return <TIco size={14} color="var(--accent)" strokeWidth={1.8} />; })()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {item.titulo}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        {item.duracionMin} min · {item.tipo}
                      </p>
                    </div>
                    <ChevronRight size={14} color="var(--text-tertiary)" strokeWidth={1.8} />
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Buscar otra cosa */}
          <button
            type="button"
            onClick={() => { setEstado('expandido'); setResultado(null); }}
            className="mt-3 text-xs [touch-action:manipulation]"
            style={{ color: 'var(--accent)' }}
          >
            Buscar algo diferente
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

// ── Card de contenido ─────────────────────────────────────────────────────
function ContentCard({
  item,
  guardado,
  onTap,
  onToggleGuardado,
}: {
  item: ContenidoBiblioteca;
  guardado: boolean;
  onTap: () => void;
  onToggleGuardado: (e: React.MouseEvent) => void;
}) {
  return (
    <motion.div
      variants={staggerItem}
      className="relative flex flex-col gap-2.5 rounded-2xl p-4 [touch-action:manipulation]"
      style={{
        background: 'var(--surface)',
        border: '1px solid color-mix(in oklab, var(--text-tertiary) 16%, transparent)',
      }}
      onClick={onTap}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onTap()}
    >
      {/* Tipo + duración */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span
            className="flex h-6 items-center gap-1 rounded-full px-2 text-xs font-semibold uppercase tracking-[0.05em]"
            style={{
              background: 'color-mix(in oklab, var(--accent) 10%, transparent)',
              color: 'var(--accent)',
            }}
          >
            {(() => { const TIco = TIPO_ICON[item.tipo]; return <TIco size={10} strokeWidth={2.2} aria-hidden="true" />; })()}
            {TIPO_LABEL[item.tipo]}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {item.audioEstado !== 'none' && (
            <span
              className="flex h-6 items-center rounded-full px-2 text-xs font-semibold"
              style={{
                background: 'color-mix(in oklab, var(--accent) 10%, transparent)',
                color: 'var(--accent)',
              }}
            >
              <Play size={9} strokeWidth={2.5} className="mr-1" aria-hidden="true" />
              Audio
            </span>
          )}
        </div>
      </div>

      {/* Título + descripción */}
      <div>
        <h3
          className="text-base font-semibold leading-snug"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
        >
          {item.titulo}
        </h3>
        <p
          className="mt-1 text-sm leading-relaxed line-clamp-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          {item.descripcionCorta}
        </p>
      </div>

      {/* Footer: duración + guardar */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
          <Clock size={11} strokeWidth={1.8} aria-hidden="true" />
          {item.duracionMin} min · {item.categoria}
        </span>
        <motion.button
          type="button"
          whileTap={{ scale: 0.88 }}
          onClick={onToggleGuardado}
          className="flex size-8 items-center justify-center rounded-full [touch-action:manipulation]"
          style={{
            background: guardado
              ? 'color-mix(in oklab, var(--accent) 12%, transparent)'
              : 'color-mix(in oklab, var(--text-tertiary) 10%, transparent)',
          }}
          aria-label={guardado ? 'Quitar de guardados' : 'Guardar'}
        >
          {guardado ? (
            <BookmarkCheck size={15} color="var(--accent)" strokeWidth={2} />
          ) : (
            <Bookmark size={15} color="var(--text-secondary)" strokeWidth={1.8} />
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── Card destacada (hero) ─────────────────────────────────────────────────
function HeroCard({
  item,
  guardado,
  onTap,
  onToggleGuardado,
}: {
  item: ContenidoBiblioteca;
  guardado: boolean;
  onTap: () => void;
  onToggleGuardado: (e: React.MouseEvent) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="relative overflow-hidden rounded-3xl p-5 [touch-action:manipulation]"
      style={{
        background: 'radial-gradient(ellipse 80% 90% at 10% -10%, var(--accent-2) 0%, transparent 55%), var(--surface)',
        border: '1.5px solid color-mix(in oklab, var(--accent) 28%, transparent)',
        boxShadow: '0 4px 28px -4px rgb(36 25 29 / 0.10), inset 0 0 0 0.5px color-mix(in oklab, var(--accent-2) 60%, transparent)',
        minHeight: '168px',
      }}
      onClick={onTap}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onTap()}
    >
      {/* Detalle ornamental */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute right-5 top-5 text-xs font-medium"
        style={{ color: 'var(--champagne)', letterSpacing: '0.3em', fontSize: 9, opacity: 0.7 }}
      >
        ✦ HOY
      </p>

      {/* Chip tipo */}
      <div className="mb-3 flex items-center justify-between">
        <span
          className="flex h-6 items-center gap-1 rounded-full px-2.5 text-xs font-semibold uppercase tracking-[0.05em]"
          style={{
            background: 'color-mix(in oklab, var(--accent) 18%, transparent)',
            color: 'var(--accent)',
          }}
        >
          {(() => { const TIco = TIPO_ICON[item.tipo]; return <TIco size={10} strokeWidth={2.2} aria-hidden="true" />; })()}
          {TIPO_LABEL[item.tipo]}
          {item.audioEstado !== 'none' && ' · Audio'}
        </span>
        <motion.button
          type="button"
          whileTap={{ scale: 0.88 }}
          onClick={onToggleGuardado}
          className="flex size-8 items-center justify-center rounded-full [touch-action:manipulation]"
          style={{
            background: guardado
              ? 'color-mix(in oklab, var(--accent) 20%, transparent)'
              : 'color-mix(in oklab, var(--bg) 30%, transparent)',
          }}
          aria-label={guardado ? 'Quitar de guardados' : 'Guardar'}
        >
          {guardado ? (
            <BookmarkCheck size={15} color="var(--accent)" strokeWidth={2} />
          ) : (
            <Bookmark size={15} color="var(--text-secondary)" strokeWidth={1.8} />
          )}
        </motion.button>
      </div>

      <h2
        className="text-2xl font-bold leading-tight"
        style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
      >
        {item.titulo}
      </h2>
      <p
        className="mt-2 text-sm leading-relaxed line-clamp-2"
        style={{ color: 'var(--text-secondary)' }}
      >
        {item.descripcionCorta}
      </p>
      <div
        className="mt-3 flex items-center gap-2 text-xs"
        style={{ color: 'var(--text-tertiary)' }}
      >
        <Clock size={11} strokeWidth={1.8} aria-hidden="true" />
        {item.duracionMin} min
        <span aria-hidden="true">·</span>
        {item.categoriaEmoji} {item.categoria}
      </div>
    </motion.div>
  );
}

// ── Chip de filtro ────────────────────────────────────────────────────────
function ChipFiltro({
  label,
  icon: Icono,
  activo,
  onTap,
}: {
  label: string;
  icon: LucideIcon;
  activo: boolean;
  onTap: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.93 }}
      onClick={onTap}
      className="flex shrink-0 h-9 items-center gap-1.5 rounded-full border px-3.5 text-xs font-medium [touch-action:manipulation]"
      style={{
        background: activo ? 'var(--accent)' : 'var(--surface)',
        borderColor: activo
          ? 'var(--accent)'
          : 'color-mix(in oklab, var(--text-tertiary) 28%, transparent)',
        color: activo ? 'white' : 'var(--text-secondary)',
      }}
    >
      <Icono size={12} strokeWidth={2} aria-hidden="true" />
      {label}
    </motion.button>
  );
}

// ── Vista de resultados de búsqueda o filtro ──────────────────────────────
function ListaResultados({
  items,
  guardados,
  onTap,
  onToggleGuardado,
  titulo,
  onLimpiar,
}: {
  items: ContenidoBiblioteca[];
  guardados: string[];
  onTap: (id: string) => void;
  onToggleGuardado: (id: string, e: React.MouseEvent) => void;
  titulo?: string;
  onLimpiar?: () => void;
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <span className="flex size-14 items-center justify-center rounded-full" style={{ background: 'color-mix(in oklab, var(--text-tertiary) 10%, transparent)' }} aria-hidden="true">
          <Search size={24} color="var(--text-tertiary)" strokeWidth={1.8} />
        </span>
        <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
          Sin resultados
        </p>
        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          Intenta con otra palabra o categoría
        </p>
        {onLimpiar && (
          <button
            type="button"
            onClick={onLimpiar}
            className="mt-1 flex h-10 items-center gap-1.5 rounded-full px-5 text-sm font-semibold [touch-action:manipulation]"
            style={{ background: 'color-mix(in oklab, var(--accent) 12%, transparent)', color: 'var(--accent)' }}
          >
            Limpiar búsqueda
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {titulo && (
        <p
          className="text-xs font-semibold uppercase tracking-[0.05em]"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {titulo} — {items.length}
        </p>
      )}
      <motion.div
        className="flex flex-col gap-3"
        variants={staggerContainer(0.055, 0)}
        initial="hidden"
        animate="show"
      >
        {items.map((item) => (
          <ContentCard
            key={item.id}
            item={item}
            guardado={guardados.includes(item.id)}
            onTap={() => onTap(item.id)}
            onToggleGuardado={(e) => onToggleGuardado(item.id, e)}
          />
        ))}
      </motion.div>
    </div>
  );
}

// ── Layout editorial (sin filtros activos) ────────────────────────────────
function LayoutEditorial({
  guardados,
  recientes,
  onTap,
  onToggleGuardado,
}: {
  guardados: string[];
  recientes: string[];
  onTap: (id: string) => void;
  onToggleGuardado: (id: string, e: React.MouseEvent) => void;
}) {
  const reduced = useReducedMotion();
  const hero = getDestacadoDelDia();

  const recentesItems = recientes
    .map((id) => CATALOGO.find((c) => c.id === id))
    .filter(Boolean) as ContenidoBiblioteca[];

  const guardadosItems = guardados
    .map((id) => CATALOGO.find((c) => c.id === id))
    .filter(Boolean) as ContenidoBiblioteca[];

  // Sugeridas: los que no están en guardados ni recientes, mezclado de tipos
  const sugeridas = CATALOGO.filter(
    (c) => !guardados.includes(c.id) && !recientes.includes(c.id) && c.id !== hero.id
  ).slice(0, 6);

  return (
    <div className="flex flex-col gap-6">

      {/* Manifestador IA */}
      <ManifestadorIA
        recientes={recientes}
        onTapSugerencia={onTap}
      />

      {/* Hero destacado */}
      <section>
        <HeroCard
          item={hero}
          guardado={guardados.includes(hero.id)}
          onTap={() => onTap(hero.id)}
          onToggleGuardado={(e) => onToggleGuardado(hero.id, e)}
        />
      </section>

      {/* Por tipo — 4 accesos rápidos */}
      <section>
        <h2
          className="mb-3 text-xs font-semibold uppercase tracking-[0.05em]"
          style={{ color: 'var(--text-tertiary)' }}
        >
          Explorar por tipo
        </h2>
        <motion.div
          className="grid grid-cols-2 gap-2.5"
          variants={staggerContainer(0.06, 0)}
          initial="hidden"
          animate="show"
        >
          {FILTROS.slice(0, 4).map((f) => {
            const count = getByTipo(f.tipo).length;
            return (
              <motion.div
                key={f.tipo}
                variants={staggerItem}
                className="flex flex-col gap-1.5 rounded-2xl p-4 [touch-action:manipulation]"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid color-mix(in oklab, var(--text-tertiary) 14%, transparent)',
                  boxShadow: 'var(--shadow-1)',
                }}
                role="button"
                tabIndex={0}
                onClick={() => {
                  // Scroll to top and dispatch a custom event to set the filter
                  window.dispatchEvent(new CustomEvent('biblioteca:filtro', { detail: f.tipo }));
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter')
                    window.dispatchEvent(new CustomEvent('biblioteca:filtro', { detail: f.tipo }));
                }}
              >
                <span
                  className="flex size-10 items-center justify-center rounded-xl"
                  style={{
                    background: 'color-mix(in oklab, var(--accent) 10%, transparent)',
                    boxShadow: '0 1px 4px color-mix(in oklab, var(--accent) 14%, transparent)',
                  }}
                  aria-hidden="true"
                >
                  <f.icon size={18} color="var(--accent)" strokeWidth={1.7} />
                </span>
                <p
                  className="text-sm font-semibold leading-tight"
                  style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
                >
                  {f.label}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  {count} {count === 1 ? 'práctica' : 'prácticas'}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Guardados (si existen) */}
      {guardadosItems.length > 0 && (
        <section>
          <h2
            className="mb-3 text-xs font-semibold uppercase tracking-[0.05em]"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Guardados
          </h2>
          <motion.div
            className="flex flex-col gap-2.5"
            variants={staggerContainer(0.055, 0)}
            initial={reduced ? false : 'hidden'}
            animate="show"
          >
            {guardadosItems.slice(0, 3).map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                guardado

                onTap={() => onTap(item.id)}
                onToggleGuardado={(e) => onToggleGuardado(item.id, e)}
              />
            ))}
          </motion.div>
        </section>
      )}

      {/* Recientes (si existen) */}
      {recentesItems.length > 0 && (
        <section>
          <h2
            className="mb-3 text-xs font-semibold uppercase tracking-[0.05em]"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Vistas recientemente
          </h2>
          <motion.div
            className="flex flex-col gap-2.5"
            variants={staggerContainer(0.055, 0)}
            initial={reduced ? false : 'hidden'}
            animate="show"
          >
            {recentesItems.slice(0, 3).map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                guardado={guardados.includes(item.id)}

                onTap={() => onTap(item.id)}
                onToggleGuardado={(e) => onToggleGuardado(item.id, e)}
              />
            ))}
          </motion.div>
        </section>
      )}

      {/* Sugeridas */}
      {sugeridas.length > 0 && (
        <section>
          <h2
            className="mb-3 text-xs font-semibold uppercase tracking-[0.05em]"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {recentesItems.length > 0 ? 'También puedes explorar' : 'Prácticas para hoy'}
          </h2>
          <motion.div
            className="flex flex-col gap-2.5"
            variants={staggerContainer(0.055, 0)}
            initial={reduced ? false : 'hidden'}
            animate="show"
          >
            {sugeridas.map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                guardado={guardados.includes(item.id)}

                onTap={() => onTap(item.id)}
                onToggleGuardado={(e) => onToggleGuardado(item.id, e)}
              />
            ))}
          </motion.div>
        </section>
      )}
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────
function BibliotecaContent() {
  const router = useRouter();
  const { guardados, recientes, toggleGuardado, registrarVisto } = useBiblioteca();
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<TipoContenido | null>(null);

  // Escuchar evento de las tarjetas de categoría en LayoutEditorial
  useEffect(() => {
    const handler = (e: Event) => {
      const tipo = (e as CustomEvent<TipoContenido>).detail;
      setFiltroTipo(tipo);
      setBusqueda('');
      const scroller = document.querySelector<HTMLElement>('.overflow-y-auto');
      if (scroller) scroller.scrollTop = 0;
    };
    window.addEventListener('biblioteca:filtro', handler);
    return () => window.removeEventListener('biblioteca:filtro', handler);
  }, []);

  const irADetalle = (id: string) => {
    registrarVisto(id);
    router.push(`/app/biblioteca/${id}`);
  };

  const handleToggleGuardado = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleGuardado(id);
  };

  const limpiarBusqueda = () => {
    setBusqueda('');
    setFiltroTipo(null);
  };

  const mostrandoResultados = busqueda.trim().length > 0 || filtroTipo !== null;

  const resultados = busqueda.trim()
    ? buscar(busqueda)
    : filtroTipo
    ? getByTipo(filtroTipo)
    : [];

  return (
    <div className="flex min-h-dvh flex-col" style={{ background: 'var(--bg)' }}>
      {/* ── HEADER ── */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="px-5 pt-6 pb-2"
      >
        <h1
          className="text-2xl font-bold tracking-[-0.025em]"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
        >
          Biblioteca
        </h1>
        <p className="mt-0.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
          Rituales, afirmaciones, decretos y más
        </p>
      </motion.div>

      {/* ── BUSCADOR ── */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, delay: 0.06, ease: EASE }}
        className="relative px-5 pt-2 pb-3"
      >
        <div
          className="flex items-center gap-2.5 rounded-2xl px-3.5 py-3"
          style={{
            background: 'var(--surface)',
            border: `1px solid ${
              busqueda
                ? 'color-mix(in oklab, var(--accent) 50%, transparent)'
                : 'color-mix(in oklab, var(--text-tertiary) 20%, transparent)'
            }`,
          }}
        >
          <Search
            size={16}
            strokeWidth={1.8}
            color="var(--text-tertiary)"
            aria-hidden="true"
          />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              if (e.target.value) setFiltroTipo(null);
            }}
            placeholder="Buscar rituales, afirmaciones…"
            className="flex-1 bg-transparent text-sm focus:outline-none"
            style={{ color: 'var(--text-primary)' }}
            aria-label="Buscar en biblioteca"
          />
          <AnimatePresence>
            {(busqueda || filtroTipo) && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="button"
                onClick={limpiarBusqueda}
                className="flex size-5 items-center justify-center rounded-full [touch-action:manipulation]"
                style={{ background: 'var(--text-tertiary)' }}
                aria-label="Limpiar búsqueda"
              >
                <X size={11} color="white" strokeWidth={2.5} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── FILTROS DE TIPO ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, delay: 0.1 }}
        className="flex gap-2 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [-webkit-overflow-scrolling:touch]"
        role="group"
        aria-label="Filtrar por tipo de contenido"
      >
        {FILTROS.map((f) => (
          <ChipFiltro
            key={f.tipo}
            label={f.label}
            icon={f.icon}
            activo={filtroTipo === f.tipo}
            onTap={() => {
              setFiltroTipo((prev) => (prev === f.tipo ? null : f.tipo));
              setBusqueda('');
            }}
          />
        ))}
      </motion.div>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <div className="flex-1 overflow-y-auto px-5 pb-32">
        <AnimatePresence mode="wait">
          {mostrandoResultados ? (
            <motion.div
              key="resultados"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ListaResultados
                items={resultados}
                guardados={guardados}
                onTap={irADetalle}
                onToggleGuardado={handleToggleGuardado}
                titulo={
                  filtroTipo
                    ? TIPO_LABEL[filtroTipo]
                    : 'Resultados'
                }
                onLimpiar={limpiarBusqueda}
              />
            </motion.div>
          ) : (
            <motion.div
              key="editorial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <LayoutEditorial
                guardados={guardados}
                recientes={recientes}
                onTap={irADetalle}
                onToggleGuardado={handleToggleGuardado}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}

export default function BibliotecaPage() {
  return (
    <Suspense>
      <BibliotecaContent />
    </Suspense>
  );
}
