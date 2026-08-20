'use client';

// MANIFIESTA — Detalle de Biblioteca
// Adaptativo por tipo: ritual / afirmacion / decreto / visualizacion / scripting-guiado / senal

import { use, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Clock,
  Repeat2,
  ChevronRight,
  Sparkles,
  Flame,
  FileText,
  Eye,
  BookOpen,
  Heart,
  PenLine,
  Flower2,
  Hash,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { getById, TIPO_LABEL } from '@/lib/biblioteca-types';
import type { TipoContenido } from '@/lib/biblioteca-types';

const TIPO_ICON: Record<TipoContenido, LucideIcon> = {
  ritual: Flame,
  afirmacion: Sparkles,
  decreto: FileText,
  visualizacion: Eye,
  'scripting-guiado': PenLine,
  senal: Hash,
  journaling: BookOpen,
  gratitud: Heart,
  autoestima: Flower2,
};
import { useBiblioteca } from '@/lib/useBiblioteca';
import { VictoriaAudioPlayer } from '@/components/VictoriaAudioPlayer';
import type { AudioEstado } from '@/lib/manifestaciones-types';

const EASE = [0.16, 1, 0.3, 1] as const;

// Voz por defecto para audio editorial (debe coincidir con CARTESIA_VOICE_ID en el servidor)
const CARTESIA_VOICE_ID_DEFAULT = '3597a26f-80ef-4bd5-8101-9699bc764917';

// ── Audio cache (module-level: sobrevive re-renders; sessionStorage: sobrevive navegación) ──────
// Clave: item id · Valor: { url: blob URL, textHash, ts }
const AUDIO_MEM: Map<string, { url: string; textHash: number }> = new Map();

function hashText(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return h >>> 0;
}

function sessionKey(id: string) { return `manifiesta_audio_${id}`; }

function loadFromSession(id: string, expectedHash: number): string | null {
  try {
    const raw = sessionStorage.getItem(sessionKey(id));
    if (!raw) return null;
    const parsed: { b64: string; textHash: number } = JSON.parse(raw);
    if (parsed.textHash !== expectedHash) return null; // texto cambió → outdated
    // Decodificar base64 → Blob → Object URL
    const bytes = Uint8Array.from(atob(parsed.b64), (c) => c.charCodeAt(0));
    const blob = new Blob([bytes], { type: 'audio/mpeg' });
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}

function saveToSession(id: string, buffer: ArrayBuffer, textHash: number) {
  try {
    const bytes = new Uint8Array(buffer);
    let b64 = '';
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      b64 += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    b64 = btoa(b64);
    sessionStorage.setItem(sessionKey(id), JSON.stringify({ b64, textHash }));
  } catch {
    // sessionStorage lleno — ignorar
  }
}


// ── Bloque de paso numerado ───────────────────────────────────────────────
function PasoItem({ numero, texto }: { numero: number; texto: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: numero * 0.06, ease: EASE }}
      className="flex gap-3"
    >
      <div
        className="flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
        style={{ background: 'color-mix(in oklab, var(--accent) 12%, transparent)', color: 'var(--accent)' }}
      >
        {numero}
      </div>
      <p className="flex-1 pt-0.5 text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {texto}
      </p>
    </motion.div>
  );
}

// ── Bloque de campo con etiqueta ─────────────────────────────────────────
function CampoBloque({
  etiqueta,
  texto,
  icono,
  acento,
}: {
  etiqueta: string;
  texto: string;
  icono?: React.ReactNode;
  acento?: boolean;
}) {
  return (
    <div
      className="flex flex-col gap-1.5 rounded-2xl p-4"
      style={{
        background: acento
          ? 'color-mix(in oklab, var(--accent) 6%, var(--surface))'
          : 'var(--surface)',
        border: `1px solid ${
          acento
            ? 'color-mix(in oklab, var(--accent) 16%, transparent)'
            : 'color-mix(in oklab, var(--text-tertiary) 16%, transparent)'
        }`,
      }}
    >
      <div className="flex items-center gap-1.5">
        {icono}
        <span
          className="text-xs font-semibold uppercase tracking-[0.06em]"
          style={{ color: acento ? 'var(--accent)' : 'var(--text-tertiary)' }}
        >
          {etiqueta}
        </span>
      </div>
      <p
        className="text-sm leading-relaxed"
        style={{ color: acento ? 'var(--text-primary)' : 'var(--text-secondary)', fontStyle: acento ? 'italic' : 'normal' }}
      >
        {texto}
      </p>
    </div>
  );
}

// ── Número de señal ──────────────────────────────────────────────────────
function NumeroSenal({ numero }: { numero: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 280, damping: 22 }}
      className="flex items-center justify-center py-6"
    >
      <div
        className="flex size-28 items-center justify-center rounded-full"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--accent) 18%, var(--surface)) 0%, var(--surface) 70%)',
          border: '2px solid color-mix(in oklab, var(--accent) 30%, transparent)',
          boxShadow: '0 0 48px color-mix(in oklab, var(--accent) 14%, transparent)',
        }}
      >
        <span
          className="font-bold tracking-[-0.03em]"
          style={{
            fontSize: '36px',
            color: 'var(--accent)',
            fontFamily: 'var(--font-display)',
          }}
        >
          {numero}
        </span>
      </div>
    </motion.div>
  );
}

// ── Contador de repeticiones (afirmaciones / decretos) ────────────────────
function ContadorRepeticiones() {
  const [count, setCount] = useState(0);
  const meta = 3;
  const completado = count >= meta;

  return (
    <div
      className="flex flex-col items-center gap-3 rounded-2xl p-4"
      style={{
        background: completado
          ? 'color-mix(in oklab, var(--accent) 8%, var(--surface))'
          : 'var(--surface)',
        border: `1px solid ${
          completado
            ? 'color-mix(in oklab, var(--accent) 22%, transparent)'
            : 'color-mix(in oklab, var(--text-tertiary) 16%, transparent)'
        }`,
      }}
    >
      <div className="flex items-center gap-2">
        <Repeat2 size={14} color={completado ? 'var(--accent)' : 'var(--text-tertiary)'} strokeWidth={2} />
        <p
          className="text-xs font-semibold uppercase tracking-[0.05em]"
          style={{ color: completado ? 'var(--accent)' : 'var(--text-tertiary)' }}
        >
          {completado ? '¡Completaste las 3 repeticiones!' : `Repetir ${meta} veces`}
        </p>
      </div>

      <div className="flex gap-3">
        {Array.from({ length: meta }, (_, i) => (
          <motion.div
            key={i}
            animate={{ scale: i < count ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.25 }}
            className="flex size-10 items-center justify-center rounded-full"
            style={{
              background:
                i < count
                  ? 'var(--accent)'
                  : 'color-mix(in oklab, var(--text-tertiary) 14%, transparent)',
              border: `2px solid ${
                i < count
                  ? 'var(--accent)'
                  : 'color-mix(in oklab, var(--text-tertiary) 22%, transparent)'
              }`,
            }}
          >
            {i < count && (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </motion.div>
        ))}
      </div>

      {!completado && (
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={() => setCount((c) => Math.min(c + 1, meta))}
          className="flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold text-white [touch-action:manipulation]"
          style={{ background: 'var(--accent)' }}
        >
          <Repeat2 size={13} strokeWidth={2.5} />
          Ya la dije
        </motion.button>
      )}
    </div>
  );
}

// ── Página ────────────────────────────────────────────────────────────────
export default function BibliotecaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { esGuardado, toggleGuardado, registrarVisto, preferencia } = useBiblioteca();
  const item = getById(id);

  // ── Estado de audio local (independiente del catálogo estático) ───────────
  const catalogEstado = item?.audioEstado ?? 'none';
  const canHaveAudio = catalogEstado !== 'none';
  const textHash = item ? hashText(item.textContent) : 0;

  const [audioEstado, setAudioEstado] = useState<AudioEstado>(() => {
    // Determinar estado inicial síncrono
    if (!canHaveAudio) return 'none';
    // Comprobar memory cache
    const mem = AUDIO_MEM.get(id);
    if (mem && mem.textHash === textHash) return 'ready';
    return 'placeholder';
  });
  const [audioUrl, setAudioUrl] = useState<string | undefined>(() => {
    const mem = AUDIO_MEM.get(id);
    if (mem && mem.textHash === textHash) return mem.url;
    return undefined;
  });

  // generando ref para evitar doble-llamada concurrente
  const generatingRef = useRef(false);
  // ref para el intervalo de sondeo cuando el servidor está generando
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Limpiar intervalo al desmontar
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  // En mount: (1) memoria → (2) sessionStorage → (3) DB (fuente de verdad)
  useEffect(() => {
    if (!canHaveAudio) return;
    if (audioEstado === 'ready') return; // ya tenemos desde memoria

    // Intentar sessionStorage primero (fast path)
    const sessionUrl = loadFromSession(id, textHash);
    if (sessionUrl) {
      AUDIO_MEM.set(id, { url: sessionUrl, textHash });
      setAudioUrl(sessionUrl);
      setAudioEstado('ready');
      return;
    }

    // Consultar DB
    const checkDb = async () => {
      try {
        const res = await fetch(
          `/api/audio-status?content_id=${encodeURIComponent(id)}&text_hash=${textHash}`,
        );
        if (!res.ok) return;
        const data: { status: string; audioUrl?: string; audioDurationSec?: number } = await res.json();

        if (data.status === 'ready' && data.audioUrl) {
          AUDIO_MEM.set(id, { url: data.audioUrl, textHash });
          setAudioUrl(data.audioUrl);
          setAudioEstado('ready');
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
        } else if (data.status === 'generating') {
          setAudioEstado('generating');
          // Sondear hasta que cambie
          if (!pollingRef.current) {
            pollingRef.current = setInterval(checkDb, 3000);
          }
        }
      } catch {
        // red no disponible — ignorar
      }
    };

    checkDb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id) registrarVisto(id);
  }, [id, registrarVisto]);

  const handleRequestGenerate = useCallback(async () => {
    if (!item || generatingRef.current) return;
    generatingRef.current = true;
    setAudioEstado('generating');

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: item.textContent,
          content_id: id,
          voice_id: CARTESIA_VOICE_ID_DEFAULT,
        }),
      });

      if (!res.ok) {
        throw new Error(`TTS error ${res.status}`);
      }

      // El endpoint devuelve JSON con audioUrl cuando se envía content_id
      const contentType = res.headers.get('content-type') ?? '';
      if (contentType.includes('application/json')) {
        const data: { audioUrl?: string; cached?: boolean; status?: string; error?: string } = await res.json();

        if (data.status === 'generating') {
          // Otro proceso está generando — sondear
          if (!pollingRef.current) {
            const poll = async () => {
              try {
                const statusRes = await fetch(
                  `/api/audio-status?content_id=${encodeURIComponent(id)}&text_hash=${textHash}`,
                );
                if (!statusRes.ok) return;
                const sd: { status: string; audioUrl?: string } = await statusRes.json();
                if (sd.status === 'ready' && sd.audioUrl) {
                  AUDIO_MEM.set(id, { url: sd.audioUrl, textHash });
                  setAudioUrl(sd.audioUrl);
                  setAudioEstado('ready');
                  if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
                } else if (sd.status === 'error') {
                  setAudioEstado('error');
                  if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
                }
              } catch { /* ignorar */ }
            };
            pollingRef.current = setInterval(poll, 3000);
          }
          return; // generatingRef se libera abajo en finally
        }

        if (data.audioUrl) {
          AUDIO_MEM.set(id, { url: data.audioUrl, textHash });
          setAudioUrl(data.audioUrl);
          setAudioEstado('ready');
          return;
        }

        throw new Error(data.error ?? 'Respuesta inesperada del servidor');
      }

      // Fallback: respuesta como buffer (sin content_id — no debería ocurrir aquí)
      const buffer = await res.arrayBuffer();
      saveToSession(id, buffer, textHash);
      const blob = new Blob([buffer], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      AUDIO_MEM.set(id, { url, textHash });
      setAudioUrl(url);
      setAudioEstado('ready');
    } catch (err) {
      console.error('[biblioteca audio]', err);
      setAudioEstado('error');
    } finally {
      generatingRef.current = false;
    }
  }, [id, item, textHash]);

  if (!item) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-5">
        <div
          className="flex size-16 items-center justify-center rounded-2xl"
          style={{ background: 'color-mix(in oklab, var(--accent) 10%, transparent)' }}
          aria-hidden="true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          Contenido no encontrado
        </p>
        <Link
          href="/app/biblioteca"
          className="text-sm font-medium"
          style={{ color: 'var(--accent)' }}
        >
          Volver a la Biblioteca
        </Link>
      </div>
    );
  }

  const guardado = esGuardado(id);

  return (
    <div
      className="flex min-h-dvh flex-col"
      style={{ background: 'var(--bg)' }}
    >
      {/* ── HEADER ── */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="sticky top-0 z-10 flex items-center justify-between px-5 py-4"
        style={{ background: 'color-mix(in oklab, var(--bg) 90%, transparent)' }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          className="flex size-9 items-center justify-center rounded-xl [touch-action:manipulation]"
          style={{ background: 'color-mix(in oklab, var(--text-tertiary) 10%, transparent)' }}
          aria-label="Volver"
        >
          <ArrowLeft size={18} color="var(--text-secondary)" />
        </button>

        <span
          className="flex items-center gap-1.5 text-sm font-semibold"
          style={{ color: 'var(--text-secondary)' }}
        >
          {(() => { const TIco = TIPO_ICON[item.tipo]; return <TIco size={14} color="var(--text-secondary)" strokeWidth={1.8} aria-hidden="true" />; })()}
          {TIPO_LABEL[item.tipo]}
        </span>

        <motion.button
          type="button"
          whileTap={{ scale: 0.88 }}
          onClick={() => toggleGuardado(id)}
          className="flex size-9 items-center justify-center rounded-xl [touch-action:manipulation]"
          style={{
            background: guardado
              ? 'color-mix(in oklab, var(--accent) 12%, transparent)'
              : 'color-mix(in oklab, var(--text-tertiary) 10%, transparent)',
          }}
          aria-label={guardado ? 'Quitar de guardados' : 'Guardar'}
        >
          {guardado ? (
            <BookmarkCheck size={18} color="var(--accent)" strokeWidth={2} />
          ) : (
            <Bookmark size={18} color="var(--text-secondary)" strokeWidth={1.8} />
          )}
        </motion.button>
      </motion.div>

      {/* ── CUERPO ── */}
      <div className="flex flex-col gap-5 px-5 pb-32">

        {/* Metadatos */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              {item.categoriaEmoji} {item.categoria}
            </span>
            <span style={{ color: 'var(--text-tertiary)' }}>·</span>
            <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-tertiary)' }}>
              <Clock size={11} strokeWidth={1.8} aria-hidden="true" />
              {item.duracionMin} min
            </span>
          </div>
          <h1
            className="text-xl font-bold leading-snug tracking-tight"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            {item.titulo}
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {item.descripcionCorta}
          </p>
        </motion.div>

        {/* ── CONTENIDO ADAPTATIVO POR TIPO ── */}

        {/* SEÑAL — número grande primero */}
        {item.tipo === 'senal' && item.numero && (
          <NumeroSenal numero={item.numero} />
        )}

        {/* Introducción (visualizacion / scripting-guiado) */}
        {item.introduccion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.08 }}
            className="rounded-2xl px-4 py-3.5"
            style={{
              background: 'color-mix(in oklab, var(--accent) 6%, var(--surface))',
              border: '1px solid color-mix(in oklab, var(--accent) 14%, transparent)',
              borderLeft: '3px solid var(--accent)',
            }}
          >
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <span className="font-semibold" style={{ color: 'var(--accent)' }}>
                Antes de comenzar:{' '}
              </span>
              {item.introduccion}
            </p>
          </motion.div>
        )}

        {/* ── AUDIO PLAYER — solo para items con capacidad de audio ── */}
        {canHaveAudio && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
          >
            <VictoriaAudioPlayer
              audioEstado={audioEstado}
              audioUrl={audioUrl}
              audioDurationSec={item.audioDurationSec}
              preferencia={preferencia}
              label={`Escuchar: ${item.titulo}`}
              onRequestGenerate={handleRequestGenerate}
            />
          </motion.div>
        )}

        {/* Texto principal */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, delay: 0.12 }}
          className="rounded-2xl p-5"
          style={{
            background: 'var(--surface)',
            border: '1px solid color-mix(in oklab, var(--text-tertiary) 14%, transparent)',
          }}
        >
          {/* Para afirmaciones y decretos: texto protagonista grande */}
          {(item.tipo === 'afirmacion' || item.tipo === 'decreto') ? (
            <p
              className="text-center font-semibold leading-relaxed"
              style={{
                fontSize: '17px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
              }}
            >
              "{item.textContent}"
            </p>
          ) : (
            <p
              className="whitespace-pre-line text-sm leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {item.textContent}
            </p>
          )}
        </motion.div>

        {/* Contador de repeticiones — afirmacion / decreto */}
        {(item.tipo === 'afirmacion' || item.tipo === 'decreto') && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: 0.18 }}
          >
            <ContadorRepeticiones />
          </motion.div>
        )}

        {/* Cómo usarla — afirmacion / decreto */}
        {item.comoUsarla && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: 0.2 }}
          >
            <CampoBloque
              etiqueta="Cómo usarla"
              texto={item.comoUsarla}
              icono={<Sparkles size={12} color="var(--text-tertiary)" strokeWidth={1.8} />}
            />
          </motion.div>
        )}

        {/* Qué necesitas — ritual */}
        {item.queNecesitas && (
          <CampoBloque etiqueta="Qué necesitas" texto={item.queNecesitas} />
        )}

        {/* Cuándo hacerlo — ritual */}
        {item.cuandoHacerlo && (
          <CampoBloque etiqueta="Cuándo hacerlo" texto={item.cuandoHacerlo} />
        )}

        {/* Interpretación — señal */}
        {item.interpretacion && (
          <CampoBloque etiqueta="Qué significa" texto={item.interpretacion} />
        )}

        {/* Pasos — ritual / scripting-guiado */}
        {item.pasos && item.pasos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.22 }}
            className="flex flex-col gap-3"
          >
            <h2
              className="text-xs font-semibold uppercase tracking-[0.05em]"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {item.tipo === 'scripting-guiado' ? 'Guía paso a paso' : 'El ritual'}
            </h2>
            {item.pasos.map((paso, i) => (
              <PasoItem key={i} numero={i + 1} texto={paso} />
            ))}
          </motion.div>
        )}

        {/* Pregunta de reflexión — señal */}
        {item.preguntaReflexion && (
          <CampoBloque
            etiqueta="Reflexiona"
            texto={item.preguntaReflexion}
            acento
          />
        )}

        {/* Afirmación final — ritual / señal */}
        {item.afirmacionFinal && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: 0.26 }}
            className="rounded-2xl px-5 py-4"
            style={{
              background: 'color-mix(in oklab, var(--accent) 8%, var(--surface))',
              border: '1px solid color-mix(in oklab, var(--accent) 18%, transparent)',
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-[0.06em] mb-2"
              style={{ color: 'var(--accent)' }}
            >
              Afirmación final
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
              }}
            >
              {item.afirmacionFinal}
            </p>
          </motion.div>
        )}

        {/* Acción después */}
        {item.accionDespues && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: 0.3 }}
            className="flex gap-3 rounded-2xl px-4 py-4"
            style={{
              background: 'var(--surface)',
              border: '1px solid color-mix(in oklab, var(--text-tertiary) 14%, transparent)',
            }}
          >
            <div
              className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full"
              style={{ background: 'var(--accent)' }}
              aria-hidden="true"
            >
              <ChevronRight size={11} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.05em] mb-1"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Tu acción de hoy
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                {item.accionDespues}
              </p>
            </div>
          </motion.div>
        )}

        {/* CTA scripting-guiado → ir a Scripting */}
        {item.tipo === 'scripting-guiado' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.34 }}
          >
            <Link
              href={`/app/scripting?intencion=${item.categoria.toLowerCase()}`}
              className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-semibold text-white [touch-action:manipulation]"
              style={{ background: 'var(--accent)' }}
            >
              <Sparkles size={16} strokeWidth={2} aria-hidden="true" />
              Ir a escribir mi scripting
            </Link>
          </motion.div>
        )}

        {/* Tags */}
        {item.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: 0.36 }}
            className="flex flex-wrap gap-2"
          >
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-3 py-1 text-xs"
                style={{
                  background: 'color-mix(in oklab, var(--text-tertiary) 10%, transparent)',
                  color: 'var(--text-tertiary)',
                }}
              >
                #{tag}
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
