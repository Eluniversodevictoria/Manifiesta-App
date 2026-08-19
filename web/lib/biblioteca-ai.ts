// Capa de IA para Biblioteca — límites, prompts y lógica de recomendación
// Decide cuándo recomendar contenido editorial vs generar contenido con IA

import { getSugerenciasPorTema, type ContenidoBiblioteca } from './biblioteca-types';

// ── Límites centralizados free vs pro ────────────────────────────────────────
export const LIMITE_IA = {
  // Cuántas generaciones de "Necesito manifestar..." puede hacer por día
  generacionesDiarias: {
    free: 1,
    pro: 10,
  },
  // Cuántas prácticas diarias personalizadas (M0) puede tener por día
  practicaDiaria: {
    free: 1,
    pro: 99, // ilimitado en la práctica
  },
  // Longitud máxima del texto TTS por bloque (caracteres)
  ttsMaxChars: {
    free: 300,
    pro: 1000,
  },
  // Cuántos bloques de audio puede generar por sesión
  audioBloquesporSesion: {
    free: 2,
    pro: 20,
  },
} as const;

export type NivelPlan = 'free' | 'pro';

// ── Tipos para el sistema "Necesito manifestar..." ───────────────────────────

export interface SolicitudManifestacion {
  tema: string;          // texto libre: "necesito manifestar trabajo nuevo"
  area?: string;         // área derivada del tema
  urgencia?: 'hoy' | 'esta-semana' | 'este-mes';
}

export interface RespuestaManifestacion {
  modo: 'editorial' | 'ia';
  sugerenciasEditoriales: ContenidoBiblioteca[];  // siempre presentes (hasta 4)
  contenidoIA?: ContenidoIA;                       // solo cuando modo === 'ia'
  mensajeVictoria: string;                         // intro cálida de Victoria
}

export interface ContenidoIA {
  afirmacion: string;
  decreto: string;
  accionConcreta: string;
  preguntaReflexion: string;
}

// ── Derivar área de vida desde texto libre ────────────────────────────────────

const AREA_KEYWORDS: Record<string, string[]> = {
  Dinero:           ['dinero', 'plata', 'abundancia', 'prosperidad', 'deuda', 'ingreso', 'trabajo freelance', 'negocio', 'vender', 'cliente', 'cobrar', 'salario', 'financiero'],
  Trabajo:          ['trabajo', 'empleo', 'carrera', 'empresa', 'ascenso', 'jefe', 'proyecto', 'freelance', 'oficio', 'profesión', 'entrevista', 'renuncia'],
  Amor:             ['amor', 'pareja', 'relación', 'cita', 'soltera', 'novio', 'novia', 'corazón', 'conexión', 'romántico', 'matrimonio', 'ex'],
  Autoestima:       ['autoestima', 'confianza', 'seguridad', 'impostor', 'valor propio', 'suficiente', 'me quiero', 'me acepto', 'cuerpo', 'imagen'],
  Calma:            ['ansiedad', 'estrés', 'paz', 'calma', 'tranquilidad', 'descanso', 'dormir', 'nervios', 'preocupación', 'agotada', 'abrumada'],
  Hogar:            ['hogar', 'casa', 'mudanza', 'departamento', 'espacio', 'vivir', 'renta', 'alquiler', 'familia en casa'],
  'Nuevos Comienzos': ['nuevo comienzo', 'empezar', 'reiniciar', 'cambio', 'nueva etapa', 'mudarse', 'comenzar', 'inicio', 'primera vez'],
  Confianza:        ['confianza', 'decisión', 'segura', 'valentía', 'miedo', 'arriesgar', 'tomar decisión', 'hablar', 'presentar'],
  Soltar:           ['soltar', 'dejar ir', 'liberar', 'soltar el control', 'desapego', 'perdonar', 'cerrar ciclo', 'ex', 'resentimiento'],
};

export function derivarArea(tema: string): string | undefined {
  const t = tema.toLowerCase();
  let mejorArea: string | undefined;
  let mejorScore = 0;
  for (const [area, keywords] of Object.entries(AREA_KEYWORDS)) {
    const score = keywords.filter((kw) => t.includes(kw)).length;
    if (score > mejorScore) {
      mejorScore = score;
      mejorArea = area;
    }
  }
  return mejorScore > 0 ? mejorArea : undefined;
}

// ── Decidir si responder con editorial o con IA ───────────────────────────────
// Regla: si hay ≥2 sugerencias editoriales con score relevante → editorial
//        si el tema es muy específico o personal y el usuario es pro → IA

export function decidirModo(
  sugerencias: ContenidoBiblioteca[],
  plan: NivelPlan,
  generacionesHoy: number
): 'editorial' | 'ia' {
  const limiteHoy = LIMITE_IA.generacionesDiarias[plan];
  const agotado = generacionesHoy >= limiteHoy;

  // Si tiene contenido editorial relevante, siempre se muestra primero
  if (sugerencias.length >= 3) return 'editorial';

  // Si el usuario pro tiene cupo, genera con IA para temas específicos
  if (!agotado && plan === 'pro') return 'ia';

  // Free con cupo: IA si hay pocas sugerencias editoriales
  if (!agotado && plan === 'free' && sugerencias.length < 2) return 'ia';

  return 'editorial';
}

// ── Prompt para Claude — "Necesito manifestar..." ─────────────────────────────

export function buildPromptManifestacion(tema: string, area?: string): string {
  const areaCtx = area ? `ÁREA DE VIDA: ${area}\n` : '';
  return `Eres Victoria, guía espiritual cálida y directa de la app MANIFIESTA. Una usuaria escribió lo que necesita manifestar.

SOLICITUD DE LA USUARIA: "${tema}"
${areaCtx}
Tu tarea es crear contenido de manifestación personal y específico para ese tema.

Responde SOLO con JSON válido con esta estructura exacta:
{
  "afirmacion": "afirmación de 1-2 oraciones en primera persona, específica para el tema",
  "decreto": "decreto de 2-3 oraciones en primera persona con 'Yo decreto', específico para el tema",
  "accionConcreta": "acción específica de 1 oración que puede tomar HOY relacionada con el tema",
  "preguntaReflexion": "pregunta profunda de 1 oración que invita a explorar el tema desde dentro",
  "mensajeVictoria": "mensaje cálido y directo de Victoria de 1-2 oraciones que acompaña al contenido"
}

REGLAS:
- Menciona o alude directamente al tema en cada campo
- No uses placeholders como {tema} — escribe el tema real integrado naturalmente
- La afirmación en primera persona ("Elijo...", "Soy...", "Tengo...", "Me permito...")
- El decreto empieza con "Yo decreto..."
- La acción concreta es específica y factible hoy, no una lista
- La pregunta de reflexión abre, no juzga
- El mensaje de Victoria es cálido, como hablarle a una amiga cercana — en segunda persona (tú)
- Máximo 80 palabras por campo
- Escribe en español latino neutro (tuteo, no voseo)`;
}

// ── Mensaje de Victoria según modo ───────────────────────────────────────────

export function mensajeVictoriaEditorial(tema: string, cantidadSugerencias: number): string {
  if (cantidadSugerencias === 0) {
    return `Para lo que necesitas manifestar, te recomiendo empezar con las prácticas generales de la biblioteca.`;
  }
  return `Encontré ${cantidadSugerencias} práctica${cantidadSugerencias > 1 ? 's' : ''} que pueden ayudarte con esto. Elige la que más resuene contigo hoy.`;
}

// ── Anti-repetición — excluir lo visto recientemente ─────────────────────────

export function filtrarRecientes(
  sugerencias: ContenidoBiblioteca[],
  recientesIds: string[]
): ContenidoBiblioteca[] {
  const sinRecientes = sugerencias.filter((s) => !recientesIds.includes(s.id));
  // Si filtrar deja menos de 2, devuelve las originales (mejor repetir que quedar vacío)
  return sinRecientes.length >= 2 ? sinRecientes : sugerencias;
}

// ── Función principal: procesar solicitud editorial ───────────────────────────
// (La llamada a IA la hace el API route — esto es solo la lógica de selección)

export function procesarSolicitudEditorial(
  solicitud: SolicitudManifestacion,
  recientesIds: string[] = []
): { sugerencias: ContenidoBiblioteca[]; area?: string } {
  const area = solicitud.area ?? derivarArea(solicitud.tema);
  const raw = getSugerenciasPorTema(solicitud.tema, 6);
  const sugerencias = filtrarRecientes(raw, recientesIds).slice(0, 4);
  return { sugerencias, area };
}
