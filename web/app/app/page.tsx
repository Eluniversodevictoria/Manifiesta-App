'use client';

// MANIFIESTA — Inicio / Práctica del día (M0 — pantalla más vista)
// Engine D1-D30: generarPractica() + PracticeProgress del contexto
// Audio: audioEstado: 'none' en LOCAL/MOCK — placeholder visual habilitado

import { useState, useEffect, useRef, Suspense, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Flame, CheckCircle2, ChevronRight, Sparkles,
  Volume2, ArrowLeft, BookOpen, Zap, PenLine,
  ChevronDown, ChevronUp, Star, Banknote, Heart, Leaf, Briefcase, Home, Plane, Gift,
  Moon,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useManifestaciones } from '@/lib/ManifestacionesContext';
import { useSheetUrgente } from '@/lib/SheetUrgenteContext';
import { getFamiliaFromCategoria } from '@/lib/categorias';
import {
  generarPractica, yaCompletoHoy, crearSnapshot,
  type ContenidoDia, type PracticaTipo, type ContenidoMedia,
} from '@/lib/practica-engine';
import type { PreferenciaMedia, AudioEstado } from '@/lib/manifestaciones-types';
import { VictoriaAudioPlayer } from '@/components/VictoriaAudioPlayer';

// ── Intención diaria rotativa (determinista por día del mes) ──────────────────
const INTENCIONES_DIARIAS = [
  'Hoy elijo confiar en que todo llega en el momento perfecto.',
  'Mi energía es un imán para lo que deseo.',
  'Lo que busco ya me está buscando a mí.',
  'Hoy abro espacio para recibir lo que el universo tiene para mí.',
  'Soy merecedora de todo lo bueno que llega a mi vida.',
  'La abundancia fluye a través de mí naturalmente.',
  'Confío en el proceso y suelto el control.',
  'Mis deseos son semillas que ya están creciendo.',
  'Hoy actúo desde la certeza, no desde el miedo.',
  'El universo conspira siempre a mi favor.',
  'Me permito recibir con gratitud y sin resistencia.',
  'Cada día me acerco más a lo que me pertenece.',
  'Soy abundancia en movimiento.',
  'Lo mejor está por llegar — y ya está en camino.',
  'Hoy vibro en la frecuencia de lo que deseo.',
  'Mi fe es más grande que cualquier duda.',
  'Recibo con amor todo lo que el universo me da.',
  'Hoy me elijo a mí y a mis sueños más grandes.',
  'La prosperidad es mi estado natural.',
  'Confío en que ya está hecho — solo tengo que recibirlo.',
  'Hoy suelto lo que no me sirve y abrazo lo que viene.',
  'Soy canal de todo lo bueno que existe.',
  'Mi corazón sabe el camino — solo tengo que seguirlo.',
  'Hoy celebro cada pequeño paso hacia mis deseos.',
  'Lo que deseo con claridad ya existe en el universo.',
  'Soy imán de milagros y oportunidades.',
  'Hoy actúo, confío y doy gracias de antemano.',
  'El universo siempre me da exactamente lo que necesito.',
  'Mis deseos y yo somos uno solo.',
  'Hoy es el día perfecto para manifestar.',
  'Todo lo que necesito ya está dentro de mí.',
];

// ── Iconos por categoría ──────────────────────────────────────────────────────
const ICONO_CAT: Record<string, LucideIcon> = {
  Dinero: Banknote,
  Abundancia: Sparkles,
  Oportunidades: Briefcase,
  Amor: Heart,
  Soltar: Leaf,
  Gratitud: Gift,
  Otro: Star,
  Trabajo: Briefcase,
  Hogar: Home,
  Bienestar: Leaf,
  Viaje: Plane,
};

// ── Labels por tipo ───────────────────────────────────────────────────────────
const LABEL_TIPO: Record<PracticaTipo, string> = {
  afirmacion:    'Tu afirmación',
  visualizacion: 'Visualización',
  scripting:     'Scripting del día',
  journaling:    'Journaling',
  ritual:        'Tu ritual',
};

const LABEL_PROFUNDIZAR: Record<PracticaTipo, string> = {
  afirmacion:    'Afirmación adicional',
  visualizacion: 'Visualización',
  scripting:     'Scripting',
  journaling:    'Pregunta de journaling',
  ritual:        'Ritual',
};

// Iconos SVG por tipo de práctica (sin emojis)
const LUCIDE_TIPO: Record<PracticaTipo, LucideIcon> = {
  afirmacion:    Sparkles,
  visualizacion: Moon,
  scripting:     PenLine,
  journaling:    BookOpen,
  ritual:        Flame,
};

// ── Conteo animado de números héroe (baseline #2) ────────────────────────────
function useAnimatedNumber(target: number, durationMs = 700) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const p = Math.min((now - start) / durationMs, 1);
      setDisplay(Math.round(p * target));
      if (p < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [target, durationMs]);
  return display;
}

// ── Arco SVG de progreso del ciclo (baseline #3) ─────────────────────────────
function CycleArc({ day, total = 30, size = 48 }: { day: number; total?: number; size?: number }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const progress = Math.min(day / total, 1);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      {/* Track */}
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="color-mix(in oklab, var(--accent) 12%, transparent)"
        strokeWidth={3}
      />
      {/* Arc animado */}
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ * (1 - progress) }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ rotate: '-90deg', transformOrigin: `${size / 2}px ${size / 2}px` }}
      />
    </svg>
  );
}

// ── Toggle preferencia ────────────────────────────────────────────────────────
function TogglePreferencia({ valor, onChange }: { valor: PreferenciaMedia; onChange: (v: PreferenciaMedia) => void }) {
  const opciones: { key: PreferenciaMedia; label: string }[] = [
    { key: 'leer',     label: 'Leer'     },
    { key: 'escuchar', label: 'Escuchar' },
    { key: 'ambas',    label: 'Ambas'    },
  ];
  return (
    <div
      className="flex rounded-full p-0.5"
      style={{ background: 'color-mix(in oklab, var(--text-tertiary) 12%, transparent)' }}
      role="group"
      aria-label="Preferencia de contenido"
    >
      {opciones.map((op) => (
        <button
          key={op.key}
          type="button"
          onClick={() => onChange(op.key)}
          className="flex-1 rounded-full py-1.5 text-xs font-semibold [touch-action:manipulation]"
          style={{
            background: valor === op.key ? 'var(--surface)' : 'transparent',
            color: valor === op.key ? 'var(--text-primary)' : 'var(--text-tertiary)',
            boxShadow: valor === op.key ? 'var(--shadow-1)' : 'none',
            transition: 'background 0.15s ease, color 0.15s ease',
          }}
          aria-pressed={valor === op.key}
        >
          {op.label}
        </button>
      ))}
    </div>
  );
}

// ── Bloque de contenido genérico ──────────────────────────────────────────────
function BloqueMedia({
  label,
  icono: Icono,
  cm,
  preferencia,
  variante = 'normal',
  children,
  audioEstadoOverride,
  audioUrlOverride,
  onRequestAudio,
}: {
  label: string;
  icono: LucideIcon;
  cm: ContenidoMedia;
  preferencia: PreferenciaMedia;
  variante?: 'normal' | 'hero' | 'afirmacion';
  children?: React.ReactNode;
  audioEstadoOverride?: import('@/lib/manifestaciones-types').AudioEstado;
  audioUrlOverride?: string;
  onRequestAudio?: () => void;
}) {
  if (variante === 'afirmacion') {
    return (
      <div
        className="rounded-[var(--radius-card)] p-5"
        style={{
          background: 'color-mix(in oklab, var(--accent) 6%, var(--surface))',
          border: '1px solid color-mix(in oklab, var(--accent) 18%, transparent)',
          boxShadow: 'var(--shadow-1)',
        }}
      >
        <div className="mb-3 flex items-center gap-2">
          <span
            className="flex size-5 shrink-0 items-center justify-center rounded-full"
            style={{ background: 'color-mix(in oklab, var(--accent) 14%, transparent)' }}
            aria-hidden="true"
          >
            <Sparkles size={10} color="var(--accent)" strokeWidth={2} />
          </span>
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'var(--accent)' }}
          >
            {label}
          </span>
        </div>
        <blockquote
          className="text-base italic leading-relaxed"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
        >
          "{cm.textContent}"
        </blockquote>
        <VictoriaAudioPlayer
          audioEstado={audioEstadoOverride ?? cm.audioEstado}
          audioUrl={audioUrlOverride}
          audioDurationSec={cm.audioDurationSec}
          preferencia={preferencia}
          label="Escuchar tu afirmación"
          onRequestGenerate={onRequestAudio}
          className="mt-3"
        />
      </div>
    );
  }

  return (
    <div
      className="rounded-[var(--radius-card)] p-5"
      style={{
        background: 'var(--surface-2)',
        border: '1px solid color-mix(in oklab, var(--text-tertiary) 14%, transparent)',
      }}
    >
      <div className="mb-3 flex items-center gap-2">
        <span
          className="flex size-6 shrink-0 items-center justify-center rounded-full"
          style={{ background: 'color-mix(in oklab, var(--text-tertiary) 14%, transparent)' }}
          aria-hidden="true"
        >
          <Icono size={12} color="var(--text-secondary)" strokeWidth={2} />
        </span>
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text-secondary)' }}
        >
          {label}
        </span>
      </div>
      {children ?? (
        <p className="text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          {cm.textContent}
        </p>
      )}
      <VictoriaAudioPlayer
        audioEstado={audioEstadoOverride ?? cm.audioEstado}
        audioUrl={audioUrlOverride}
        audioDurationSec={cm.audioDurationSec}
        preferencia={preferencia}
        label={`Escuchar: ${label}`}
        onRequestGenerate={onRequestAudio}
        className="mt-3"
      />
    </div>
  );
}

// ── Bloque Scripting (link a la pantalla de scripting) ────────────────────────
function BloqueScripting({ cm, manifestacionId }: { cm: ContenidoMedia; manifestacionId?: string }) {
  return (
    <Link
      href={manifestacionId ? `/app/scripting?manifestacionId=${manifestacionId}` : '/app/scripting'}
      className="flex items-start gap-3 rounded-[var(--radius-card)] border p-4 [touch-action:manipulation]"
      style={{
        background: 'var(--surface-2)',
        borderColor: 'color-mix(in oklab, var(--accent) 20%, transparent)',
        borderStyle: 'dashed',
      }}
    >
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-xl"
        style={{ background: 'var(--chip-bg)' }}
        aria-hidden="true"
      >
        <PenLine size={16} color="var(--accent)" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="mb-0.5 text-xs font-semibold" style={{ color: 'var(--accent)' }}>
          Scripting del día
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {cm.textContent}
        </p>
      </div>
      <ChevronRight size={16} color="var(--text-tertiary)" className="mt-0.5 shrink-0" aria-hidden="true" />
    </Link>
  );
}

// ── Bloque protagonista del día ───────────────────────────────────────────────
function BloqueProtagonista({
  tipo,
  cm,
  preferencia,
  manifestacionId,
  audioEstadoOverride,
  audioUrlOverride,
  onRequestAudio,
}: {
  tipo: PracticaTipo;
  cm: ContenidoMedia;
  preferencia: PreferenciaMedia;
  manifestacionId?: string;
  audioEstadoOverride?: import('@/lib/manifestaciones-types').AudioEstado;
  audioUrlOverride?: string;
  onRequestAudio?: () => void;
}) {
  if (tipo === 'scripting') {
    return <BloqueScripting cm={cm} manifestacionId={manifestacionId} />;
  }

  if (tipo === 'afirmacion') {
    return (
      <div
        className="rounded-[var(--radius-card)] px-5 py-4"
        style={{
          background: 'color-mix(in oklab, var(--accent) 6%, var(--surface))',
          border: '1px solid color-mix(in oklab, var(--accent) 16%, transparent)',
        }}
      >
        <div className="mb-3 flex items-center gap-2">
          <span
            className="flex size-6 shrink-0 items-center justify-center rounded-full"
            style={{ background: 'color-mix(in oklab, var(--text-tertiary) 14%, transparent)' }}
            aria-hidden="true"
          >
            <Sparkles size={12} color="var(--text-secondary)" strokeWidth={2} />
          </span>
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-secondary)' }}
          >
            Cómo practicarla
          </span>
        </div>
        <p className="text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          {cm.textContent}
        </p>
        <VictoriaAudioPlayer
          audioEstado={audioEstadoOverride ?? cm.audioEstado}
          audioUrl={audioUrlOverride}
          audioDurationSec={cm.audioDurationSec}
          preferencia={preferencia}
          label="Escuchar cómo practicarla"
          onRequestGenerate={onRequestAudio}
          className="mt-3"
        />
      </div>
    );
  }

  if (tipo === 'ritual') {
    const pasos = cm.textContent.split(/\n/).filter(Boolean);
    return (
      <BloqueMedia
        label={LABEL_TIPO[tipo]}
        icono={LUCIDE_TIPO[tipo]}
        cm={cm}
        preferencia={preferencia}
        variante="normal"
        audioEstadoOverride={audioEstadoOverride}
        audioUrlOverride={audioUrlOverride}
        onRequestAudio={onRequestAudio}
      >
        {pasos.length > 1 ? (
          <ol className="flex flex-col gap-3">
            {pasos.map((paso, i) => (
              <li key={i} className="flex gap-3">
                <span
                  className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{
                    background: 'color-mix(in oklab, var(--champagne) 30%, transparent)',
                    color: 'var(--text-secondary)',
                  }}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span className="text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  {paso}
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {cm.textContent}
          </p>
        )}
      </BloqueMedia>
    );
  }

  // visualizacion | journaling
  return (
    <div
      className="rounded-[var(--radius-card)] px-5 py-4"
      style={{
        background: 'var(--surface-2)',
        border: '1px solid color-mix(in oklab, var(--text-tertiary) 14%, transparent)',
      }}
    >
      <div className="mb-3 flex items-center gap-2">
        <span
          className="flex size-6 shrink-0 items-center justify-center rounded-full"
          style={{ background: 'color-mix(in oklab, var(--text-tertiary) 14%, transparent)' }}
          aria-hidden="true"
        >
          {(() => { const I = LUCIDE_TIPO[tipo]; return <I size={12} color="var(--text-secondary)" strokeWidth={2} />; })()}
        </span>
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text-secondary)' }}
        >
          {LABEL_TIPO[tipo]}
        </span>
      </div>
      <p className="text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {cm.textContent}
      </p>
      <VictoriaAudioPlayer
        audioEstado={audioEstadoOverride ?? cm.audioEstado}
        audioUrl={audioUrlOverride}
        audioDurationSec={cm.audioDurationSec}
        preferencia={preferencia}
        label={`Escuchar: ${LABEL_TIPO[tipo]}`}
        onRequestGenerate={onRequestAudio}
        className="mt-3"
      />
    </div>
  );
}

// ── Estado de ánimo diario ────────────────────────────────────────────────────
const ANIMOS = [
  { id: 'radiante', emoji: '🌟', label: 'Radiante' },
  { id: 'tranquila', emoji: '🌸', label: 'Tranquila' },
  { id: 'dudosa', emoji: '🌫️', label: 'Con dudas' },
  { id: 'cansada', emoji: '🌙', label: 'Cansada' },
] as const;

type AnimoId = typeof ANIMOS[number]['id'];

function getAnimoKeyHoy() {
  const d = new Date();
  return `manifiesta_animo_${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function EstadoAnimoCard() {
  const [seleccionado, setSeleccionado] = useState<AnimoId | null>(null);
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    const prev = localStorage.getItem(getAnimoKeyHoy());
    if (prev) { setSeleccionado(prev as AnimoId); setGuardado(true); }
  }, []);

  const elegir = (id: AnimoId) => {
    if (guardado) return;
    setSeleccionado(id);
    setGuardado(true);
    localStorage.setItem(getAnimoKeyHoy(), id);
  };

  const animoSel = ANIMOS.find((a) => a.id === seleccionado);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-[var(--radius-card)] p-4"
      style={{
        background: 'var(--surface)',
        border: '1px solid color-mix(in oklab, var(--accent) 12%, transparent)',
      }}
    >
      {!guardado ? (
        <>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
            ¿Cómo llegas hoy?
          </p>
          <div className="grid grid-cols-4 gap-2">
            {ANIMOS.map((a) => (
              <button
                key={a.id}
                onClick={() => elegir(a.id)}
                className="flex flex-col items-center gap-1.5 rounded-xl py-3 transition-transform active:scale-95"
                style={{
                  background: seleccionado === a.id
                    ? 'color-mix(in oklab, var(--accent) 12%, transparent)'
                    : 'color-mix(in oklab, var(--text-tertiary) 8%, transparent)',
                  border: seleccionado === a.id
                    ? '1.5px solid color-mix(in oklab, var(--accent) 35%, transparent)'
                    : '1.5px solid transparent',
                }}
              >
                <span className="text-xl leading-none">{a.emoji}</span>
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)', fontSize: 11 }}>{a.label}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="flex items-center gap-3">
          <span className="text-2xl">{animoSel?.emoji ?? '✨'}</span>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Llegas {animoSel?.label?.toLowerCase() ?? 'con energía'} — y eso está perfecto.
            </p>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              Victoria ajustó tu práctica para hoy.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ── Contenido principal ───────────────────────────────────────────────────────
function InicioContent() {
  const {
    manifestaciones, getById,
    manifestacionActivaId, setManifestacionActiva,
    getProgress, completarDiaPractica, continuarCiclo,
    addCheckIn, marcarManifestado,
  } = useManifestaciones();

  const activas = manifestaciones.filter((m) => m.estado === 'activo');
  const hayVariasActivas = activas.length > 1;

  const manifestacionActiva = manifestacionActivaId
    ? getById(manifestacionActivaId)
    : activas.length === 1
      ? activas[0]
      : undefined;

  useEffect(() => {
    if (!manifestacionActivaId && activas.length === 1) {
      setManifestacionActiva(activas[0].id);
    }
  }, [manifestacionActivaId, activas, setManifestacionActiva]);

  const progress = manifestacionActiva ? getProgress(manifestacionActiva.id) : null;
  const familia = manifestacionActiva ? getFamiliaFromCategoria(manifestacionActiva.categoria) : 'general';
  const deseo = manifestacionActiva?.deseo ?? 'lo que deseas';

  // Base estática (fallback inmediato mientras carga la IA)
  const practicaBase = useMemo(() => generarPractica(
    progress?.currentDay ?? 1,
    familia,
    deseo,
  ), [progress?.currentDay, familia, deseo]);

  const [practica, setPractica] = useState<ContenidoDia>(practicaBase);
  const [practicaSource, setPracticaSource] = useState<'local' | 'ai' | 'loading'>('local');

  // Clave de cache: manifestacionId + dia + fecha
  const cacheKey = manifestacionActiva
    ? `manifiesta_practica_ai_${manifestacionActiva.id}_d${progress?.currentDay ?? 1}_${new Date().toISOString().slice(0, 10)}`
    : null;

  useEffect(() => {
    setPractica(practicaBase);
  }, [practicaBase]);

  useEffect(() => {
    if (!manifestacionActiva || !cacheKey) return;

    // Intentar cargar desde cache
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setPractica(JSON.parse(cached));
        setPracticaSource('ai');
        return;
      }
    } catch { /* ignorar */ }

    // Llamar al endpoint de IA
    setPracticaSource('loading');
    fetch('/api/practica', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dia: progress?.currentDay ?? 1,
        familia,
        deseoRaw: deseo,
      }),
    })
      .then((r) => r.json())
      .then((data: { practica: ContenidoDia; source: string }) => {
        if (data.practica) {
          setPractica(data.practica);
          setPracticaSource(data.source === 'ai' ? 'ai' : 'local');
          if (data.source === 'ai') {
            try { localStorage.setItem(cacheKey, JSON.stringify(data.practica)); } catch { /* ignorar */ }
          }
        }
      })
      .catch(() => {
        setPracticaSource('local');
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey]);

  const hoyCompletado = progress ? yaCompletoHoy(progress) : false;
  const cicloCompleto = progress?.cycleComplete ?? false;

  const { abrir: abrirSheetUrgente } = useSheetUrgente();

  // Estado de audio por bloque: clave = 'afirmacion' | 'protagonista' | 'profundizar-N'
  type AudioBlockState = { estado: import('@/lib/manifestaciones-types').AudioEstado; url?: string };
  const [audioBlocks, setAudioBlocks] = useState<Record<string, AudioBlockState>>({});

  const requestAudio = useCallback(async (blockKey: string, text: string) => {
    setAudioBlocks((prev) => ({ ...prev, [blockKey]: { estado: 'generating' } }));
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error('tts error');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioBlocks((prev) => ({ ...prev, [blockKey]: { estado: 'ready', url } }));
    } catch {
      setAudioBlocks((prev) => ({ ...prev, [blockKey]: { estado: 'error' } }));
    }
  }, []);

  const prefersReduced = useReducedMotion();
  const [celebrando, setCelebrando] = useState(false);
  const [completado, setCompletado] = useState(hoyCompletado);
  const [toastRacha, setToastRacha] = useState<number | null>(null);
  const toastRachaRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [profundizarAbierto, setProfundizarAbierto] = useState(false);
  const [preferencia, setPreferencia] = useState<PreferenciaMedia>('ambas');

  useEffect(() => { setCompletado(hoyCompletado); }, [hoyCompletado]);

  useEffect(() => {
    const guardada = localStorage.getItem('manifiesta_preferencia_media') as PreferenciaMedia | null;
    if (guardada) setPreferencia(guardada);
  }, []);

  const cambiarPreferencia = useCallback((v: PreferenciaMedia) => {
    setPreferencia(v);
    localStorage.setItem('manifiesta_preferencia_media', v);
  }, []);

  const hora = new Date().getHours();
  const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches';

  const racha = (() => {
    const MESES: Record<string, number> = { ene:0,feb:1,mar:2,abr:3,may:4,jun:5,jul:6,ago:7,sep:8,oct:9,nov:10,dic:11 };
    const anio = new Date().getFullYear();
    const parsear = (f: string): number | null => {
      if (f === 'Hoy') return new Date(new Date().setHours(0,0,0,0)).getTime();
      const [d, m] = f.trim().toLowerCase().split(' ');
      const mes = MESES[m];
      if (mes === undefined) return null;
      return new Date(anio, mes, parseInt(d)).getTime();
    };
    const dias = new Set(
      manifestaciones.flatMap((m) => m.checkIns.map((ci) => parsear(ci.fecha)).filter(Boolean) as number[])
    );
    const hoyTs = new Date(new Date().setHours(0,0,0,0)).getTime();
    const MS_DIA = 86_400_000;
    let count = 0;
    let cursor = hoyTs;
    while (dias.has(cursor)) { count++; cursor -= MS_DIA; }
    if (count === 0) { cursor = hoyTs - MS_DIA; while (dias.has(cursor)) { count++; cursor -= MS_DIA; } }
    return count;
  })();

  const rachaDisplay = useAnimatedNumber(racha);

  // ── Toast de hito de racha (7, 14, 21 días) ─────────────────────────────
  useEffect(() => {
    const HITOS = [7, 14, 21];
    if (!HITOS.includes(racha)) return;
    const key = `manifiesta_racha_toast_${racha}`;
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, '1');
    setToastRacha(racha);
    if (toastRachaRef.current) clearTimeout(toastRachaRef.current);
    toastRachaRef.current = setTimeout(() => setToastRacha(null), 4000);
    return () => { if (toastRachaRef.current) clearTimeout(toastRachaRef.current); };
  }, [racha]);

  // ── Ref para CTA sticky ───────────────────────────────────────────────────
  const [ctaInView, setCtaInView] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  // Callback ref: se adjusta cuando el elemento condicional aparece en el DOM
  const ctaRef = useCallback((el: HTMLDivElement | null) => {
    observerRef.current?.disconnect();
    if (!el) return;
    observerRef.current = new IntersectionObserver(
      ([entry]) => setCtaInView(entry.isIntersecting),
      { rootMargin: '0px 0px 120px 0px' }
    );
    observerRef.current.observe(el);
  }, []);

  // ── Toast de Deshacer para "Lo hice hoy" ─────────────────────────────────
  const [undoVisible, setUndoVisible] = useState(false);
  const undoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingCompletarRef = useRef<(() => void) | null>(null);

  const completarPractica = () => {
    if (completado || celebrando) return;
    setCelebrando(true);
    // Mostrar feedback inmediato, luego dar 4s de gracia para Deshacer
    setTimeout(() => { setCompletado(true); setCelebrando(false); }, 900);
    setUndoVisible(true);

    const persistir = () => {
      if (manifestacionActiva) {
        const snap = crearSnapshot({
          manifestacionId: manifestacionActiva.id,
          dia: progress?.currentDay ?? 1,
          cycleNumber: progress?.cycleNumber ?? 1,
          familia,
          deseoRaw: deseo,
          practica,
        });
        completarDiaPractica(manifestacionActiva.id, snap);
        if (!hoyCompletado) {
          addCheckIn(manifestacionActiva.id, `Práctica del día ${progress?.currentDay ?? 1} completada`);
        }
      }
    };

    pendingCompletarRef.current = persistir;
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    undoTimeoutRef.current = setTimeout(() => {
      persistir();
      setUndoVisible(false);
    }, 4000);
  };

  const handleDeshacer = () => {
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    pendingCompletarRef.current = null;
    setUndoVisible(false);
    setCompletado(false);
    setCelebrando(false);
  };

  const handleContinuarCiclo = () => {
    if (manifestacionActiva) {
      continuarCiclo(manifestacionActiva.id);
      setCompletado(false);
    }
  };

  const handleSeManifesto = () => {
    if (!manifestacionActiva) return;
    const hoy = new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
    marcarManifestado(manifestacionActiva.id, {
      fechaOcurrencia: hoy,
      comoLlego: 'Completé el ciclo de 30 días de práctica.',
      aprendizaje: 'La práctica constante me llevó aquí.',
      notaFinal: '✨',
    });
    setManifestacionActiva(null);
  };

  const EASE = [0.16, 1, 0.3, 1] as const;
  const diaActual = progress?.currentDay ?? 1;
  const cicloActual = progress?.cycleNumber ?? 1;

  return (
    <>
    {/* ── Toast de hito de racha ───────────────────────────────────────────── */}
    <AnimatePresence>
      {toastRacha && (
        <motion.div
          key={`toast-racha-${toastRacha}`}
          initial={{ opacity: 0, y: 24, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          className="pointer-events-none fixed left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl px-5 py-3.5 shadow-lg"
          style={{
            bottom: 'calc(88px + env(safe-area-inset-bottom))',
            background: 'var(--surface)',
            border: '1.5px solid color-mix(in oklab, var(--accent) 30%, transparent)',
            minWidth: '220px',
          }}
          aria-live="polite"
          role="status"
        >
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-full"
            style={{ background: 'color-mix(in oklab, var(--accent) 12%, transparent)' }}
            aria-hidden="true"
          >
            <Flame size={18} color="var(--accent)" strokeWidth={1.8} />
          </span>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              ¡{toastRacha} días seguidos! 🔥
            </p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {toastRacha === 7 ? 'Una semana manifestando. Sigue así.' : toastRacha === 14 ? 'Dos semanas. Tu energía está en marcha.' : 'Tres semanas. Esto ya es un hábito.'}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Micro-celebración al completar práctica: sutil, reserva el impacto para "Se manifestó" */}
    <AnimatePresence>
      {celebrando && !prefersReduced && (
        <motion.div
          key="micro-cel"
          initial={{ opacity: 0, scale: 0.6, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          className="pointer-events-none fixed bottom-32 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1.5 rounded-full px-4 py-2"
          style={{ background: 'color-mix(in oklab, var(--accent) 14%, transparent)', border: '1px solid color-mix(in oklab, var(--accent) 30%, transparent)' }}
          aria-hidden="true"
        >
          <Sparkles size={15} color="var(--accent)" strokeWidth={1.8} />
          <Sparkles size={11} color="var(--accent-2)" strokeWidth={1.8} />
          <Sparkles size={13} color="var(--accent)" strokeWidth={1.8} />
        </motion.div>
      )}
    </AnimatePresence>
    <div className="flex flex-col">

      {/* ── HEADER ── */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="flex items-center justify-between px-5 pt-6 pb-4"
      >
        <div>
          <p
            className="text-xs font-medium"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {saludo}
          </p>
          <h1
            className="mt-0.5 text-2xl font-bold leading-tight"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            Tu práctica de hoy
          </h1>
        </div>

        {/* Racha */}
        <div
          className="flex items-center gap-1.5 rounded-full px-3 py-2"
          style={{
            background: 'color-mix(in oklab, var(--accent) 9%, transparent)',
            border: '1px solid color-mix(in oklab, var(--accent) 16%, transparent)',
            boxShadow: '0 2px 8px color-mix(in oklab, var(--accent) 18%, transparent)',
          }}
        >
          <Flame size={14} color="var(--accent)" strokeWidth={2} aria-hidden="true" />
          <span className="text-sm font-bold tabular-nums" style={{ color: 'var(--accent)' }}>{rachaDisplay}</span>
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>días</span>
        </div>
      </motion.header>


      <div className="flex flex-col gap-5 px-5">

        {/* ── CAPA EMOCIONAL — intención del día (hero editorial) ── */}
        {(() => {
          const diaIndex = new Date().getDate() % INTENCIONES_DIARIAS.length;
          return (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className="rounded-[var(--radius-card)] px-5 py-6"
              style={{
                background: 'radial-gradient(ellipse 90% 100% at 15% -5%, var(--accent-2) 0%, transparent 55%), var(--surface)',
                border: '1px solid color-mix(in oklab, var(--accent) 22%, transparent)',
                boxShadow: '0 4px 24px -4px rgb(36 25 29 / 0.09)',
              }}
            >
              <p
                className="text-xs font-medium"
                style={{ color: 'var(--champagne)', letterSpacing: '0.4em', fontSize: 10 }}
                aria-hidden="true"
              >
                ✦ MANIFIESTA
              </p>
              <p
                className="mt-3 text-lg font-semibold italic leading-relaxed"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
              >
                "{INTENCIONES_DIARIAS[diaIndex]}"
              </p>
              <p className="mt-3 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                Tu intención de hoy · Llévala contigo
              </p>
            </motion.div>
          );
        })()}

        {/* ── EMPTY STATE ── */}
        {activas.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="flex flex-col items-center gap-4 rounded-[var(--radius-card)] py-12 text-center"
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
              <p
                className="text-base font-semibold"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
              >
                Aún no tienes un deseo activo
              </p>
              <p className="mt-1 px-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Cuéntale a Victoria qué quieres manifestar para comenzar.
              </p>
            </div>
            <Link
              href="/app/manifestaciones"
              className="flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold text-white [touch-action:manipulation]"
              style={{ background: 'var(--accent)' }}
            >
              <Sparkles size={14} strokeWidth={2} />
              Agregar un deseo
            </Link>
          </motion.div>
        )}

        {/* ── SELECTOR (2+ activas sin selección) ── */}
        {hayVariasActivas && !manifestacionActivaId && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="rounded-[var(--radius-card)] p-4"
            style={{
              background: 'var(--surface-rose)',
              border: '1px solid color-mix(in oklab, var(--accent) 16%, transparent)',
            }}
          >
            <p className="mb-3 text-xs font-semibold" style={{ color: 'var(--accent)' }}>
              ¿Para qué deseo trabajas hoy?
            </p>
            <div className="flex flex-col gap-2">
              {activas.map((m) => {
                const IcoM = ICONO_CAT[m.categoria] ?? Star;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setManifestacionActiva(m.id)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left [touch-action:manipulation]"
                    style={{ background: 'var(--surface)' }}
                  >
                    <span
                      className="flex size-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: 'var(--chip-bg)' }}
                      aria-hidden="true"
                    >
                      <IcoM size={15} color="var(--accent)" strokeWidth={2} />
                    </span>
                    <span className="flex-1 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {m.deseo}
                    </span>
                    <ChevronRight size={15} color="var(--text-tertiary)" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── BOTÓN CAMBIAR ── */}
        {hayVariasActivas && manifestacionActivaId && (
          <button
            type="button"
            onClick={() => setManifestacionActiva(null)}
            className="flex min-h-11 items-center gap-1.5 self-end rounded-full px-3 py-1.5 text-xs font-medium [touch-action:manipulation]"
            style={{
              color: 'var(--text-tertiary)',
              border: '1px solid color-mix(in oklab, var(--text-tertiary) 28%, transparent)',
            }}
          >
            <ArrowLeft size={12} aria-hidden="true" />
            Cambiar manifestación
          </button>
        )}

        {/* ── CONTEXTO: DESEO + DÍA ── */}
        {manifestacionActiva && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.06, ease: EASE }}
            className="flex items-center justify-between rounded-[var(--radius-card)] px-4 py-3"
            style={{
              background: 'var(--surface)',
              border: '1px solid color-mix(in oklab, var(--text-tertiary) 12%, transparent)',
              boxShadow: '0 4px 20px -4px rgb(36 25 29 / 0.08)',
            }}
          >
            <div className="flex min-w-0 items-center gap-3">
              {(() => { const IcoA = ICONO_CAT[manifestacionActiva.categoria] ?? Star; return (
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: 'var(--chip-bg)' }}
                  aria-hidden="true"
                >
                  <IcoA size={16} color="var(--accent)" strokeWidth={1.8} />
                </span>
              ); })()}
              <div className="min-w-0">
                <p
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--champagne)' }}
                >
                  Día {diaActual} de 30
                  {cicloActual > 1 && ` · Ciclo ${cicloActual}`}
                </p>
                <p
                  className="truncate text-sm font-semibold"
                  style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
                >
                  {manifestacionActiva.deseo}
                </p>
              </div>
            </div>
            <Link
              href={`/app/manifestaciones/${manifestacionActiva.id}`}
              className="relative flex shrink-0 items-center justify-center [touch-action:manipulation]"
              aria-label={`Ver detalle — Día ${diaActual} de 30`}
            >
              <CycleArc day={diaActual} total={30} size={52} />
              <span
                className="absolute text-xs font-bold tabular-nums"
                style={{ color: 'var(--accent)', fontSize: 13 }}
              >
                {diaActual}
              </span>
            </Link>
          </motion.div>
        )}

        {/* ── ESTADO DE ÁNIMO — check rápido diario ── */}
        {manifestacionActiva && <EstadoAnimoCard />}

        {/* ── PRÁCTICA — solo con manifestación activa ── */}
        {manifestacionActiva && (<>

        {/* Toggle leer/escuchar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.07, ease: EASE }}
        >
          <TogglePreferencia valor={preferencia} onChange={cambiarPreferencia} />
        </motion.div>

        {/* 1. INTENCIÓN DEL DÍA — card editorial, no rosa sólido */}
        <motion.div
          data-tour="practica"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: EASE }}
          className="rounded-[var(--radius-card)] p-5"
          style={{
            background: 'var(--surface-rose)',
            border: '1px solid color-mix(in oklab, var(--accent) 12%, transparent)',
            boxShadow: '0 4px 20px -4px rgb(36 25 29 / 0.08)',
          }}
        >
          <div className="mb-3 flex items-center gap-2">
            <span
              className="flex size-6 shrink-0 items-center justify-center rounded-full"
              style={{ background: 'var(--chip-bg)' }}
              aria-hidden="true"
            >
              <Sparkles size={12} color="var(--accent)" strokeWidth={2} />
            </span>
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--accent)' }}
            >
              {practica.fase} · {practica.tema}
            </span>
          </div>
          <p
            className="text-base font-semibold leading-relaxed"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
            }}
          >
            {practica.base.intencion.textContent}
          </p>
        </motion.div>

        {/* 2. AFIRMACIÓN */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.16, ease: EASE }}
        >
          <BloqueMedia
            label="Tu afirmación"
            icono={Sparkles}
            cm={practica.base.afirmacion}
            preferencia={preferencia}
            variante="afirmacion"
            audioEstadoOverride={audioBlocks['afirmacion']?.estado}
            audioUrlOverride={audioBlocks['afirmacion']?.url}
            onRequestAudio={() => requestAudio('afirmacion', practica.base.afirmacion.textContent)}
          />
        </motion.div>

        {/* 3. PROTAGONISTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.2, ease: EASE }}
        >
          <BloqueProtagonista
            tipo={practica.protagonista}
            cm={practica.base.protagonistaBloque}
            preferencia={preferencia}
            manifestacionId={manifestacionActiva?.id}
            audioEstadoOverride={audioBlocks['protagonista']?.estado}
            audioUrlOverride={audioBlocks['protagonista']?.url}
            onRequestAudio={() => requestAudio('protagonista', practica.base.protagonistaBloque.textContent)}
          />
        </motion.div>

        {/* 4. ACCIÓN CONCRETA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.24, ease: EASE }}
          className="rounded-[var(--radius-card)] p-5"
          style={{
            background: 'var(--surface)',
            border: '1px solid color-mix(in oklab, var(--accent) 20%, transparent)',
            boxShadow: 'var(--shadow-1)',
          }}
        >
          <div className="mb-3 flex items-center gap-2">
            <span
              className="flex size-6 shrink-0 items-center justify-center rounded-full"
              style={{ background: 'var(--chip-bg)' }}
              aria-hidden="true"
            >
              <Zap size={12} color="var(--accent)" strokeWidth={2} />
            </span>
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--accent)' }}
            >
              Acción de hoy
            </span>
          </div>
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {practica.base.accionConcreta.textContent}
          </p>
        </motion.div>

        {/* 5. IR MÁS PROFUNDO */}
        {practica.profundizar.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.28 }}
          >
            <button
              type="button"
              onClick={() => setProfundizarAbierto((v) => !v)}
              className="flex w-full items-center justify-between rounded-[var(--radius-card)] px-4 py-3 [touch-action:manipulation]"
              style={{
                background: 'var(--surface)',
                border: '1px solid color-mix(in oklab, var(--text-tertiary) 16%, transparent)',
              }}
              aria-expanded={profundizarAbierto}
            >
              <div className="flex items-center gap-2">
                <BookOpen size={15} color="var(--text-secondary)" strokeWidth={2} aria-hidden="true" />
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Ir más profundo
                </span>
                <span
                  className="rounded-full px-1.5 py-0.5 text-xs font-bold"
                  style={{
                    background: 'var(--chip-bg)',
                    color: 'var(--accent)',
                  }}
                >
                  {practica.profundizar.length}
                </span>
              </div>
              {profundizarAbierto
                ? <ChevronUp size={15} color="var(--text-tertiary)" />
                : <ChevronDown size={15} color="var(--text-tertiary)" />}
            </button>

            <AnimatePresence>
              {profundizarAbierto && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="flex flex-col gap-3 overflow-hidden pt-3"
                >
                  {practica.profundizar.map((bloque, i) => (
                    <div key={i}>
                      {bloque.tipo === 'scripting' ? (
                        <BloqueScripting
                          cm={bloque.contenido}
                          manifestacionId={manifestacionActiva?.id}
                        />
                      ) : (
                        <div
                          className="rounded-[var(--radius-card)] px-5 py-4"
                          style={{
                            background: bloque.tipo === 'afirmacion'
                              ? 'color-mix(in oklab, var(--accent) 5%, var(--surface))'
                              : 'var(--surface-2)',
                          }}
                        >
                          <div className="mb-2 flex items-center gap-2">
                            <span
                              className="flex size-5 shrink-0 items-center justify-center rounded-full"
                              style={{ background: 'color-mix(in oklab, var(--text-tertiary) 12%, transparent)' }}
                              aria-hidden="true"
                            >
                              {(() => { const I = LUCIDE_TIPO[bloque.tipo]; return <I size={10} color="var(--text-secondary)" strokeWidth={2} />; })()}
                            </span>
                            <span
                              className="text-xs font-semibold uppercase tracking-wider"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              {LABEL_PROFUNDIZAR[bloque.tipo]}
                            </span>
                          </div>
                          <p
                            className={`leading-relaxed ${bloque.tipo === 'afirmacion' ? 'text-base italic' : 'text-base'}`}
                            style={{
                              color: 'var(--text-primary)',
                              fontFamily: bloque.tipo === 'afirmacion' ? 'var(--font-display)' : undefined,
                            }}
                          >
                            {bloque.tipo === 'afirmacion'
                              ? `"${bloque.contenido.textContent}"`
                              : bloque.contenido.textContent}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* 6. CTA: LO HICE HOY / CICLO COMPLETO */}
        <motion.div
          ref={ctaRef}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.32, ease: EASE }}
        >
          <AnimatePresence mode="wait">
            {cicloCompleto && !celebrando ? (
              <motion.div
                key="ciclo-completo"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="flex flex-col items-center gap-4 rounded-[var(--radius-card)] px-4 py-6"
                style={{ background: 'var(--surface-rose)' }}
              >
                <span
                  className="flex size-12 items-center justify-center rounded-full"
                  style={{ background: 'var(--chip-bg)' }}
                  aria-hidden="true"
                >
                  <Star size={22} color="var(--accent)" strokeWidth={1.5} />
                </span>
                <div className="text-center">
                  <p
                    className="text-lg font-bold"
                    style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
                  >
                    Completaste 30 días
                  </p>
                  <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Ciclo {cicloActual} terminado · ¿Qué sigue?
                  </p>
                </div>
                <div className="flex w-full flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleSeManifesto}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] text-sm font-semibold text-white [touch-action:manipulation]"
                    style={{ background: 'var(--accent)' }}
                  >
                    <Sparkles size={15} strokeWidth={2} />
                    Se manifestó ✨
                  </button>
                  <button
                    type="button"
                    onClick={handleContinuarCiclo}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] text-xs font-semibold [touch-action:manipulation]"
                    style={{
                      background: 'var(--surface)',
                      color: 'var(--text-primary)',
                      border: '1px solid color-mix(in oklab, var(--text-tertiary) 20%, transparent)',
                    }}
                  >
                    Continuar con este deseo — Ciclo {cicloActual + 1}
                  </button>
                  <button
                    type="button"
                    onClick={() => setManifestacionActiva(null)}
                    className="h-9 text-xs font-medium [touch-action:manipulation]"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    Cambiar manifestación
                  </button>
                </div>
              </motion.div>
            ) : !completado ? (
              <motion.button
                key="cta"
                data-tour="checkin"
                type="button"
                onClick={completarPractica}
                disabled={celebrando}
                whileTap={{ scale: 0.97 }}
                exit={{ opacity: 0, scale: 0.95 }}
                initial={prefersReduced ? false : { boxShadow: '0 4px 16px color-mix(in oklab, var(--accent) 8%, transparent)' }}
                animate={prefersReduced ? {} : { boxShadow: ['0 4px 16px color-mix(in oklab, var(--accent) 8%, transparent)', '0 6px 32px color-mix(in oklab, var(--accent) 42%, transparent)', '0 4px 20px color-mix(in oklab, var(--accent) 22%, transparent)'] }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], times: [0, 0.5, 1] }}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] text-base font-semibold text-white [touch-action:manipulation] disabled:opacity-70"
                style={{ background: 'var(--accent)' }}
              >
                {celebrando ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Guardando…
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} strokeWidth={2.5} aria-hidden="true" />
                    Lo hice hoy
                  </>
                )}
              </motion.button>
            ) : (
              <motion.div
                key="completado"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                className="flex flex-col items-center gap-2 rounded-[var(--radius-card)] py-5"
                style={{ background: 'var(--surface-rose)' }}
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={18} color="var(--accent)" strokeWidth={1.5} aria-hidden="true" />
                  <span className="text-base font-semibold" style={{ color: 'var(--accent)' }}>
                    Práctica de hoy completada
                  </span>
                </div>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Día {diaActual} · {practica.fase}
                </span>
                {manifestacionActiva && (
                  <Link
                    href={`/app/manifestaciones/${manifestacionActiva.id}`}
                    className="mt-1 flex items-center gap-1 text-xs font-medium [touch-action:manipulation]"
                    style={{ color: 'var(--accent)' }}
                  >
                    Ver tu manifestación
                    <ChevronRight size={13} />
                  </Link>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        </>)}

        {/* ── PARA TI HOY — accesos rápidos ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.32 }}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.06em]" style={{ color: 'var(--text-tertiary)' }}>
            Para ti hoy
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Sparkles, label: 'Afirmación', href: '/app/scripting?intencion=gratitud' },
              { icon: Moon,     label: 'Visualización', href: '/app/biblioteca' },
              { icon: PenLine,  label: 'Scripting', href: '/app/scripting' },
            ].map(({ icon: Ico, label, href }, i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: 0.32 + i * 0.04, ease: EASE }}
              >
                <Link
                  href={href}
                  className="flex flex-col items-center gap-2 rounded-[var(--radius-card)] px-2 py-4 text-center [touch-action:manipulation]"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid color-mix(in oklab, var(--text-tertiary) 16%, transparent)',
                    boxShadow: 'var(--shadow-1)',
                  }}
                >
                  <span
                    className="flex size-12 items-center justify-center rounded-2xl"
                    style={{ background: 'color-mix(in oklab, var(--accent) 10%, transparent)' }}
                    aria-hidden="true"
                  >
                    <Ico size={22} color="var(--accent)" strokeWidth={1.8} />
                  </span>
                  <span className="text-xs font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>{label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── SEPARADOR DE MARCA ── */}
        <div className="flex items-center justify-center py-1" aria-hidden="true">
          <span style={{ color: 'var(--accent)', opacity: 0.3, fontSize: 10, letterSpacing: '0.4em' }}>✦ ✦ ✦</span>
        </div>

        {/* ── CHAT CON VICTORIA — tarjeta destacada por profundidad, no color ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.36, ease: EASE }}
        >
          <Link
            href="/app/chat"
            className="flex w-full items-center gap-4 rounded-[var(--radius-card)] p-4 [touch-action:manipulation]"
            style={{
              background: 'var(--surface)',
              border: '1px solid color-mix(in oklab, var(--accent) 14%, transparent)',
              boxShadow: 'var(--shadow-2)',
            }}
          >
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-xl"
              style={{ background: 'color-mix(in oklab, var(--accent) 10%, transparent)' }}
              aria-hidden="true"
            >
              <Moon size={18} color="var(--accent)" strokeWidth={1.8} />
            </span>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                Habla con Victoria
              </p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                Tu guía personal · disponible ahora
              </p>
            </div>
            <ChevronRight size={16} color="var(--text-tertiary)" aria-hidden="true" />
          </Link>
        </motion.div>

        {/* ── BIBLIOTECA — enlace secundario sin fondo ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.24, delay: 0.42, ease: EASE }}
        >
          <Link
            href="/app/biblioteca"
            className="flex items-center gap-2 px-1 py-2 [touch-action:manipulation]"
          >
            <BookOpen size={14} color="var(--text-tertiary)" strokeWidth={2} aria-hidden="true" />
            <span className="flex-1 text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Explorar la biblioteca
            </span>
            <ChevronRight size={14} color="var(--text-tertiary)" aria-hidden="true" />
          </Link>
        </motion.div>

        {/* ── NECESITO MANIFESTAR — después de Biblioteca ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.38 }}
          className="pb-28"
        >
          <button
              data-tour="urgente"
              type="button"
              onClick={abrirSheetUrgente}
              className="flex w-full items-center gap-4 rounded-[var(--radius-card)] p-4 [touch-action:manipulation]"
              style={{
                background: 'var(--surface)',
                border: '1px solid color-mix(in oklab, var(--accent) 20%, transparent)',
                boxShadow: 'var(--shadow-1)',
              }}
            >
              <span
                className="flex size-10 shrink-0 items-center justify-center rounded-xl"
                style={{ background: 'var(--chip-bg)' }}
                aria-hidden="true"
              >
                <Zap size={18} color="var(--accent)" strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                  Necesito manifestar ahora…
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Práctica al momento para lo que sientes ahora
                </p>
              </div>
              <ChevronRight size={16} color="var(--text-tertiary)" aria-hidden="true" />
            </button>
        </motion.div>

      </div>
    </div>

    {/* ── STICKY CTA — visible cuando el CTA inline sale de pantalla ── */}
    <AnimatePresence>
      {!ctaInView && !completado && manifestacionActiva && !cicloCompleto && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="fixed left-0 right-0 z-40 px-5 pb-2 md:hidden"
          style={{ bottom: 'calc(68px + env(safe-area-inset-bottom))' }}
        >
          <button
            type="button"
            onClick={completarPractica}
            disabled={celebrando}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold text-white shadow-lg [touch-action:manipulation]"
            style={{ background: 'var(--accent)' }}
          >
            <CheckCircle2 size={16} strokeWidth={2.5} />
            Lo hice hoy
          </button>
        </motion.div>
      )}
    </AnimatePresence>

    {/* ── TOAST DESHACER — aparece 4s después de "Lo hice hoy" ── */}
    <AnimatePresence>
      {undoVisible && (
        <motion.div
          initial={{ opacity: 0, y: 16, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 16, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="fixed bottom-24 left-1/2 z-50 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-lg"
          style={{
            background: 'var(--text-primary)',
            color: 'white',
            minWidth: 240,
          }}
          role="alert"
          aria-live="polite"
        >
          <span className="flex-1 text-sm font-medium">Práctica completada</span>
          <button
            type="button"
            onClick={handleDeshacer}
            className="shrink-0 rounded-full px-3 py-1.5 text-xs font-bold [touch-action:manipulation]"
            style={{ background: 'color-mix(in oklab, white 18%, transparent)', color: 'white' }}
          >
            Deshacer
          </button>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}

export default function AppHome() {
  return (
    <Suspense>
      <InicioContent />
    </Suspense>
  );
}
