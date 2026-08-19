'use client';

// MANIFIESTA — Scripting
// Dos modos:
//   • normal: chips de intención libres (sin ?manifestacionId)
//   • vinculado: ?manifestacionId=<id> → guarda el script en la manifestación del contexto
//   • urgente: ?modo=urgente → intención libre, prompt genérico

import { useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useManifestaciones } from '@/lib/ManifestacionesContext';

// ── Intenciones / categorías ──────────────────────────────────────────────
const INTENCIONES = [
  { key: 'dinero',    label: 'Dinero'   },
  { key: 'trabajo',   label: 'Trabajo'  },
  { key: 'amor',      label: 'Amor'     },
  { key: 'salud',     label: 'Salud'    },
  { key: 'soltar',    label: 'Soltar'   },
  { key: 'gratitud',  label: 'Gratitud' },
] as const;

// ── Prompts de Victoria por intención ─────────────────────────────────────
const PROMPTS: Record<string, string> = {
  dinero:
    'Escribe como si ya tuvieras el dinero que deseas. Describe cómo se siente, qué puedes hacer ahora, qué cambió en tu vida.',
  trabajo:
    'Escribe sobre el trabajo o proyecto que está llegando. ¿Cómo te sientes al recibirlo? ¿Qué oportunidades abre?',
  amor:
    'Escribe sobre el amor que ya está en tu vida o que está llegando. Siente la calidez, la gratitud, la conexión.',
  salud:
    'Escribe sobre tu cuerpo con gratitud y amor. Describe la energía que sientes, la vitalidad que es tuya.',
  soltar:
    'Escribe qué estás soltando hoy. Deja ir aquello que ya no te sirve, con amor y sin culpa.',
  gratitud:
    'Escribe todo lo que agradeces hoy. Desde lo más pequeño hasta lo más grande — todo tiene valor.',
  bienestar:
    'Escribe sobre cómo se siente tu vida cuando estás en paz. Describe ese estado con todos tus sentidos.',
};

const PROMPT_URGENTE =
  'Escribe lo que necesitas manifestar ahora mismo. Sin filtros, sin perfección — solo expresa tu intención con claridad y sentimiento.';

// Scripts independientes de ejemplo (solo se muestran cuando NO hay manifestacionId)
const SCRIPTS_INDEPENDIENTES = [
  {
    id: 'ej1',
    intencion: 'dinero',
    texto: 'El dinero llega a mí de formas inesperadas y maravillosas. Hoy recibí una oportunidad que no esperaba y la recibí con gratitud.',
    fecha: 'Hace 2 días',
  },
  {
    id: 'ej2',
    intencion: 'trabajo',
    texto: 'Mi proyecto nuevo está siendo visto por las personas correctas. Confío en que el universo alinea todo para mi mayor bien.',
    fecha: 'Hace 4 días',
  },
];

// ── Chip de intención ─────────────────────────────────────────────────────
function ChipIntencion({
  item,
  activo,
  onTap,
}: {
  item: (typeof INTENCIONES)[number];
  activo: boolean;
  onTap: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={onTap}
      className="flex h-8 items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium [touch-action:manipulation]"
      style={{
        background: activo ? 'var(--accent)' : 'var(--surface)',
        borderColor: activo
          ? 'var(--accent)'
          : 'color-mix(in oklab, var(--text-tertiary) 28%, transparent)',
        color: activo ? 'white' : 'var(--text-secondary)',
      }}
    >
      {item.label}
    </motion.button>
  );
}

// ── Contenido principal ───────────────────────────────────────────────────
function ScriptingContent() {
  const searchParams = useSearchParams();
  const { getById, addScript } = useManifestaciones();

  const urgente = searchParams.get('modo') === 'urgente';
  const manifestacionId = searchParams.get('manifestacionId') ?? undefined;
  const intencionParam = searchParams.get('intencion') ?? '';

  // Manifestación vinculada (si existe)
  const manifestacion = manifestacionId ? getById(manifestacionId) : undefined;

  // Intención inicial: la de la manifestación > la del param > 'dinero'
  const intencionInicial = manifestacion
    ? manifestacion.categoria.toLowerCase()
    : intencionParam || (urgente ? '' : 'dinero');

  const [intencion, setIntencion] = useState<string>(intencionInicial);
  const [texto, setTexto] = useState('');
  const [guardado, setGuardado] = useState(false);
  // Scripts independientes solo se muestran cuando no hay manifestacionId
  const [scriptsLocales, setScriptsLocales] = useState(
    manifestacionId ? [] : SCRIPTS_INDEPENDIENTES
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const prompt = urgente
    ? PROMPT_URGENTE
    : PROMPTS[intencion] ?? PROMPTS.dinero;

  const EASE = [0.16, 1, 0.3, 1] as const;

  const guardar = () => {
    if (!texto.trim()) return;

    if (manifestacionId) {
      // Guardar en la manifestación del contexto (fuente de verdad)
      addScript(manifestacionId, texto.trim(), intencion || undefined);
    } else {
      // Script independiente — solo estado local
      setScriptsLocales((prev) => [
        {
          id: `local-${Date.now()}`,
          intencion: intencion || 'gratitud',
          texto: texto.trim(),
          fecha: 'Ahora mismo',
        },
        ...prev,
      ]);
    }

    setTexto('');
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2200);
    textareaRef.current?.focus();
  };

  // Scripts a mostrar en la sección inferior
  const scriptsAMostrar = manifestacion
    ? manifestacion.scripts.slice(0, 5)
    : scriptsLocales;

  return (
    <div className="flex flex-col">
      {/* ── HEADER ── */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="px-5 pt-6 pb-4"
      >
        <div className="flex items-center gap-3">
          {manifestacionId && (
            <Link
              href={`/app/manifestaciones/${manifestacionId}`}
              className="flex size-9 shrink-0 items-center justify-center rounded-xl [touch-action:manipulation]"
              style={{ background: 'color-mix(in oklab, var(--text-tertiary) 10%, transparent)' }}
              aria-label="Volver a la manifestación"
            >
              <ArrowLeft size={18} color="var(--text-secondary)" />
            </Link>
          )}
          <div>
            <h1
              className="text-[20px] font-bold tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {urgente ? 'Manifestar ahora' : 'Scripting'}
            </h1>
            <p className="mt-0.5 text-[13px]" style={{ color: 'var(--text-secondary)' }}>
              {urgente
                ? 'Escribe con intención y claridad'
                : 'Escribe tus manifestaciones con Victoria'}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col gap-4 px-5">

        {/* ── BANNER: escribiendo para esta manifestación ── */}
        {manifestacion && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="flex items-center gap-2.5 rounded-2xl px-4 py-3"
            style={{
              background: 'color-mix(in oklab, var(--accent) 9%, transparent)',
              border: '1px solid color-mix(in oklab, var(--accent) 20%, transparent)',
            }}
          >
            <span className="text-[16px]" aria-hidden="true">{manifestacion.categoriaEmoji}</span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: 'var(--accent)' }}>
                Escribiendo para
              </p>
              <p className="truncate text-[14px] font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                {manifestacion.deseo}
              </p>
            </div>
            <Sparkles size={14} color="var(--accent)" strokeWidth={1.8} aria-hidden="true" />
          </motion.div>
        )}

        {/* ── CHIPS DE INTENCIÓN (solo en modo libre — sin manifestación vinculada) ── */}
        {!urgente && !manifestacion && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.06, ease: EASE }}
            className="flex flex-wrap gap-2"
          >
            {INTENCIONES.map((item) => (
              <ChipIntencion
                key={item.key}
                item={item}
                activo={intencion === item.key}
                onTap={() => setIntencion(item.key)}
              />
            ))}
          </motion.div>
        )}

        {/* ── GUÍA DE VICTORIA ── */}
        <motion.div
          key={intencion}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: EASE }}
          className="flex items-start gap-2.5 rounded-2xl px-4 py-3"
          style={{ background: 'color-mix(in oklab, var(--accent) 7%, transparent)' }}
        >
          <Sparkles
            size={15}
            color="var(--accent)"
            strokeWidth={1.8}
            className="mt-0.5 shrink-0"
            aria-hidden="true"
          />
          <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <span className="font-semibold" style={{ color: 'var(--accent)' }}>Victoria sugiere: </span>
            {prompt}
          </p>
        </motion.div>

        {/* ── ÁREA DE ESCRITURA ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, delay: 0.1, ease: EASE }}
          className="relative rounded-2xl border"
          style={{
            background: 'var(--surface)',
            borderColor: texto
              ? 'color-mix(in oklab, var(--accent) 50%, transparent)'
              : 'color-mix(in oklab, var(--text-tertiary) 25%, transparent)',
          }}
        >
          <textarea
            ref={textareaRef}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder={
              manifestacion
                ? `Escribe para "${manifestacion.deseo}"...`
                : 'Escribe aquí tu manifestación...'
            }
            rows={5}
            className="w-full resize-none rounded-2xl bg-transparent px-4 pt-4 pb-12 text-[15px] leading-relaxed focus:outline-none"
            style={{ color: 'var(--text-primary)' }}
            aria-label="Escribe tu manifestación"
          />

          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 pb-3">
            <span className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
              {texto.length > 0 ? `${texto.trim().split(/\s+/).length} palabras` : ''}
            </span>

            <AnimatePresence mode="wait">
              {guardado ? (
                <motion.span
                  key="ok"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 text-[13px] font-semibold"
                  style={{ color: 'var(--accent)' }}
                >
                  <CheckCircle2 size={14} strokeWidth={2.5} />
                  {manifestacion ? 'Guardado en tu manifestación' : 'Guardada'}
                </motion.span>
              ) : (
                <motion.button
                  key="guardar"
                  type="button"
                  onClick={guardar}
                  disabled={!texto.trim()}
                  whileTap={{ scale: 0.93 }}
                  className="flex h-8 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold text-white [touch-action:manipulation] disabled:opacity-40"
                  style={{ background: 'var(--accent)' }}
                >
                  <Send size={13} strokeWidth={2.5} aria-hidden="true" />
                  Guardar
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── SCRIPTS ANTERIORES ── */}
        {scriptsAMostrar.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.18 }}
            className="pb-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2
                className="text-[13px] font-semibold uppercase tracking-[0.05em]"
                style={{ color: 'var(--text-tertiary)' }}
              >
                {manifestacion ? 'Scripts de esta manifestación' : 'Tus manifestaciones'}
              </h2>
              <span className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
                {manifestacion ? manifestacion.scripts.length : scriptsLocales.length}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {scriptsAMostrar.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-4"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid color-mix(in oklab, var(--text-tertiary) 18%, transparent)',
                  }}
                >
                  <p className="mb-1.5 text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
                    {'intencion' in item && item.intencion
                      ? `${INTENCIONES.find((i) => i.key === item.intencion)?.label ?? item.intencion} · `
                      : ''}
                    {item.fecha}
                  </p>
                  <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                    {item.texto}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Si hay más scripts en la manifestación de los que se muestran */}
            {manifestacion && manifestacion.scripts.length > 5 && (
              <p className="mt-2 text-center text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
                +{manifestacion.scripts.length - 5} más en tu manifestación
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function ScriptingPage() {
  return (
    <Suspense>
      <ScriptingContent />
    </Suspense>
  );
}
