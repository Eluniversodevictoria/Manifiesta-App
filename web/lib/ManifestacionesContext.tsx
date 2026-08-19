'use client';

// Contexto compartido de manifestaciones — un único origen de verdad para toda la app
// Persistencia: localStorage (Fase 4); en Fase 5 se reemplaza por Supabase

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { Manifestacion, Script, CheckIn, Reflexion, CierreManifestacion } from './manifestaciones-types';
import { MOCK_INICIAL } from './manifestaciones-types';
import {
  type PracticeProgress,
  type PracticeSnapshot,
  iniciarPracticeProgress,
  avanzarDia,
  iniciarCiclo2,
  crearSnapshot,
} from './practica-engine';

const LS_KEY = 'manifiesta_manifestaciones_v1';
const LS_ACTIVA = 'manifiesta_activa_id';
const LS_PROGRESS = 'manifiesta_practice_progress_v1';
const LS_SNAPSHOTS = 'manifiesta_snapshots_v1';

// ── Helpers ───────────────────────────────────────────────────────────────
function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function fechaHoy() {
  return new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}

// ── Contexto ──────────────────────────────────────────────────────────────
interface ManifestacionesCtx {
  manifestaciones: Manifestacion[];
  getById: (id: string) => Manifestacion | undefined;
  add: (m: Omit<Manifestacion, 'id' | 'scripts' | 'checkIns' | 'reflexiones'>) => string;
  update: (id: string, cambios: Partial<Manifestacion>) => void;
  marcarManifestado: (id: string, cierre: CierreManifestacion) => void;
  addScript: (manifestacionId: string, texto: string, intencion?: string) => void;
  addCheckIn: (manifestacionId: string, nota?: string) => void;
  addReflexion: (manifestacionId: string, texto: string) => void;
  // Engine D1-D30
  manifestacionActivaId: string | null;
  setManifestacionActiva: (id: string | null) => void;
  practiceProgress: Record<string, PracticeProgress>;
  completarDiaPractica: (manifestacionId: string, snapshot: PracticeSnapshot) => void;
  continuarCiclo: (manifestacionId: string) => void;
  getProgress: (manifestacionId: string) => PracticeProgress;
  // Snapshots
  snapshots: PracticeSnapshot[];
  getSnapshotsByManifestacion: (manifestacionId: string) => PracticeSnapshot[];
}

const Ctx = createContext<ManifestacionesCtx | null>(null);

export function ManifestacionesProvider({ children }: { children: ReactNode }) {
  const [manifestaciones, setManifestaciones] = useState<Manifestacion[]>([]);
  const [cargado, setCargado] = useState(false);
  const [manifestacionActivaId, setManifestacionActivaIdState] = useState<string | null>(null);
  const [practiceProgress, setPracticeProgress] = useState<Record<string, PracticeProgress>>({});
  const [snapshots, setSnapshots] = useState<PracticeSnapshot[]>([]);

  // Cargar desde localStorage al montar (solo client)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      setManifestaciones(raw ? JSON.parse(raw) : MOCK_INICIAL);
    } catch {
      setManifestaciones(MOCK_INICIAL);
    }
    try {
      const activa = localStorage.getItem(LS_ACTIVA);
      if (activa) setManifestacionActivaIdState(activa);
    } catch { /* sin estado previo */ }
    try {
      const prog = localStorage.getItem(LS_PROGRESS);
      if (prog) setPracticeProgress(JSON.parse(prog));
    } catch { /* sin progreso previo */ }
    try {
      const snaps = localStorage.getItem(LS_SNAPSHOTS);
      if (snaps) setSnapshots(JSON.parse(snaps));
    } catch { /* sin snapshots previos */ }
    setCargado(true);
  }, []);

  useEffect(() => {
    if (!cargado) return;
    localStorage.setItem(LS_KEY, JSON.stringify(manifestaciones));
  }, [manifestaciones, cargado]);

  useEffect(() => {
    if (!cargado) return;
    if (manifestacionActivaId) {
      localStorage.setItem(LS_ACTIVA, manifestacionActivaId);
    } else {
      localStorage.removeItem(LS_ACTIVA);
    }
  }, [manifestacionActivaId, cargado]);

  useEffect(() => {
    if (!cargado) return;
    localStorage.setItem(LS_PROGRESS, JSON.stringify(practiceProgress));
  }, [practiceProgress, cargado]);

  useEffect(() => {
    if (!cargado) return;
    localStorage.setItem(LS_SNAPSHOTS, JSON.stringify(snapshots));
  }, [snapshots, cargado]);

  const getById = useCallback(
    (id: string) => manifestaciones.find((m) => m.id === id),
    [manifestaciones]
  );

  const setManifestacionActiva = useCallback((id: string | null) => {
    setManifestacionActivaIdState(id);
  }, []);

  const getProgress = useCallback(
    (manifestacionId: string): PracticeProgress =>
      practiceProgress[manifestacionId] ?? iniciarPracticeProgress(manifestacionId),
    [practiceProgress]
  );

  const completarDiaPractica = useCallback((manifestacionId: string, snapshot: PracticeSnapshot) => {
    setPracticeProgress((prev) => {
      const current = prev[manifestacionId] ?? iniciarPracticeProgress(manifestacionId);
      const updated = avanzarDia(current);
      return { ...prev, [manifestacionId]: updated };
    });
    setSnapshots((prev) => [...prev, snapshot]);
  }, []);

  const getSnapshotsByManifestacion = useCallback(
    (manifestacionId: string) => snapshots.filter((s) => s.manifestacionId === manifestacionId),
    [snapshots]
  );

  const continuarCiclo = useCallback((manifestacionId: string) => {
    setPracticeProgress((prev) => {
      const current = prev[manifestacionId] ?? iniciarPracticeProgress(manifestacionId);
      return { ...prev, [manifestacionId]: iniciarCiclo2(current) };
    });
  }, []);

  const add = useCallback(
    (m: Omit<Manifestacion, 'id' | 'scripts' | 'checkIns' | 'reflexiones'>): string => {
      const id = uid();
      setManifestaciones((prev) => [
        { ...m, id, scripts: [], checkIns: [], reflexiones: [] },
        ...prev,
      ]);
      // Iniciar progreso D1 para la nueva manifestación
      setPracticeProgress((prev) => ({
        ...prev,
        [id]: iniciarPracticeProgress(id),
      }));
      return id;
    },
    []
  );

  const update = useCallback((id: string, cambios: Partial<Manifestacion>) => {
    setManifestaciones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...cambios } : m))
    );
  }, []);

  const marcarManifestado = useCallback(
    (id: string, cierre: CierreManifestacion) => {
      setManifestaciones((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, estado: 'manifestado', cierre } : m
        )
      );
    },
    []
  );

  const addScript = useCallback(
    (manifestacionId: string, texto: string, intencion?: string) => {
      const script: Script = {
        id: uid(),
        texto,
        fecha: 'Ahora mismo',
        intencion,
      };
      setManifestaciones((prev) =>
        prev.map((m) =>
          m.id === manifestacionId
            ? { ...m, scripts: [script, ...m.scripts] }
            : m
        )
      );
    },
    []
  );

  const addCheckIn = useCallback((manifestacionId: string, nota?: string) => {
    const checkIn: CheckIn = { id: uid(), fecha: fechaHoy(), nota };
    setManifestaciones((prev) =>
      prev.map((m) =>
        m.id === manifestacionId
          ? {
              ...m,
              checkIns: [checkIn, ...m.checkIns],
              ultimoCheckIn: 'Hoy',
            }
          : m
      )
    );
  }, []);

  const addReflexion = useCallback(
    (manifestacionId: string, texto: string) => {
      const reflexion: Reflexion = {
        id: uid(),
        texto,
        fecha: 'Ahora mismo',
      };
      setManifestaciones((prev) =>
        prev.map((m) =>
          m.id === manifestacionId
            ? { ...m, reflexiones: [reflexion, ...m.reflexiones] }
            : m
        )
      );
    },
    []
  );

  return (
    <Ctx.Provider
      value={{
        manifestaciones,
        getById,
        add,
        update,
        marcarManifestado,
        addScript,
        addCheckIn,
        addReflexion,
        manifestacionActivaId,
        setManifestacionActiva,
        practiceProgress,
        completarDiaPractica,
        continuarCiclo,
        getProgress,
        snapshots,
        getSnapshotsByManifestacion,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useManifestaciones() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useManifestaciones debe usarse dentro de ManifestacionesProvider');
  return ctx;
}
