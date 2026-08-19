'use client';

// MANIFIESTA — Onboarding (Fase 2 de la Secuencia Maestra)
// 5 pasos: Deseo → Obstáculo → Momento → Reconocimiento → Loading → Paywall
// Bienestar/consumo personalizado: 4-8 pasos de alto rendimiento (02B)
// Una pregunta por pantalla (Ley de Hick) · Auto-avance 320ms · Escape hatch en categoría abierta

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import ConstellationSVG from '@/components/ConstellationSVG';
import { useRouter } from 'next/navigation';
import {
  Banknote, Briefcase, Heart, Home, Leaf, Plane,
  Sunrise, Sun, Moon, ChevronLeft, ChevronDown, Check, Sparkles, Pencil,
  Repeat, BookOpen, HelpCircle, CloudOff,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { CATEGORIAS_ONBOARDING } from '@/lib/categorias';

// ── DATOS ─────────────────────────────────────────────────────────────────────

interface Opcion {
  key: string;
  label: string;
  icon?: LucideIcon;
}

// Mapa de íconos para las categorías del onboarding (UI concern, solo aquí)
const ICONO_CATEGORIA: Record<string, LucideIcon> = {
  Dinero:    Banknote,
  Trabajo:   Briefcase,
  Amor:      Heart,
  Hogar:     Home,
  Bienestar: Leaf,
  Viaje:     Plane,
};

const DESEOS: Opcion[] = CATEGORIAS_ONBOARDING.map((c) => ({
  key:   c.id.toLowerCase(),
  label: c.labelOnboarding,
  icon:  ICONO_CATEGORIA[c.id],
}));

const OBSTACULOS: Opcion[] = [
  { key: 'dejo',       label: 'Empiezo rituales y los dejo a los días',   icon: Repeat      },
  { key: 'consumo',    label: 'Consumo mucho contenido pero no practico', icon: BookOpen    },
  { key: 'nose',       label: 'No sé qué practicar cada día',             icon: HelpCircle  },
  { key: 'nofunciona', label: 'Siento que a mí no me funciona',           icon: CloudOff    },
];

const MOMENTOS: Opcion[] = [
  { key: 'manana', label: 'Al despertar',   icon: Sunrise },
  { key: 'dia',    label: 'Durante el día', icon: Sun     },
  { key: 'noche',  label: 'Antes de dormir', icon: Moon   },
];

// Etiquetas del deseo para el copy personalizado
const DESEO_LABELS: Record<string, string> = {
  dinero:    'dinero y abundancia',
  trabajo:   'trabajo y éxito',
  amor:      'amor y relaciones',
  hogar:     'hogar y estabilidad',
  bienestar: 'salud y bienestar',
  viaje:     'viaje y libertad',
};

// Frase del obstáculo para el reconocimiento personalizado (paso 3)
const RECONOCIMIENTO_OBSTACULO: Record<string, string> = {
  dejo:       'cada vez que empiezas algo, lo dejas',
  consumo:    'consumes contenido pero no lo practicas',
  nose:       'no sabes exactamente qué hacer cada día',
  nofunciona: 'sientes que a ti no te funciona',
};

// Afirmación pre-generada por deseo para el preview (paso 5)
const AFIRMACIONES: Record<string, string> = {
  dinero:    'El dinero y la prosperidad fluyen hacia mí con facilidad y gratitud. Estoy lista para recibirlos de formas inesperadas y maravillosas.',
  trabajo:   'Mi trabajo refleja mis talentos únicos y crea valor real. Las oportunidades correctas llegan en el momento exacto.',
  amor:      'El amor se expande en mi vida de formas profundas y significativas. Estoy lista para darlo y recibirlo plenamente.',
  hogar:     'Mi hogar es un refugio de paz, calidez y abundancia. Cada día construyo el espacio que merece mi vida.',
  bienestar: 'Mi cuerpo y mente se fortalecen y sanan cada día. Vivo con energía, claridad y gratitud profunda.',
  viaje:     'La libertad y la aventura son parte natural de mi vida. El universo me lleva exactamente donde necesito estar.',
};

// Pasos que Victoria muestra mientras "prepara" (paso 4)
const PASOS_PREPARACION = [
  'Entendiendo lo que quieres manifestar',
  'Adaptando la práctica a lo que hoy te cuesta',
  'Preparando tu afirmación',
  'Creando tu scripting y ritual',
  'Eligiendo una acción para hoy',
];

// Progreso de la barra — 6 pasos: deseo · obstáculo · momento · reconocimiento · preparación · preview
const PROGRESO = [22, 44, 64, 82, 90, 96];

// ── CHIP ──────────────────────────────────────────────────────────────────────

function Chip({
  opcion,
  seleccionado,
  bloqueado,
  onTap,
}: {
  opcion: Opcion;
  seleccionado: boolean;
  bloqueado: boolean;
  onTap: () => void;
}) {
  const Icono = opcion.icon;
  return (
    <motion.button
      type="button"
      whileTap={bloqueado ? {} : { scale: 0.97 }}
      onClick={bloqueado ? undefined : onTap}
      aria-pressed={seleccionado}
      className={`relative flex h-[60px] w-full items-center gap-3 rounded-[var(--radius-card)] border px-4 text-left transition-colors duration-150 [touch-action:manipulation] ${
        seleccionado
          ? 'border-[color-mix(in_oklab,var(--accent)_80%,transparent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)]'
          : 'border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface)] hover:border-[color-mix(in_oklab,var(--accent)_40%,transparent)]'
      }`}
      style={{ boxShadow: 'var(--shadow-1)' }}
    >
      {Icono && (
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--chip-bg)]"
        >
          <Icono size={18} color="var(--accent)" strokeWidth={1.8} />
        </span>
      )}
      <span className="flex-1 text-[15px] font-medium leading-snug text-[var(--text-primary)]">
        {opcion.label}
      </span>
      <AnimatePresence>
        {seleccionado && (
          <motion.span
            key="check"
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.3, opacity: 0 }}
            transition={{ duration: 0.18, type: 'spring', stiffness: 500, damping: 25 }}
            aria-hidden="true"
            className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]"
          >
            <Check size={11} strokeWidth={3} color="white" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ── ONBOARDING ────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const reduce = useReducedMotion();

  const [step, setStep]           = useState(0);
  const [dir, setDir]             = useState(1);   // 1=forward -1=backward
  const [deseo, setDeseo]         = useState<string | null>(null);
  const [deseoCustom, setDeseoCustom] = useState('');
  const [obstaculo, setObstaculo] = useState<string | null>(null);
  const [momento, setMomento]     = useState<string | null>(null);
  const [bloqueado, setBloqueado] = useState(false);
  const [verMasDeseos, setVerMasDeseos] = useState(false);
  // Paso 4 — Victoria preparando
  const [pasosVisibles, setPasosVisibles] = useState(0);
  const [practicaLista, setPracticaLista] = useState(false);

  // Navegación por teclado entre chips — ArrowDown/ArrowUp
  const handleListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const buttons = Array.from(
      e.currentTarget.querySelectorAll<HTMLElement>('button[aria-pressed]')
    );
    const idx = buttons.indexOf(document.activeElement as HTMLElement);
    if (idx === -1) return;
    const next = e.key === 'ArrowDown' ? (idx + 1) % buttons.length : (idx - 1 + buttons.length) % buttons.length;
    buttons[next]?.focus();
  };

  // Auto-avance: seleccionar → ver check 320ms → avanzar
  const seleccionarYAvanzar = useCallback(
    (setter: (v: string) => void, valor: string) => {
      if (bloqueado) return;
      setter(valor);
      setBloqueado(true);
      setTimeout(() => {
        setBloqueado(false);
        setDir(1);
        setStep((s) => s + 1);
      }, 320);
    },
    [bloqueado]
  );

  const volver = () => {
    if (step === 0 || step >= 4) return;
    setDir(-1);
    setStep((s) => s - 1);
  };

  // Avanzar desde el reconocimiento (paso 3 → Victoria preparando)
  const avanzarAlLoading = () => {
    setDir(1);
    setStep(4);
  };

  // Ir al paywall desde el preview (paso 5) — guarda en sessionStorage y navega
  const irAlPaywall = () => {
    sessionStorage.setItem('ob_deseo',     deseo === 'otro' ? deseoCustom : (deseo ?? ''));
    sessionStorage.setItem('ob_obstaculo', obstaculo ?? '');
    sessionStorage.setItem('ob_momento',   momento ?? '');
    router.push('/onboarding/paywall');
  };

  const [hintCustom, setHintCustom] = useState(false);

  // Avanzar desde "otro" con texto
  const avanzarDeseoCustom = () => {
    if (!deseoCustom.trim()) { setHintCustom(true); return; }
    if (bloqueado) return;
    setHintCustom(false);
    setDeseo('otro');
    setBloqueado(true);
    setTimeout(() => {
      setBloqueado(false);
      setDir(1);
      setStep(1);
    }, 80);
  };

  // Paso 4 — Victoria preparando: revela items secuencialmente, luego auto-avanza a paso 5
  useEffect(() => {
    if (step !== 4) {
      setPasosVisibles(0);
      setPracticaLista(false);
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    PASOS_PREPARACION.forEach((_, i) => {
      timers.push(setTimeout(() => setPasosVisibles(i + 1), 500 + i * 650));
    });
    timers.push(setTimeout(() => setPracticaLista(true), 500 + PASOS_PREPARACION.length * 650 + 350));
    timers.push(setTimeout(() => { setDir(1); setStep(5); }, 500 + PASOS_PREPARACION.length * 650 + 950));
    return () => timers.forEach(clearTimeout);
  }, [step]);

  // Variants de slide
  const variantes = {
    enter:  (d: number) => ({ x: reduce ? 0 : d * 36, opacity: 0   }),
    center: { x: 0, opacity: 1 },
    exit:   (d: number) => ({ x: reduce ? 0 : d * -36, opacity: 0 }),
  };
  const tx = { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const };

  const progresoPct = PROGRESO[step] ?? 8;

  return (
    <div
      className="flex min-h-dvh flex-col"
      style={{ background: 'var(--bg)', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}
    >
      {/* Grain — dispositivo ownable de identidad visual */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          opacity: 0.07,
        }}
      />
      {/* Pétalo decorativo — ownable visible en el fondo superior */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed right-0 top-0 -z-[1]"
        style={{ opacity: 0.12 }}
      >
        <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: 'var(--accent)' }}>
          <ellipse cx="130" cy="50" rx="90" ry="55" transform="rotate(-30 130 50)" fill="currentColor"/>
        </svg>
      </div>
      {/* HEADER */}
      <header
        className="sticky top-0 z-10 px-4 pt-4 pb-3"
        style={{ background: 'var(--bg)' }}
      >
        <div className="flex items-center gap-2">
          {step < 4 && (
            <button
              type="button"
              onClick={step === 0 ? () => router.push('/') : volver}
              aria-label={step === 0 ? 'Volver al inicio' : 'Volver'}
              className="flex size-11 shrink-0 items-center justify-center rounded-full transition-colors [touch-action:manipulation] hover:bg-[var(--surface-2)]"
            >
              <ChevronLeft size={22} color="var(--text-secondary)" />
            </button>
          )}
          <a href="/" className="flex items-center gap-2 text-[15px] font-semibold">
            <span aria-hidden="true" className="size-5 rounded-[6px] bg-[var(--accent)]" />
            MANIFIESTA
          </a>
          {step < 3 && (
            <span className="ml-auto text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
              {step + 1}/3
            </span>
          )}
        </div>

        {/* Barra de progreso — 3px, pill, fill animado */}
        <div
          className="mt-3 h-[3px] w-full overflow-hidden rounded-full"
          style={{ background: 'color-mix(in oklab, var(--accent) 12%, transparent)' }}
        >
          <motion.div
            animate={{ width: `${progresoPct}%` }}
            transition={{ duration: reduce ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full"
            style={{ background: 'var(--accent)' }}
          />
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="flex flex-1 flex-col px-4">
        <AnimatePresence custom={dir} mode="wait">

          {/* ── PASO 0 · Deseo ──────────────────────────────── */}
          {step === 0 && (
            <motion.div
              key="s0"
              custom={dir}
              variants={variantes}
              initial="enter"
              animate="center"
              exit="exit"
              transition={tx}
              className="flex flex-1 flex-col pt-8"
            >
              <h1
                className="text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-balance"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                ¿Qué quieres atraer?
              </h1>
              <p className="mt-1.5 text-[14px] text-[var(--text-secondary)]">
                Victoria diseñará tu práctica para este deseo
              </p>

              <div className="mt-6 flex flex-col gap-3 pb-8" onKeyDown={handleListKeyDown}>
                {/* Mostrar 4 opciones principales — "Ver más" revela las 2 restantes */}
                {DESEOS.slice(0, 4).map((op, i) => (
                  <motion.div
                    key={op.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, delay: reduce ? 0 : i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Chip
                      opcion={op}
                      seleccionado={deseo === op.key}
                      bloqueado={bloqueado}
                      onTap={() => seleccionarYAvanzar(setDeseo, op.key)}
                    />
                  </motion.div>
                ))}
                {/* Opciones extra — colapsadas hasta que la usuaria pide ver más */}
                <AnimatePresence>
                  {verMasDeseos && DESEOS.slice(4).map((op, i) => (
                    <motion.div
                      key={op.key}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.22, delay: i * 0.05 }}
                    >
                      <Chip
                        opcion={op}
                        seleccionado={deseo === op.key}
                        bloqueado={bloqueado}
                        onTap={() => seleccionarYAvanzar(setDeseo, op.key)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
                {/* Ver más — solo visible cuando la opciones extra están ocultas */}
                {!verMasDeseos && (
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: reduce ? 0 : 0.26 }}
                    onClick={() => setVerMasDeseos(true)}
                    className="flex items-center justify-center gap-1.5 py-1 text-[13px] [touch-action:manipulation] transition-colors"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    <ChevronDown size={13} color="var(--text-tertiary)" />
                    Ver más opciones
                  </motion.button>
                )}

                {/* Escape hatch — categoría abierta (obligatorio, 50 → A2) */}
                {deseo !== 'otro' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, delay: reduce ? 0 : DESEOS.length * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  >
                  <button
                    type="button"
                    onClick={() => setDeseo('otro')}
                    className="flex h-11 w-full items-center justify-center gap-2 text-[13px] [touch-action:manipulation] transition-colors"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    <Pencil size={12} color="var(--text-tertiary)" />
                    Algo más específico (escríbelo)
                  </button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-3"
                  >
                    <div className="rounded-2xl border-2 border-[color-mix(in_oklab,var(--accent)_60%,transparent)] bg-[var(--surface)] px-4 py-3">
                      <input
                        type="text"
                        autoFocus
                        value={deseoCustom}
                        onChange={(e) => { setDeseoCustom(e.target.value); setHintCustom(false); }}
                        onKeyDown={(e) => e.key === 'Enter' && avanzarDeseoCustom()}
                        placeholder="Ej: conseguir mi casa propia"
                        className="w-full bg-transparent text-[16px] font-medium text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
                      />
                    </div>
                    {hintCustom && (
                      <p className="text-[12px] font-medium" style={{ color: 'var(--accent)' }}>
                        Escribe tu deseo para continuar
                      </p>
                    )}
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={avanzarDeseoCustom}
                      className="flex h-[52px] w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[17px] font-semibold text-white shadow-[0_8px_30px_color-mix(in_oklab,var(--accent)_25%,transparent)] [touch-action:manipulation]"
                    >
                      Continuar
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── PASO 1 · Obstáculo ──────────────────────────── */}
          {step === 1 && (
            <motion.div
              key="s1"
              custom={dir}
              variants={variantes}
              initial="enter"
              animate="center"
              exit="exit"
              transition={tx}
              className="flex flex-1 flex-col pt-8"
            >
              <h1
                className="text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-balance"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                ¿Qué te pasa más seguido?
              </h1>
              <p className="mt-1.5 text-[14px] text-[var(--text-secondary)]">
                Sé honesta — Victoria lo usa para personalizar tu práctica
              </p>
              <div className="mt-6 flex flex-col gap-3 pb-8" onKeyDown={handleListKeyDown}>
                {OBSTACULOS.map((op, i) => (
                  <motion.div
                    key={op.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, delay: reduce ? 0 : i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Chip
                      opcion={op}
                      seleccionado={obstaculo === op.key}
                      bloqueado={bloqueado}
                      onTap={() => seleccionarYAvanzar(setObstaculo, op.key)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── PASO 2 · Momento ────────────────────────────── */}
          {step === 2 && (
            <motion.div
              key="s2"
              custom={dir}
              variants={variantes}
              initial="enter"
              animate="center"
              exit="exit"
              transition={tx}
              className="flex flex-1 flex-col pt-8"
            >
              <h1
                className="text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-balance"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                ¿Cuándo harías tu práctica?
              </h1>
              <p className="mt-1.5 text-[14px] text-[var(--text-secondary)]">
                Victoria te esperará a esa hora cada día
              </p>
              <div className="mt-6 flex flex-col gap-3 pb-8" onKeyDown={handleListKeyDown}>
                {MOMENTOS.map((op, i) => (
                  <motion.div
                    key={op.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, delay: reduce ? 0 : i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Chip
                      opcion={op}
                      seleccionado={momento === op.key}
                      bloqueado={bloqueado}
                      onTap={() => seleccionarYAvanzar(setMomento, op.key)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── PASO 3 · Reconocimiento personalizado ──────── */}
          {step === 3 && (
            <motion.div
              key="s3"
              custom={dir}
              variants={variantes}
              initial="enter"
              animate="center"
              exit="exit"
              transition={tx}
              className="flex flex-1 flex-col py-8"
            >
              {(() => {
                const deseoLabel = DESEO_LABELS[deseo ?? ''] ?? (deseo === 'otro' ? deseoCustom : deseo) ?? 'algo mejor';
                const obstaculoTexto = RECONOCIMIENTO_OBSTACULO[obstaculo ?? 'nose'] ?? 'no encuentras la práctica correcta';
                return (
                  <>
                    <div className="flex flex-col gap-5 pt-8">
                      <motion.div
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.45, type: 'spring', stiffness: 280, damping: 22 }}
                        className="flex size-16 items-center justify-center rounded-2xl"
                        style={{ background: 'color-mix(in oklab, var(--accent) 12%, transparent)' }}
                      >
                        <Sparkles size={32} color="var(--accent)" strokeWidth={1.5} />
                      </motion.div>

                      <motion.h1
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="text-[28px] font-bold leading-[1.15] tracking-[-0.02em]"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        Ya entendí qué estaba pasando.
                      </motion.h1>

                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.22 }}
                        className="flex flex-col gap-3"
                      >
                        <p className="text-[15px] leading-relaxed text-[var(--text-secondary)]">
                          Quieres{' '}
                          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {deseoLabel}
                          </span>{' '}
                          pero{' '}
                          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                            {obstaculoTexto}
                          </span>
                          .
                        </p>
                        <p className="text-[15px] leading-relaxed text-[var(--text-secondary)]">
                          Por eso tu práctica no debería sentirse como otra rutina. Victoria va a prepararla alrededor de ti.
                        </p>
                      </motion.div>
                    </div>

                    <div className="flex-1" />

                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={avanzarAlLoading}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.38 }}
                      className="mt-6 flex h-[52px] w-full shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[17px] font-semibold text-white shadow-[0_8px_30px_color-mix(in_oklab,var(--accent)_25%,transparent)] [touch-action:manipulation]"
                    >
                      Sí, quiero mi práctica
                    </motion.button>
                  </>
                );
              })()}
            </motion.div>
          )}

          {/* ── PASO 4 · Victoria preparando ────────────────── */}
          {step === 4 && (
            <motion.div
              key="s4"
              custom={dir}
              variants={variantes}
              initial="enter"
              animate="center"
              exit="exit"
              transition={tx}
              className="relative flex flex-1 flex-col justify-center gap-8 py-12"
            >
              {/* Constelación decorativa de fondo */}
              <div className="pointer-events-none absolute right-0 top-4 opacity-60" aria-hidden="true">
                <ConstellationSVG width={240} height={120} opacity={0.3} delay={0.6} />
              </div>
              {(() => {
                const deseoLabel = DESEO_LABELS[deseo ?? ''] ?? (deseo === 'otro' ? deseoCustom : deseo) ?? 'tu deseo';
                return (
                  <>
                    <div className="flex flex-col gap-3">
                      <motion.div
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, type: 'spring', stiffness: 260, damping: 22 }}
                        className="flex size-16 items-center justify-center rounded-2xl"
                        style={{ background: 'color-mix(in oklab, var(--accent) 12%, transparent)' }}
                      >
                        <Sparkles size={32} color="var(--accent)" strokeWidth={1.5} />
                      </motion.div>

                      <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.38, delay: 0.12 }}
                        className="text-[22px] font-bold leading-snug tracking-[-0.02em]"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        Victoria está preparando algo para ti
                      </motion.h2>

                      <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.34, delay: 0.22 }}
                        className="text-[14px]"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Está creando tu primera práctica para{' '}
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                          {deseoLabel}
                        </span>
                        .
                      </motion.p>
                    </div>

                    {/* Lista de pasos secuenciales */}
                    <div className="flex flex-col gap-3">
                      {PASOS_PREPARACION.map((paso, i) => (
                        <AnimatePresence key={paso}>
                          {pasosVisibles > i && (
                            <motion.div
                              initial={{ opacity: 0, x: -12 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                              className="flex items-center gap-3"
                            >
                              <motion.span
                                initial={{ scale: 0.4 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.25, type: 'spring', stiffness: 400, damping: 20 }}
                                className="flex size-6 shrink-0 items-center justify-center rounded-full"
                                style={{ background: 'color-mix(in oklab, var(--accent) 14%, transparent)' }}
                              >
                                <Check size={12} color="var(--accent)" strokeWidth={2.5} />
                              </motion.span>
                              <span className="text-[14px] font-medium" style={{ color: 'var(--text-primary)' }}>
                                {paso}
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      ))}
                    </div>

                    {/* "Tu práctica está lista" — aparece después del último paso */}
                    <AnimatePresence>
                      {practicaLista && (
                        <motion.p
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                          className="text-[15px] font-semibold"
                          style={{ color: 'var(--accent)' }}
                        >
                          Tu práctica está lista
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </>
                );
              })()}
            </motion.div>
          )}

          {/* ── PASO 5 · Preview personalizado ──────────────── */}
          {step === 5 && (
            <motion.div
              key="s5"
              custom={dir}
              variants={variantes}
              initial="enter"
              animate="center"
              exit="exit"
              transition={tx}
              className="flex flex-1 flex-col py-8"
            >
              {(() => {
                const deseoLabel = DESEO_LABELS[deseo ?? ''] ?? (deseo === 'otro' ? deseoCustom : deseo) ?? 'tu deseo';
                const afirmacion = AFIRMACIONES[deseo ?? ''] ?? 'Estoy lista para recibir todo lo bueno que el universo tiene para mí.';
                return (
                  <>
                    <div className="flex flex-col gap-5">
                      {/* Kicker */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.32 }}
                      >
                        <span
                          className="text-[11px] font-bold uppercase tracking-[0.1em]"
                          style={{ color: 'var(--accent)' }}
                        >
                          Tu primera práctica
                        </span>
                        <h1
                          className="mt-1.5 text-[26px] font-bold leading-[1.15] tracking-[-0.02em]"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          Esto es lo que Victoria preparó para ti.
                        </h1>
                      </motion.div>

                      {/* Card: deseo activo */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.32, delay: 0.1 }}
                        className="flex items-center gap-3 rounded-2xl px-4 py-3"
                        style={{
                          background: 'color-mix(in oklab, var(--accent) 8%, transparent)',
                          border: '1px solid color-mix(in oklab, var(--accent) 20%, transparent)',
                        }}
                      >
                        <Sparkles size={16} color="var(--accent)" strokeWidth={1.8} aria-hidden="true" />
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: 'var(--accent)' }}>
                            Estás manifestando
                          </p>
                          <p className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                            {deseoLabel}
                          </p>
                        </div>
                      </motion.div>

                      {/* Card: afirmación generada */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.32, delay: 0.18 }}
                        className="rounded-2xl p-4"
                        style={{
                          background: 'var(--surface)',
                          border: '1px solid color-mix(in oklab, var(--text-tertiary) 18%, transparent)',
                        }}
                      >
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: 'var(--text-tertiary)' }}>
                          Tu afirmación
                        </p>
                        <p
                          className="text-[15px] leading-relaxed italic"
                          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
                        >
                          "{afirmacion}"
                        </p>
                      </motion.div>

                      {/* Teaser — contenido que espera */}
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.32, delay: 0.28 }}
                        className="flex flex-col gap-2.5"
                      >
                        <p className="text-[12px] font-semibold uppercase tracking-[0.06em]" style={{ color: 'var(--text-tertiary)' }}>
                          También incluye
                        </p>
                        {[
                          'Scripting personalizado',
                          'Ritual breve',
                          'Acción para hoy',
                        ].map((item) => (
                          <div key={item} className="flex items-center gap-2.5">
                            <span
                              className="text-[11px] font-bold"
                              style={{ color: 'var(--champagne)' }}
                              aria-hidden="true"
                            >
                              ✦
                            </span>
                            <span className="text-[14px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                              {item}
                            </span>
                          </div>
                        ))}
                      </motion.div>
                    </div>

                    <div className="flex-1" />

                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={irAlPaywall}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.36 }}
                      className="mt-8 flex h-[52px] w-full shrink-0 items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-[17px] font-semibold text-white shadow-[0_8px_30px_color-mix(in_oklab,var(--accent)_25%,transparent)] [touch-action:manipulation]"
                    >
                      Ver mi práctica completa
                      <ChevronLeft size={18} color="white" strokeWidth={2.5} style={{ transform: 'rotate(180deg)' }} />
                    </motion.button>
                  </>
                );
              })()}
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
