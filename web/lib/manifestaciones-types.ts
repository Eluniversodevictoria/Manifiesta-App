// Tipos compartidos + datos semilla de manifestaciones
// En Fase 5: reemplazar MOCK_INICIAL por llamadas a Supabase

export type EstadoManifestacion = 'activo' | 'manifestado' | 'pausado';

// ── Audio / multimedia ────────────────────────────────────────────────────
// Preparado para ElevenLabs / Storage en Fase 6 — sin integraciones todavía.
// Todo contenido que hoy es solo texto podrá tener su par de audio.
export type AudioEstado = 'none' | 'placeholder' | 'generating' | 'ready' | 'error' | 'outdated';
export type PreferenciaMedia = 'leer' | 'escuchar' | 'ambas';

// Mixin reutilizable en Script, Ritual, Afirmacion, Visualizacion, etc.
export interface ContenidoMedia {
  textContent: string;          // siempre presente
  audioUrl?: string;            // vacío hasta Fase 6
  audioDurationSec?: number;    // duración en segundos (estimada o real)
  audioEstado: AudioEstado;     // 'none' | 'placeholder' | 'ready' | 'error'
}

export interface Script {
  id: string;
  texto: string;                // alias de textContent — se mantiene por compatibilidad
  fecha: string;
  intencion?: string;
  manifestacionId?: string;     // vincula el script a una manifestación específica
  // audio (opcional, para cuando se active en Fase 6)
  audioUrl?: string;
  audioDurationSec?: number;
  audioEstado?: AudioEstado;
}

export interface CheckIn {
  id: string;
  fecha: string;
  nota?: string;
}

export interface Reflexion {
  id: string;
  texto: string;
  fecha: string;
}

export interface CierreManifestacion {
  fechaOcurrencia: string;
  comoLlego: string;
  aprendizaje: string;
  notaFinal: string;
}

export interface Manifestacion {
  id: string;
  deseo: string;
  categoria: string;
  categoriaEmoji: string;
  descripcion: string;          // intención actual
  fechaInicio: string;
  estado: EstadoManifestacion;
  ultimoCheckIn: string;
  scripts: Script[];
  checkIns: CheckIn[];
  reflexiones: Reflexion[];
  cierre?: CierreManifestacion;
}

// progreso derivado — no se persiste, se calcula
// Meta: 30 check-ins = manifestación completamente trabajada
export function calcularProgreso(m: Manifestacion): number {
  return Math.min(Math.round((m.checkIns.length / 30) * 100), 100);
}

// MAPA_PRACTICA y derivarTrabajoHoy eliminados.
// Usar getFamiliaFromCategoria() de lib/categorias.ts
// y generarPractica() de lib/practica-engine.ts

// ── Datos semilla ─────────────────────────────────────────────────────────
export const MOCK_INICIAL: Manifestacion[] = [
  {
    id: '1',
    deseo: 'Dinero y abundancia',
    categoria: 'Dinero',
    categoriaEmoji: '💰',
    descripcion: 'Quiero vivir sin preocupaciones económicas y recibir dinero de fuentes inesperadas.',
    fechaInicio: '8 jul 2026',
    estado: 'activo',
    ultimoCheckIn: 'Hoy',
    scripts: [
      { id: 's1', texto: 'El dinero llega a mí de formas inesperadas y maravillosas. Soy próspera y lo recibo con gratitud.', fecha: 'Hace 2 días', intencion: 'dinero' },
      { id: 's2', texto: 'Hoy atraje una oportunidad nueva. Confío en que el universo me respalda siempre.', fecha: 'Hace 5 días', intencion: 'dinero' },
    ],
    checkIns: [
      { id: 'c1', fecha: '16 ago', nota: 'Sentí mucha gratitud hoy.' },
      { id: 'c2', fecha: '15 ago', nota: 'Recibí dinero inesperado.' },
      { id: 'c3', fecha: '14 ago' },
      { id: 'c4', fecha: '13 ago' },
      { id: 'c5', fecha: '12 ago', nota: 'Visualicé el resultado con mucha claridad.' },
      { id: 'c6', fecha: '11 ago' },
      { id: 'c7', fecha: '10 ago', nota: 'Un día difícil, pero sostuve la intención.' },
      { id: 'c8', fecha: '9 ago' },
    ],
    reflexiones: [
      {
        id: 'r1',
        texto: 'Noto que cuando suelto la ansiedad por el dinero, las oportunidades aparecen solas.',
        fecha: 'Hace 3 días',
      },
    ],
  },
  {
    id: '2',
    deseo: 'Trabajo que me apasione',
    categoria: 'Trabajo',
    categoriaEmoji: '🚀',
    descripcion: 'Un proyecto o cliente nuevo que llegue de forma natural y me permita expresar mis talentos.',
    fechaInicio: '15 jul 2026',
    estado: 'activo',
    ultimoCheckIn: 'Hace 2 días',
    scripts: [
      { id: 's3', texto: 'Mi trabajo ideal ya existe y está llegando a mí. Las personas correctas me ven.', fecha: 'Hace 4 días', intencion: 'trabajo' },
    ],
    checkIns: [
      { id: 'c9', fecha: '14 ago' },
      { id: 'c10', fecha: '13 ago', nota: 'Tuve una reunión prometedora.' },
      { id: 'c11', fecha: '10 ago' },
    ],
    reflexiones: [],
  },
  {
    id: '3',
    deseo: 'Paz interior',
    categoria: 'Bienestar',
    categoriaEmoji: '🌿',
    descripcion: 'Soltar la ansiedad y confiar en el proceso sin forzar resultados.',
    fechaInicio: '1 jun 2026',
    estado: 'manifestado',
    ultimoCheckIn: 'Hace 1 semana',
    scripts: [],
    checkIns: Array.from({ length: 22 }, (_, i) => ({ id: `cm${i}`, fecha: `${30 - i} jun` })),
    reflexiones: [
      { id: 'r2', texto: 'La paz no es ausencia de problemas, es saber que puedo con ellos.', fecha: 'Hace 2 semanas' },
    ],
    cierre: {
      fechaOcurrencia: '10 ago 2026',
      comoLlego: 'Llegó gradualmente, cuando dejé de pelear con mis pensamientos.',
      aprendizaje: 'La aceptación es más poderosa que el control.',
      notaFinal: 'Estoy agradecida por este camino. ✨',
    },
  },
];
