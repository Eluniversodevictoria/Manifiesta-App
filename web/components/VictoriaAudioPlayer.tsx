'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, AlertCircle, RefreshCw } from 'lucide-react';
import type { AudioEstado, PreferenciaMedia } from '@/lib/manifestaciones-types';

export interface VictoriaAudioPlayerProps {
  audioEstado: AudioEstado;
  audioUrl?: string;
  audioDurationSec?: number;
  preferencia: PreferenciaMedia;
  label?: string;
  onRequestGenerate?: () => void;
  className?: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;
const SPEEDS = [1, 1.5, 2] as const;
type Speed = (typeof SPEEDS)[number];

function fmtTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function WaveformBars({ active, size = 'md' }: { active: boolean; size?: 'sm' | 'md' }) {
  const h = size === 'sm' ? 12 : 16;
  const scales = [0.4, 0.7, 1, 0.7, 0.5, 0.8, 0.6];
  return (
    <div className="flex items-center" style={{ gap: 2, height: h }} aria-hidden="true">
      {scales.map((s, i) => (
        <motion.div
          key={i}
          style={{ width: 2, height: h, background: 'var(--accent)', borderRadius: 999, originY: 0.5 }}
          animate={
            active
              ? { scaleY: [s, s * 1.9, s], opacity: [0.55, 1, 0.55] }
              : { scaleY: s, opacity: 0.4 }
          }
          transition={
            active
              ? { duration: 0.75, delay: i * 0.09, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.3 }
          }
          initial={false}
        />
      ))}
    </div>
  );
}

export function VictoriaAudioPlayer({
  audioEstado: estadoProp,
  audioUrl,
  audioDurationSec,
  preferencia,
  label = 'Escuchar con Victoria',
  onRequestGenerate,
  className = '',
}: VictoriaAudioPlayerProps) {
  const [estado, setEstado] = useState<AudioEstado>(estadoProp);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(audioDurationSec ?? 0);
  const [speed, setSpeed] = useState<Speed>(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync estado desde prop (cuando el padre actualiza)
  useEffect(() => {
    setEstado(estadoProp);
  }, [estadoProp]);

  // Crear/destruir HTMLAudioElement cuando llega audioUrl real
  useEffect(() => {
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.onloadedmetadata = () => {
      setDuration(audio.duration);
    };
    audio.ontimeupdate = () => {
      setPosition(audio.currentTime);
    };
    audio.onended = () => {
      setPlaying(false);
      setPosition(0);
    };
    audio.onerror = () => {
      setEstado('error');
      setPlaying(false);
    };

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [audioUrl]);

  // Sincronizar velocidad con el elemento de audio
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed;
  }, [speed]);

  const handleRequest = useCallback(() => {
    onRequestGenerate?.();
  }, [onRequestGenerate]);

  const handleRetry = useCallback(() => {
    onRequestGenerate?.();
  }, [onRequestGenerate]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => setEstado('error'));
    }
  }, [playing]);

  const handleRewind = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  }, []);

  const handleCycleSpeed = useCallback(() => {
    setSpeed((s) => {
      const idx = SPEEDS.indexOf(s);
      return SPEEDS[(idx + 1) % SPEEDS.length];
    });
  }, []);

  const handleScrub = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * duration;
  }, [duration]);

  if (estado === 'none') return null;

  const progress = duration > 0 ? position / duration : 0;
  const base = `rounded-2xl px-4 py-3 ${className}`;
  const motionProps = {
    initial: { opacity: 0, y: 4 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -4 },
    transition: { duration: 0.22, ease: EASE },
  };

  return (
    <AnimatePresence mode="wait">

      {(estado === 'placeholder' || estado === 'outdated') && (
        <motion.button
          key="placeholder"
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={handleRequest}
          {...motionProps}
          className={`${base} flex w-full items-center gap-3 [touch-action:manipulation]`}
          style={{
            background: 'var(--chip-bg)',
            border: `1px solid color-mix(in oklab, var(--accent) ${estado === 'outdated' ? '40%' : '20%'}, transparent)`,
          }}
          aria-label={label}
        >
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-full"
            style={{ background: 'var(--accent)' }}
            aria-hidden="true"
          >
            <WaveformBars active={false} />
          </span>
          <span className="flex-1 min-w-0 text-left">
            <span className="block text-sm font-semibold leading-tight" style={{ color: 'var(--accent)' }}>
              {estado === 'outdated' ? 'Audio desactualizado — regenerar' : label}
            </span>
            {audioDurationSec && estado === 'placeholder' && (
              <span className="block text-xs" style={{ color: 'var(--text-tertiary)' }}>
                {Math.ceil(audioDurationSec / 60)} min
              </span>
            )}
          </span>
          <span
            className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold"
            style={{ background: 'var(--accent)', color: 'white' }}
            aria-hidden="true"
          >
            {estado === 'outdated' ? 'Regenerar' : 'Escuchar'}
          </span>
        </motion.button>
      )}

      {estado === 'generating' && (
        <motion.div
          key="generating"
          {...motionProps}
          className={base}
          style={{
            background: 'var(--chip-bg)',
            border: '1px solid color-mix(in oklab, var(--accent) 20%, transparent)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-full"
              style={{ background: 'var(--accent)' }}
            >
              <WaveformBars active={true} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                Victoria está preparando tu audio…
              </p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                Solo unos segundos
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {estado === 'ready' && (
        <motion.div
          key="ready"
          {...motionProps}
          className={base}
          style={{
            background: 'var(--chip-bg)',
            border: '1px solid color-mix(in oklab, var(--accent) 24%, transparent)',
          }}
        >
          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              whileTap={{ scale: 0.88 }}
              onClick={togglePlay}
              className="flex size-9 shrink-0 items-center justify-center rounded-full [touch-action:manipulation]"
              style={{ background: 'var(--accent)' }}
              aria-label={playing ? 'Pausar' : 'Reproducir'}
            >
              {playing ? (
                <Pause size={14} color="white" strokeWidth={2.5} />
              ) : (
                <Play size={14} color="white" strokeWidth={2.5} style={{ transform: 'translateX(1px)' }} />
              )}
            </motion.button>

            <div className="flex flex-1 items-center gap-2 min-w-0">
              <WaveformBars active={playing} size="sm" />
              <span className="tabular-nums text-xs shrink-0" style={{ color: 'var(--text-secondary)' }}>
                {fmtTime(position)}&nbsp;/&nbsp;{fmtTime(duration)}
              </span>
            </div>

            <motion.button
              type="button"
              whileTap={{ scale: 0.88 }}
              onClick={handleRewind}
              className="flex size-8 shrink-0 items-center justify-center rounded-full [touch-action:manipulation]"
              style={{ background: 'color-mix(in oklab, var(--accent) 12%, transparent)' }}
              aria-label="Retroceder 10 segundos"
            >
              <RotateCcw size={12} color="var(--accent)" strokeWidth={2.5} />
            </motion.button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.88 }}
              onClick={handleCycleSpeed}
              className="flex h-8 w-12 shrink-0 items-center justify-center rounded-full px-2 text-xs font-bold tabular-nums [touch-action:manipulation]"
              style={{
                background: 'color-mix(in oklab, var(--accent) 12%, transparent)',
                color: 'var(--accent)',
              }}
              aria-label={`Velocidad: ${speed}x`}
            >
              {speed}×
            </motion.button>
          </div>

          <div
            className="mt-2 h-1 cursor-pointer overflow-hidden rounded-full"
            style={{ background: 'color-mix(in oklab, var(--accent) 18%, transparent)' }}
            onClick={handleScrub}
            role="progressbar"
            aria-valuenow={Math.round(position)}
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
          >
            <div
              className="h-full rounded-full transition-[width] duration-200"
              style={{ width: `${progress * 100}%`, background: 'var(--accent)' }}
            />
          </div>
        </motion.div>
      )}

      {estado === 'error' && (
        <motion.div
          key="error"
          {...motionProps}
          className={base}
          style={{
            background: 'color-mix(in oklab, var(--accent) 6%, var(--surface))',
            border: '1px solid color-mix(in oklab, var(--accent) 20%, transparent)',
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <AlertCircle size={18} strokeWidth={2} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
              <div className="min-w-0">
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Error al cargar el audio
                </p>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  Toca para intentar de nuevo
                </p>
              </div>
            </div>
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={handleRetry}
              className="flex size-9 shrink-0 items-center justify-center rounded-full [touch-action:manipulation]"
              style={{
                background: 'color-mix(in oklab, var(--accent) 10%, transparent)',
                border: '1px solid color-mix(in oklab, var(--accent) 24%, transparent)',
              }}
              aria-label="Reintentar"
            >
              <RefreshCw size={14} strokeWidth={2.5} style={{ color: 'var(--accent)' }} />
            </motion.button>
          </div>
        </motion.div>
      )}

    </AnimatePresence>
  );
}
