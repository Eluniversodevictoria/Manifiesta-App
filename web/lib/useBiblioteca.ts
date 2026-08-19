'use client';

import { useState, useEffect, useCallback } from 'react';
import type { PreferenciaMedia } from './manifestaciones-types';

const KEY_GUARDADOS = 'manifiesta_biblioteca_guardados_v1';
const KEY_RECIENTES = 'manifiesta_biblioteca_recientes_v1';
const KEY_PREFERENCIA = 'manifiesta_preferencia_media';
const MAX_RECIENTES = 8;

function cargarArray(key: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function guardarArray(key: string, arr: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(arr));
  } catch {}
}

export function useBiblioteca() {
  const [guardados, setGuardados] = useState<string[]>([]);
  const [recientes, setRecientes] = useState<string[]>([]);
  const [preferencia, setPreferenciaState] = useState<PreferenciaMedia>('leer');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setGuardados(cargarArray(KEY_GUARDADOS));
    setRecientes(cargarArray(KEY_RECIENTES));
    const pref = localStorage.getItem(KEY_PREFERENCIA) as PreferenciaMedia | null;
    if (pref) setPreferenciaState(pref);
    setMounted(true);
  }, []);

  const toggleGuardado = useCallback((id: string) => {
    setGuardados((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev];
      guardarArray(KEY_GUARDADOS, next);
      return next;
    });
  }, []);

  const registrarVisto = useCallback((id: string) => {
    setRecientes((prev) => {
      const sin = prev.filter((x) => x !== id);
      const next = [id, ...sin].slice(0, MAX_RECIENTES);
      guardarArray(KEY_RECIENTES, next);
      return next;
    });
  }, []);

  const setPreferencia = useCallback((p: PreferenciaMedia) => {
    setPreferenciaState(p);
    try {
      localStorage.setItem(KEY_PREFERENCIA, p);
    } catch {}
  }, []);

  const esGuardado = useCallback((id: string) => guardados.includes(id), [guardados]);

  return { guardados, recientes, preferencia, setPreferencia, toggleGuardado, registrarVisto, esGuardado, mounted };
}
