'use client';

// MANIFIESTA — Perfil

import { useState, useMemo, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { staggerContainer, staggerItem } from '@/lib/motion-presets';
import Link from 'next/link';
import {
  Flame, Star, Crown, Bell, Lock, ChevronRight,
  LogOut, CheckCircle2, Sparkles, BookOpen, Trash2,
} from 'lucide-react';
import { useManifestaciones } from '@/lib/ManifestacionesContext';
import { usePlan } from '@/lib/PlanContext';

// Calcula racha de días consecutivos con check-in hasta hoy
function calcularRacha(checkInFechas: string[]): number {
  if (checkInFechas.length === 0) return 0;
  // Normalizar: "16 ago" → Date de este año
  const MESES: Record<string, number> = {
    ene:0,feb:1,mar:2,abr:3,may:4,jun:5,jul:6,ago:7,sep:8,oct:9,nov:10,dic:11,
  };
  const anio = new Date().getFullYear();
  const parsear = (f: string): Date | null => {
    if (f === 'Hoy') return new Date();
    const [d, m] = f.trim().toLowerCase().split(' ');
    const mes = MESES[m];
    if (mes === undefined) return null;
    return new Date(anio, mes, parseInt(d));
  };
  // Fechas únicas como timestamps (día, sin hora)
  const dias = new Set(
    checkInFechas
      .map((f) => parsear(f))
      .filter(Boolean)
      .map((d) => {
        const dd = d as Date;
        return new Date(dd.getFullYear(), dd.getMonth(), dd.getDate()).getTime();
      })
  );
  const HOY = new Date();
  const hoyTs = new Date(HOY.getFullYear(), HOY.getMonth(), HOY.getDate()).getTime();
  const MS_DIA = 86_400_000;
  let racha = 0;
  let cursor = hoyTs;
  while (dias.has(cursor)) {
    racha++;
    cursor -= MS_DIA;
  }
  // Si no hay check-in hoy, intentar desde ayer
  if (racha === 0) {
    cursor = hoyTs - MS_DIA;
    while (dias.has(cursor)) {
      racha++;
      cursor -= MS_DIA;
    }
  }
  return racha;
}

// ── Sección envuelta ──────────────────────────────────────────────────────
function Seccion({ titulo, children }: { titulo?: string; children: React.ReactNode }) {
  return (
    <div>
      {titulo && (
        <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-[0.06em]"
          style={{ color: 'var(--text-tertiary)' }}>
          {titulo}
        </p>
      )}
      <div className="overflow-hidden rounded-2xl" style={{ background: 'var(--surface)' }}>
        {children}
      </div>
    </div>
  );
}

// ── Fila de opción ────────────────────────────────────────────────────────
function Fila({
  icon,
  label,
  valor,
  acento,
  onTap,
  divider = true,
  labelColor,
}: {
  icon: React.ReactNode;
  label: string;
  valor?: string;
  acento?: boolean;
  onTap?: () => void;
  divider?: boolean;
  labelColor?: string;
}) {
  const Tag = onTap ? 'button' : 'div';
  return (
    <Tag
      type={onTap ? 'button' : undefined}
      onClick={onTap}
      className="flex w-full items-center gap-3 px-4 py-3.5 [touch-action:manipulation]"
      style={{
        borderBottom: divider
          ? '1px solid color-mix(in oklab, var(--text-tertiary) 14%, transparent)'
          : 'none',
      }}
    >
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-xl"
        style={{
          background: acento
            ? 'color-mix(in oklab, var(--accent) 12%, transparent)'
            : 'color-mix(in oklab, var(--text-tertiary) 10%, transparent)',
        }}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className="flex-1 text-left text-sm font-medium" style={{ color: labelColor ?? 'var(--text-primary)' }}>
        {label}
      </span>
      {valor && (
        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          {valor}
        </span>
      )}
      {onTap && (
        <ChevronRight size={15} color="var(--text-tertiary)" aria-hidden="true" />
      )}
    </Tag>
  );
}

// ── Pantalla ──────────────────────────────────────────────────────────────
export default function PerfilPage() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const { manifestaciones } = useManifestaciones();
  const [notif, setNotif] = useState(true);
  const [cerrandoSesion, setCerrandoSesion] = useState(false);

  const EASE = [0.16, 1, 0.3, 1] as const;

  // Plan real desde contexto
  const { isPro, planPeriodo } = usePlan();
  const isPremium = isPro;
  const plan: 'gratis' | 'mensual' | 'anual' = isPro ? (planPeriodo ?? 'mensual') : 'gratis';

  // Datos derivados del estado real
  const manifActiva = manifestaciones.find((m) => m.estado === 'activo');
  const deseo = manifActiva?.deseo ?? 'Sin deseo activo';

  const racha = useMemo(() => {
    const todasFechas = manifestaciones.flatMap((m) =>
      m.checkIns.map((ci) => ci.fecha)
    );
    return calcularRacha(todasFechas);
  }, [manifestaciones]);

  const [confirmarEliminar, setConfirmarEliminar] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const handleCerrarSesion = useCallback(async () => {
    setCerrandoSesion(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  }, []);

  const handleEliminarCuenta = async () => {
    setEliminando(true);
    // TODO: llamar a /api/delete-account cuando el endpoint esté listo
    // Por ahora redirige al email de soporte
    window.location.href = 'mailto:soportemanifiesta.app@gmail.com?subject=Eliminar%20mi%20cuenta&body=Hola%2C%20quiero%20eliminar%20mi%20cuenta%20y%20todos%20mis%20datos.';
    setEliminando(false);
    setConfirmarEliminar(false);
  };

  return (
    <div className="flex flex-col pb-4">
      {/* ── HEADER / AVATAR ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: EASE }}
        className="flex flex-col items-center px-5 pt-8 pb-6"
      >
        {/* Avatar */}
        <div
          className="relative mb-3 flex size-20 items-center justify-center rounded-full text-3xl font-bold text-white"
          style={{ background: 'var(--accent)' }}
        >
          ✦
          {isPremium && (
            <span
              className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full"
              style={{ background: 'var(--bg)', boxShadow: '0 0 0 2px var(--bg)' }}
            >
              <Crown size={13} fill="var(--accent)" color="var(--accent)" aria-hidden="true" />
            </span>
          )}
        </div>

        <h1 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>
          Mi universo
        </h1>

        {/* Stats inline */}
        <div className="mt-4 flex gap-5">
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1">
              <Flame size={14} color="var(--accent)" strokeWidth={2} />
              <span className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                {racha}
              </span>
            </div>
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>días racha</span>
          </div>
          <div className="w-px" style={{ background: 'color-mix(in oklab, var(--text-tertiary) 20%, transparent)' }} />
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1">
              <Star size={13} fill="var(--accent)" color="var(--accent)" />
              <span className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                {manifestaciones.filter((m) => m.estado === 'activo').length}
              </span>
            </div>
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>activos</span>
          </div>
          <div className="w-px" style={{ background: 'color-mix(in oklab, var(--text-tertiary) 20%, transparent)' }} />
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              {manifestaciones.filter((m) => m.estado === 'manifestado').length}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>manifestados</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="flex flex-col gap-4 px-5"
        variants={staggerContainer(0.07, 0.05)}
        initial={reduced ? false : 'hidden'}
        animate="show"
      >

        {/* ── PLAN ── */}
        <motion.div variants={reduced ? {} : staggerItem}>
          {isPremium ? (
            <div
              className="flex items-center gap-3 rounded-2xl px-4 py-3.5"
              style={{
                background: 'color-mix(in oklab, var(--accent) 8%, transparent)',
                border: '1px solid color-mix(in oklab, var(--accent) 22%, transparent)',
              }}
            >
              <Crown size={18} fill="var(--accent)" color="var(--accent)" aria-hidden="true" />
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                  Plan {plan === 'anual' ? 'Anual' : 'Mensual'} activo
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Acceso completo a MANIFIESTA
                </p>
              </div>
              <CheckCircle2 size={16} color="var(--accent)" strokeWidth={2.5} aria-hidden="true" />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => router.push('/onboarding/paywall')}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 [touch-action:manipulation]"
              style={{
                background: 'color-mix(in oklab, var(--accent) 8%, transparent)',
                border: '1px solid color-mix(in oklab, var(--accent) 22%, transparent)',
              }}
            >
              <Sparkles size={18} color="var(--accent)" strokeWidth={1.8} aria-hidden="true" />
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                  Desbloquear acceso completo
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Desde $4/mes con plan anual
                </p>
              </div>
              <ChevronRight size={15} color="var(--accent)" />
            </button>
          )}
        </motion.div>

        {/* ── MI PRÁCTICA ── */}
        <motion.div variants={reduced ? {} : staggerItem}>
          <Seccion titulo="Mi práctica">
            <Fila
              icon={<Star size={15} fill="var(--accent)" color="var(--accent)" />}
              label="Cambiar mi deseo"
              valor={deseo.split(' ').slice(0, 3).join(' ')}
              acento
              onTap={() => router.push('/app/manifestaciones')}
            />
            <Fila
              icon={<Flame size={15} color="var(--accent)" strokeWidth={2} />}
              label="Mi racha"
              valor={`${racha} días`}
              acento
              divider={false}
            />
          </Seccion>
        </motion.div>

        {/* ── PREFERENCIAS ── */}
        <motion.div variants={reduced ? {} : staggerItem}>
          <Seccion titulo="Preferencias">
            {/* Notificaciones — toggle */}
            <div className="flex items-center gap-3 px-4 py-3.5">
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-xl"
                style={{ background: 'color-mix(in oklab, var(--text-tertiary) 10%, transparent)' }}
              >
                <Bell size={15} color="var(--text-secondary)" strokeWidth={1.8} />
              </span>
              <span className="flex-1 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Recordatorio diario
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={notif}
                onClick={() => setNotif((v) => !v)}
                className="relative h-6 w-12 rounded-full transition-colors duration-200 [touch-action:manipulation]"
                style={{ background: notif ? 'var(--accent)' : 'color-mix(in oklab, var(--text-tertiary) 30%, transparent)' }}
              >
                <span
                  className="absolute top-1 size-4 rounded-full bg-white shadow transition-transform duration-200"
                  style={{ left: notif ? '23px' : '3px' }}
                />
              </button>
            </div>
          </Seccion>
        </motion.div>

        {/* ── CUENTA ── */}
        <motion.div variants={reduced ? {} : staggerItem}>
          <Seccion titulo="Cuenta">
            <Link
              href="/app/historial"
              className="flex w-full items-center gap-3 px-4 py-3.5 [touch-action:manipulation]"
              style={{ borderBottom: '1px solid color-mix(in oklab, var(--text-tertiary) 14%, transparent)' }}
            >
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-xl"
                style={{ background: 'color-mix(in oklab, var(--text-tertiary) 10%, transparent)' }}
              >
                <BookOpen size={15} color="var(--text-secondary)" strokeWidth={1.8} />
              </span>
              <span className="flex-1 text-left text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Mi historial
              </span>
              <ChevronRight size={15} color="var(--text-tertiary)" />
            </Link>
            <Fila
              icon={<Lock size={15} color="var(--text-secondary)" strokeWidth={1.8} />}
              label="Cambiar contraseña"
            />
            <Fila
              icon={<LogOut size={15} color="var(--text-secondary)" strokeWidth={1.8} />}
              label="Cerrar sesión"
              onTap={handleCerrarSesion}
            />
            <Fila
              icon={<Trash2 size={15} strokeWidth={1.8} style={{ color: 'var(--error)' }} />}
              label="Eliminar mi cuenta"
              divider={false}
              labelColor="var(--error)"
              onTap={() => setConfirmarEliminar(true)}
            />
          </Seccion>
        </motion.div>

        {/* Versión */}
        <motion.p
          variants={reduced ? {} : staggerItem}
          className="pb-2 text-center text-xs"
          style={{ color: 'var(--text-tertiary)' }}
        >
          MANIFIESTA v1.0 · con Victoria
        </motion.p>
      </motion.div>

      {/* Modal confirmar eliminar cuenta */}
      <AnimatePresence>
        {confirmarEliminar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center pb-8 px-5"
            style={{ background: 'rgba(0,0,0,0.45)' }}
            onClick={() => setConfirmarEliminar(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              className="w-full max-w-sm rounded-3xl p-6"
              style={{ background: 'var(--bg)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="mb-1 text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                ¿Eliminar tu cuenta?
              </p>
              <p className="mb-5 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Se borrarán tu historial, manifestaciones y prácticas. Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmarEliminar(false)}
                  className="flex-1 rounded-2xl py-3 text-sm font-semibold [touch-action:manipulation]"
                  style={{ background: 'var(--surface)', color: 'var(--text-primary)' }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleEliminarCuenta}
                  disabled={eliminando}
                  className="flex-1 rounded-2xl py-3 text-sm font-semibold text-white [touch-action:manipulation] disabled:opacity-60"
                  style={{ background: 'var(--error)' }}
                >
                  {eliminando ? 'Eliminando…' : 'Sí, eliminar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast de cierre de sesión */}
      <AnimatePresence>
        {cerrandoSesion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 rounded-2xl px-4 py-3 shadow-lg"
            style={{ background: 'var(--text-primary)', color: 'var(--bg)', fontSize: 13 }}
          >
            Sesión cerrada — hasta pronto ✨
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
