// Configuración visual de los premios — colores de sección de la ruleta.
// Son constantes de datos, no tokens de UI (no remplazables por var(--...))
// porque cada premio tiene su identidad cromática única en el SVG de la ruleta.

import { Moon, Sparkles, PenLine, Zap, Headphones, Star, Gift, Gem } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type PremioConfig = {
  id: string;
  nombre: string;
  label: string;
  descripcion: string;
  color: string;
  Icon: LucideIcon;
};

// SVG structural colors for the wheel (border ring, lights, center hub)
// Defined here to keep page.tsx free of hex values
export const WHEEL_COLORS = {
  gold: '#D4A96A',       // champagne — border ring, hub outer, gold lights
  goldLight: '#FFF8E0',  // near-white alternating lights
  hubInner: '#C9A86A',   // slightly darker champagne for hub inner ring
} as const;

export const PREMIOS: PremioConfig[] = [
  {
    id: 'ritual_lunar',
    nombre: 'Ritual Lunar',
    label: 'Ritual',
    descripcion: 'Un ritual de luna llena exclusivo: 3 pasos para amplificar tu manifestación con la energía lunar. Guarda esta pantalla o anótalo para hacerlo esta noche.',
    color: '#8B6DB5',
    Icon: Moon,
  },
  {
    id: 'afirmacion_vip',
    nombre: 'Afirmación VIP',
    label: 'Afirm.',
    descripcion: 'Tu afirmación personalizada de alta frecuencia, calibrada para tu deseo actual. Repítela 21 veces esta noche antes de dormir.',
    color: '#C4748A',
    Icon: Sparkles,
  },
  {
    id: 'script_magico',
    nombre: 'Script Mágico',
    label: 'Script',
    descripcion: 'Un script de scripting guiado de 5 minutos para conectar con tu deseo desde el sentimiento, no desde la mente.',
    color: '#C9A86A',
    Icon: PenLine,
  },
  {
    id: 'decreto_especial',
    nombre: 'Decreto Especial',
    label: 'Decreto',
    descripcion: 'Tu decreto de alta vibración del día. Pronúncialo en voz alta con convicción 3 veces al despertar mañana.',
    color: '#5A9E8E',
    Icon: Zap,
  },
  {
    id: 'meditacion',
    nombre: 'Meditación Guiada',
    label: 'Medita',
    descripcion: 'Accede hoy a la meditación de manifestación de 10 minutos en tu biblioteca. Ideal para el momento antes de dormir.',
    color: '#7B9EC4',
    Icon: Headphones,
  },
  {
    id: 'mensaje_secreto',
    nombre: 'Mensaje Secreto',
    label: 'Mensaje',
    descripcion: 'El universo tiene un mensaje para ti hoy: "Lo que pides ya está en camino. Confía en el proceso y suelta el control."',
    color: '#B06090',
    Icon: Star,
  },
  {
    id: 'sorpresa',
    nombre: 'Sorpresa Estelar',
    label: 'Sorpresa',
    descripcion: '¡Premio especial! Acceso desbloqueado a un ritual de manifestación exclusivo. Revísalo en tu biblioteca esta semana.',
    color: '#D4785A',
    Icon: Gift,
  },
  {
    id: 'joya_biblioteca',
    nombre: 'Joya de Biblioteca',
    label: 'Joya',
    descripcion: 'Has desbloqueado una pieza rara de la biblioteca: el ritual de los 33 días. Empiézalo mañana para ver resultados en un mes.',
    color: '#8B7040',
    Icon: Gem,
  },
];
