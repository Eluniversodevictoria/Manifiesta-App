// Utilidades para el Historial personal de la usuaria
// FUENTES DE VERDAD (en orden de prioridad):
//   1. PracticeSnapshot  → prácticas diarias (rich: dia, fase, tema, protagonista, bloques)
//   2. CheckIns          → fallback para prácticas sin snapshot (datos legacy / pre-engine)
//   3. Manifestacion     → scripts, reflexiones, creación, cierre
// No mezclar con event_log de analítica (eso es telemetría para el panel admin).

import type { Manifestacion } from './manifestaciones-types';
import type { PracticeSnapshot } from './practica-engine';

export type TipoActividad =
  | 'practica'
  | 'practica_legacy'
  | 'script'
  | 'reflexion'
  | 'manifestacion_creada'
  | 'manifestacion_cumplida';

export interface SnapshotResumen {
  dia: number;
  fase: string;
  tema: string;
  familia: string;
  cycleNumber: number;
  previewText: string;
}

export interface ActividadHistorial {
  id: string;
  tipo: TipoActividad;
  fechaDisplay: string;
  fechaAprox: Date;
  titulo: string;
  descripcion?: string;
  manifestacionId?: string;
  manifestacionNombre?: string;
  manifestacionEmoji?: string;
  snapshot?: SnapshotResumen;
}

export interface GrupoHistorial {
  label: string;
  actividades: ActividadHistorial[];
}

export interface ResumenHistorial {
  diasConPracticaEsteMes: number;
  totalPracticas: number;
  totalScripts: number;
  manifestacionesCumplidas: number;
}

// ── Parser de fechas display → Date aproximado ────────────────────────────
const MESES: Record<string, number> = {
  ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5,
  jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11,
};

export function parseFechaAprox(fecha: string): Date {
  const ahora = new Date();
  const f = fecha.toLowerCase().trim();

  if (f === 'hoy' || f === 'ahora mismo') return new Date(ahora);

  const dias = f.match(/hace (\d+) d[ií]a/);
  if (dias) {
    const d = new Date(ahora);
    d.setDate(d.getDate() - parseInt(dias[1]));
    return d;
  }

  const semanas = f.match(/hace (\d+) semana/);
  if (semanas) {
    const d = new Date(ahora);
    d.setDate(d.getDate() - parseInt(semanas[1]) * 7);
    return d;
  }

  const conAnio = f.match(/(\d{1,2})\s+([a-záéíóú]{3})\s+(\d{4})/);
  if (conAnio) {
    const mes = MESES[conAnio[2]];
    if (mes !== undefined) {
      return new Date(parseInt(conAnio[3]), mes, parseInt(conAnio[1]));
    }
  }

  const sinAnio = f.match(/(\d{1,2})\s+([a-záéíóú]{3})/);
  if (sinAnio) {
    const mes = MESES[sinAnio[2]];
    if (mes !== undefined) {
      const d = new Date(ahora.getFullYear(), mes, parseInt(sinAnio[1]));
      if (d > ahora) d.setFullYear(ahora.getFullYear() - 1);
      return d;
    }
  }

  return new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
}

// ISO date string → Date local (evita offset timezone)
function isoToLocal(iso: string): Date {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
}

// Fecha ISO → display "17 ago"
function isoToDisplay(iso: string): string {
  const NOMBRES: Record<number, string> = {
    0: 'ene', 1: 'feb', 2: 'mar', 3: 'abr', 4: 'may', 5: 'jun',
    6: 'jul', 7: 'ago', 8: 'sep', 9: 'oct', 10: 'nov', 11: 'dic',
  };
  const d = isoToLocal(iso);
  return `${d.getDate()} ${NOMBRES[d.getMonth()]}`;
}

// Clave de día normalizada para detectar duplicados
function clavesDia(fecha: Date): string {
  return `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}`;
}

// Extrae el texto más representativo de los bloques del snapshot
function extractPreview(snap: PracticeSnapshot): string {
  // Preferir el protagonista, luego el primero de profundizar, luego intencion
  const protagonista = snap.bloques.find((b) => b.esProtagonista);
  if (protagonista && protagonista.textContent.length > 0) {
    return protagonista.textContent.slice(0, 120);
  }
  const profundizar = snap.bloques.find((b) => b.esProfundizar);
  if (profundizar) return profundizar.textContent.slice(0, 120);
  const primero = snap.bloques[0];
  return primero ? primero.textContent.slice(0, 120) : '';
}

// ── Etiqueta de grupo por fecha ───────────────────────────────────────────
const MESES_NOMBRE = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export function labelGrupo(fecha: Date): string {
  const ahora = new Date();
  const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  const ayer = new Date(hoy.getTime() - 86_400_000);
  const hace6dias = new Date(hoy.getTime() - 6 * 86_400_000);
  const fechaD = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());

  if (fechaD.getTime() === hoy.getTime()) return 'Hoy';
  if (fechaD.getTime() === ayer.getTime()) return 'Ayer';
  if (fechaD >= hace6dias) return 'Esta semana';

  const mes = MESES_NOMBRE[fecha.getMonth()];
  const anio = fecha.getFullYear();
  return anio === ahora.getFullYear() ? mes : `${mes} ${anio}`;
}

// ── Derivar historial ─────────────────────────────────────────────────────
export function derivarHistorial(
  manifestaciones: Manifestacion[],
  snapshots: PracticeSnapshot[] = [],
): ActividadHistorial[] {
  const items: ActividadHistorial[] = [];

  // ── 1. Entradas desde PracticeSnapshot (fuente primaria de prácticas) ──
  // Índice: manifestacionId + clave de día → snap usado (para deduplicar checkIns)
  const snapDiasUsados = new Set<string>();

  for (const snap of snapshots) {
    const completedIso = snap.completedAt ?? new Date().toISOString();
    const fechaLocal = isoToLocal(completedIso);
    const clave = `${snap.manifestacionId}-${clavesDia(fechaLocal)}`;
    snapDiasUsados.add(clave);

    const m = manifestaciones.find((x) => x.id === snap.manifestacionId);
    const cicloLabel = snap.cycleNumber > 1 ? ` · Ciclo ${snap.cycleNumber}` : '';

    items.push({
      id: `snap-${snap.id}`,
      tipo: 'practica',
      fechaDisplay: isoToDisplay(completedIso),
      fechaAprox: fechaLocal,
      titulo: `Día ${snap.dia} · ${snap.fase}${cicloLabel}`,
      descripcion: snap.tema,
      manifestacionId: snap.manifestacionId,
      manifestacionNombre: m?.deseo ?? snap.deseoSnapshot,
      manifestacionEmoji: m?.categoriaEmoji,
      snapshot: {
        dia: snap.dia,
        fase: snap.fase,
        tema: snap.tema,
        familia: snap.familia,
        cycleNumber: snap.cycleNumber,
        previewText: extractPreview(snap),
      },
    });
  }

  for (const m of manifestaciones) {
    // ── 2. CheckIns sin snapshot correspondiente (legacy / pre-engine) ──
    for (const c of m.checkIns) {
      const fechaAprox = parseFechaAprox(c.fecha);
      const clave = `${m.id}-${clavesDia(fechaAprox)}`;
      if (snapDiasUsados.has(clave)) continue; // ya cubierto por snapshot

      items.push({
        id: `ck-${c.id}`,
        tipo: 'practica_legacy',
        fechaDisplay: c.fecha,
        fechaAprox,
        titulo: 'Práctica completada',
        descripcion: c.nota,
        manifestacionId: m.id,
        manifestacionNombre: m.deseo,
        manifestacionEmoji: m.categoriaEmoji,
      });
    }

    // ── 3. Manifestación creada ──
    items.push({
      id: `manif-creada-${m.id}`,
      tipo: 'manifestacion_creada',
      fechaDisplay: m.fechaInicio,
      fechaAprox: parseFechaAprox(m.fechaInicio),
      titulo: 'Nueva manifestación',
      descripcion: m.deseo,
      manifestacionId: m.id,
      manifestacionNombre: m.deseo,
      manifestacionEmoji: m.categoriaEmoji,
    });

    // ── 4. Manifestación cumplida ──
    if (m.estado === 'manifestado' && m.cierre) {
      items.push({
        id: `manif-cumplida-${m.id}`,
        tipo: 'manifestacion_cumplida',
        fechaDisplay: m.cierre.fechaOcurrencia,
        fechaAprox: parseFechaAprox(m.cierre.fechaOcurrencia),
        titulo: 'Se manifestó ✨',
        descripcion: m.deseo,
        manifestacionId: m.id,
        manifestacionNombre: m.deseo,
        manifestacionEmoji: m.categoriaEmoji,
      });
    }

    // ── 5. Scripts ──
    for (const s of m.scripts) {
      items.push({
        id: `scr-${s.id}`,
        tipo: 'script',
        fechaDisplay: s.fecha,
        fechaAprox: parseFechaAprox(s.fecha),
        titulo: 'Escribiste un script',
        descripcion: s.texto.length > 110 ? s.texto.slice(0, 110) + '…' : s.texto,
        manifestacionId: m.id,
        manifestacionNombre: m.deseo,
        manifestacionEmoji: m.categoriaEmoji,
      });
    }

    // ── 6. Reflexiones ──
    for (const r of m.reflexiones) {
      items.push({
        id: `ref-${r.id}`,
        tipo: 'reflexion',
        fechaDisplay: r.fecha,
        fechaAprox: parseFechaAprox(r.fecha),
        titulo: 'Reflexión anotada',
        descripcion: r.texto.length > 110 ? r.texto.slice(0, 110) + '…' : r.texto,
        manifestacionId: m.id,
        manifestacionNombre: m.deseo,
        manifestacionEmoji: m.categoriaEmoji,
      });
    }
  }

  return items.sort((a, b) => b.fechaAprox.getTime() - a.fechaAprox.getTime());
}

// ── Agrupar por fecha ─────────────────────────────────────────────────────
export function agruparHistorial(items: ActividadHistorial[]): GrupoHistorial[] {
  const map = new Map<string, ActividadHistorial[]>();
  for (const item of items) {
    const label = labelGrupo(item.fechaAprox);
    const existing = map.get(label);
    if (existing) existing.push(item);
    else map.set(label, [item]);
  }
  return Array.from(map.entries()).map(([label, actividades]) => ({ label, actividades }));
}

// ── Resumen estadístico ───────────────────────────────────────────────────
export function derivarResumen(
  manifestaciones: Manifestacion[],
  snapshots: PracticeSnapshot[] = [],
): ResumenHistorial {
  const ahora = new Date();
  const mesActual = ahora.getMonth();
  const anioActual = ahora.getFullYear();

  const diasConPractica = new Set<string>();
  let totalScripts = 0;
  let manifestacionesCumplidas = 0;

  // Contar días de práctica desde snapshots (fuente primaria)
  const snapDias = new Set<string>();
  for (const snap of snapshots) {
    const d = isoToLocal(snap.completedAt ?? new Date().toISOString());
    if (d.getMonth() === mesActual && d.getFullYear() === anioActual) {
      diasConPractica.add(clavesDia(d));
    }
    snapDias.add(`${snap.manifestacionId}-${clavesDia(d)}`);
  }

  for (const m of manifestaciones) {
    totalScripts += m.scripts.length;
    if (m.estado === 'manifestado') manifestacionesCumplidas++;

    // CheckIns legacy (sin snapshot)
    for (const c of m.checkIns) {
      const fecha = parseFechaAprox(c.fecha);
      const clave = `${m.id}-${clavesDia(fecha)}`;
      if (snapDias.has(clave)) continue;
      if (fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual) {
        diasConPractica.add(clavesDia(fecha));
      }
    }
  }

  const totalPracticas = snapshots.length
    + manifestaciones.reduce((acc, m) => {
        return acc + m.checkIns.filter((c) => {
          const d = parseFechaAprox(c.fecha);
          return !snapDias.has(`${m.id}-${clavesDia(d)}`);
        }).length;
      }, 0);

  return {
    diasConPracticaEsteMes: diasConPractica.size,
    totalPracticas,
    totalScripts,
    manifestacionesCumplidas,
  };
}
