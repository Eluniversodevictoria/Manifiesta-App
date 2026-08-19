import { Star, CheckCircle2 } from 'lucide-react';
import type { EstadoManifestacion } from '@/lib/manifestaciones-types';

const CFG: Record<EstadoManifestacion, { label: string; bg: string; color: string }> = {
  activo:      { label: 'Activo',       bg: 'color-mix(in oklab, var(--accent) 10%, transparent)',  color: 'var(--accent)'   },
  manifestado: { label: 'Se manifestó', bg: 'var(--success-bg)',                                    color: 'var(--success)'  },
  pausado:     { label: 'Pausado',      bg: 'color-mix(in oklab, var(--text-tertiary) 14%, transparent)', color: 'var(--text-tertiary)' },
};

export function BadgeEstado({ estado }: { estado: EstadoManifestacion }) {
  const cfg = CFG[estado];
  return (
    <span
      className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {estado === 'manifestado' && <CheckCircle2 size={10} strokeWidth={2.5} />}
      {estado === 'activo'      && <Star size={10} fill={cfg.color} color={cfg.color} />}
      {cfg.label}
    </span>
  );
}
