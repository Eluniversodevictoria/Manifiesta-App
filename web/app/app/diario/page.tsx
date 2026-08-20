'use client';

// MANIFIESTA — Diario libre
// Espacio de escritura diaria vinculado al deseo activo.
// Cada entrada se guarda en localStorage con fecha — una por día.

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, PenLine, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { useManifestaciones } from '@/lib/ManifestacionesContext';

// ── Tipos ─────────────────────────────────────────────────────────────────────
interface EntradaDiario {
  fecha: string;        // YYYY-MM-DD
  texto: string;
  deseoSnapshot: string;
  guardadoAt: string;   // ISO string
}

const STORAGE_KEY = 'manifiesta_diario_v1';

function getFechaHoy(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatFecha(fechaISO: string): string {
  const [y, m, d] = fechaISO.split('-').map(Number);
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${d} ${meses[m - 1]} ${y}`;
}

function cargarEntradas(): EntradaDiario[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as EntradaDiario[]) : [];
  } catch { return []; }
}

function guardarEntrada(entrada: EntradaDiario) {
  const todas = cargarEntradas().filter((e) => e.fecha !== entrada.fecha);
  todas.unshift(entrada);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todas.slice(0, 90))); // últimas 90 entradas
}

// ── Preguntas inspiradoras rotativas ──────────────────────────────────────────
const PREGUNTAS = [
  '¿Cómo te sientes hoy respecto a lo que deseas?',
  '¿Qué señal recibiste hoy de que va en camino?',
  '¿Qué necesitas soltar para que llegue más rápido?',
  '¿Qué agradeces hoy en este proceso?',
  '¿Qué pensamiento te frena — y qué eliges creer en cambio?',
  '¿Cómo se sentiría tu vida si ya tuvieras lo que deseas?',
  '¿Qué pequeña acción tomaste hoy hacia tu manifestación?',
  '¿Qué te dijo Victoria hoy que resonó contigo?',
];

function getPreguntaHoy(): string {
  const d = new Date();
  const idx = (d.getDate() + d.getMonth()) % PREGUNTAS.length;
  return PREGUNTAS[idx];
}

// ── Componente de entrada pasada ──────────────────────────────────────────────
function EntradaPasada({ entrada }: { entrada: EntradaDiario }) {
  const [abierta, setAbierta] = useState(false);
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid color-mix(in oklab, var(--text-tertiary) 14%, transparent)' }}
    >
      <button
        onClick={() => setAbierta((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
        style={{ background: 'var(--surface)' }}
      >
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {formatFecha(entrada.fecha)}
          </p>
          {!abierta && (
            <p className="mt-0.5 text-xs line-clamp-1" style={{ color: 'var(--text-secondary)' }}>
              {entrada.texto}
            </p>
          )}
        </div>
        {abierta
          ? <ChevronUp size={16} color="var(--text-tertiary)" />
          : <ChevronDown size={16} color="var(--text-tertiary)" />
        }
      </button>
      <AnimatePresence>
        {abierta && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden', background: 'var(--bg)' }}
          >
            <p className="px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>
              {entrada.texto}
            </p>
            {entrada.deseoSnapshot && (
              <p className="px-4 pb-3 text-xs italic" style={{ color: 'var(--text-tertiary)' }}>
                Deseo: &ldquo;{entrada.deseoSnapshot}&rdquo;
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Pantalla ──────────────────────────────────────────────────────────────────
export default function DiarioPage() {
  const router = useRouter();
  const { manifestaciones } = useManifestaciones();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const manifestacionActiva = manifestaciones.find((m) => m.estado === 'activo');
  const deseoActivo = manifestacionActiva?.deseo ?? '';

  const [texto, setTexto] = useState('');
  const [guardado, setGuardado] = useState(false);
  const [entradas, setEntradas] = useState<EntradaDiario[]>([]);
  const pregunta = getPreguntaHoy();
  const hoy = getFechaHoy();

  useEffect(() => {
    const todas = cargarEntradas();
    setEntradas(todas);
    const hoyEntry = todas.find((e) => e.fecha === hoy);
    if (hoyEntry) { setTexto(hoyEntry.texto); setGuardado(true); }
  }, [hoy]);

  const pasadas = entradas.filter((e) => e.fecha !== hoy);

  const guardar = () => {
    if (!texto.trim()) return;
    const entrada: EntradaDiario = {
      fecha: hoy,
      texto: texto.trim(),
      deseoSnapshot: deseoActivo,
      guardadoAt: new Date().toISOString(),
    };
    guardarEntrada(entrada);
    setGuardado(true);
    setEntradas(cargarEntradas());
  };

  const editar = () => { setGuardado(false); setTimeout(() => textareaRef.current?.focus(), 100); };

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: 'var(--bg)' }}>
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
        <div className="flex-1">
          <h1 className="text-base font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            Mi diario
          </h1>
          {deseoActivo && (
            <p className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>
              {deseoActivo}
            </p>
          )}
        </div>
        <span>
          <PenLine size={18} color="var(--accent)" />
        </span>
      </div>

      <div className="flex-1 px-4 py-5 pb-28 flex flex-col gap-5">

        {/* Entrada de hoy */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-2xl p-5"
          style={{
            background: `radial-gradient(ellipse 100% 60% at 0% 0%, var(--accent-2) 0%, transparent 60%), var(--surface)`,
            border: '1px solid color-mix(in oklab, var(--accent) 18%, transparent)',
          }}
        >
          {/* Pregunta del día */}
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
            ✦ Reflexión de hoy · {formatFecha(hoy)}
          </p>
          <p className="mb-4 text-sm font-medium leading-snug" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            {pregunta}
          </p>

          {guardado ? (
            /* Entrada guardada */
            <div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>
                {texto}
              </p>
              <button
                onClick={editar}
                className="mt-4 flex items-center gap-1.5 text-xs font-semibold"
                style={{ color: 'var(--accent)' }}
              >
                <PenLine size={12} />
                Editar entrada
              </button>
            </div>
          ) : (
            /* Editor */
            <div className="flex flex-col gap-3">
              <textarea
                ref={textareaRef}
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Escribe lo que sientes, piensas o agradeces hoy…"
                rows={5}
                className="w-full resize-none rounded-xl px-4 py-3 text-sm leading-relaxed outline-none"
                style={{
                  background: 'color-mix(in oklab, var(--bg) 60%, transparent)',
                  border: '1px solid color-mix(in oklab, var(--accent) 18%, transparent)',
                  color: 'var(--text-primary)',
                }}
              />
              <button
                onClick={guardar}
                disabled={!texto.trim()}
                className="flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-opacity disabled:opacity-40"
                style={{ background: 'var(--accent)', color: 'white' }}
              >
                <CheckCircle2 size={16} />
                Guardar entrada de hoy
              </button>
            </div>
          )}
        </motion.div>

        {/* Entradas pasadas */}
        {pasadas.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider px-1" style={{ color: 'var(--text-tertiary)' }}>
              Entradas anteriores
            </p>
            {pasadas.map((e) => (
              <EntradaPasada key={e.fecha} entrada={e} />
            ))}
          </div>
        )}

        {/* Empty state — primera vez */}
        {entradas.length === 0 && (
          <div className="flex flex-col items-center gap-3 pt-8 text-center">
            <span className="text-3xl" aria-hidden="true">📖</span>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Tu diario empieza hoy.<br />Cada entrada es un registro de tu proceso — tuyo para siempre.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
