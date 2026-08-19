'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, PenLine, Sparkles, CheckCircle2, Plus,
  Calendar, Layers, X, ChevronRight, Zap,
} from 'lucide-react';
import { useManifestaciones } from '@/lib/ManifestacionesContext';
import { calcularProgreso } from '@/lib/manifestaciones-types';
import { BadgeEstado } from '../../components/BadgeEstado';
import type { CierreManifestacion } from '@/lib/manifestaciones-types';
import StarBurst from '@/components/StarBurst';
import ConstellationSVG from '@/components/ConstellationSVG';

// ── Barra de progreso ─────────────────────────────────────────────────────
function BarraProgreso({ valor }: { valor: number }) {
  return (
    <div className="relative h-2 w-full overflow-hidden rounded-full" style={{ background: 'color-mix(in oklab, var(--text-tertiary) 14%, transparent)' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${valor}%` }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ background: 'var(--accent)' }}
      />
    </div>
  );
}

// ── Sheet de reflexión ────────────────────────────────────────────────────
function SheetReflexion({
  abierto,
  onCerrar,
  onGuardar,
}: {
  abierto: boolean;
  onCerrar: () => void;
  onGuardar: (texto: string) => void;
}) {
  const [texto, setTexto] = useState('');

  const guardar = () => {
    if (!texto.trim()) return;
    onGuardar(texto.trim());
    setTexto('');
    onCerrar();
  };

  return (
    <AnimatePresence>
      {abierto && (
        <>
          <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }} className="fixed inset-0 z-40"
            style={{ background: 'rgba(34,20,26,0.45)' }} onClick={onCerrar} aria-hidden="true" />
          <motion.div key="sh" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 34, mass: 0.9 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[28px] px-5 pt-5"
            style={{ background: 'var(--surface)', paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))' }}
            role="dialog" aria-modal="true" aria-label="Agregar reflexión">
            <div className="mx-auto mb-5 h-1 w-10 rounded-full" style={{ background: 'color-mix(in oklab, var(--text-tertiary) 30%, transparent)' }} />
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[17px] font-bold" style={{ fontFamily: 'var(--font-display)' }}>Agregar reflexión</h2>
              <button type="button" onClick={onCerrar} className="flex size-8 items-center justify-center rounded-full [touch-action:manipulation]"
                style={{ background: 'color-mix(in oklab, var(--text-tertiary) 12%, transparent)' }}>
                <X size={15} color="var(--text-secondary)" />
              </button>
            </div>
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="¿Qué notaste hoy? ¿Qué aprendiste? ¿Cómo te sentiste con este deseo?"
              rows={4}
              className="mb-4 w-full resize-none rounded-2xl px-4 py-3 text-[14px] leading-relaxed focus:outline-none"
              style={{ background: 'var(--bg)', color: 'var(--text-primary)', border: '1px solid color-mix(in oklab, var(--text-tertiary) 22%, transparent)' }}
              autoFocus
            />
            <button type="button" onClick={guardar} disabled={!texto.trim()}
              className="flex h-12 w-full items-center justify-center rounded-[var(--radius-button)] text-[15px] font-semibold text-white [touch-action:manipulation] disabled:opacity-40"
              style={{ background: 'var(--accent)' }}>
              Guardar reflexión
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Sheet de cierre "Se manifestó" ────────────────────────────────────────
function SheetCierre({
  abierto,
  onCerrar,
  onGuardar,
}: {
  abierto: boolean;
  onCerrar: () => void;
  onGuardar: (cierre: CierreManifestacion) => void;
}) {
  const [form, setForm] = useState<CierreManifestacion>({
    fechaOcurrencia: '',
    comoLlego: '',
    aprendizaje: '',
    notaFinal: '',
  });
  const [celebrando, setCelebrando] = useState(false);

  const campo = (key: keyof CierreManifestacion) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const valido = form.fechaOcurrencia.trim() && form.comoLlego.trim();

  const guardar = () => {
    if (!valido) return;
    setCelebrando(true);
    setTimeout(() => {
      onGuardar(form);
      setCelebrando(false);
    }, 1400);
  };

  return (
    <AnimatePresence>
      {abierto && (
        <>
          <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }} className="fixed inset-0 z-40"
            style={{ background: 'rgba(34,20,26,0.55)' }} onClick={onCerrar} aria-hidden="true" />
          <StarBurst trigger={celebrando} />
          <motion.div key="sh" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32, mass: 1 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[90dvh] overflow-y-auto rounded-t-[28px] px-5 pt-5"
            style={{ background: 'var(--surface)', paddingBottom: 'calc(2.5rem + env(safe-area-inset-bottom))' }}
            role="dialog" aria-modal="true" aria-label="Cerrar manifestación">

            <div className="mx-auto mb-4 h-1 w-10 rounded-full" style={{ background: 'color-mix(in oklab, var(--text-tertiary) 30%, transparent)' }} />

            <AnimatePresence mode="wait">
              {celebrando ? (
                <motion.div key="celebra" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }} className="flex flex-col items-center gap-3 py-10 text-center">
                  <div
                    className="flex size-16 items-center justify-center rounded-2xl"
                    style={{ background: 'color-mix(in oklab, var(--accent) 14%, transparent)' }}
                  >
                    <Sparkles size={34} color="var(--accent)" strokeWidth={1.5} />
                  </div>
                  <p className="text-[20px] font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>
                    ¡Se manifestó!
                  </p>
                  <p className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>
                    Este deseo pasa a tu sección de cumplidos
                  </p>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="mb-5 flex items-start justify-between">
                    <div>
                      <p className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.06em]" style={{ color: 'var(--accent)' }}>
                        <Sparkles size={13} color="var(--accent)" strokeWidth={2} aria-hidden="true" />
                        Se manifestó
                      </p>
                      <h2 className="mt-1 text-[19px] font-bold leading-snug" style={{ fontFamily: 'var(--font-display)' }}>
                        Cuéntame cómo llegó
                      </h2>
                    </div>
                    <button type="button" onClick={onCerrar} className="flex size-8 items-center justify-center rounded-full [touch-action:manipulation]"
                      style={{ background: 'color-mix(in oklab, var(--text-tertiary) 12%, transparent)' }}>
                      <X size={15} color="var(--text-secondary)" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-4">
                    {/* ¿Cuándo? */}
                    <div>
                      <label className="mb-1.5 block text-[13px] font-semibold" style={{ color: 'var(--text-secondary)' }}>
                        ¿Cuándo ocurrió? *
                      </label>
                      <input type="text" placeholder="Ej. 15 de agosto de 2026"
                        className="w-full rounded-2xl px-4 py-3 text-[14px] focus:outline-none"
                        style={{ background: 'var(--bg)', color: 'var(--text-primary)', border: '1px solid color-mix(in oklab, var(--text-tertiary) 22%, transparent)' }}
                        {...campo('fechaOcurrencia')} />
                    </div>

                    {/* ¿Cómo llegó? */}
                    <div>
                      <label className="mb-1.5 block text-[13px] font-semibold" style={{ color: 'var(--text-secondary)' }}>
                        ¿Cómo llegó? *
                      </label>
                      <textarea placeholder="Describe cómo se manifestó este deseo..." rows={3}
                        className="w-full resize-none rounded-2xl px-4 py-3 text-[14px] leading-relaxed focus:outline-none"
                        style={{ background: 'var(--bg)', color: 'var(--text-primary)', border: '1px solid color-mix(in oklab, var(--text-tertiary) 22%, transparent)' }}
                        {...campo('comoLlego')} />
                    </div>

                    {/* ¿Qué aprendiste? */}
                    <div>
                      <label className="mb-1.5 block text-[13px] font-semibold" style={{ color: 'var(--text-secondary)' }}>
                        ¿Qué aprendiste?
                      </label>
                      <textarea placeholder="Una lección de este camino..." rows={2}
                        className="w-full resize-none rounded-2xl px-4 py-3 text-[14px] leading-relaxed focus:outline-none"
                        style={{ background: 'var(--bg)', color: 'var(--text-primary)', border: '1px solid color-mix(in oklab, var(--text-tertiary) 22%, transparent)' }}
                        {...campo('aprendizaje')} />
                    </div>

                    {/* Nota final */}
                    <div>
                      <label className="mb-1.5 block text-[13px] font-semibold" style={{ color: 'var(--text-secondary)' }}>
                        Nota final (opcional)
                      </label>
                      <input type="text" placeholder="Una palabra, una frase de gratitud..."
                        className="w-full rounded-2xl px-4 py-3 text-[14px] focus:outline-none"
                        style={{ background: 'var(--bg)', color: 'var(--text-primary)', border: '1px solid color-mix(in oklab, var(--text-tertiary) 22%, transparent)' }}
                        {...campo('notaFinal')} />
                    </div>

                    <button type="button" onClick={guardar} disabled={!valido}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] text-[15px] font-semibold text-white [touch-action:manipulation] disabled:opacity-40"
                      style={{ background: 'var(--accent)', boxShadow: 'var(--shadow-2)' }}>
                      <CheckCircle2 size={17} strokeWidth={2.5} />
                      Guardar mi cierre
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Pantalla de detalle ───────────────────────────────────────────────────
export default function DetalleManifestacionPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getById, marcarManifestado, addScript, addCheckIn, addReflexion, snapshots } = useManifestaciones();

  const manifestacion = getById(params.id);

  const [sheetReflexion, setSheetReflexion] = useState(false);
  const [sheetCierre, setSheetCierre] = useState(false);
  const [checkInGuardado, setCheckInGuardado] = useState(false);

  if (!manifestacion) {
    return (
      <div className="flex flex-col items-center gap-3 px-5 pt-16 text-center">
        <p className="text-[16px] font-semibold" style={{ color: 'var(--text-primary)' }}>Manifestación no encontrada</p>
        <button type="button" onClick={() => router.back()} className="text-[14px]" style={{ color: 'var(--accent)' }}>Volver</button>
      </div>
    );
  }

  const progreso = calcularProgreso(manifestacion);
  const estaActiva = manifestacion.estado === 'activo';
  const esManifestado = manifestacion.estado === 'manifestado';

  // Nivel de constelación basado en eventos reales, no en días transcurridos.
  // Cada tipo de evento aporta distinto peso: prácticas > check-ins > scripts/reflexiones.
  const snapshotsPropios = snapshots.filter((s) => s.manifestacionId === manifestacion.id);
  const eventosReales =
    snapshotsPropios.length * 3 +          // práctica completada (más significativa)
    manifestacion.checkIns.length * 2 +    // check-in manual
    manifestacion.scripts.length +         // scripting
    manifestacion.reflexiones.length;      // reflexiones
  // Normalizar a 0–1: 20 eventos = constelación completa (opacity máxima de 0.32)
  const nivelConstelacion = Math.min(eventosReales / 20, 1);
  const EASE = [0.16, 1, 0.3, 1] as const;

  const handleRegistrarCheckIn = () => {
    addCheckIn(manifestacion.id);
    setCheckInGuardado(true);
    setTimeout(() => setCheckInGuardado(false), 2000);
  };

  const handleCierre = (cierre: CierreManifestacion) => {
    marcarManifestado(manifestacion.id, cierre);
    setTimeout(() => router.push('/app/manifestaciones'), 1600);
  };

  return (
    <div className="flex flex-col pb-6">

      {/* ── HEADER ── */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: EASE }}
        className="flex items-center gap-3 px-5 pt-6 pb-4"
      >
        <button type="button" onClick={() => router.back()}
          className="flex size-9 shrink-0 items-center justify-center rounded-xl [touch-action:manipulation]"
          style={{ background: 'color-mix(in oklab, var(--text-tertiary) 10%, transparent)' }}
          aria-label="Volver">
          <ArrowLeft size={18} color="var(--text-secondary)" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="truncate text-[18px] font-bold tracking-[-0.02em]" style={{ fontFamily: 'var(--font-display)' }}>
            {manifestacion.deseo}
          </h1>
        </div>
        <BadgeEstado estado={manifestacion.estado} />
      </motion.div>

      <div className="flex flex-col gap-5 px-5">

        {/* ── PRÁCTICA DEL DÍA (solo si activo) ── */}
        {estaActiva && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.06, ease: EASE }}
            className="rounded-2xl p-4"
            style={{ background: 'color-mix(in oklab, var(--accent) 7%, transparent)', border: '1px solid color-mix(in oklab, var(--accent) 18%, transparent)' }}
          >
            <div className="mb-2 flex items-center gap-2">
              <Zap size={13} color="var(--accent)" strokeWidth={2} aria-hidden="true" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: 'var(--accent)' }}>
                Tu práctica de hoy
              </span>
            </div>
            <p className="mb-3 text-[13px]" style={{ color: 'var(--text-secondary)' }}>
              Afirmación, visualización, scripting y acción — personalizada para este deseo.
            </p>
            <div className="flex gap-2">
              <Link
                href="/app"
                className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full text-[13px] font-semibold text-white [touch-action:manipulation]"
                style={{ background: 'var(--accent)' }}
              >
                <Sparkles size={13} strokeWidth={2} />
                Ver práctica
              </Link>
              <Link
                href={`/app/scripting?manifestacionId=${manifestacion.id}`}
                className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full text-[13px] font-semibold [touch-action:manipulation]"
                style={{ background: 'color-mix(in oklab, var(--accent) 12%, transparent)', color: 'var(--accent)' }}
              >
                <PenLine size={13} strokeWidth={2} />
                Escribir script
              </Link>
            </div>
          </motion.div>
        )}

        {/* ── DETALLES ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1, ease: EASE }}
          className="rounded-2xl p-4"
          style={{ background: 'var(--surface)' }}
        >
          <div className="mb-3 grid grid-cols-3 gap-3">
            <div>
              <div className="mb-0.5 flex items-center gap-1">
                <Calendar size={11} color="var(--text-tertiary)" strokeWidth={1.8} />
                <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>Inicio</span>
              </div>
              <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>{manifestacion.fechaInicio}</span>
            </div>
            <div>
              <div className="mb-0.5 flex items-center gap-1">
                <Layers size={11} color="var(--text-tertiary)" strokeWidth={1.8} />
                <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>Prácticas</span>
              </div>
              <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>{manifestacion.checkIns.length}</span>
            </div>
            <div>
              <div className="mb-0.5 flex items-center gap-1">
                <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>Categoría</span>
              </div>
              <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                {manifestacion.categoriaEmoji} {manifestacion.categoria}
              </span>
            </div>
          </div>
          {manifestacion.descripcion && (
            <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {manifestacion.descripcion}
            </p>
          )}
        </motion.div>

        {/* ── PROGRESO ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.14, ease: EASE }}
          className="relative overflow-hidden rounded-2xl p-4"
          style={{ background: 'var(--surface)' }}
        >
          {/* Constelación: evoluciona con eventos reales (prácticas, check-ins, scripts, reflexiones) */}
          <div
            className="pointer-events-none absolute right-2 top-2"
            aria-hidden="true"
            style={{ opacity: 0.06 + nivelConstelacion * 0.26 }}
          >
            <ConstellationSVG width={160} height={80} opacity={1} delay={0.4} />
          </div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
              Progreso
            </span>
            <span className="text-[13px] font-bold" style={{ color: 'var(--accent)' }}>{progreso}%</span>
          </div>
          <BarraProgreso valor={progreso} />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
              {manifestacion.checkIns.length} check-ins · último {manifestacion.ultimoCheckIn}
            </span>
            {!esManifestado && (
              <AnimatePresence mode="wait">
                {checkInGuardado ? (
                  <motion.span key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-1 text-[12px] font-semibold" style={{ color: 'var(--accent)' }}>
                    <CheckCircle2 size={12} strokeWidth={2.5} /> Guardado
                  </motion.span>
                ) : (
                  <motion.button key="btn" type="button" onClick={handleRegistrarCheckIn} whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold [touch-action:manipulation]"
                    style={{ background: 'color-mix(in oklab, var(--accent) 10%, transparent)', color: 'var(--accent)' }}>
                    <Plus size={11} strokeWidth={2.5} /> Check-in
                  </motion.button>
                )}
              </AnimatePresence>
            )}
          </div>
        </motion.div>

        {/* ── SCRIPTS RELACIONADOS ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.18, ease: EASE }}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-[0.06em]" style={{ color: 'var(--text-tertiary)' }}>
              Scripts · {manifestacion.scripts.length}
            </span>
            {!esManifestado && (
              <Link
                href={`/app/scripting?intencion=${manifestacion.categoria.toLowerCase()}&manifestacionId=${manifestacion.id}`}
                className="flex items-center gap-1 text-[12px] font-semibold [touch-action:manipulation]"
                style={{ color: 'var(--accent)' }}
              >
                <Plus size={12} strokeWidth={2.5} /> Nuevo
              </Link>
            )}
          </div>

          {manifestacion.scripts.length === 0 ? (
            <div className="rounded-2xl py-6 text-center" style={{ background: 'var(--surface)' }}>
              <p className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>
                Sin scripts aún — escribe el primero
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {manifestacion.scripts.slice(0, 3).map((s) => (
                <div key={s.id} className="rounded-2xl p-4" style={{ background: 'var(--surface)' }}>
                  <p className="mb-1 text-[14px] leading-relaxed" style={{ color: 'var(--text-primary)' }}>{s.texto}</p>
                  <p className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>{s.fecha}</p>
                </div>
              ))}
              {manifestacion.scripts.length > 3 && (
                <p className="text-center text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
                  +{manifestacion.scripts.length - 3} más
                </p>
              )}
            </div>
          )}
        </motion.div>

        {/* ── REFLEXIONES ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.22, ease: EASE }}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-[0.06em]" style={{ color: 'var(--text-tertiary)' }}>
              Reflexiones · {manifestacion.reflexiones.length}
            </span>
            {!esManifestado && (
              <button type="button" onClick={() => setSheetReflexion(true)}
                className="flex items-center gap-1 text-[12px] font-semibold [touch-action:manipulation]"
                style={{ color: 'var(--accent)' }}>
                <Plus size={12} strokeWidth={2.5} /> Nueva
              </button>
            )}
          </div>

          {manifestacion.reflexiones.length === 0 ? (
            <div className="rounded-2xl py-6 text-center" style={{ background: 'var(--surface)' }}>
              <p className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>
                Sin reflexiones aún
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {manifestacion.reflexiones.map((r) => (
                <div key={r.id} className="rounded-2xl p-4" style={{ background: 'var(--surface)', borderLeft: '3px solid var(--accent)' }}>
                  <p className="mb-1 text-[14px] italic leading-relaxed" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                    "{r.texto}"
                  </p>
                  <p className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>{r.fecha}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── CIERRE si ya se manifestó ── */}
        {esManifestado && manifestacion.cierre && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.26, ease: EASE }}
            className="rounded-2xl p-4"
            style={{ background: 'var(--success-bg)', border: '1px solid var(--success-border)' }}
          >
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.06em]" style={{ color: 'var(--success)' }}>
              <span className="flex items-center gap-1.5"><Sparkles size={11} color="var(--success)" strokeWidth={2} aria-hidden="true" /> Cierre de manifestación</span>
            </p>
            <p className="mb-1 text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
              {manifestacion.cierre.fechaOcurrencia}
            </p>
            <p className="mb-2 text-[14px] italic leading-relaxed" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              "{manifestacion.cierre.comoLlego}"
            </p>
            {manifestacion.cierre.aprendizaje && (
              <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                Aprendizaje: {manifestacion.cierre.aprendizaje}
              </p>
            )}
            {manifestacion.cierre.notaFinal && (
              <p className="mt-1 text-[13px] font-medium" style={{ color: 'var(--accent)' }}>
                {manifestacion.cierre.notaFinal}
              </p>
            )}
          </motion.div>
        )}

        {/* ── CTA PRINCIPAL ── */}
        {!esManifestado && (
          <motion.button
            type="button"
            onClick={() => setSheetCierre(true)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.28, ease: EASE }}
            whileTap={{ scale: 0.97 }}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] text-[15px] font-semibold [touch-action:manipulation]"
            style={{
              background: 'color-mix(in oklab, var(--accent) 10%, transparent)',
              color: 'var(--accent)',
              border: '1px solid color-mix(in oklab, var(--accent) 22%, transparent)',
            }}
          >
            <Sparkles size={16} strokeWidth={1.8} />
            Marcar como manifestado
          </motion.button>
        )}
      </div>

      {/* ── SHEETS ── */}
      <SheetReflexion
        abierto={sheetReflexion}
        onCerrar={() => setSheetReflexion(false)}
        onGuardar={(texto) => addReflexion(manifestacion.id, texto)}
      />
      <SheetCierre
        abierto={sheetCierre}
        onCerrar={() => setSheetCierre(false)}
        onGuardar={handleCierre}
      />
    </div>
  );
}
