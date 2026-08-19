// Fuente única de verdad para categorías de manifestaciones.
// Usada por onboarding, manifestaciones y el engine D1-D30.
// NO duplicar este array en ningún otro archivo.

import type { PracticaFamilia } from './practica-engine';

export type CategoriaId =
  | 'Dinero'
  | 'Abundancia'
  | 'Oportunidades'
  | 'Amor'
  | 'Soltar'
  | 'Gratitud'
  | 'Otro'
  | 'Trabajo'
  | 'Hogar'
  | 'Bienestar'
  | 'Viaje';

export interface Categoria {
  id: CategoriaId;
  label: string;             // label en Manifestaciones
  labelOnboarding: string;   // label en el flujo de bienvenida
  emoji: string;
  familia: PracticaFamilia;
  visibleEnOnboarding: boolean;
  visibleEnManifestaciones: boolean;
}

// Mapping definitivo categoría → familia (aprobado 2026-08-17):
// Dinero / Abundancia → prosperidad
// Trabajo / Oportunidades / Viaje → proposito
// Amor → amor
// Hogar / Bienestar / Soltar / Gratitud → bienestar
// Otro → general
export const CATEGORIAS: Categoria[] = [
  {
    id: 'Dinero',
    label: 'Dinero',
    labelOnboarding: 'Dinero y abundancia',
    emoji: '💰',
    familia: 'prosperidad',
    visibleEnOnboarding: true,
    visibleEnManifestaciones: true,
  },
  {
    id: 'Abundancia',
    label: 'Abundancia',
    labelOnboarding: 'Abundancia',
    emoji: '🌟',
    familia: 'prosperidad',
    visibleEnOnboarding: false,
    visibleEnManifestaciones: true,
  },
  {
    id: 'Trabajo',
    label: 'Trabajo',
    labelOnboarding: 'Trabajo y éxito',
    emoji: '🚀',
    familia: 'proposito',
    visibleEnOnboarding: true,
    visibleEnManifestaciones: false,
  },
  {
    id: 'Oportunidades',
    label: 'Oportunidades',
    labelOnboarding: 'Oportunidades',
    emoji: '🚀',
    familia: 'proposito',
    visibleEnOnboarding: false,
    visibleEnManifestaciones: true,
  },
  {
    id: 'Amor',
    label: 'Amor',
    labelOnboarding: 'Amor y relaciones',
    emoji: '💗',
    familia: 'amor',
    visibleEnOnboarding: true,
    visibleEnManifestaciones: true,
  },
  {
    id: 'Hogar',
    label: 'Hogar',
    labelOnboarding: 'Hogar y estabilidad',
    emoji: '🏠',
    familia: 'bienestar',
    visibleEnOnboarding: true,
    visibleEnManifestaciones: false,
  },
  {
    id: 'Bienestar',
    label: 'Bienestar',
    labelOnboarding: 'Salud y bienestar',
    emoji: '🌿',
    familia: 'bienestar',
    visibleEnOnboarding: true,
    visibleEnManifestaciones: false,
  },
  {
    id: 'Soltar',
    label: 'Soltar',
    labelOnboarding: 'Soltar',
    emoji: '🕊️',
    familia: 'bienestar',
    visibleEnOnboarding: false,
    visibleEnManifestaciones: true,
  },
  {
    id: 'Gratitud',
    label: 'Gratitud',
    labelOnboarding: 'Gratitud',
    emoji: '🙏',
    familia: 'bienestar',
    visibleEnOnboarding: false,
    visibleEnManifestaciones: true,
  },
  {
    id: 'Viaje',
    label: 'Viaje',
    labelOnboarding: 'Viaje y libertad',
    emoji: '✈️',
    familia: 'proposito',
    visibleEnOnboarding: true,
    visibleEnManifestaciones: false,
  },
  {
    id: 'Otro',
    label: 'Otro',
    labelOnboarding: 'Otro',
    emoji: '✨',
    familia: 'general',
    visibleEnOnboarding: false,
    visibleEnManifestaciones: true,
  },
];

export function getCategoriaById(id: string): Categoria | undefined {
  return CATEGORIAS.find((c) => c.id === id);
}

export function getFamiliaFromCategoria(categoriaId: string): PracticaFamilia {
  return getCategoriaById(categoriaId)?.familia ?? 'general';
}

export const CATEGORIAS_ONBOARDING = CATEGORIAS.filter((c) => c.visibleEnOnboarding);
export const CATEGORIAS_MANIFESTACIONES = CATEGORIAS.filter((c) => c.visibleEnManifestaciones);
