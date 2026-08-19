// Engine D1–D30 — MANIFIESTA con Victoria
// LOCAL/MOCK: sin Supabase, sin IA, sin TTS todavía.
// En Fase 5 el CONTENIDO_GENERAL se alimentará parcialmente de IA + TTS de ElevenLabs.

// ═══════════════════════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════════════════════

export type AudioEstado =
  | 'none'        // sin audio
  | 'placeholder' // reservado, no generado
  | 'generating'  // TTS en proceso
  | 'ready'       // disponible
  | 'error'       // falló
  | 'outdated';   // texto cambió, audio desactualizado

export interface ContenidoMedia {
  textContent: string;
  audioEstado: AudioEstado;
  audioUrl?: string;
  audioDurationSec?: number;
}

export type PracticaTipo =
  | 'afirmacion'
  | 'visualizacion'
  | 'scripting'
  | 'journaling'
  | 'ritual';

export type PracticaFamilia =
  | 'prosperidad'  // Dinero, Abundancia
  | 'proposito'    // Oportunidades, Trabajo, Viaje
  | 'amor'         // Amor
  | 'bienestar'    // Soltar, Gratitud, Hogar, Bienestar
  | 'general';     // Otro / deseo libre

export interface DayBlueprint {
  dia: number;
  fase: 'Apertura' | 'Profundizar' | 'Recibir' | 'Soltar-Actuar' | 'Integrar' | 'Cierre';
  tema: string;
  protagonista: PracticaTipo;
  profundizarTipos: PracticaTipo[];
}

export interface BloqueAdicional {
  tipo: PracticaTipo;
  contenido: ContenidoMedia;
}

export interface ContenidoDia {
  dia: number;
  fase: string;
  tema: string;
  protagonista: PracticaTipo;
  base: {
    intencion: ContenidoMedia;
    afirmacion: ContenidoMedia;
    protagonistaBloque: ContenidoMedia;
    accionConcreta: ContenidoMedia;
  };
  profundizar: BloqueAdicional[];
}

export interface PracticeProgress {
  manifestacionId: string;
  currentDay: number;         // 1-30; se queda en 30 hasta que el usuario pulse "Continuar"
  cycleComplete: boolean;     // true cuando D30 fue completado
  cycleNumber: number;        // 1 = primer ciclo
  startedAt: string;          // ISO date 'YYYY-MM-DD'
  lastPracticeAt: string | null; // ISO date — guard de doble-completado
  completedDays: number[];    // días con "Lo hice hoy" registrado
}

export interface PracticeBloque {
  tipo: PracticaTipo | 'intencion' | 'accion';
  textContent: string;
  esProtagonista: boolean;
  esProfundizar: boolean;
}

export interface PracticeSnapshot {
  id: string;
  manifestacionId: string;
  manifestacionActivaId: string;
  templateId: string;      // ej. 'general-d3'
  contentVersion: string;  // '1.0.0'
  engineVersion: string;   // '1'
  dia: number;
  cycleNumber: number;
  fase: string;
  tema: string;
  protagonista: PracticaTipo;
  deseoSnapshot: string;
  familia: PracticaFamilia;
  bloques: PracticeBloque[];
  journalingEntries: string[];
  reflexion: string | null;
  completedAt: string | null;
  createdAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// DESEO CONTEXT — evita concatenar texto crudo gramaticalmente incorrecto
// ═══════════════════════════════════════════════════════════════════════════

export interface DeseoContext {
  raw: string;
  corto: string;          // max 30 chars — para chips, kickers
  comoIntencion: string;  // stripped de verbos iniciales — para body copy
}

const PREFIJOS_VERBO = [
  /^quiero\s+que\s+/i,
  /^quiero\s+/i,
  /^deseo\s+/i,
  /^necesito\s+/i,
  /^me\s+gustar[ií]a\s+/i,
  /^sueño\s+con\s+/i,
  /^espero\s+/i,
  /^busco\s+/i,
];

export function buildDeseoContext(raw: string): DeseoContext {
  let comoIntencion = raw.trim().replace(/\.$/, '');
  for (const prefijo of PREFIJOS_VERBO) {
    const resultado = comoIntencion.replace(prefijo, '');
    if (resultado !== comoIntencion) {
      comoIntencion = resultado.charAt(0).toLowerCase() + resultado.slice(1);
      break;
    }
  }
  const corto =
    comoIntencion.length > 30
      ? comoIntencion.substring(0, 30).replace(/\s+\S*$/, '…')
      : comoIntencion;
  return { raw, corto, comoIntencion };
}

// ═══════════════════════════════════════════════════════════════════════════
// BLUEPRINT D1–D30 — fuente de verdad editorial
// ═══════════════════════════════════════════════════════════════════════════

export const DAY_BLUEPRINT: DayBlueprint[] = [
  { dia:  1, fase:'Apertura',      tema:'Bienvenida al proceso',       protagonista:'afirmacion',    profundizarTipos:['visualizacion'] },
  { dia:  2, fase:'Apertura',      tema:'Tu deseo más claro',          protagonista:'visualizacion', profundizarTipos:['afirmacion'] },
  { dia:  3, fase:'Apertura',      tema:'El "yo" que ya lo tiene',     protagonista:'scripting',     profundizarTipos:['afirmacion'] },
  { dia:  4, fase:'Apertura',      tema:'Gratitud como apertura',      protagonista:'ritual',        profundizarTipos:[] },
  { dia:  5, fase:'Apertura',      tema:'La sensación primero',        protagonista:'visualizacion', profundizarTipos:['journaling'] },
  { dia:  6, fase:'Apertura',      tema:'Escribir desde el futuro',    protagonista:'scripting',     profundizarTipos:[] },
  { dia:  7, fase:'Apertura',      tema:'Cierre de la primera semana', protagonista:'ritual',        profundizarTipos:['journaling'] },
  { dia:  8, fase:'Profundizar',   tema:'La raíz del deseo',           protagonista:'journaling',    profundizarTipos:['afirmacion'] },
  { dia:  9, fase:'Profundizar',   tema:'Creencias que abren',         protagonista:'afirmacion',    profundizarTipos:['journaling'] },
  { dia: 10, fase:'Profundizar',   tema:'El cuerpo como receptor',     protagonista:'visualizacion', profundizarTipos:[] },
  { dia: 11, fase:'Profundizar',   tema:'Historia que te sirve',       protagonista:'scripting',     profundizarTipos:['afirmacion'] },
  { dia: 12, fase:'Profundizar',   tema:'Gratitud profunda',           protagonista:'ritual',        profundizarTipos:['journaling'] },
  { dia: 13, fase:'Profundizar',   tema:'Expansión del deseo',         protagonista:'journaling',    profundizarTipos:['visualizacion'] },
  { dia: 14, fase:'Recibir',       tema:'Abrir la mano',               protagonista:'visualizacion', profundizarTipos:['afirmacion'] },
  { dia: 15, fase:'Recibir',       tema:'Las señales que llegan',      protagonista:'afirmacion',    profundizarTipos:['journaling'] },
  { dia: 16, fase:'Recibir',       tema:'Flujo sin control',           protagonista:'journaling',    profundizarTipos:[] },
  { dia: 17, fase:'Recibir',       tema:'El detalle que ya existe',    protagonista:'scripting',     profundizarTipos:['visualizacion'] },
  { dia: 18, fase:'Recibir',       tema:'Gratitud en el proceso',      protagonista:'ritual',        profundizarTipos:[] },
  { dia: 19, fase:'Recibir',       tema:'Cierre de la recepción',      protagonista:'visualizacion', profundizarTipos:['journaling'] },
  { dia: 20, fase:'Soltar-Actuar', tema:'Soltar el "cómo"',            protagonista:'journaling',    profundizarTipos:['visualizacion'] },
  { dia: 21, fase:'Soltar-Actuar', tema:'La acción inspirada',         protagonista:'ritual',        profundizarTipos:[] },
  { dia: 22, fase:'Soltar-Actuar', tema:'Decretar sin apego',          protagonista:'afirmacion',    profundizarTipos:['visualizacion'] },
  { dia: 23, fase:'Soltar-Actuar', tema:'Escribir desde el ya-fue',    protagonista:'scripting',     profundizarTipos:[] },
  { dia: 24, fase:'Soltar-Actuar', tema:'Ceder el resultado',          protagonista:'visualizacion', profundizarTipos:['afirmacion'] },
  { dia: 25, fase:'Soltar-Actuar', tema:'Actuar como si',              protagonista:'ritual',        profundizarTipos:['journaling'] },
  { dia: 26, fase:'Integrar',      tema:'Lo que cambió en ti',         protagonista:'journaling',    profundizarTipos:['scripting'] },
  { dia: 27, fase:'Integrar',      tema:'La identidad nueva',          protagonista:'afirmacion',    profundizarTipos:['scripting'] },
  { dia: 28, fase:'Integrar',      tema:'El cuerpo que recibe',        protagonista:'visualizacion', profundizarTipos:['afirmacion'] },
  { dia: 29, fase:'Integrar',      tema:'Sellar el ciclo',             protagonista:'scripting',     profundizarTipos:['ritual'] },
  { dia: 30, fase:'Cierre',        tema:'Celebración y apertura',      protagonista:'ritual',        profundizarTipos:['scripting','journaling'] },
];

// ═══════════════════════════════════════════════════════════════════════════
// CONTENIDO GENERAL — familia de referencia; {deseo} se interpola en runtime
// ═══════════════════════════════════════════════════════════════════════════

// audioEstado: 'placeholder' → el player se muestra en modo mock; 'none' lo oculta.
// Cambiar a 'none' si la pantalla no debe mostrar player todavía.
const cm = (textContent: string): ContenidoMedia => ({ textContent, audioEstado: 'placeholder' });
const bp = (dia: number) => DAY_BLUEPRINT[dia - 1];

function bloque(tipo: PracticaTipo, text: string): BloqueAdicional {
  return { tipo, contenido: cm(text) };
}

const CONTENIDO_GENERAL: Record<number, ContenidoDia> = {
  1: {
    ...bp(1),
    base: {
      intencion: cm('Hoy comienzas. No tienes que creer todo al 100%; basta con estar dispuesta a explorar qué pasa cuando prestas atención a {deseo}.'),
      afirmacion: cm('Elijo abrir espacio para que {deseo} tome forma en mi vida.'),
      protagonistaBloque: cm('Repite esta afirmación tres veces, en voz alta si puedes. Nota qué sientes en el cuerpo al decirla — sin juzgar lo que aparezca.'),
      accionConcreta: cm('Escribe "{deseo}" en papel, con tus propias palabras. Guárdalo donde puedas verlo al menos una vez al día.'),
    },
    profundizar: [
      bloque('visualizacion', 'Cierra los ojos. Imagina cómo sería un día cualquiera en tu vida si {deseo} ya fuera parte de ella. Sin forzar detalles — deja que lleguen solos. Tres respiraciones. Luego abre los ojos.'),
    ],
  },
  2: {
    ...bp(2),
    base: {
      intencion: cm('Hoy le das forma más concreta a lo que quieres. Cuanto más nítido, más fácil orientar la atención hacia {deseo}.'),
      afirmacion: cm('Tengo claridad sobre lo que quiero. {deseo} tiene un lugar en mi vida.'),
      protagonistaBloque: cm('Imagina que {deseo} ya es parte de tu vida. ¿Dónde estás? ¿Qué ves a tu alrededor? ¿Qué sientes en el cuerpo? Observa los detalles que aparecen sin forzarlos. Quédate ahí dos minutos.'),
      accionConcreta: cm('Describe en 2-3 líneas cómo se ve tu vida cuando {deseo} ya es parte de ella. Guárdalo en tus notas.'),
    },
    profundizar: [
      bloque('afirmacion', 'Veo con claridad lo que deseo. Esa claridad es el primer paso en este proceso.'),
    ],
  },
  3: {
    ...bp(3),
    base: {
      intencion: cm('El scripting es escribir desde el futuro como si ya ocurrió. No es mentirte a ti misma — es entrenar la mente a imaginar ese escenario como real.'),
      afirmacion: cm('Soy la versión de mí que tiene {deseo}. Esa versión ya existe en mi imaginación — y la imaginación es el principio.'),
      protagonistaBloque: cm('Escribe durante 3-5 minutos desde el punto de vista de la persona que ya tiene {deseo}. Usa tiempo presente o pasado ("conseguí", "tengo", "siento"). Describe cómo es tu día, cómo te sientes, qué cambió.'),
      accionConcreta: cm('Relee lo que escribiste y subraya la frase que más te llega emocionalmente. Esa es la señal de lo que más importa.'),
    },
    profundizar: [
      bloque('afirmacion', 'La persona que tiene {deseo} ya vive dentro de mí. Elijo pensar y sentir como ella hoy.'),
    ],
  },
  4: {
    ...bp(4),
    base: {
      intencion: cm('La gratitud activa no es performativa. Es notar lo que ya tienes y reconocer que hay espacio para más — incluyendo {deseo}.'),
      afirmacion: cm('Soy agradecida por lo que ya tengo y estoy dispuesta a recibir más.'),
      protagonistaBloque: cm('Siéntate en silencio 2-3 minutos. Piensa en 3 cosas concretas y específicas de tu vida actual por las que genuinamente te sientes agradecida — no en abstracto, sino algo real para ti hoy. Luego añade: "...y doy la bienvenida a {deseo}."'),
      accionConcreta: cm('Escribe esas 3 cosas en tu cuaderno o notas. Esta semana intégralo como parte de tu comienzo del día.'),
    },
    profundizar: [],
  },
  5: {
    ...bp(5),
    base: {
      intencion: cm('Antes de que algo ocurra físicamente, ocurre como experiencia sensorial interna. Hoy exploramos esa sensación asociada a {deseo}.'),
      afirmacion: cm('Elijo conectar con la sensación de {deseo} antes de que llegue en su forma visible.'),
      protagonistaBloque: cm('Cierra los ojos. En lugar de imaginar detalles externos, centra tu atención en cómo se siente en el cuerpo tener {deseo}. ¿Más ligereza? ¿Expansión en el pecho? ¿Calma? Encuentra esa sensación y sostenla durante tres respiraciones.'),
      accionConcreta: cm('Describe la sensación que encontraste en una palabra o frase corta. Escríbela donde puedas verla hoy.'),
    },
    profundizar: [
      bloque('journaling', '¿Cuándo en tu vida pasada sentiste algo similar a lo que buscas con {deseo}? ¿Qué tenía eso de especial?'),
    ],
  },
  6: {
    ...bp(6),
    base: {
      intencion: cm('Hoy escribes una entrada de diario como si ya estuvieras del otro lado — meses después, con {deseo} presente en tu vida.'),
      afirmacion: cm('Escribir desde el futuro me ayuda a ver con claridad el camino.'),
      protagonistaBloque: cm('Escribe una entrada de diario fechada 6 meses en el futuro. Empieza con "Hoy es [fecha futura] y..." Describe cómo llegó {deseo}, cómo te sientes, qué cambió. Escribe sin censura durante 5 minutos.'),
      accionConcreta: cm('Guarda esa entrada. Es un punto de referencia para este ciclo.'),
    },
    profundizar: [],
  },
  7: {
    ...bp(7),
    base: {
      intencion: cm('Completaste la primera semana. Eso ya dice algo de ti. Hoy es para reconocerlo y preparar lo que viene.'),
      afirmacion: cm('Soy una persona que se comprometió con su proceso durante 7 días. Elijo continuar.'),
      protagonistaBloque: cm('Dedica 5 minutos a revisar tu semana: ¿Qué se sintió natural? ¿Qué se sintió difícil? ¿Hubo algún momento en que te conectaste de verdad con {deseo}? No hay respuestas correctas — solo observación.'),
      accionConcreta: cm('Escribe una frase de intención para la semana que viene. Qué quieres que sea diferente o más profundo.'),
    },
    profundizar: [
      bloque('journaling', '¿Qué aprendiste sobre {deseo} esta semana? ¿Tu comprensión de lo que quieres cambió de alguna forma?'),
    ],
  },
  8: {
    ...bp(8),
    base: {
      intencion: cm('Hoy vas más adentro. No qué quieres, sino para qué lo quieres realmente.'),
      afirmacion: cm('Merezco {deseo} por quien soy, no por lo que produzco ni demuestro.'),
      protagonistaBloque: cm('¿Por qué quieres {deseo}? Escribe sin filtros. Cuando llegues a una respuesta, pregúntate de nuevo: ¿y por qué eso importa? Baja hasta encontrar algo que se sienta honesto.'),
      accionConcreta: cm('Subraya la frase más honesta que escribiste. Esa es la razón que vale para este ciclo.'),
    },
    profundizar: [
      bloque('afirmacion', 'Debajo de {deseo} hay algo que ya reconozco como verdadero en mí. Elijo nombrarlo y sostenerlo.'),
    ],
  },
  9: {
    ...bp(9),
    base: {
      intencion: cm('Las creencias limitantes no son verdades — son historias que repetimos. Hoy practicamos cuestionarlas.'),
      afirmacion: cm('Elijo creer que {deseo} es posible para mí, aunque todavía no sepa cómo.'),
      protagonistaBloque: cm('Repite la afirmación despacio. Observa qué parte de ti resiste. Esa resistencia es la creencia que quieres suavizar — no eliminar por fuerza, sino cuestionar. ¿De dónde viene esa voz? ¿Es realmente tuya?'),
      accionConcreta: cm('Escribe una creencia que puede estar bloqueándote respecto a {deseo}. Luego escribe una alternativa posible, aunque no la creas al 100% todavía.'),
    },
    profundizar: [
      bloque('journaling', '¿Qué creencia sobre ti misma o sobre el mundo haría {deseo} imposible? ¿De dónde viene esa creencia?'),
    ],
  },
  10: {
    ...bp(10),
    base: {
      intencion: cm('La mente imagina, pero el cuerpo es quien finalmente reconoce cuando algo cambió. Hoy entrenamos esa recepción.'),
      afirmacion: cm('Mi cuerpo sabe cómo recibir. Elijo estar abierta a las sensaciones que acompañan {deseo}.'),
      protagonistaBloque: cm('Cierra los ojos. Respira profundo tres veces. Imagina que {deseo} llega ahora mismo — no gradualmente, sino de golpe. ¿Qué ocurre en tu cuerpo? ¿Dónde lo sientes primero? ¿Qué cambia en la tensión muscular, en la respiración?'),
      accionConcreta: cm('Escribe en una palabra o frase la sensación física que encontraste. Esta es tu ancla — el estado interno que asocias con {deseo}.'),
    },
    profundizar: [],
  },
  11: {
    ...bp(11),
    base: {
      intencion: cm('Las historias que nos contamos sobre nosotras mismas definen lo que creemos posible. Hoy eliges una que te apoye.'),
      afirmacion: cm('Elijo contar la historia de una persona que tiene {deseo} — y esa persona soy yo.'),
      protagonistaBloque: cm('Escribe durante 4-5 minutos: "La historia de cómo llegué a {deseo}." No tiene que ser perfecta ni creíble al 100%. Escribe la historia más generosa y posible que puedas imaginar sobre ti misma.'),
      accionConcreta: cm('Relee tu historia. ¿Qué cualidad tuya aparece en ella? Esa es real — la historia puede ser ficción, pero esa cualidad ya está en ti.'),
    },
    profundizar: [
      bloque('afirmacion', 'Tengo la capacidad y el merecimiento para {deseo}. Mi historia lo refleja.'),
    ],
  },
  12: {
    ...bp(12),
    base: {
      intencion: cm('Gratitud profunda no es una lista de cosas buenas. Es reconocer, con calma, que ya tienes más de lo que a veces notas.'),
      afirmacion: cm('Soy agradecida por lo que ya tengo y por lo que viene, incluyendo {deseo}.'),
      protagonistaBloque: cm('Elige una sola cosa en tu vida actual — algo que antes era una aspiración y ahora tienes — y dedícale 3 minutos completos de atención agradecida. No añadas más a la lista; quédate con esa una sola cosa hasta sentir algo real.'),
      accionConcreta: cm('Escribe esa cosa y por qué importa en tu diario o notas.'),
    },
    profundizar: [
      bloque('journaling', '¿Hay algo relacionado con {deseo} por lo que ya puedas sentir gratitud, aunque sea anticipada o parcial?'),
    ],
  },
  13: {
    ...bp(13),
    base: {
      intencion: cm('A veces lo que pedimos es más pequeño de lo que realmente queremos. Hoy exploramos si {deseo} tiene más dimensiones.'),
      afirmacion: cm('Me permito querer {deseo} en su forma más completa, sin limitar lo que puede ser.'),
      protagonistaBloque: cm('Escribe: "¿Qué más podría abarcar {deseo}?" Deja que el deseo se expanda. Escribe todo lo que aparezca, sin juzgar si es "demasiado" o "imposible". Permite que la escritura te sorprenda.'),
      accionConcreta: cm('Si apareció algo que no habías considerado, añádelo a tu intención de esta semana.'),
    },
    profundizar: [
      bloque('visualizacion', 'Imagina la versión más amplia de {deseo}: no solo el objetivo concreto, sino todo lo que viene con él. ¿Cómo se siente ese espacio más grande?'),
    ],
  },
  14: {
    ...bp(14),
    base: {
      intencion: cm('Recibir requiere una postura interna diferente a la de perseguir. Hoy practicamos ese estado de apertura respecto a {deseo}.'),
      afirmacion: cm('Elijo estar abierta a recibir {deseo} de la manera y en el momento que se presente.'),
      protagonistaBloque: cm('Imagina que abres las manos con las palmas hacia arriba. Ese es el gesto de recibir. Visualiza {deseo} llegando a esas manos abiertas — sin que tengas que ir a buscarlo, sin esfuerzo. Solo estar abierta. Sostenlo durante tres respiraciones.'),
      accionConcreta: cm('Haz el gesto físico: abre las manos con las palmas hacia arriba durante 30 segundos. Nota cómo se siente ese gesto en el cuerpo.'),
    },
    profundizar: [
      bloque('afirmacion', 'No necesito forzar ni perseguir. Elijo confiar en el proceso mientras me oriento hacia {deseo}.'),
    ],
  },
  15: {
    ...bp(15),
    base: {
      intencion: cm('Hoy el trabajo es notar. Prestar atención es un acto activo de este proceso.'),
      afirmacion: cm('Elijo prestar atención a las coincidencias que relaciono con mi intención de {deseo}.'),
      protagonistaBloque: cm('Di esta afirmación despacio. Luego pregúntate: ¿qué pequeñas coincidencias de esta semana podría elegir relacionar con mi proceso? No son garantías — son puntos de atención que tú decides notar.'),
      accionConcreta: cm('Esta noche escribe una cosa — un momento, una conversación, una emoción — que puedas relacionar voluntariamente con tu intención de {deseo}.'),
    },
    profundizar: [
      bloque('journaling', '¿Hay algo que hayas notado esta semana que normalmente habrías ignorado? ¿Cómo se siente elegir relacionarlo con tu proceso?'),
    ],
  },
  16: {
    ...bp(16),
    base: {
      intencion: cm('Hay una diferencia entre orientar la atención hacia {deseo} y aferrarse a que ocurra de cierta manera.'),
      afirmacion: cm('Elijo orientar mi intención hacia {deseo} sin aferrarme a cómo o cuándo llega.'),
      protagonistaBloque: cm('Escribe libremente: ¿qué significa para ti confiar en el proceso de {deseo}? ¿Qué parte de ti siente que tienes que controlar el cómo? ¿De dónde viene esa parte?'),
      accionConcreta: cm('Identifica una expectativa concreta sobre cómo debe llegar {deseo}. Escríbela. Luego, debajo, escribe: "La suelto voluntariamente."'),
    },
    profundizar: [],
  },
  17: {
    ...bp(17),
    base: {
      intencion: cm('A veces ya hay pequeñas versiones de lo que queremos. Hoy las nombramos.'),
      afirmacion: cm('Partes de {deseo} ya están presentes en mi vida de alguna forma. Las reconozco.'),
      protagonistaBloque: cm('Escribe: "Las maneras en que {deseo} ya está presente en mi vida, aunque sea en pequeño:" — lista todo lo que aparezca, por pequeño que sea. Luego escribe desde ese lugar, como si esos detalles fueran el principio de algo más grande.'),
      accionConcreta: cm('Elige uno de los detalles que encontraste y date mérito por haberlo creado o permitido, conscientemente o no.'),
    },
    profundizar: [
      bloque('visualizacion', 'Imagina esos pequeños detalles creciendo. ¿Cómo se ve {deseo} cuando esas semillas pequeñas florecen completamente?'),
    ],
  },
  18: {
    ...bp(18),
    base: {
      intencion: cm('Gratitud en el proceso — no solo por los resultados — es la práctica más difícil y más transformadora.'),
      afirmacion: cm('Soy agradecida por el proceso de {deseo}, no solo por su llegada.'),
      protagonistaBloque: cm('Siéntate 3 minutos en silencio. Piensa en una cosa de este proceso — aunque sea difícil o incierta — por la que puedas sentir algo parecido a gratitud. No tienes que forzarla; basta con encontrar aunque sea una.'),
      accionConcreta: cm('Escribe esa cosa. Es real aunque sea pequeña.'),
    },
    profundizar: [],
  },
  19: {
    ...bp(19),
    base: {
      intencion: cm('Cierras la fase de recibir. En estos días practicaste apertura, atención y confianza en el proceso.'),
      afirmacion: cm('He practicado abrirme a {deseo}. Ese trabajo interno es real.'),
      protagonistaBloque: cm('Visualiza los últimos días como un campo que preparaste. Todavía no cosechaste — solo preparaste. Imagina ese campo listo, abierto, con espacio para que {deseo} crezca. Tres respiraciones en ese espacio.'),
      accionConcreta: cm('Escribe una frase que resuma cómo entras a la siguiente fase: ¿Qué aprendiste sobre recibir?'),
    },
    profundizar: [
      bloque('journaling', '¿Qué cambió en cómo te relacionas con {deseo} desde que empezaste este ciclo? ¿Qué sigue siendo difícil?'),
    ],
  },
  20: {
    ...bp(20),
    base: {
      intencion: cm('Soltar no significa rendirse. Significa dejar de aferrarse a una sola forma de que algo ocurra.'),
      afirmacion: cm('Elijo soltar la necesidad de controlar cómo llega {deseo}.'),
      protagonistaBloque: cm('Escribe: ¿Cuál es el "cómo" que más te cuesta soltar respecto a {deseo}? ¿Qué pasaría si ese camino específico no fuera el único? ¿Qué otros caminos podrían existir?'),
      accionConcreta: cm('Escribe una sola frase de renuncia voluntaria: "Suelto la necesidad de que {deseo} llegue de [forma específica]." Solo una.'),
    },
    profundizar: [
      bloque('visualizacion', 'Imagina que sueltas un globo. Dentro está escrita la forma específica en que creías que {deseo} tenía que llegar. Lo ves alejarse. Te quedas con la intención, no con el método.'),
    ],
  },
  21: {
    ...bp(21),
    base: {
      intencion: cm('La acción inspirada es diferente de la acción ansiosa. Una sale de claridad; la otra, de miedo.'),
      afirmacion: cm('Elijo actuar desde la claridad de lo que quiero, no desde la urgencia de que ya debería haber llegado.'),
      protagonistaBloque: cm('Identifica una acción pequeña, concreta y tuya que se siente alineada con {deseo} — no la más grande, la más auténtica. Puede ser una conversación, un email, un cambio de hábito. Luego hazla antes de que termine el día.'),
      accionConcreta: cm('Anota la acción que elegiste y cuándo la harás. La especificidad importa.'),
    },
    profundizar: [],
  },
  22: {
    ...bp(22),
    base: {
      intencion: cm('Decretar no es exigir. Es declarar una intención y soltar la necesidad de controlar cómo llega.'),
      afirmacion: cm('Elijo sostener la intención de {deseo} sin aferrarme a cómo o cuándo ocurre.'),
      protagonistaBloque: cm('Repite la afirmación lentamente. Luego suelta físicamente algo — los hombros, la mandíbula, las manos. El gesto físico forma parte del decreto.'),
      accionConcreta: cm('Escribe: "Mi intención es {deseo}. Reconozco que no controlo el cómo. Elijo confiar en el proceso." Fírmalo.'),
    },
    profundizar: [
      bloque('visualizacion', 'Imagina que sueltas un globo con la palabra "cómo" escrita adentro. Lo ves alejarse. Tú te quedas con la claridad de lo que quieres, sin el peso de tener que resolverlo.'),
    ],
  },
  23: {
    ...bp(23),
    base: {
      intencion: cm('Hoy escribes desde el otro lado — cuando {deseo} ya ocurrió. Sin esfuerzo, solo reconocimiento.'),
      afirmacion: cm('Escribir desde el ya-fue me ayuda a ver el camino desde otro ángulo.'),
      protagonistaBloque: cm('{deseo} ya ocurrió. Escribe 5 minutos desde este punto de vista: "Fue así como llegó..." Escribe el final primero — cómo se siente, cómo llegó, qué pasó. Deja que la historia se cuente sola.'),
      accionConcreta: cm('Relee lo que escribiste. ¿Qué detalle o frase te sorprendió? Ese es el que vale subrayar.'),
    },
    profundizar: [],
  },
  24: {
    ...bp(24),
    base: {
      intencion: cm('Ceder el resultado es la práctica más difícil. No es resignarse — es confiar en el proceso sin exigir la forma.'),
      afirmacion: cm('Elijo soltar la imagen exacta de cómo debe verse {deseo} cuando llegue.'),
      protagonistaBloque: cm('Visualiza {deseo} como una semilla que plantaste. Hiciste el trabajo — la plantaste, la regaste, la cuidaste. Ahora visualiza soltarla: confiar en que la tierra hará su parte. No tienes que controlar cómo crece.'),
      accionConcreta: cm('Identifica una expectativa específica sobre cómo debe llegar {deseo}. Escríbela. Luego escribe debajo: "La suelto."'),
    },
    profundizar: [
      bloque('afirmacion', 'Confío en que {deseo} está tomando su forma de la manera más adecuada para mí, aunque no la vea todavía.'),
    ],
  },
  25: {
    ...bp(25),
    base: {
      intencion: cm('Actuar "como si" no es fingir — es elegir conscientemente comportarte desde la versión de ti que ya tiene {deseo}.'),
      afirmacion: cm('Elijo actuar hoy como la persona que ya tiene {deseo} en su vida.'),
      protagonistaBloque: cm('Elige una acción pequeña para hoy que haría la persona que ya tiene {deseo}. No tiene que ser grande. Puede ser cómo te hablas a ti misma, cómo respondes a algo, qué decisión tomas. Hazla.'),
      accionConcreta: cm('Escribe qué acción elegiste y cómo se sintió hacerla desde ese lugar.'),
    },
    profundizar: [
      bloque('journaling', '¿En qué parte de tu día sientes más distancia entre quien eres ahora y la persona que tiene {deseo}? ¿Qué pequeño cambio de comportamiento podría acortar esa distancia?'),
    ],
  },
  26: {
    ...bp(26),
    base: {
      intencion: cm('26 días. Independientemente de lo que ocurra afuera, algo cambió adentro. Hoy lo nombramos.'),
      afirmacion: cm('He cambiado en este proceso, aunque no siempre pueda verlo desde adentro.'),
      protagonistaBloque: cm('Escribe: "¿Qué cambió en mí desde el D1 en relación a {deseo}?" No lo que cambió en tu vida exterior — lo que cambió en cómo piensas, cómo te tratas, qué crees posible. Sé específica.'),
      accionConcreta: cm('Identifica un cambio interno concreto que reconoces en ti. Ese es el logro real de este ciclo.'),
    },
    profundizar: [
      bloque('scripting', 'Escribo desde hoy: "En estos 26 días descubrí que puedo... Y eso cambia cómo me relaciono con {deseo}."'),
    ],
  },
  27: {
    ...bp(27),
    base: {
      intencion: cm('La identidad no cambia de un día para otro — se construye con repetición y reconocimiento. Hoy reconoces la identidad que estás construyendo.'),
      afirmacion: cm('Soy la persona que practica, que persiste y que se permite querer {deseo}.'),
      protagonistaBloque: cm('Repite la afirmación. Luego añade la tuya propia: "...y también soy la persona que [completa con algo que reconozcas en ti después de estos 27 días]." Escríbela. Repítela dos veces más.'),
      accionConcreta: cm('Guarda esa afirmación personalizada. Es tuya — nadie más la tiene igual.'),
    },
    profundizar: [
      bloque('scripting', 'Escribo como la versión integrada de mí misma: "Ya no soy exactamente la misma que empezó este ciclo. Ahora sé que puedo..."'),
    ],
  },
  28: {
    ...bp(28),
    base: {
      intencion: cm('El cuerpo también integra los cambios. Hoy cerramos el ciclo en el nivel sensorial.'),
      afirmacion: cm('Mi cuerpo ya tiene la memoria de lo que se siente orientarse hacia {deseo}. Esa memoria es real.'),
      protagonistaBloque: cm('Siéntate cómoda. Cierra los ojos. Recuerda los momentos de este ciclo en que más te conectaste con {deseo} — aunque sean segundos. ¿Cómo se sentía el cuerpo en esos momentos? Evoca esa sensación ahora. Sostenla tres respiraciones.'),
      accionConcreta: cm('Escribe esa sensación en una frase. Es tu ancla sensorial para el ciclo que viene.'),
    },
    profundizar: [
      bloque('afirmacion', 'Llevo conmigo la sensación de orientarme hacia {deseo}. Mi cuerpo la reconoce.'),
    ],
  },
  29: {
    ...bp(29),
    base: {
      intencion: cm('Mañana es el D30. Hoy escribes la transición — de quien entró al ciclo a quien lo va a cerrar.'),
      afirmacion: cm('He completado casi un ciclo de práctica. Lo que construí en este tiempo es real.'),
      protagonistaBloque: cm('Escribe durante 5-7 minutos: "El D1 yo quería {deseo} y pensaba... Hoy, 29 días después, todavía lo quiero y ahora también sé que..." Escribe la transición con honestidad.'),
      accionConcreta: cm('Prepara tu ritual de mañana. ¿Qué necesitas para cerrar bien el D30? ¿Dónde estarás? ¿Qué tiempo te darás?'),
    },
    profundizar: [
      bloque('ritual', 'Esta noche, antes de dormir, pon la mano en el corazón y di: "Mañana cierro este ciclo. Lo que hice en estos 29 días fue real." Y duerme.'),
    ],
  },
  30: {
    ...bp(30),
    base: {
      intencion: cm('30 días. Lo terminaste. Hoy no hay instrucciones — hay reconocimiento.'),
      afirmacion: cm('Completé un ciclo de práctica. Soy una persona que honra sus compromisos consigo misma.'),
      protagonistaBloque: cm('Crea un pequeño ritual de cierre que tenga sentido para ti: una vela, música, un paseo, escribir en papel. Lo que signifique celebración para ti. Dedica 5-10 minutos solo para esto.'),
      accionConcreta: cm('Antes de terminar, escribe 3 cosas que cambiaron en ti durante este ciclo — aunque {deseo} no haya llegado todavía en la forma que esperabas.'),
    },
    profundizar: [
      bloque('scripting', 'Escribo una carta al yo que empezó el D1: "Querida [nombre], en este ciclo descubrí que puedo..."'),
      bloque('journaling', '¿Qué evidencias de avance — internas o externas — puedo reconocer hoy? ¿Con qué intención entro al ciclo 2?'),
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// ADAPTADORES — diferencial por familia (vocabulario + overrides puntuales)
// ═══════════════════════════════════════════════════════════════════════════

interface FamiliaAdapter {
  overrides: Partial<Record<number, Partial<{
    intencion: string;
    afirmacion: string;
    protagonistaBloque: string;
    accionConcreta: string;
    profundizar: { tipo: PracticaTipo; text: string }[];
  }>>>;
}

const ADAPTADORES: Record<Exclude<PracticaFamilia, 'general'>, FamiliaAdapter> = {
  prosperidad: {
    overrides: {
      1: {
        afirmacion: 'El dinero y la prosperidad fluyen hacia mí de formas inesperadas. Estoy lista para recibirlos.',
      },
      8: {
        protagonistaBloque: '¿Por qué quieres prosperidad y {deseo}? Escribe sin filtros. ¿Es seguridad? ¿Libertad? ¿Reconocimiento? Cuando llegues a una respuesta, pregúntate de nuevo: ¿y por qué eso importa? Baja hasta encontrar algo que se sienta honesto.',
      },
      9: {
        afirmacion: 'Elijo creer que la prosperidad y {deseo} son posibles para mí, aunque todavía no sepa cómo.',
        protagonistaBloque: '¿Qué historia te cuentas sobre el dinero y la prosperidad? Repite la afirmación despacio. ¿Qué parte de ti dice "eso no es para mí"? Escucha esa voz — y pregúntate de dónde viene realmente.',
      },
    },
  },
  proposito: {
    overrides: {
      1: {
        afirmacion: 'Elijo abrir espacio para que {deseo} tome forma en mi vida. Mi propósito y mis oportunidades ya existen.',
      },
      8: {
        protagonistaBloque: '¿Por qué quieres {deseo}? ¿Es reconocimiento? ¿Impacto? ¿Expresión creativa? ¿Libertad económica? Escribe sin filtros. Cuando llegues a una respuesta, pregúntate: ¿y por qué eso importa en este momento de mi vida?',
      },
      21: {
        accionConcreta: 'Identifica una acción pequeña y concreta que se siente alineada con {deseo}: un email enviado, una conversación iniciada, una aplicación hecha, un proyecto avanzado. Comprométete a hacerla hoy.',
      },
    },
  },
  amor: {
    overrides: {
      1: {
        afirmacion: 'Elijo abrir mi corazón para que {deseo} tome forma en mi vida. Soy digna de conexión profunda.',
      },
      8: {
        protagonistaBloque: '¿Por qué quieres {deseo}? ¿Es sentirte vista? ¿Pertenencia? ¿Reciprocidad? ¿Ternura? Escribe sin filtros. Cuando llegues a una respuesta, pregúntate: ¿en qué partes de tu vida actual ya existe algo de eso?',
      },
      14: {
        protagonistaBloque: 'Imagina que abres el corazón — no las manos, el corazón. Esa es la postura de recibir amor. Visualiza {deseo} llegando a ese espacio abierto — sin que tengas que ir a buscarlo, sin estrategia. Solo estar abierta. Sostenlo durante tres respiraciones.',
      },
    },
  },
  bienestar: {
    overrides: {
      1: {
        afirmacion: 'Elijo abrir espacio para {deseo} en mi vida. Mi cuerpo y mi mente merecen este cuidado.',
      },
      8: {
        protagonistaBloque: '¿Por qué quieres {deseo}? ¿Es paz interior? ¿Energía? ¿Soltar algo que cargas? Escribe sin filtros. Cuando llegues a una respuesta, pregúntate: ¿en qué parte de tu cuerpo o tu mente sientes que más lo necesitas hoy?',
      },
      10: {
        protagonistaBloque: 'Cierra los ojos. Respira profundo tres veces. Siente el cuerpo tal como está ahora — sin juzgarlo. Luego imagina que llega {deseo}: ¿qué ocurre en el cuerpo? ¿Más ligereza? ¿Menos tensión? ¿Calma? Observa esa diferencia y sostenla.',
      },
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// ENGINE — generarPractica()
// ═══════════════════════════════════════════════════════════════════════════

function interpolarCm(cm: ContenidoMedia, deseo: string): ContenidoMedia {
  return { ...cm, textContent: cm.textContent.replace(/\{deseo\}/g, deseo) };
}

function interpolarDia(dia: ContenidoDia, ctx: DeseoContext): ContenidoDia {
  const i = (c: ContenidoMedia) => interpolarCm(c, ctx.comoIntencion);
  return {
    ...dia,
    base: {
      intencion: i(dia.base.intencion),
      afirmacion: i(dia.base.afirmacion),
      protagonistaBloque: i(dia.base.protagonistaBloque),
      accionConcreta: i(dia.base.accionConcreta),
    },
    profundizar: dia.profundizar.map((p) => ({
      ...p,
      contenido: i(p.contenido),
    })),
  };
}

function aplicarAdapter(
  base: ContenidoDia,
  familia: Exclude<PracticaFamilia, 'general'>,
): ContenidoDia {
  const adapter = ADAPTADORES[familia];
  const override = adapter.overrides[base.dia];
  if (!override) return base;

  return {
    ...base,
    base: {
      intencion: override.intencion ? cm(override.intencion) : base.base.intencion,
      afirmacion: override.afirmacion ? cm(override.afirmacion) : base.base.afirmacion,
      protagonistaBloque: override.protagonistaBloque
        ? cm(override.protagonistaBloque)
        : base.base.protagonistaBloque,
      accionConcreta: override.accionConcreta
        ? cm(override.accionConcreta)
        : base.base.accionConcreta,
    },
    profundizar: override.profundizar
      ? override.profundizar.map((p) => bloque(p.tipo, p.text))
      : base.profundizar,
  };
}

export function generarPractica(
  dia: number,
  familia: PracticaFamilia,
  deseoRaw: string,
): ContenidoDia {
  const diaClamp = Math.min(Math.max(1, dia), 30);
  const base = CONTENIDO_GENERAL[diaClamp];
  const ctx = buildDeseoContext(deseoRaw);
  const adapted = familia === 'general' ? base : aplicarAdapter(base, familia);
  return interpolarDia(adapted, ctx);
}

export function iniciarPracticeProgress(manifestacionId: string): PracticeProgress {
  return {
    manifestacionId,
    currentDay: 1,
    cycleComplete: false,
    cycleNumber: 1,
    startedAt: new Date().toISOString().slice(0, 10),
    lastPracticeAt: null,
    completedDays: [],
  };
}

export function avanzarDia(progress: PracticeProgress): PracticeProgress {
  const hoy = new Date().toISOString().slice(0, 10);
  if (progress.lastPracticeAt === hoy) return progress; // guard doble-completado
  const eraD30 = progress.currentDay === 30;
  return {
    ...progress,
    completedDays: [...progress.completedDays, progress.currentDay],
    currentDay: eraD30 ? 30 : progress.currentDay + 1,
    cycleComplete: eraD30,
    lastPracticeAt: hoy,
  };
}

export function iniciarCiclo2(progress: PracticeProgress): PracticeProgress {
  return {
    ...progress,
    currentDay: 1,
    cycleComplete: false,
    cycleNumber: progress.cycleNumber + 1,
    startedAt: new Date().toISOString().slice(0, 10),
    lastPracticeAt: null,
    completedDays: [],
  };
}

export function yaCompletoHoy(progress: PracticeProgress): boolean {
  const hoy = new Date().toISOString().slice(0, 10);
  return progress.lastPracticeAt === hoy;
}

// ── Snapshot — inmutable al momento de completar ───────────────────────────
export const ENGINE_VERSION = '1';
export const CONTENT_VERSION = '1.0.0';

function uid8(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function crearSnapshot(params: {
  manifestacionId: string;
  dia: number;
  cycleNumber: number;
  familia: PracticaFamilia;
  deseoRaw: string;
  practica: ContenidoDia;
}): PracticeSnapshot {
  const { manifestacionId, dia, cycleNumber, familia, deseoRaw, practica } = params;
  const familiaStr = familia;
  const bloques: PracticeBloque[] = [
    { tipo: 'intencion', textContent: practica.base.intencion.textContent, esProtagonista: false, esProfundizar: false },
    { tipo: 'accion',    textContent: practica.base.accionConcreta.textContent, esProtagonista: false, esProfundizar: false },
    { tipo: practica.protagonista, textContent: practica.base.afirmacion.textContent, esProtagonista: false, esProfundizar: false },
    { tipo: practica.protagonista, textContent: practica.base.protagonistaBloque.textContent, esProtagonista: true, esProfundizar: false },
    ...practica.profundizar.map((b): PracticeBloque => ({
      tipo: b.tipo, textContent: b.contenido.textContent, esProtagonista: false, esProfundizar: true,
    })),
  ];
  return {
    id: uid8(),
    manifestacionId,
    manifestacionActivaId: manifestacionId,
    templateId: `${familiaStr}-d${dia}`,
    contentVersion: CONTENT_VERSION,
    engineVersion: ENGINE_VERSION,
    dia,
    cycleNumber,
    fase: practica.fase,
    tema: practica.tema,
    protagonista: practica.protagonista,
    deseoSnapshot: deseoRaw,
    familia,
    bloques,
    journalingEntries: [],
    reflexion: null,
    completedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
}
