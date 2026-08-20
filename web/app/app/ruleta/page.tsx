'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { X, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { PREMIOS, WHEEL_COLORS, type PremioConfig } from './premios';

// ── Types ─────────────────────────────────────────────────────────────────────

type HistoryItem = { id: string; premio_id: string; premio_nombre: string; created_at: string };

// ── SVG geometry ─────────────────────────────────────────────────────────────

const CX = 200, CY = 200, R = 162, LIGHTS_R = 181;

function sectionPath(i: number): string {
  const a1 = (i * 45 * Math.PI) / 180;
  const a2 = ((i + 1) * 45 * Math.PI) / 180;
  const x1 = CX + R * Math.sin(a1), y1 = CY - R * Math.cos(a1);
  const x2 = CX + R * Math.sin(a2), y2 = CY - R * Math.cos(a2);
  return `M ${CX} ${CY} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${R} ${R} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`;
}

function separatorXY(i: number): { x: string; y: string } {
  const a = (i * 45 * Math.PI) / 180;
  return { x: (CX + R * Math.sin(a)).toFixed(1), y: (CY - R * Math.cos(a)).toFixed(1) };
}

function iconCenter(i: number): { x: number; y: number } {
  const a = ((i * 45 + 22.5) * Math.PI) / 180;
  return { x: CX + R * 0.57 * Math.sin(a), y: CY - R * 0.57 * Math.cos(a) };
}

const LIGHTS = Array.from({ length: 32 }, (_, i) => {
  const a = (i * (360 / 32) * Math.PI) / 180;
  return {
    x: (CX + LIGHTS_R * Math.sin(a)).toFixed(1),
    y: (CY - LIGHTS_R * Math.cos(a)).toFixed(1),
    gold: i % 2 === 0,
  };
});

// ── Confetti canvas ───────────────────────────────────────────────────────────

function Confetti({ active, onDone }: { active: boolean; onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cbRef = useRef(onDone);
  cbRef.current = onDone;

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const colors = PREMIOS.map(p => p.color);
    const particles = Array.from({ length: 72 }, () => ({
      x: Math.random() * W,
      y: -Math.random() * 80 - 10,
      vx: (Math.random() - 0.5) * 5.5,
      vy: Math.random() * 3.5 + 1.5,
      g: 0.11,
      color: colors[Math.floor(Math.random() * colors.length)],
      w: Math.random() * 11 + 5,
      h: Math.random() * 5 + 3,
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 10,
    }));

    let rafId: number;
    let frame = 0;
    const TOTAL = 140;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      frame++;
      const opacity = Math.max(0, 1 - Math.pow(frame / TOTAL, 1.6));
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy; p.vy += p.g; p.rot += p.rotV;
        if (opacity <= 0.02) continue;
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (frame < TOTAL) rafId = requestAnimationFrame(draw);
      else cbRef.current();
    };
    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-30 w-full h-full"
      aria-hidden="true"
    />
  );
}

// ── SVG Wheel ─────────────────────────────────────────────────────────────────

function Wheel({ wheelRef }: { wheelRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={wheelRef} className="w-full h-full" style={{ willChange: 'transform' }}>
      <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">

        {/* Pie sections */}
        {PREMIOS.map((p, i) => (
          <path key={p.id} d={sectionPath(i)} style={{ fill: p.color }} />
        ))}

        {/* Section dividers */}
        {PREMIOS.map((_, i) => {
          const ep = separatorXY(i);
          return (
            <line key={i} x1={CX} y1={CY} x2={ep.x} y2={ep.y}
              stroke="rgba(255,255,255,0.38)" strokeWidth="1.5" />
          );
        })}

        {/* Gold border ring */}
        <circle cx={CX} cy={CY} r="170" fill="none" stroke={WHEEL_COLORS.gold} strokeWidth="14" />
        <circle cx={CX} cy={CY} r="177" fill="none" stroke="rgba(212,169,106,0.28)" strokeWidth="6" />

        {/* Decorative lights */}
        {LIGHTS.map((l, i) => (
          <circle key={i} cx={l.x} cy={l.y} r="4.5"
            fill={l.gold ? WHEEL_COLORS.goldLight : WHEEL_COLORS.gold} opacity="0.92" />
        ))}

        {/* Icons and labels per section — no extra rotation (stays horizontal) */}
        {PREMIOS.map((p, i) => {
          const { x, y } = iconCenter(i);
          return (
            <foreignObject
              key={p.id}
              x={(x - 20).toFixed(0)}
              y={(y - 23).toFixed(0)}
              width="40"
              height="46"
            >
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <div {...{ xmlns: 'http://www.w3.org/1999/xhtml' } as any}
                style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2, width:40 }}
              >
                <p.Icon size={20} color="rgba(255,255,255,0.95)" strokeWidth={1.9} />
                <span style={{
                  color: 'rgba(255,255,255,0.88)',
                  fontSize: 9,
                  fontWeight: 700,
                  textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                  whiteSpace: 'nowrap',
                  fontFamily: 'system-ui, sans-serif',
                  lineHeight: 1,
                  textAlign: 'center',
                  display: 'block',
                }}>{p.label}</span>
              </div>
            </foreignObject>
          );
        })}

        {/* Center hub */}
        <circle cx={CX} cy={CY} r="38" fill={WHEEL_COLORS.gold} />
        <circle cx={CX} cy={CY} r="30" fill={WHEEL_COLORS.hubInner} />
        <circle cx={CX} cy={CY} r="21" fill="rgba(255,255,255,0.13)" />
        <text x={CX} y={CY + 8} textAnchor="middle" fontSize="20" fill="white"
          style={{ fontFamily: 'Georgia, serif', userSelect: 'none' }}>✦</text>
      </svg>
    </div>
  );
}

// ── Prize result sheet ────────────────────────────────────────────────────────

function ResultSheet({
  prizeConfig,
  onClose,
}: { prizeConfig: PremioConfig; onClose: () => void }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(34,20,26,0.52)', backdropFilter: 'blur(5px)' }}
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        role="dialog" aria-modal="true" aria-label={`Premio: ${prizeConfig.nombre}`}
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl px-6 pt-6"
        style={{
          background: 'var(--bg)',
          paddingBottom: 'calc(28px + env(safe-area-inset-bottom))',
          boxShadow: '0 -14px 48px rgba(34,20,26,0.2)',
        }}
      >
        {/* Drag handle */}
        <div className="mx-auto mb-5 h-1 w-10 rounded-full" style={{ background: 'var(--surface-2)' }} />

        {/* Close */}
        <button
          type="button" onClick={onClose}
          className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full [touch-action:manipulation]"
          style={{ background: 'var(--surface)' }}
          aria-label="Cerrar"
        >
          <X size={16} color="var(--text-secondary)" />
        </button>

        {/* Prize icon */}
        <div className="flex justify-center mb-5">
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.12, damping: 14, stiffness: 260 }}
            className="flex size-24 items-center justify-center rounded-full"
            style={{ background: `color-mix(in srgb, ${prizeConfig.color} 13%, transparent)` }}
          >
            <prizeConfig.Icon size={40} color={prizeConfig.color} strokeWidth={1.7} />
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <p
            className="text-center text-xs font-semibold mb-1.5"
            style={{ color: prizeConfig.color, textTransform: 'uppercase', letterSpacing: '0.09em' }}
          >
            ✦ Tu premio de hoy
          </p>
          <h2 className="text-center text-2xl font-bold mb-3 leading-tight" style={{ color: 'var(--text-primary)' }}>
            {prizeConfig.nombre}
          </h2>
          <p className="text-center text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {prizeConfig.descripcion}
          </p>
          <button
            type="button" onClick={onClose}
            className="mt-6 w-full py-6 rounded-2xl text-white font-bold text-base [touch-action:manipulation]"
            style={{ background: `linear-gradient(135deg, ${prizeConfig.color} 0%, var(--accent) 100%)` }}
          >
            ¡Gracias, universo! ✦
          </button>
        </motion.div>
      </motion.div>
    </>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function RuletaPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [nextAt, setNextAt] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [prize, setPrize] = useState<PremioConfig | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [confetti, setConfetti] = useState(false);
  const [pointerBounce, setPointerBounce] = useState(false);

  const wheelRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load initial state
  useEffect(() => {
    fetch('/api/ruleta/historial')
      .then(r => {
        if (r.status === 401) { router.push('/entrar'); return null; }
        return r.json();
      })
      .then(data => {
        if (!data) return;
        setLoading(false);
        setHistory(data.history ?? []);
        if (data.blocked && data.nextAt) {
          setBlocked(true);
          setNextAt(new Date(data.nextAt));
        }
      })
      .catch(() => setLoading(false));
  }, [router]);

  // Live countdown
  useEffect(() => {
    if (!blocked || !nextAt) { setTimeLeft(''); return; }
    const tick = () => {
      const diff = nextAt.getTime() - Date.now();
      if (diff <= 0) { setBlocked(false); setNextAt(null); setTimeLeft(''); return; }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setTimeLeft(`${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`);
    };
    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, [blocked, nextAt]);

  const handleSpin = useCallback(async () => {
    if (spinning || blocked || loading) return;
    setSpinning(true);
    setShowResult(false);
    setPrize(null);
    setConfetti(false);

    try {
      const res = await fetch('/api/ruleta/girar', { method: 'POST' });
      if (res.status === 401) { router.push('/entrar'); return; }
      const data = await res.json();

      if (data.blocked) {
        setBlocked(true);
        setNextAt(new Date(data.nextAt));
        setSpinning(false);
        return;
      }

      const wonId: string = data.premio.id;
      const prizeIdx = PREMIOS.findIndex(p => p.id === wonId);
      const idx = prizeIdx >= 0 ? prizeIdx : 0;
      const wonPrize = PREMIOS[idx];

      const duration = 4 + Math.random() * 3;
      const extraSpins = (Math.floor(Math.random() * 4) + 5) * 360;
      // Section i midpoint is at i*45+22.5° from top; bring it to pointer (top=0°)
      const targetMod = 360 - (idx * 45 + 22.5);
      const currentMod = ((angleRef.current % 360) + 360) % 360;
      let delta = targetMod - currentMod;
      if (delta < 0) delta += 360;
      const finalAngle = angleRef.current + extraSpins + delta;

      const el = wheelRef.current;
      if (!el) { setSpinning(false); return; }

      // Force reflow before applying animated transition
      el.style.transition = 'none';
      void el.offsetWidth;
      el.style.transition = `transform ${duration}s cubic-bezier(0.1, 0.9, 0.3, 1)`;
      el.style.transform = `rotate(${finalAngle}deg)`;
      angleRef.current = finalAngle;

      const finish = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        el.removeEventListener('transitionend', onEnd);
        el.style.transition = 'none';
        setSpinning(false);
        setPrize(wonPrize);
        setShowResult(true);
        setConfetti(true);
        setPointerBounce(true);
        setTimeout(() => setPointerBounce(false), 700);
        setBlocked(true);
        setNextAt(new Date(Date.now() + 24 * 3_600_000));
        setHistory(prev => [
          { id: String(Date.now()), premio_id: wonPrize.id, premio_nombre: wonPrize.nombre, created_at: new Date().toISOString() },
          ...prev.slice(0, 4),
        ]);
      };

      const onEnd = () => finish();
      el.addEventListener('transitionend', onEnd, { once: true });
      timerRef.current = setTimeout(finish, (duration + 1.5) * 1_000);
    } catch {
      setSpinning(false);
    }
  }, [spinning, blocked, loading, router]);

  return (
    <main
      className="min-h-dvh flex flex-col"
      style={{ background: 'var(--bg)', paddingBottom: 'calc(72px + env(safe-area-inset-bottom))' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-4">
        <Link
          href="/app"
          aria-label="Volver"
          className="flex size-9 items-center justify-center rounded-full flex-shrink-0"
          style={{ background: 'var(--surface)' }}
        >
          <ChevronLeft size={18} color="var(--text-secondary)" />
        </Link>
        <div>
          <h1 className="text-lg font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
            Ruleta de Premios
          </h1>
          <p className="text-xs leading-tight" style={{ color: 'var(--text-tertiary)' }}>
            Un giro por día · premios de alta vibración
          </p>
        </div>
      </div>

      {/* Wheel section */}
      <div className="flex flex-col items-center px-4 pt-1 pb-6">

        {/* Fixed pointer — sits outside the rotating div */}
        <div
          style={{
            marginBottom: -12,
            zIndex: 10,
            position: 'relative',
            animation: pointerBounce ? 'pointerBounce 0.65s ease' : 'none',
          }}
          aria-hidden="true"
        >
          <svg width="26" height="32" viewBox="0 0 26 32" fill="none">
            <path d="M13 31 L1 10 Q13 0 25 10 Z" fill="var(--accent)" />
            <path d="M13 27 L3.5 12 Q13 3 22.5 12 Z" fill="color-mix(in oklab, var(--accent) 70%, white)" />
            <circle cx="13" cy="13" r="5" fill="white" />
            <circle cx="13" cy="13" r="3" fill="var(--accent)" />
          </svg>
        </div>

        {/* Outer container: drop-shadow + confetti canvas */}
        <div
          className="relative w-full"
          style={{
            maxWidth: 340,
            aspectRatio: '1',
            filter: 'drop-shadow(0 8px 28px color-mix(in oklab, var(--accent) 22%, transparent))',
          }}
        >
          <Confetti active={confetti} onDone={() => setConfetti(false)} />
          <Wheel wheelRef={wheelRef} />
        </div>

        {/* Spin button */}
        <div className="mt-6 w-full flex flex-col items-center gap-2" style={{ maxWidth: 340 }}>
          <motion.button
            type="button"
            onClick={handleSpin}
            disabled={spinning || loading}
            whileTap={!spinning && !blocked ? { scale: 0.96 } : {}}
            animate={!spinning && !blocked && !loading ? { scale: [1, 1.025, 1] } : { scale: 1 }}
            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
            className="w-full py-6 rounded-2xl font-bold text-base [touch-action:manipulation]"
            style={{
              background: blocked
                ? 'var(--surface-2)'
                : spinning
                ? 'var(--accent)'
                : 'linear-gradient(135deg, var(--accent) 0%, color-mix(in oklab, var(--accent) 68%, var(--text-primary)) 100%)',
              boxShadow: blocked || spinning
                ? 'none'
                : '0 6px 22px color-mix(in oklab, var(--accent) 32%, transparent)',
              color: blocked ? 'var(--text-tertiary)' : 'white',
            }}
            aria-label={
              spinning ? 'Girando ruleta'
              : blocked ? 'Ruleta bloqueada hasta mañana'
              : 'Girar la ruleta'
            }
          >
            {spinning ? '✦ Girando…'
              : blocked
              ? (timeLeft ? `Vuelve en ${timeLeft}` : '¡Ya giraste hoy!')
              : loading ? '…'
              : '✦ Girar la ruleta'}
          </motion.button>

          {blocked && !spinning && (
            <p className="text-xs text-center" style={{ color: 'var(--text-tertiary)' }}>
              Un nuevo giro te espera mañana ✦
            </p>
          )}
        </div>

        {/* Last prizes history */}
        {history.length > 0 && (
          <div className="mt-8 w-full" style={{ maxWidth: 340 }}>
            <p
              className="text-xs font-semibold mb-3"
              style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}
            >
              Tus últimos premios
            </p>
            <div className="flex flex-col gap-2">
              {history.map((h, i) => {
                const cfg = PREMIOS.find(p => p.id === h.premio_id);
                return (
                  <div key={h.id} className="flex items-center gap-3 rounded-2xl px-4 py-3" style={{ background: 'var(--surface)' }}>
                    {cfg && (
                      <div
                        className="flex size-9 items-center justify-center rounded-full flex-shrink-0"
                        style={{ background: `color-mix(in srgb, ${cfg.color} 14%, transparent)` }}
                      >
                        <cfg.Icon size={17} color={cfg.color} strokeWidth={2} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight truncate" style={{ color: 'var(--text-primary)' }}>
                        {h.premio_nombre}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                        {i === 0 && blocked
                          ? 'Hoy'
                          : new Date(h.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Result sheet */}
      <AnimatePresence>
        {showResult && prize && <ResultSheet prizeConfig={prize} onClose={() => setShowResult(false)} />}
      </AnimatePresence>

      {/* Pointer bounce animation */}
      <style>{`
        @keyframes pointerBounce {
          0%   { transform: translateY(0);     }
          28%  { transform: translateY(-11px); }
          55%  { transform: translateY(5px);   }
          76%  { transform: translateY(-4px);  }
          100% { transform: translateY(0);     }
        }
      `}</style>
    </main>
  );
}
