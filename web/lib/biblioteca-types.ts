// Modelo de contenido de Biblioteca — un solo tipo base para todos los formatos

import type { AudioEstado } from './manifestaciones-types';

export type TipoContenido =
  | 'ritual'
  | 'afirmacion'
  | 'decreto'
  | 'visualizacion'
  | 'scripting-guiado'
  | 'senal'
  | 'journaling'
  | 'gratitud'
  | 'autoestima';

export type CategoriaContenido =
  | 'Dinero'
  | 'Amor'
  | 'Trabajo'
  | 'Bienestar'
  | 'Soltar'
  | 'Gratitud'
  | 'General'
  | 'Autoestima'
  | 'Hogar'
  | 'Nuevos Comienzos'
  | 'Confianza'
  | 'Calma';

// Las 9 áreas de vida que balancea el catálogo
export type AreaVida =
  | 'Dinero'
  | 'Trabajo'
  | 'Amor'
  | 'Autoestima'
  | 'Calma'
  | 'Hogar'
  | 'Nuevos Comienzos'
  | 'Confianza'
  | 'Soltar';

export interface ContenidoBiblioteca {
  id: string;
  tipo: TipoContenido;
  titulo: string;
  descripcionCorta: string;
  categoria: CategoriaContenido;
  categoriaEmoji: string;
  area?: AreaVida;            // área de vida principal
  duracionMin: number;
  // Texto + Audio (ContenidoMedia)
  textContent: string;        // texto principal (siempre presente)
  audioUrl?: string;
  audioDurationSec?: number;
  audioEstado: AudioEstado;
  // Metadatos
  premium: boolean;
  destacado: boolean;
  tags: string[];
  // Campos opcionales por tipo:
  pasos?: string[];            // ritual / scripting-guiado
  queNecesitas?: string;       // ritual
  cuandoHacerlo?: string;      // ritual
  afirmacionFinal?: string;    // ritual / general
  accionDespues?: string;      // ritual / afirmacion / decreto
  comoUsarla?: string;         // afirmacion / decreto
  introduccion?: string;       // visualizacion / journaling
  preguntasGuia?: string[];    // journaling
  numero?: string;             // senal (ej. "111", "333")
  interpretacion?: string;     // senal
  preguntaReflexion?: string;  // senal
  victoriaClose?: string;      // cierre de Victoria — frase final cálida de acompañamiento
}

// ── Catálogo editorial — 83 piezas en 9 áreas de vida ─────────────────────
export const CATALOGO: ContenidoBiblioteca[] = [

  // ── RITUALES (15) ─────────────────────────────────────────────────────────
  {
    id: 'rit-001',
    tipo: 'ritual',
    titulo: 'Ritual matutino de abundancia',
    descripcionCorta: 'El ritual diario que activa tu frecuencia de recepción antes de empezar el día.',
    categoria: 'Dinero',
    categoriaEmoji: '💰',
    area: 'Dinero',
    duracionMin: 10,
    textContent:
      'Este ritual trabaja el campo energético de la abundancia desde las primeras horas del día, cuando la mente todavía está receptiva y los filtros del ego están bajos. No necesitas creer en todo — solo abrirte a recibir.',
    audioDurationSec: 600,
    audioEstado: 'placeholder',
    premium: false,
    destacado: true,
    tags: ['mañana', 'abundancia', 'dinero', 'diario'],
    queNecesitas: 'Un vaso de agua, 10 minutos de silencio, un cuaderno si quieres escribir.',
    cuandoHacerlo: 'Antes de revisar el teléfono. En el momento en que te despiertas, antes de que el día empiece a exigirte cosas.',
    pasos: [
      'Siéntate en un lugar cómodo. Pon la mano sobre tu corazón y respira profundo 3 veces.',
      'Bebe un sorbo de agua con gratitud, como si fuera el primer regalo del día.',
      'Di en voz alta: "Hoy estoy abierta a recibir dinero de formas inesperadas y maravillosas."',
      'Cierra los ojos 60 segundos. Visualiza una cifra concreta que quieres recibir hoy — cualquiera, sin filtrar.',
      'Escribe en tu cuaderno: "Gracias por [esa cifra]. Ya la recibí." Escríbelo en pasado.',
      'Termina con: "Confío. Recibo. Soy próspera." Tres veces.',
    ],
    afirmacionFinal: 'El dinero llega a mí con facilidad. Soy un imán para la abundancia. Gracias.',
    accionDespues: 'Hoy, cuando recibas cualquier cosa — un café, un elogio, una oportunidad — di mentalmente "gracias" antes de responder.',
    victoriaClose: 'Bien hecho. Empezar el día desde la gratitud lo cambia todo.',
  },

  {
    id: 'rit-002',
    tipo: 'ritual',
    titulo: 'Ritual de la luna nueva',
    descripcionCorta: 'Planta intenciones poderosas en el momento de mayor apertura del ciclo lunar.',
    categoria: 'General',
    categoriaEmoji: '🌙',
    area: 'Nuevos Comienzos',
    duracionMin: 20,
    textContent:
      'La luna nueva es el lienzo en blanco del ciclo. Es el momento para plantar semillas — deseos, intenciones, decisiones. Lo que siembras en luna nueva crece durante los próximos 28 días.',
    audioDurationSec: 1200,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['luna', 'intenciones', 'ciclo', 'mensual'],
    queNecesitas: 'Una vela (opcional), papel, bolígrafo, 20 minutos sin interrupciones.',
    cuandoHacerlo: 'En los 3 días siguientes a la luna nueva. Por la noche, cuando todo esté tranquilo.',
    pasos: [
      'Enciende una vela si tienes. Siéntate en silencio hasta que tu mente se calme.',
      'Escribe en papel tres deseos concretos. No pongas limitaciones — escribe lo que realmente quieres.',
      'Lee cada deseo en voz alta, como si ya fuera real: "Tengo [deseo]. Gracias."',
      'Dobla el papel y guárdalo en un lugar especial. No lo leas hasta la luna llena.',
      'Siéntate en silencio 5 minutos más. Confía.',
    ],
    afirmacionFinal: 'Planto estas semillas con fe. El universo ya está trabajando en mi favor.',
    accionDespues: 'Toma una acción concreta hacia cada deseo en las próximas 48 horas.',
    victoriaClose: 'La luna ya recibió tus intenciones. Ahora confía y actúa.',
  },

  {
    id: 'rit-003',
    tipo: 'ritual',
    titulo: 'Ritual de soltar lo que ya no sirve',
    descripcionCorta: 'Libera creencias, personas o situaciones que ya cumplieron su ciclo en tu vida.',
    categoria: 'Soltar',
    categoriaEmoji: '🕊️',
    area: 'Soltar',
    duracionMin: 15,
    textContent:
      'Soltar no es rendirse — es elegir. Es reconocer que hay algo que ya no pertenece a quién eres ahora. Este ritual crea espacio para que lo nuevo pueda llegar.',
    audioDurationSec: 900,
    audioEstado: 'placeholder',
    premium: false,
    destacado: false,
    tags: ['soltar', 'liberar', 'cierre', 'desapego'],
    queNecesitas: 'Papel, algo para escribir, un lugar donde puedas estar sola. Opcional: música instrumental suave.',
    cuandoHacerlo: 'En luna llena o cuando sientas que algo te pesa demasiado.',
    pasos: [
      'Escribe en papel todo lo que quieres soltar — sin filtrar. Puede ser una persona, una creencia, un trabajo, un miedo.',
      'Lee lo que escribiste sin juzgarte. Solo observa.',
      'Di en voz alta: "[Nombre/situación], te agradezco lo que me enseñaste. Hoy elijo soltarte con amor."',
      'Rompe el papel en pedazos pequeños. Mientras lo haces, imagina que cada pedazo lleva algo que ya no te pertenece.',
      'Respira profundo. Siente el espacio nuevo que se está creando.',
    ],
    afirmacionFinal: 'Suelto con amor. Creo espacio para lo nuevo. Confío en el proceso.',
    accionDespues: 'Haz algo pequeño y placentero para ti — como símbolo de que eliges tu bienestar.',
    victoriaClose: 'Acabas de crear espacio. Lo nuevo ya puede entrar.',
  },

  {
    id: 'rit-004',
    tipo: 'ritual',
    titulo: 'Ritual de apertura del corazón',
    descripcionCorta: 'Para cuando el corazón está cerrado y necesitas volver a abrirte al amor.',
    categoria: 'Amor',
    categoriaEmoji: '💗',
    area: 'Amor',
    duracionMin: 12,
    textContent:
      'El corazón se cierra para protegerse — es inteligente, no es malo. Este ritual no fuerza la apertura: la invita. Trabaja con el cuerpo primero, porque el corazón siente antes de que la mente entienda.',
    audioDurationSec: 720,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['amor', 'corazón', 'apertura', 'vulnerabilidad'],
    queNecesitas: 'Un lugar donde puedas estar sola. Música suave si quieres. Las manos libres.',
    cuandoHacerlo: 'Cuando sientas el pecho cerrado, después de una decepción amorosa, o antes de una conversación importante.',
    pasos: [
      'Siéntate con la espalda recta. Pon las dos manos sobre el centro del pecho. Siente el calor de tus propias manos.',
      'Respira lento: inhala 4 tiempos, retén 2, exhala 6. Hazlo 5 veces sin prisa.',
      'Con los ojos cerrados, piensa en una persona o momento que te hizo sentir completamente amada. No busques — deja que llegue solo.',
      'Di en voz baja: "Gracias por ese amor. Ya sé cómo se siente. Estoy abierta a recibirlo de nuevo."',
      'Abre los brazos hacia los lados, como abriendo puertas. Mantén la postura 30 segundos, respirando.',
      'Cierra con: "Mi corazón está disponible. No cerrado — abierto, con sabiduría."',
    ],
    afirmacionFinal: 'Elijo abrir mi corazón sin perder mi centro. El amor que merezco llega a mí.',
    accionDespues: 'Conecta hoy con una persona que te importe — aunque sea un mensaje corto y genuino.',
    victoriaClose: 'Eso que sientes ahora en el pecho es tu corazón recordando que sabe amar.',
  },

  {
    id: 'rit-005',
    tipo: 'ritual',
    titulo: 'Ritual de inicio de semana',
    descripcionCorta: 'Arranca cada lunes con claridad de intención en lugar de urgencia y reacción.',
    categoria: 'Trabajo',
    categoriaEmoji: '🚀',
    area: 'Trabajo',
    duracionMin: 8,
    textContent:
      'La mayoría de las semanas empiezan en modo reacción: el correo, las notificaciones, lo urgente. Este ritual pone tu intención primero — y eso cambia el tono de todo lo que viene después.',
    audioDurationSec: 480,
    audioEstado: 'placeholder',
    premium: false,
    destacado: false,
    tags: ['trabajo', 'semana', 'lunes', 'intención', 'productividad'],
    queNecesitas: '8 minutos antes de abrir el correo o el teléfono. Un cuaderno opcional.',
    cuandoHacerlo: 'El lunes por la mañana, antes de entrar en modo trabajo.',
    pasos: [
      'Siéntate en silencio 2 minutos. Solo respira. No planifiques todavía.',
      'Pregúntate: "¿Cuál es la cosa más importante que quiero lograr esta semana?" Una sola, la que más importa.',
      'Escríbela o dila en voz alta. No una lista — una cosa.',
      'Pregunta: "¿Qué persona quiero ser en el trabajo esta semana?" Una cualidad: paciente, creativa, audaz.',
      'Cierra con: "Esta semana trabajo con intención, no con urgencia. Lo importante primero."',
    ],
    afirmacionFinal: 'Soy productiva y enfocada. Mi trabajo tiene impacto y significado.',
    accionDespues: 'Bloquea en tu agenda 90 minutos para la tarea más importante antes de cualquier reunión.',
    victoriaClose: 'Una semana con intención clara vale más que tres semanas en modo apagafuegos.',
  },

  {
    id: 'rit-006',
    tipo: 'ritual',
    titulo: 'Ritual del espejo',
    descripcionCorta: 'El ritual de amor propio más incómodo y más efectivo que existe.',
    categoria: 'Autoestima',
    categoriaEmoji: '🌸',
    area: 'Autoestima',
    duracionMin: 5,
    textContent:
      'Louise Hay lo popularizó por algo: mirar a los propios ojos y decir "te amo" es incómodo precisamente porque toca el núcleo de cómo nos relacionamos con nosotras mismas. La incomodidad es la señal de que está funcionando.',
    audioDurationSec: 300,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['autoestima', 'espejo', 'amor-propio', 'Louise Hay'],
    queNecesitas: 'Un espejo donde puedas ver tus ojos. 5 minutos de privacidad.',
    cuandoHacerlo: 'Por la mañana antes de salir, o cada vez que la autocrítica sea muy fuerte.',
    pasos: [
      'Párate frente al espejo. Mira tus ojos directamente — no tu piel, no tu cabello. Tus ojos.',
      'Respira. Nota la incomodidad si aparece. No la pelees — solo obsérvala.',
      'Di en voz alta, mirándote: "Te amo. Eres suficiente. Estoy orgullosa de ti."',
      'Si sientes resistencia o ganas de reírte, sigue. Esa resistencia es exactamente lo que estás trabajando.',
      'Agrega algo específico: "Hoy me gusta [algo real que puedas reconocerte]." No tiene que ser físico.',
      'Termina con: "Cuento contigo. Eres mi persona favorita."',
    ],
    afirmacionFinal: 'Me amo. Me cuido. Me elijo todos los días.',
    accionDespues: 'Haz una cosa hoy que sea solo para ti — no para nadie más.',
    victoriaClose: 'Lo más valiente que puedes hacer es mirarte y quedarte.',
  },

  {
    id: 'rit-007',
    tipo: 'ritual',
    titulo: 'Limpieza energética del hogar',
    descripcionCorta: 'Renueva la energía de tu espacio y crea un hogar que te recargue en lugar de agotarte.',
    categoria: 'Hogar',
    categoriaEmoji: '🏡',
    area: 'Hogar',
    duracionMin: 20,
    textContent:
      'Tu espacio físico refleja y afecta tu estado interno. Un hogar con energía estancada — de discusiones, de preocupaciones, de momentos difíciles — puede mantenerte en esa frecuencia sin que te des cuenta.',
    audioDurationSec: 0,
    audioEstado: 'none',
    premium: false,
    destacado: false,
    tags: ['hogar', 'limpieza', 'energía', 'espacio', 'feng-shui'],
    queNecesitas: 'Incienso o salvia seca (opcional), ventanas que puedas abrir, música que te guste.',
    cuandoHacerlo: 'Al mudarte a un lugar nuevo, después de momentos difíciles en casa, o una vez al mes como mantenimiento.',
    pasos: [
      'Abre todas las ventanas que puedas. El aire fresco es la limpieza más simple y poderosa.',
      'Pon música que te haga sentir bien — con energía, alegre, expansiva.',
      'Camina por cada cuarto con la intención de agradecer ese espacio: "Gracias, cocina, por alimentarme. Gracias, cama, por descanso."',
      'Si tienes incienso o salvia, pásalo por los rincones, los marcos de puertas y ventanas. Si no, con las manos haciendo movimientos de barrido imaginario es suficiente.',
      'En el cuarto principal, di: "Este hogar me recarga. Aquí se vive bien. Aquí llega lo bueno."',
      'Termina prendiendo una vela o poniendo flores frescas — un gesto simbólico de bienvenida a la energía nueva.',
    ],
    afirmacionFinal: 'Mi hogar es mi refugio. Aquí me siento segura, amada y en paz.',
    accionDespues: 'Deshazte hoy de una cosa que ya no uses y que ocupe espacio físico y mental.',
    victoriaClose: 'Un hogar limpio energéticamente es un hogar que trabaja contigo, no contra ti.',
  },

  {
    id: 'rit-008',
    tipo: 'ritual',
    titulo: 'Ritual del umbral',
    descripcionCorta: 'Para cruzar con intención hacia una nueva etapa, trabajo, relación o versión de ti.',
    categoria: 'Nuevos Comienzos',
    categoriaEmoji: '🌱',
    area: 'Nuevos Comienzos',
    duracionMin: 10,
    textContent:
      'Un umbral es cualquier punto de transición: un nuevo empleo, una mudanza, una decisión que te cambia. Este ritual ayuda a cruzarlo conscientemente en lugar de caer en él por inercia.',
    audioDurationSec: 600,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['nuevos comienzos', 'transición', 'cambio', 'intención'],
    queNecesitas: 'Un cuaderno, un bolígrafo, 10 minutos de silencio.',
    cuandoHacerlo: 'En el momento exacto de transición: la noche anterior al primer día de trabajo, el día de la mudanza, cuando tomas una decisión importante.',
    pasos: [
      'Escribe: "Dejo atrás:" — lista lo que conscientemente eliges dejar en la etapa anterior. Creencias, hábitos, roles, miedos.',
      'Escribe: "Llevo conmigo:" — lo que has aprendido, lo que eres, lo que construiste.',
      'Escribe: "Voy hacia:" — no metas concretas, sino la persona en quien quieres convertirte.',
      'Lee los tres en voz alta.',
      'Di: "Cruzo este umbral con conciencia. Lo que viene es bueno."',
      'Haz algo físico que marque el cruce: cambia de cuarto, sal a la calle y vuelve a entrar, date un baño.',
    ],
    afirmacionFinal: 'Cada nuevo comienzo es una oportunidad de ser la persona que elijo ser.',
    accionDespues: 'Cuenta a alguien de confianza en qué umbral estás. Nombrarlo lo hace real.',
    victoriaClose: 'Ya cruzaste. Lo que viene es diferente — y eso es exactamente lo que pediste.',
  },

  {
    id: 'rit-009',
    tipo: 'ritual',
    titulo: 'Ritual de la columna vertebral',
    descripcionCorta: 'Para recuperar tu centro y tu confianza cuando sientes que todo te tambalea.',
    categoria: 'Confianza',
    categoriaEmoji: '🦋',
    area: 'Confianza',
    duracionMin: 7,
    textContent:
      'La confianza en ti misma no es una creencia — es una sensación física. Cuando te encoges, cuando bajas la voz, cuando te disculpas por existir, el cuerpo está diciéndote algo. Este ritual trabaja desde el cuerpo hacia arriba.',
    audioDurationSec: 420,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['confianza', 'seguridad', 'cuerpo', 'poder personal'],
    queNecesitas: 'Solo tu cuerpo y un espacio donde puedas ponerte de pie.',
    cuandoHacerlo: 'Antes de una situación que te genera inseguridad, o cuando sientas que te estás achicando.',
    pasos: [
      'Párate de pie. Los pies a la altura de los hombros. Bien plantada en el suelo.',
      'Estira la columna: imagina que un hilo te jala suavemente desde la coronilla hacia el techo.',
      'Los hombros hacia atrás y abajo — no tensos, solo abiertos. El pecho disponible.',
      'Respira profundo desde el vientre, 3 veces. Lento.',
      'Di en voz alta: "Estoy aquí. Tengo lo que necesito. Confío en mí."',
      'Mantén esa postura 2 minutos más. No hagas nada — solo está en esa posición. El cuerpo te cambia la química.',
    ],
    afirmacionFinal: 'Confío en mí misma. Tengo todo lo que necesito para enfrentar esto.',
    accionDespues: 'Entra a la situación difícil con la columna en esa posición. El cuerpo lidera.',
    victoriaClose: 'Eres más capaz de lo que crees. Tu cuerpo ya lo sabe.',
  },

  {
    id: 'rit-010',
    tipo: 'ritual',
    titulo: 'Ritual de cierre del día',
    descripcionCorta: 'Cierra el día con gratitud y suelta lo que no te sirve llevar a mañana.',
    categoria: 'Calma',
    categoriaEmoji: '🌙',
    area: 'Calma',
    duracionMin: 8,
    textContent:
      'La mayoría de las personas llevan el día a la cama — las preocupaciones, los correos pendientes, los "debería haber dicho". Este ritual crea un corte limpio: el día termina aquí. Mañana es otro día.',
    audioDurationSec: 480,
    audioEstado: 'placeholder',
    premium: false,
    destacado: true,
    tags: ['noche', 'cierre', 'descanso', 'gratitud', 'diario'],
    queNecesitas: 'Un cuaderno o el modo de voz. Lugar cómodo. 8 minutos antes de dormir.',
    cuandoHacerlo: 'Cada noche antes de acostarte. Reemplaza el scroll nocturno.',
    pasos: [
      'Escribe o piensa: 3 cosas que pasaron hoy, cualquier tamaño, por las que puedes agradecer.',
      'Escribe: 1 cosa que hiciste bien hoy. Aunque sea pequeña. No la minimices.',
      'Escribe: 1 cosa que quieres hacer diferente mañana. Solo una — no una lista de culpas.',
      'Di en voz alta: "El día terminó. Lo di todo. Lo que no resolví hoy, no necesita resolverse esta noche."',
      'Pon el teléfono boca abajo o fuera del cuarto.',
      'Respira 5 veces profundo. En cada exhalación, suelta algo.',
    ],
    afirmacionFinal: 'Descanso con paz. Mañana es una oportunidad nueva.',
    accionDespues: 'Duerme. Eso es todo. Mañana es mañana.',
    victoriaClose: 'Bien hecho hoy. Ahora descansa — también eso es manifestar.',
  },

  {
    id: 'rit-011',
    tipo: 'ritual',
    titulo: 'Ritual del cheque de abundancia',
    descripcionCorta: 'Una práctica poderosa de scripting físico para anclar en el cuerpo la recepción de dinero.',
    categoria: 'Dinero',
    categoriaEmoji: '💰',
    area: 'Dinero',
    duracionMin: 10,
    textContent:
      'Escribir un cheque a tu nombre — de una cantidad que te emociona y no te aterra — le habla al inconsciente en un lenguaje que entiende: imágenes físicas y emociones reales. Es una técnica popularizada por Jim Carrey y practicada por miles.',
    audioDurationSec: 0,
    audioEstado: 'none',
    premium: true,
    destacado: false,
    tags: ['dinero', 'cheque', 'scripting físico', 'abundancia', 'Jim Carrey'],
    queNecesitas: 'Papel, bolígrafo. Puedes descargar un cheque en blanco para imprimir o dibujarlo a mano.',
    cuandoHacerlo: 'Luna nueva de cada mes. O cuando necesites un impulso energético en tu relación con el dinero.',
    pasos: [
      'Escribe un cheque a tu nombre con una cantidad que te emocione — que se sienta posible aunque ahora parezca grande.',
      'En el campo "por concepto de" escribe: "Servicios prestados con alegría y amor."',
      'Firma el cheque con "El Universo" o "La Abundancia".',
      'Siéntate con el cheque en las manos. Siente la textura del papel. Léelo lento.',
      'Cierra los ojos e imagina qué harás con ese dinero. Lo primero que te venga — no lo censures.',
      'Guarda el cheque en un lugar que veas a diario: el espejo del baño, tu cartera, tu agenda.',
    ],
    afirmacionFinal: 'Recibo dinero con facilidad y gratitud. Mi abundancia crece cada día.',
    accionDespues: 'Cada vez que veas el cheque esta semana, di: "Gracias. Ya viene."',
    victoriaClose: 'El dinero también responde a las instrucciones que le das con emoción.',
  },

  {
    id: 'rit-012',
    tipo: 'ritual',
    titulo: 'Ritual de luna llena para el amor',
    descripcionCorta: 'Libera bloqueos del corazón y amplifica tu frecuencia de amor en el punto más alto del ciclo lunar.',
    categoria: 'Amor',
    categoriaEmoji: '💗',
    area: 'Amor',
    duracionMin: 15,
    textContent:
      'La luna llena amplifica lo que ya está activo en ti. Si hay apertura, la expande. Si hay bloqueos, los saca a la superficie para que los puedas ver. Este ritual trabaja con las dos cosas.',
    audioDurationSec: 900,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['amor', 'luna llena', 'bloqueos', 'corazón', 'ciclo lunar'],
    queNecesitas: 'Una vela rosa o blanca, papel y bolígrafo, acceso a la luz de la luna (real o imaginada).',
    cuandoHacerlo: 'La noche de la luna llena o la noche anterior.',
    pasos: [
      'Enciende la vela. Siéntate con el papel frente a ti.',
      'Escribe todo lo que has estado cargando sobre el amor: miedos, decepciones, creencias que te limitan. Sin filtro.',
      'Lee lo que escribiste en voz alta — como confesión, no como condena.',
      'Di: "Gracias por protegerme. Ya no necesitas hacerlo de esta forma."',
      'Dobla el papel. Si puedes quemarlo de forma segura, hazlo. Si no, córtalo en pedazos pequeños.',
      'Di: "Elijo el amor. Elijo recibirlo y darlo. Estoy disponible para una conexión real."',
      'Siéntate con la vela encendida 5 minutos más, en silencio.',
    ],
    afirmacionFinal: 'Suelto las heridas del pasado. Mi corazón está libre para amar y ser amada.',
    accionDespues: 'Esta semana, di "sí" a una invitación o conexión que normalmente evitarías por miedo.',
    victoriaClose: 'La luna te vio soltar algo esta noche. Lo que viene es diferente.',
  },

  {
    id: 'rit-013',
    tipo: 'ritual',
    titulo: 'Antes de una presentación importante',
    descripcionCorta: 'Transforma los nervios en energía útil antes de hablar, presentar o defender tu trabajo.',
    categoria: 'Trabajo',
    categoriaEmoji: '🚀',
    area: 'Confianza',
    duracionMin: 5,
    textContent:
      'Los nervios antes de algo importante no son una señal de que algo está mal — son energía que todavía no tiene dirección. Este ritual de 5 minutos le da dirección a esa energía.',
    audioDurationSec: 300,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['trabajo', 'presentación', 'nervios', 'confianza', 'hablar en público'],
    queNecesitas: '5 minutos a solas. Un baño, un cuarto, el pasillo — donde sea.',
    cuandoHacerlo: 'Justo antes de entrar a la sala, a la videollamada, o subir al escenario.',
    pasos: [
      'Para. Respira profundo 3 veces, exhalando más lento de lo que inhalas.',
      'Pon las manos en postura de poder (manos en caderas, postura abierta) 60 segundos.',
      'Di en voz baja: "Sé lo que sé. Tengo lo que tengo. Es suficiente."',
      'Recuerda una vez que lo hiciste bien — cualquier vez. Siente esa sensación un momento.',
      'Di: "Voy a hacer mi mejor trabajo. Y eso es exactamente lo que necesitan."',
      'Entra.',
    ],
    afirmacionFinal: 'Mis palabras tienen peso. Mi presencia importa. Estoy lista.',
    accionDespues: 'Después, anota qué salió bien — no qué mejorar. Eso primero.',
    victoriaClose: 'Tus nervios son señal de que esto te importa. Úsalos.',
  },

  {
    id: 'rit-014',
    tipo: 'ritual',
    titulo: 'Ritual de perdón propio',
    descripcionCorta: 'Para soltar la culpa, el arrepentimiento y las versiones de ti que todavía te persiguen.',
    categoria: 'Soltar',
    categoriaEmoji: '🕊️',
    area: 'Soltar',
    duracionMin: 15,
    textContent:
      'El perdón propio es el más difícil porque somos más duras con nosotras mismas que con cualquier otra persona. Este ritual no justifica — reconoce, honra y suelta.',
    audioDurationSec: 900,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['perdón', 'culpa', 'soltar', 'autocompasión', 'heridas'],
    queNecesitas: 'Cuaderno, bolígrafo, privacidad. Tiempo sin interrupciones.',
    cuandoHacerlo: 'Cuando cargues culpa que ya no te sirve. Cuando te critiques por algo del pasado.',
    pasos: [
      'Escribe la situación o decisión por la que no te has perdonado. Con todos los detalles que necesites.',
      'Escribe: "En ese momento, hice lo mejor que pude con lo que sabía y lo que tenía."',
      'Escribe: "Lo que aprendí de eso fue:" — honestamente, sin dramatismo.',
      'Escribe una carta corta de tu yo actual a tu yo de ese momento. Con compasión real, no con condescendencia.',
      'Lee la carta en voz alta.',
      'Di: "Me perdono. No porque lo que pasó no importó, sino porque cargar esa culpa ya no me sirve."',
    ],
    afirmacionFinal: 'Me libero de la culpa. Aprendo, crezco y sigo adelante con amor.',
    accionDespues: 'Haz algo bueno por ti hoy — no para compensar, sino porque ya te lo mereces.',
    victoriaClose: 'Perdonarte no borra lo que pasó. Borra el poder que tiene sobre ti hoy.',
  },

  {
    id: 'rit-015',
    tipo: 'ritual',
    titulo: 'Ritual de gratitud semanal',
    descripcionCorta: 'Una práctica de cierre semanal para consolidar lo bueno y preparar la siguiente semana desde la plenitud.',
    categoria: 'Gratitud',
    categoriaEmoji: '🙏',
    area: 'Calma',
    duracionMin: 15,
    textContent:
      'La gratitud no es solo optimismo — es una práctica neurológica. Cuando documentas lo bueno de la semana, entrenas el cerebro a buscarlo activamente. Y lo que buscas, lo encuentras.',
    audioDurationSec: 0,
    audioEstado: 'none',
    premium: true,
    destacado: false,
    tags: ['gratitud', 'semana', 'cierre', 'reflexión', 'diario'],
    queNecesitas: 'Cuaderno o aplicación de notas. 15 minutos el domingo.',
    cuandoHacerlo: 'Domingo por la tarde o noche, antes de preparar la semana siguiente.',
    pasos: [
      'Escribe: "Las 5 cosas más importantes que pasaron esta semana" — buenas, difíciles, o simplemente significativas.',
      'Escribe: "La persona que quiero agradecer esta semana y por qué." Mándales un mensaje si puedes.',
      'Escribe: "El momento en que más me sentí yo misma esta semana."',
      'Escribe: "Algo que aprendí sobre mí misma."',
      'Escribe: "La intención de la semana que viene." Una palabra o frase.',
    ],
    afirmacionFinal: 'Mi vida está llena de momentos por agradecer. Los veo. Los recibo.',
    accionDespues: 'Manda ese agradecimiento a la persona que elegiste. No lo dejes para después.',
    victoriaClose: 'Una semana bien cerrada es la mejor preparación para una semana bien abierta.',
  },

  // ── AFIRMACIONES (15) ────────────────────────────────────────────────────
  {
    id: 'afi-001',
    tipo: 'afirmacion',
    titulo: 'Soy próspera y abundante',
    descripcionCorta: 'La afirmación de dinero más poderosa cuando la repites con emoción real.',
    categoria: 'Dinero',
    categoriaEmoji: '💰',
    area: 'Dinero',
    duracionMin: 2,
    textContent:
      'Soy próspera y abundante. El dinero llega a mí con facilidad, constancia y gratitud. Recibo sin culpa, gasto con intención y ahorro con amor. La abundancia es mi estado natural.',
    audioDurationSec: 90,
    audioEstado: 'placeholder',
    premium: false,
    destacado: true,
    tags: ['dinero', 'prosperidad', 'abundancia', 'diario'],
    comoUsarla:
      'Repítela 3 veces en voz alta cada mañana, poniendo la mano sobre el corazón. No la repitas como un mantra mecánico — siente cada palabra. Usa el modo Escuchar para dejar que Victoria te guíe.',
    accionDespues: 'Escribe en tu cuaderno un ejemplo de abundancia que ya existe en tu vida ahora mismo.',
    victoriaClose: 'La prosperidad empieza por creer que ya es tuya.',
  },

  {
    id: 'afi-002',
    tipo: 'afirmacion',
    titulo: 'El amor que merezco ya existe',
    descripcionCorta: 'Para abrir el corazón cuando el miedo o las heridas cierran la posibilidad del amor.',
    categoria: 'Amor',
    categoriaEmoji: '💗',
    area: 'Amor',
    duracionMin: 2,
    textContent:
      'Soy digna de un amor profundo, recíproco y libre. El amor que deseo ya existe y está encontrando el camino hacia mí. Abro mi corazón para dar y recibir sin miedo, sin condiciones, sin pretender ser alguien que no soy.',
    audioDurationSec: 90,
    audioEstado: 'placeholder',
    premium: false,
    destacado: false,
    tags: ['amor', 'relaciones', 'autoestima', 'apertura'],
    comoUsarla:
      'Úsala especialmente cuando sientas miedo a conectar, cuando dudes de merecer amor, o antes de salir a una cita. Mírate a los ojos en el espejo mientras la dices.',
    accionDespues: 'Haz un acto de amor propio hoy — algo que hagas solo porque te hace bien.',
    victoriaClose: 'El amor que das a ti misma es el estándar que acepta el que viene de fuera.',
  },

  {
    id: 'afi-003',
    tipo: 'afirmacion',
    titulo: 'Confío en el timing del universo',
    descripcionCorta: 'Para los momentos en que la impaciencia o la duda intentan convencerte de que nada está pasando.',
    categoria: 'Bienestar',
    categoriaEmoji: '🌿',
    area: 'Calma',
    duracionMin: 2,
    textContent:
      'Todo llega en el momento exacto. No antes, no después — exacto. Confío en el proceso aunque no pueda ver los resultados todavía. Lo que es mío ya viene hacia mí y nada puede detenerlo.',
    audioDurationSec: 90,
    audioEstado: 'placeholder',
    premium: false,
    destacado: false,
    tags: ['confianza', 'proceso', 'paciencia', 'fe'],
    comoUsarla:
      'Repítela cuando sientas ansiedad por los resultados o cuando compares tu camino con el de otras personas.',
    accionDespues: 'Escribe tres cosas que YA tienes en tu vida que en algún momento también pediste.',
    victoriaClose: 'Lo que es tuyo no se puede perder. Lo que no llegó aún, está en camino.',
  },

  {
    id: 'afi-004',
    tipo: 'afirmacion',
    titulo: 'Soy talentosa y mi trabajo tiene valor',
    descripcionCorta: 'Para los días en que el síndrome del impostor intenta convencerte de que no eres suficientemente buena.',
    categoria: 'Trabajo',
    categoriaEmoji: '🚀',
    area: 'Trabajo',
    duracionMin: 2,
    textContent:
      'Tengo talentos únicos que el mundo necesita. Mi trabajo tiene valor real y merece ser reconocido y bien pagado. No tengo que ganarme el derecho a estar aquí — ya estoy aquí y eso es suficiente.',
    audioDurationSec: 90,
    audioEstado: 'placeholder',
    premium: false,
    destacado: false,
    tags: ['trabajo', 'talento', 'valor', 'síndrome del impostor'],
    comoUsarla:
      'Úsala antes de enviar una propuesta, pedir un aumento, o publicar tu trabajo. Hazlo de pie, con voz firme.',
    accionDespues: 'Identifica un talento tuyo que no estás usando al máximo y pregúntate cómo puedes usarlo más esta semana.',
    victoriaClose: 'Tus talentos no son casualidad. Están ahí por algo.',
  },

  {
    id: 'afi-005',
    tipo: 'afirmacion',
    titulo: 'Soy suficiente exactamente como soy',
    descripcionCorta: 'La afirmación más difícil de creer y la más transformadora cuando lo haces.',
    categoria: 'Autoestima',
    categoriaEmoji: '🌸',
    area: 'Autoestima',
    duracionMin: 2,
    textContent:
      'Soy suficiente ahora mismo. No cuando adelgace, no cuando logre más, no cuando tenga más dinero o mejor relación. Ahora. Mi valor no es algo que construyo — es algo que reconozco. Ya soy suficiente.',
    audioDurationSec: 90,
    audioEstado: 'placeholder',
    premium: false,
    destacado: true,
    tags: ['autoestima', 'suficiencia', 'valor propio', 'ahora'],
    comoUsarla:
      'Di esta afirmación lento, mirándote al espejo si puedes. Nota la resistencia — ese es exactamente el punto donde necesitas seguir.',
    accionDespues: 'Escribe: ¿En qué área de tu vida sientes que no eres suficiente? Y pregúntate: ¿de dónde viene esa creencia?',
    victoriaClose: 'No tienes que ganarte tu propio amor. Ya lo mereces.',
  },

  {
    id: 'afi-006',
    tipo: 'afirmacion',
    titulo: 'Vivo en un hogar que me nutre',
    descripcionCorta: 'Para crear la relación correcta con tu espacio — ya sea el que tienes o el que estás construyendo.',
    categoria: 'Hogar',
    categoriaEmoji: '🏡',
    area: 'Hogar',
    duracionMin: 2,
    textContent:
      'Mi hogar es mi refugio. Aquí me siento segura, en paz y yo misma. El espacio donde vivo me apoya, me recarga y me abraza. Vivo rodeada de belleza, orden y amor — aunque sea en pequeño.',
    audioDurationSec: 90,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['hogar', 'espacio', 'refugio', 'paz'],
    comoUsarla:
      'Dila mientras caminas por tu hogar, tocando las paredes o los muebles. Activa los sentidos físicos — ver, tocar, oler.',
    accionDespues: 'Haz un pequeño gesto de belleza en tu hogar hoy: una vela, flores, ordenar un rincón.',
    victoriaClose: 'El hogar que mereces empieza por sentirte bien en el que tienes ahora.',
  },

  {
    id: 'afi-007',
    tipo: 'afirmacion',
    titulo: 'Los nuevos comienzos me emocionan',
    descripcionCorta: 'Para transformar el miedo al cambio en curiosidad y apertura.',
    categoria: 'Nuevos Comienzos',
    categoriaEmoji: '🌱',
    area: 'Nuevos Comienzos',
    duracionMin: 2,
    textContent:
      'Cada nuevo comienzo es una oportunidad de ser quien quiero ser. El cambio no es una amenaza — es una invitación. Estoy lista para lo nuevo. Confío en mi capacidad de adaptarme, crecer y florecer en cualquier terreno.',
    audioDurationSec: 90,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['nuevos comienzos', 'cambio', 'adaptación', 'crecimiento'],
    comoUsarla:
      'Úsala cuando sientas resistencia o miedo ante un cambio. Repítela 5 veces con los ojos abiertos, mirando hacia adelante.',
    accionDespues: 'Identifica una pequeña cosa nueva que puedas hacer hoy — aunque sea tomar una ruta diferente.',
    victoriaClose: 'El miedo y la emoción se sienten igual en el cuerpo. Tú eliges cómo llamarlo.',
  },

  {
    id: 'afi-008',
    tipo: 'afirmacion',
    titulo: 'Confío plenamente en mí misma',
    descripcionCorta: 'Para recuperar la confianza en tu criterio cuando las dudas te paralizan.',
    categoria: 'Confianza',
    categoriaEmoji: '🦋',
    area: 'Confianza',
    duracionMin: 2,
    textContent:
      'Confío en mi criterio. Confío en mi intuición. Confío en mi capacidad de manejar lo que venga. No necesito certeza absoluta para actuar — me muevo con la confianza que tengo y eso es suficiente.',
    audioDurationSec: 90,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['confianza', 'intuición', 'criterio', 'decisiones'],
    comoUsarla:
      'Úsala cuando estés frente a una decisión difícil o cuando dudes de tu propio juicio. De pie, voz firme.',
    accionDespues: 'Toma hoy una decisión pequeña sin consultarla con nadie. Confía en ti.',
    victoriaClose: 'Tu intuición no te ha traído hasta aquí para abandonarte ahora.',
  },

  {
    id: 'afi-009',
    tipo: 'afirmacion',
    titulo: 'Suelto con amor lo que ya no me sirve',
    descripcionCorta: 'Para practicar el desapego y crear espacio para lo que realmente quieres.',
    categoria: 'Soltar',
    categoriaEmoji: '🕊️',
    area: 'Soltar',
    duracionMin: 2,
    textContent:
      'Suelto con amor y gratitud lo que ya cumplió su ciclo en mi vida. No me aferro por miedo al vacío — confío en que el espacio que creo al soltar es el espacio que necesita lo nuevo para llegar.',
    audioDurationSec: 90,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['soltar', 'desapego', 'liberación', 'espacio'],
    comoUsarla:
      'Úsala mientras piensas en algo específico que quieres soltar. Visualiza que lo sueltas con cada exhalación.',
    accionDespues: 'Identifica una cosa — persona, creencia, hábito, objeto — que puedas soltar hoy. Da el primer paso.',
    victoriaClose: 'Soltar no es perder. Es crear espacio para lo que realmente mereces.',
  },

  {
    id: 'afi-010',
    tipo: 'afirmacion',
    titulo: 'La paz es mi estado natural',
    descripcionCorta: 'Para volver a la calma cuando la ansiedad o el estrés se vuelven el modo por defecto.',
    categoria: 'Calma',
    categoriaEmoji: '🌿',
    area: 'Calma',
    duracionMin: 2,
    textContent:
      'La paz no es ausencia de problemas — es saber que puedo manejarlos. Mi estado natural es la calma, no la urgencia. Cada vez que regreso a mi respiración, regreso a mí misma. Soy paz.',
    audioDurationSec: 90,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['calma', 'paz', 'ansiedad', 'respiración', 'presente'],
    comoUsarla:
      'Úsala en el momento en que sientas que la ansiedad sube. Para. Respira. Dila tres veces antes de continuar.',
    accionDespues: 'Agrega 3 respiraciones conscientes como práctica entre actividades hoy.',
    victoriaClose: 'La calma no es debilidad. Es la base desde donde actúas con claridad.',
  },

  {
    id: 'afi-011',
    tipo: 'afirmacion',
    titulo: 'Mis ingresos crecen constantemente',
    descripcionCorta: 'Para activar la mentalidad de expansión económica cuando la escasez se siente más real que la abundancia.',
    categoria: 'Dinero',
    categoriaEmoji: '💰',
    area: 'Dinero',
    duracionMin: 2,
    textContent:
      'Mis ingresos crecen constantemente de formas que a veces esperaba y otras no. Soy buena con el dinero — lo recibo, lo cuido y lo hago crecer. La prosperidad es un proceso continuo y yo voy en la dirección correcta.',
    audioDurationSec: 90,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['dinero', 'ingresos', 'crecimiento', 'prosperidad'],
    comoUsarla:
      'Úsala mientras revisas tus finanzas o cuando sientas que el dinero no alcanza. Cámbiala al presente.',
    accionDespues: 'Anota una acción concreta esta semana que pueda abrir una fuente nueva de ingreso, aunque sea pequeña.',
    victoriaClose: 'El dinero responde a quien lo trata como si ya viniera.',
  },

  {
    id: 'afi-012',
    tipo: 'afirmacion',
    titulo: 'Tengo una relación profunda y apasionada',
    descripcionCorta: 'Para quien ya está en una relación y quiere profundizarla, o para quien está lista para recibirla.',
    categoria: 'Amor',
    categoriaEmoji: '💗',
    area: 'Amor',
    duracionMin: 2,
    textContent:
      'Tengo o estoy atrayendo una relación donde soy completamente vista, elegida y amada. Una relación que me da alas en lugar de cortarlas. Profunda, honesta, apasionada y libre.',
    audioDurationSec: 90,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['amor', 'relación', 'pareja', 'profundidad'],
    comoUsarla:
      'Si estás en pareja: dila pensando en tu relación, notando lo que ya tienes. Si estás soltera: dila como una invitación, no como un deseo distante.',
    accionDespues: 'Haz hoy algo que la versión de ti que tiene esa relación haría — conecta, abre, da.',
    victoriaClose: 'El amor que describes existe. Y ya está buscándote.',
  },

  {
    id: 'afi-013',
    tipo: 'afirmacion',
    titulo: 'Mis ideas son valiosas y bienvenidas',
    descripcionCorta: 'Para cuando la voz interna que dice "¿quién soy yo para hablar?" se vuelve demasiado ruidosa.',
    categoria: 'Trabajo',
    categoriaEmoji: '🚀',
    area: 'Trabajo',
    duracionMin: 2,
    textContent:
      'Mis ideas tienen valor. Lo que pienso merece ser dicho, propuesto y defendido. No tengo que esperar a ser la más experta de la sala para contribuir — mi perspectiva única es exactamente lo que algunas conversaciones necesitan.',
    audioDurationSec: 90,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['trabajo', 'ideas', 'voz', 'síndrome del impostor', 'contribución'],
    comoUsarla:
      'Dila antes de una reunión, antes de publicar contenido, o antes de enviar un email importante.',
    accionDespues: 'Di en voz alta o escribe una idea que has estado guardándote. Compártela aunque sea imperfecta.',
    victoriaClose: 'Las ideas que no dices no ayudan a nadie — ni a ti.',
  },

  {
    id: 'afi-014',
    tipo: 'afirmacion',
    titulo: 'Me amo y me acepto completamente',
    descripcionCorta: 'La afirmación fundamental de Louise Hay que trabaja en lo profundo cuando la repites con constancia.',
    categoria: 'Autoestima',
    categoriaEmoji: '🌸',
    area: 'Autoestima',
    duracionMin: 2,
    textContent:
      'Me amo y me acepto completamente. Mis sombras y mis luces. Mis errores y mis aciertos. Mi cuerpo, mi mente, mi historia. No necesito ser diferente para merecer amor — me lo doy ahora, exactamente como soy.',
    audioDurationSec: 90,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['autoestima', 'amor propio', 'aceptación', 'Louise Hay'],
    comoUsarla:
      'Repítela en el espejo, en voz alta, mirándote a los ojos. Si sientes resistencia, eso es señal de que más la necesitas.',
    accionDespues: 'Escribe una lista de 5 cualidades que genuinamente aprecias de ti misma.',
    victoriaClose: 'Este amor propio que cultivas hoy protege tu energía mañana.',
  },

  {
    id: 'afi-015',
    tipo: 'afirmacion',
    titulo: 'Soy la creadora de mi realidad',
    descripcionCorta: 'La afirmación maestra que activa la agencia y la responsabilidad creativa sobre tu vida.',
    categoria: 'General',
    categoriaEmoji: '✨',
    duracionMin: 2,
    textContent:
      'Soy la creadora de mi realidad. Mis pensamientos, mis palabras y mis acciones construyen el mundo en que vivo. No soy víctima de las circunstancias — soy arquitecta de mi vida. Elijo conscientemente lo que quiero crear.',
    audioDurationSec: 90,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['manifestación', 'agencia', 'creación', 'responsabilidad'],
    comoUsarla:
      'Úsala como arranque del día o en momentos en que sientas que la vida "te pasa" en lugar de que tú la diriges.',
    accionDespues: 'Identifica una situación en tu vida donde no te estás comportando como la creadora. ¿Qué cambiarías?',
    victoriaClose: 'Cada día es un lienzo. Tú tienes el pincel.',
  },

  // ── DECRETOS (10) ────────────────────────────────────────────────────────
  {
    id: 'dec-001',
    tipo: 'decreto',
    titulo: 'Decreto de abundancia total',
    descripcionCorta: 'Un decreto completo para activar la frecuencia de prosperidad en todas las áreas.',
    categoria: 'Dinero',
    categoriaEmoji: '💰',
    area: 'Dinero',
    duracionMin: 4,
    textContent:
      'Yo decreto y declaro que la abundancia fluye hacia mí en todas sus formas. Decreto que el dinero llega a mí de formas esperadas e inesperadas, de forma constante y en cantidades cada vez mayores. Decreto que soy una receptora poderosa de la prosperidad del universo. Decreto que merezco vivir con riqueza, en paz, con salud y amor. Y así es.',
    audioDurationSec: 240,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['decreto', 'prosperidad', 'declaración', 'poder'],
    comoUsarla:
      'Lee el decreto en voz alta, de pie, con los pies en el suelo. No lo susurres — decreta con autoridad. Hazlo en la mañana, antes de empezar a trabajar.',
    accionDespues: 'Toma una decisión financiera hoy que refleje que ya vives con abundancia (aunque sea pequeña).',
    victoriaClose: 'Un decreto dicho con autoridad mueve energía. Hazlo con convicción.',
  },

  {
    id: 'dec-002',
    tipo: 'decreto',
    titulo: 'Decreto de amor propio',
    descripcionCorta: 'Cuando necesitas recordarte que eres suficiente, exactamente como eres ahora.',
    categoria: 'Amor',
    categoriaEmoji: '💗',
    area: 'Autoestima',
    duracionMin: 3,
    textContent:
      'Yo decreto que me amo y me acepto completamente, con mis sombras y mis luces. Decreto que no necesito la aprobación de nadie para saber que soy suficiente. Decreto que mi valor no depende de lo que produzco, de lo que peso ni de lo que logro. Existo. Eso es suficiente. Y así es.',
    audioDurationSec: 180,
    audioEstado: 'placeholder',
    premium: false,
    destacado: false,
    tags: ['decreto', 'amor-propio', 'autoestima', 'suficiencia'],
    comoUsarla:
      'Lee este decreto mirándote a los ojos en el espejo. Si sientes resistencia o ganas de llorar, está funcionando — sigue.',
    accionDespues: 'Escribe una carta corta de amor a ti misma. No la corrijas. Solo escribe.',
    victoriaClose: 'Existes. Eso ya es suficiente para merecer amor.',
  },

  {
    id: 'dec-003',
    tipo: 'decreto',
    titulo: 'Decreto de oportunidades',
    descripcionCorta: 'Para cuando sientes que las puertas están cerradas y necesitas recordar que hay otras.',
    categoria: 'Trabajo',
    categoriaEmoji: '🚀',
    area: 'Trabajo',
    duracionMin: 3,
    textContent:
      'Yo decreto que las oportunidades perfectas para mí están llegando ahora. Decreto que las personas correctas me encuentran, me ven y reconocen mi valor. Decreto que estoy en el lugar correcto, en el momento correcto, con los talentos correctos. Las puertas abren. Y así es.',
    audioDurationSec: 180,
    audioEstado: 'placeholder',
    premium: false,
    destacado: false,
    tags: ['decreto', 'trabajo', 'oportunidades', 'apertura'],
    comoUsarla:
      'Léelo antes de una entrevista, una reunión importante o cuando sientas que nada avanza.',
    accionDespues: 'Identifica una acción concreta que la versión de ti que ya tiene las oportunidades haría hoy. Hazla.',
    victoriaClose: 'Las oportunidades no desaparecen — cambian de forma. Sigue mirando.',
  },

  {
    id: 'dec-004',
    tipo: 'decreto',
    titulo: 'Decreto de poder personal',
    descripcionCorta: 'Para recuperar tu fuerza y tu voz cuando sientes que la has perdido o cedido.',
    categoria: 'Autoestima',
    categoriaEmoji: '🌸',
    area: 'Autoestima',
    duracionMin: 3,
    textContent:
      'Yo decreto que soy una mujer poderosa. Decreto que mi voz importa y merece ser escuchada. Decreto que ya no cedo mi poder por miedo a molestar, a decepcionar o a no gustar. Decreto que me paro en mi lugar con gracia y firmeza. Soy poderosa. Y así es.',
    audioDurationSec: 180,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['poder personal', 'voz', 'autoestima', 'firmeza'],
    comoUsarla:
      'De pie, con los pies bien plantados. Voz fuerte. No te disculpes por el espacio que ocupas.',
    accionDespues: 'Hoy, ejerce tu voz en una situación donde normalmente te callas. Aunque sea pequeño.',
    victoriaClose: 'Tu poder no es arrogancia — es responsabilidad contigo misma.',
  },

  {
    id: 'dec-005',
    tipo: 'decreto',
    titulo: 'Decreto del hogar próspero',
    descripcionCorta: 'Para crear la energía de un hogar abundante, ordenado y lleno de vida.',
    categoria: 'Hogar',
    categoriaEmoji: '🏡',
    area: 'Hogar',
    duracionMin: 3,
    textContent:
      'Yo decreto que mi hogar es próspero, abundante y lleno de amor. Decreto que en este espacio reina la paz, la salud y la alegría. Decreto que todo lo que entra a mi hogar es bienvenido con gratitud y todo lo que sale lo hace con bendición. Mi hogar refleja mi vida interior: ordenada, bella y en expansión. Y así es.',
    audioDurationSec: 180,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['hogar', 'prosperidad', 'paz', 'espacio', 'abundancia'],
    comoUsarla:
      'Dilo en el centro de tu hogar, de pie. Puedes poner la mano en una pared mientras lo lees.',
    accionDespues: 'Ordena un espacio de tu hogar hoy — aunque sea un cajón. El orden físico crea orden energético.',
    victoriaClose: 'Un hogar próspero empieza por la intención que pones en él.',
  },

  {
    id: 'dec-006',
    tipo: 'decreto',
    titulo: 'Decreto de apertura total',
    descripcionCorta: 'Para cruzar hacia una nueva etapa con la mente y el corazón completamente abiertos.',
    categoria: 'Nuevos Comienzos',
    categoriaEmoji: '🌱',
    area: 'Nuevos Comienzos',
    duracionMin: 3,
    textContent:
      'Yo decreto que estoy completamente abierta a lo nuevo. Decreto que suelto el pasado con amor y creo espacio para lo que quiero construir. Decreto que cada comienzo me encuentra más fuerte, más clara y más lista. Lo nuevo llega. Y así es.',
    audioDurationSec: 180,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['nuevos comienzos', 'apertura', 'cambio', 'crecimiento'],
    comoUsarla:
      'Léelo la mañana del primer día de una nueva etapa — nuevo trabajo, nuevo mes, nueva decisión.',
    accionDespues: 'Haz algo que simbolice apertura física: abre una ventana, camina a un lugar nuevo, prueba algo que nunca hayas comido.',
    victoriaClose: 'Lo nuevo no espera que estés lista. Solo espera que digas que sí.',
  },

  {
    id: 'dec-007',
    tipo: 'decreto',
    titulo: 'Decreto de fe en mí misma',
    descripcionCorta: 'Cuando necesitas confiar en tu propio criterio más que en el ruido externo.',
    categoria: 'Confianza',
    categoriaEmoji: '🦋',
    area: 'Confianza',
    duracionMin: 3,
    textContent:
      'Yo decreto que confío en mí misma. Decreto que mi intuición es confiable y me guía hacia lo correcto. Decreto que no necesito la validación de otros para saber que estoy tomando las decisiones correctas. Confío en mi proceso. Confío en mi camino. Y así es.',
    audioDurationSec: 180,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['confianza', 'intuición', 'validación', 'criterio'],
    comoUsarla:
      'Úsalo cuando estés paralizada por indecisión o cuando busques demasiado la aprobación de otros.',
    accionDespues: 'Toma hoy una decisión que has estado postergando, basada en lo que TÚ sientes — no en lo que otros esperan.',
    victoriaClose: 'La decisión que tomaste desde tu intuición casi siempre fue la correcta.',
  },

  {
    id: 'dec-008',
    tipo: 'decreto',
    titulo: 'Decreto de salud y bienestar',
    descripcionCorta: 'Para honrar tu cuerpo y activar la frecuencia de salud integral.',
    categoria: 'Calma',
    categoriaEmoji: '🌿',
    area: 'Calma',
    duracionMin: 3,
    textContent:
      'Yo decreto que soy sana, vital y llena de energía. Decreto que mi cuerpo es inteligente y sabe sanar. Decreto que cuido mi cuerpo con amor, no con castigo. Decreto que el descanso, la alimentación y el movimiento son actos de amor propio, no de disciplina. Soy salud. Y así es.',
    audioDurationSec: 180,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['salud', 'bienestar', 'cuerpo', 'energía', 'vitalidad'],
    comoUsarla:
      'Dilo con las manos en el cuerpo — abdomen, pecho, donde sientas que necesita atención.',
    accionDespues: 'Haz hoy un gesto de cuidado hacia tu cuerpo: agua, movimiento, descanso, comida real.',
    victoriaClose: 'Tu cuerpo escucha lo que piensas de él. Habla bien.',
  },

  {
    id: 'dec-009',
    tipo: 'decreto',
    titulo: 'Decreto de liberación completa',
    descripcionCorta: 'Para soltar de raíz lo que ya no pertenece a tu vida — personas, situaciones o creencias.',
    categoria: 'Soltar',
    categoriaEmoji: '🕊️',
    area: 'Soltar',
    duracionMin: 4,
    textContent:
      'Yo decreto que me libero de todo lo que ya no me sirve. Decreto que suelto con amor y sin resentimiento todo vínculo, creencia o situación que ya cumplió su ciclo. Decreto que no necesito aferrarme para sentirme segura — mi seguridad viene de dentro. Suelto. Confío. Recibo lo nuevo. Y así es.',
    audioDurationSec: 240,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['soltar', 'liberación', 'desapego', 'cierre'],
    comoUsarla:
      'Con los ojos cerrados, visualiza lo que quieres soltar mientras lees. En cada frase, imagina que se va.',
    accionDespues: 'Escribe en papel lo que decretas soltar y hazlo desaparecer físicamente: quémalo, córtalo, tíralo.',
    victoriaClose: 'Soltar es el acto de fe más poderoso que puedes hacer.',
  },

  {
    id: 'dec-010',
    tipo: 'decreto',
    titulo: 'Decreto del año próspero',
    descripcionCorta: 'El decreto maestro para activar al inicio de año o en cualquier nuevo comienzo significativo.',
    categoria: 'General',
    categoriaEmoji: '✨',
    duracionMin: 5,
    textContent:
      'Yo decreto que este año es mi año más próspero, más amoroso y más auténtico hasta ahora. Decreto que recibo abundancia en dinero, salud, amor y propósito. Decreto que las personas correctas llegan a mi vida y las que ya cumplieron su ciclo se van con amor. Decreto que actúo con valentía, descanso con paz y celebro con gratitud. Este año me pertenece. Y así es.',
    audioDurationSec: 300,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['año nuevo', 'prosperidad', 'master decreto', 'intención anual'],
    comoUsarla:
      'El 1 de enero, el día de tu cumpleaños, o cualquier día que elijas como tu "año nuevo personal". De pie, en voz alta, con emoción.',
    accionDespues: 'Escribe tres compromisos concretos que harán que este decreto sea verdad.',
    victoriaClose: 'Tu año más próspero no empieza en enero — empieza cuando decretas que es posible.',
  },

  // ── VISUALIZACIONES (10) ─────────────────────────────────────────────────
  {
    id: 'vis-001',
    tipo: 'visualizacion',
    titulo: 'Tu yo próspero',
    descripcionCorta: 'Una visualización guiada para experimentar la prosperidad como algo presente, no futuro.',
    categoria: 'Dinero',
    categoriaEmoji: '💰',
    area: 'Dinero',
    duracionMin: 10,
    textContent:
      'Cierra los ojos. Respira profundo tres veces y lleva tu atención al centro de tu pecho.\n\nAhora imagina que te despiertas mañana con todo el dinero que necesitas. No tienes deudas. Tienes reservas. Tu cuenta bancaria refleja una cantidad que te da paz.\n\n¿Cómo te sientes al levantarte? Observa esa sensación — no el número, la sensación.\n\nVes tu día normal, pero sin la presión económica. ¿Cómo caminas? ¿Cómo hablas? ¿Qué decisiones tomas diferente?\n\nEntra a ese día. Siéntelo en tu cuerpo. Tu espalda más derecha. Tu voz más segura. Tu mente más clara.\n\nMantén esa sensación. No el dinero — la persona que eres cuando no tienes miedo al dinero.\n\nEsa persona ya vive en ti. Eres tú, sin las capas de miedo.',
    audioDurationSec: 600,
    audioEstado: 'placeholder',
    premium: false,
    destacado: true,
    tags: ['visualización', 'dinero', 'prosperidad', 'guiado'],
    introduccion:
      'Esta visualización funciona diferente a las que solo visualizan objetos o cantidades. Aquí vas a experimentar la EMOCIÓN de la prosperidad — porque esa emoción es lo que realmente atrae. Necesitas 10 minutos sin interrupciones.',
    accionDespues: 'Escribe en tu cuaderno: ¿Qué decisión tomarías hoy si ya fueras esa persona próspera?',
    victoriaClose: 'La persona próspera que visualizaste eres tú — sin los miedos encima.',
  },

  {
    id: 'vis-002',
    tipo: 'visualizacion',
    titulo: 'El amor que llega',
    descripcionCorta: 'Visualiza el amor romántico o la conexión profunda que tu corazón está pidiendo.',
    categoria: 'Amor',
    categoriaEmoji: '💗',
    area: 'Amor',
    duracionMin: 8,
    textContent:
      'Cierra los ojos. Respira y suelta. No intentes controlar nada — solo observa.\n\nImagina que estás en un lugar que te hace sentir segura. Puede ser real o inventado — un lugar donde te sientes completamente tú.\n\nDentro de esa escena, llega alguien. No necesitas ver su cara. Solo siente su presencia — la energía de alguien que te ve, que te elige, que te cuida sin quitarte tu espacio.\n\n¿Cómo se siente estar con esa persona? ¿Hay ligereza? ¿Hay paz? ¿Hay risa?\n\nNo intentes forzar una imagen. Solo siente la emoción de ese amor recíproco. La seguridad. La calidez. La libertad de ser completamente tú.\n\nEse amor ya existe en el campo. Tu corazón ya lo conoce. Solo estás recordando lo que ya viene.',
    audioDurationSec: 480,
    audioEstado: 'placeholder',
    premium: false,
    destacado: false,
    tags: ['visualización', 'amor', 'relaciones', 'guiado'],
    introduccion:
      'Esta visualización está diseñada para abrir el corazón, no para "atraer" a una persona específica. Funciona mejor cuando sueltas el control y permites sentir — sin esperar ver una cara o un nombre.',
    accionDespues: 'Escribe: ¿Qué tipo de amor quieres recibir? Sé específica en cómo te hace SENTIR, no en cómo se ve la persona.',
    victoriaClose: 'Lo que sentiste ahí es real. El amor que buscas ya te está buscando.',
  },

  {
    id: 'vis-003',
    tipo: 'visualizacion',
    titulo: 'Paz interior completa',
    descripcionCorta: 'Una visualización de descanso profundo para cuando la mente no para de correr.',
    categoria: 'Bienestar',
    categoriaEmoji: '🌿',
    area: 'Calma',
    duracionMin: 12,
    textContent:
      'Cierra los ojos. Respira más despacio de lo que crees que necesitas.\n\nImagina que tu mente es un lago. Ahora mismo puede estar agitado, con olas, con barro removido. Eso está bien — solo observa sin intentar calmar nada.\n\nMientras respiras, el lago empieza a calmarse por sí solo. No lo forzes. Solo observa cómo cada exhalación lleva un poco de agitación afuera.\n\nCuando el lago empieza a calmarse, puedes ver el fondo. En ese fondo hay paz. Una paz que siempre estuvo ahí, debajo de todo el ruido.\n\nEsa paz es tuya. No la creaste — la encontraste. Siempre estuvo disponible para ti.\n\nQuédate en esa paz por un momento. Sin preguntas, sin planes, sin preocupaciones. Solo tú, respirando, en paz.',
    audioDurationSec: 720,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['visualización', 'paz', 'meditación', 'bienestar'],
    introduccion:
      'Úsala cuando la ansiedad o el ruido mental se vuelvan muy intensos. No necesitas estar "lista" — úsala exactamente cuando sientas que no puedes parar.',
    accionDespues: 'Toma tres respiraciones conscientes cada vez que hoy sientas que la mente se acelera.',
    victoriaClose: 'La paz que encontraste aquí siempre estuvo ahí. Solo la habías olvidado.',
  },

  {
    id: 'vis-004',
    tipo: 'visualizacion',
    titulo: 'Mi trabajo floreciente',
    descripcionCorta: 'Visualiza tu trabajo o negocio en su máxima expresión — con clientes, impacto y abundancia.',
    categoria: 'Trabajo',
    categoriaEmoji: '🚀',
    area: 'Trabajo',
    duracionMin: 10,
    textContent:
      'Cierra los ojos. Respira profundo y lleva tu atención a tu trabajo — lo que haces, lo que ofreces, lo que creas.\n\nAhora imagina que tu trabajo está floreciendo. No de forma vaga — de forma concreta. ¿Cuántos clientes tienes? ¿Qué te dicen? ¿Cómo se siente tu agenda?\n\nVes un día ordinario en ese trabajo que ya funciona. Despiertas con energía para lo que vas a hacer. Las personas que necesitan lo que ofreces te encuentran.\n\n¿Cuánto ganas? No lo censures — pon un número que te emocione.\n\n¿Cómo se siente tu cuerpo en ese trabajo? ¿Hay orgullo? ¿Hay propósito? ¿Hay alegría?\n\nEse trabajo es posible. Esa versión tuya ya existe en el campo.',
    audioDurationSec: 600,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['trabajo', 'negocio', 'éxito', 'abundancia', 'propósito'],
    introduccion:
      'Esta visualización funciona mejor cuando tienes un trabajo o proyecto concreto en mente. Si no tienes uno claro todavía, usa el tiempo para imaginar cómo se sentiría el trabajo ideal — sin limitarte por lo "realista".',
    accionDespues: 'Escribe: ¿Qué acción concreta acercaría hoy tu trabajo real a esa versión que visualizaste?',
    victoriaClose: 'Ese trabajo que viste es posible. Solo necesita tus acciones de hoy.',
  },

  {
    id: 'vis-005',
    tipo: 'visualizacion',
    titulo: 'La versión más confiada de ti',
    descripcionCorta: 'Conoce y encarna a la versión de ti que ya tiene la confianza que estás buscando.',
    categoria: 'Autoestima',
    categoriaEmoji: '🌸',
    area: 'Autoestima',
    duracionMin: 10,
    textContent:
      'Cierra los ojos. Respira y afloja los hombros.\n\nImagina que frente a ti aparece una versión de ti misma. Esta versión tiene la confianza que tú estás buscando. La tiene de verdad — no es arrogancia, es paz consigo misma.\n\n¿Cómo camina? Observa su postura. Sus hombros. Su mirada.\n\n¿Cómo habla? ¿Con qué tono? ¿Cuánto espacio ocupa en una conversación?\n\n¿Qué no hace esa versión de ti? ¿Qué ha dejado de necesitar?\n\nAcércate a ella. Mírala a los ojos. Pregúntale: "¿Qué necesito saber?"\n\nEscucha lo que venga. No lo censures.\n\nAhora, fusionarte con ella. Imagina que te fusionas. Esa confianza ya vive en ti.',
    audioDurationSec: 600,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['autoestima', 'confianza', 'identidad', 'versión futura'],
    introduccion:
      'Esta es una visualización de identidad, no de metas. No vamos a visualizar lo que tienes — vamos a visualizar quién eres cuando la confianza ya está.',
    accionDespues: 'Actúa hoy como esa versión de ti en UNA situación concreta.',
    victoriaClose: 'Esa versión tuya no está lejos. Solo está un poco más adelante en el camino.',
  },

  {
    id: 'vis-006',
    tipo: 'visualizacion',
    titulo: 'El hogar de tus sueños',
    descripcionCorta: 'Una visualización sensorial del espacio donde te sientes completamente en casa.',
    categoria: 'Hogar',
    categoriaEmoji: '🏡',
    area: 'Hogar',
    duracionMin: 8,
    textContent:
      'Cierra los ojos. Respira profundo tres veces.\n\nAhora imagina que estás en el hogar que tu corazón pide. No uno perfecto de revista — el que te haría sentir en casa de verdad.\n\n¿Cómo es la luz? ¿Natural? ¿Cálida?\n\n¿Qué ves cuando entras? ¿Qué hueles?\n\nCamina por ese espacio. Entra a la cocina. Entra al cuarto. Sal al espacio exterior si lo hay.\n\n¿Cómo te sientes en ese hogar? ¿Qué parte de ti respira diferente ahí?\n\n¿Con quién estás? ¿Sola con paz, o acompañada con amor?\n\nEse hogar existe. Ya sea este con mejoras, o uno que aún no llegó.',
    audioDurationSec: 480,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['hogar', 'espacio', 'sueños', 'paz', 'refugio'],
    introduccion:
      'No te limites por lo que crees posible ahora. Este ejercicio trabaja con la visión — no con el presupuesto. Deja que tu corazón dibuje sin filtros.',
    accionDespues: 'Escribe 3 elementos de ese hogar que podrías incorporar en tu espacio actual, aunque sea en pequeño.',
    victoriaClose: 'El hogar que sueñas ya está disponible para ti — empieza por sentirte en casa donde estás.',
  },

  {
    id: 'vis-007',
    tipo: 'visualizacion',
    titulo: 'La vida que me espera',
    descripcionCorta: 'Viaja al día en que tu nueva etapa ya llegó y está siendo más hermosa de lo que imaginaste.',
    categoria: 'Nuevos Comienzos',
    categoriaEmoji: '🌱',
    area: 'Nuevos Comienzos',
    duracionMin: 12,
    textContent:
      'Cierra los ojos. Imagina que han pasado 12 meses desde hoy.\n\nTe despiertas en tu vida nueva. La etapa que estabas esperando ya llegó. No perfectamente — pero bien. Mejor de lo que habías imaginado en los momentos de duda.\n\n¿Dónde estás? ¿Cómo es tu mañana?\n\n¿Qué fue lo más difícil del año? ¿Qué fue lo más inesperadamente bueno?\n\n¿Quién eres ahora? ¿En qué eres diferente?\n\n¿Qué les dices a las personas que quieres sobre este año?\n\nSiente la gratitud de esa versión de ti. La que ya cruzó. La que lo hizo.\n\nEsa eres tú — dentro de 12 meses.',
    audioDurationSec: 720,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['nuevos comienzos', 'futuro', 'visión', '12 meses'],
    introduccion:
      'Esta visualización funciona mejor cuando estás en un punto de transición real. Úsala cuando la incertidumbre sobre lo que viene sea muy fuerte.',
    accionDespues: 'Escribe una carta desde tu yo de dentro de 12 meses a tu yo de hoy. ¿Qué te diría?',
    victoriaClose: 'Esa versión de ti ya existe. Solo necesita que la de hoy dé el siguiente paso.',
  },

  {
    id: 'vis-008',
    tipo: 'visualizacion',
    titulo: 'El momento en que confié',
    descripcionCorta: 'Regresa a una memoria de cuando confiaste en ti y funcionó — para anclar esa sensación en el cuerpo.',
    categoria: 'Confianza',
    categoriaEmoji: '🦋',
    area: 'Confianza',
    duracionMin: 8,
    textContent:
      'Cierra los ojos. Respira.\n\nLleva tu memoria a un momento — real, de tu vida — cuando confiaste en ti misma. Una decisión que tomaste sin estar segura de 100%. Un riesgo que diste. Una conversación difícil que tuviste.\n\nRevive ese momento. ¿Dónde estabas? ¿Cómo se sentía el cuerpo antes?\n\nY ahora recuerda cómo salió. No tiene que haber salido perfecto — pero lo manejaste. Estuviste presente.\n\n¿Cómo se sintió después? ¿Había algo de orgullo propio?\n\nEsa sensación — la de después de confiar en ti — es lo que tienes disponible ahora mismo.\n\nAnclala. Respira con ella. Esta eres tú cuando confías.',
    audioDurationSec: 480,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['confianza', 'memoria', 'recurso interno', 'seguridad'],
    introduccion:
      'Si no te viene ningún momento grande, usa uno pequeño. La confianza no necesita hazañas — necesita evidencia, aunque sea mínima.',
    accionDespues: 'Escribe ese momento que recordaste. Tenlo disponible para cuando la duda vuelva.',
    victoriaClose: 'Ya confiaste antes. Y lo seguirás haciendo.',
  },

  {
    id: 'vis-009',
    tipo: 'visualizacion',
    titulo: 'El río que fluye',
    descripcionCorta: 'Una visualización de desapego y fluidez para aprender a soltar sin esfuerzo.',
    categoria: 'Soltar',
    categoriaEmoji: '🕊️',
    area: 'Soltar',
    duracionMin: 10,
    textContent:
      'Cierra los ojos. Imagina que estás sentada a la orilla de un río.\n\nEl río fluye constante. No lucha con las rocas — las rodea. No se preocupa si hay curvas — simplemente fluye.\n\nAhora observa el río. En la superficie flotan hojas, pequeños objetos, cosas que el río lleva consigo sin aferrarse.\n\nToma algo que estás cargando — una preocupación, una persona, una situación — y ponla en el río. Solo ponla ahí.\n\nObserva cómo el río la toma sin esfuerzo. No la destruye — simplemente la lleva más allá de donde puedes verla.\n\nSiente en tu cuerpo lo que se libera cuando sueltas eso que cargabas.\n\nEl río fluye. Tú también puedes.',
    audioDurationSec: 600,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['soltar', 'fluidez', 'desapego', 'río', 'naturaleza'],
    introduccion:
      'Puedes hacer esta visualización varias veces, con cosas distintas. Cada vez que notes que estás cargando algo, regresa al río.',
    accionDespues: 'Identifica una cosa concreta que puedas dejar de controlar activamente hoy.',
    victoriaClose: 'Fluir no es rendirse. Es confiar en la dirección del río.',
  },

  {
    id: 'vis-010',
    tipo: 'visualizacion',
    titulo: 'Tu vida un año después',
    descripcionCorta: 'Una visualización completa de todas las áreas de tu vida cuando ya estás viviendo tu mejor versión.',
    categoria: 'General',
    categoriaEmoji: '✨',
    duracionMin: 15,
    textContent:
      'Cierra los ojos. Viaja 12 meses hacia el futuro.\n\nTe despiertas. ¿Cómo es tu mañana? ¿Qué es lo primero que sientes?\n\nMira tu vida en dinero: ¿Cómo está tu cuenta? ¿Cómo ganas? ¿Cómo gastas?\n\nMira tu vida en amor: ¿Qué relaciones tienes? ¿Cómo das y recibes amor?\n\nMira tu vida en trabajo: ¿Qué haces? ¿Cómo te sientes haciéndolo?\n\nMira tu cuerpo: ¿Cómo se siente? ¿Qué lo cuida?\n\nMira tu hogar: ¿Dónde vives? ¿Con quién?\n\nAhora observa cómo te mueves por ese día. ¿Hay paz? ¿Hay propósito? ¿Hay alegría ordinaria?\n\nEsa vida que acabas de ver es posible. Tú la puedes construir.',
    audioDurationSec: 900,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['visión', 'futuro', 'vida completa', '12 meses', 'todas las áreas'],
    introduccion:
      'Esta es la visualización más completa del catálogo. Deja al menos 15 minutos sin interrupciones. Si algo en la visualización se siente difícil de imaginar, es exactamente ahí donde más necesitas trabajar.',
    accionDespues: 'Escribe las 3 áreas donde la visión fue más clara, y las 3 donde fue más difícil. Las difíciles son tu mapa.',
    victoriaClose: 'Esa vida entera que viste — ya está disponible para ti. Lo que necesita es que la elijas.',
  },

  // ── SEÑALES Y NÚMEROS (3) ────────────────────────────────────────────────
  {
    id: 'sen-001',
    tipo: 'senal',
    area: 'Nuevos Comienzos',
    titulo: '111 — El universo te escucha',
    descripcionCorta: 'Cuando el 111 aparece, tus pensamientos se están manifestando rápidamente.',
    categoria: 'General',
    categoriaEmoji: '✨',
    duracionMin: 3,
    textContent:
      'El 111 es una señal de alineación. Cuando aparece, el universo te está diciendo: "Lo que estás pensando ahora mismo es importante — elige con cuidado." Es un portal de manifestación abierto.',
    audioEstado: 'none',
    premium: false,
    destacado: false,
    tags: ['números', 'señales', 'manifestación', '111'],
    numero: '111',
    interpretacion:
      'El 1 es el número del inicio, de la creación, del yo. Tres unos juntos amplifican esa energía: estás en un momento de inicio poderoso. Los pensamientos que tienes cuando ves el 111 se están sembrando en la realidad. Si eran positivos, expándelos. Si eran negativos, cámbialos de inmediato.',
    preguntaReflexion: '¿En qué estabas pensando exactamente cuando viste el 111? ¿Es eso lo que quieres manifestar?',
    afirmacionFinal: 'Mis pensamientos crean mi realidad. Elijo pensar en abundancia, amor y posibilidades.',
    accionDespues: 'Escribe el pensamiento que tenías y pregúntate: ¿Es esto lo que quiero atraer? Ajusta si es necesario.',
  },

  {
    id: 'sen-002',
    tipo: 'senal',
    area: 'Calma',
    titulo: '333 — Apoyo divino',
    descripcionCorta: 'Tres treses es la señal de que no estás sola — hay apoyo invisible que camina contigo.',
    categoria: 'Bienestar',
    categoriaEmoji: '🌿',
    duracionMin: 3,
    textContent:
      'El 333 es la señal de los guías, del universo, de algo más grande que tú misma. Cuando aparece, te dice: "No estás cargando esto sola. Hay apoyo disponible para ti ahora mismo."',
    audioEstado: 'none',
    premium: false,
    destacado: false,
    tags: ['números', 'señales', 'apoyo', '333'],
    numero: '333',
    interpretacion:
      'El 3 representa creatividad, expresión y trinidad — mente, cuerpo y alma en alineación. Tres treses amplifica esa energía de apoyo y guía. Es una señal de que el universo está activo en tu vida, trabajando por ti aunque no lo veas. Puedes pedir ayuda — no tienes que resolverlo todo sola.',
    preguntaReflexion: '¿En qué área de tu vida necesitas más apoyo ahora mismo? ¿Has pedido ese apoyo?',
    afirmacionFinal: 'No estoy sola. El universo camina conmigo y me apoya en cada paso.',
    accionDespues: 'Pide ayuda en algo — a una persona, al universo, o simplemente admítete a ti misma que necesitas apoyo.',
  },

  {
    id: 'sen-003',
    tipo: 'senal',
    area: 'Dinero',
    titulo: '888 — Ciclo de abundancia',
    descripcionCorta: 'El 888 anuncia un ciclo de cosecha. Lo que sembraste está llegando.',
    categoria: 'Dinero',
    categoriaEmoji: '💰',
    duracionMin: 3,
    textContent:
      'El 888 es la señal más poderosa de abundancia material. Cuando aparece, anuncia que un ciclo de recepción está abierto. No es momento de dudar — es momento de recibir.',
    audioEstado: 'none',
    premium: false,
    destacado: false,
    tags: ['números', 'señales', 'abundancia', 'dinero', '888'],
    numero: '888',
    interpretacion:
      'El 8 es el número del infinito y la abundancia material. Es el número de los ciclos que se cierran y se abren. Tres ochos juntos amplifican esa energía de ciclo infinito de recepción. El 888 aparece cuando estás cerca de recibir algo que pediste — o justo cuando lo estás recibiendo sin reconocerlo.',
    preguntaReflexion: '¿Qué abundancia está llegando a tu vida ahora mismo que quizás no estás viendo o reconociendo?',
    afirmacionFinal: 'Estoy en un ciclo de abundancia. Recibo con gratitud y amplío mi capacidad de recibir más.',
    accionDespues: 'Identifica algo que ya recibiste esta semana — grande o pequeño — y agradécelo conscientemente.',
  },

  // ── JOURNALING (10) ──────────────────────────────────────────────────────
  {
    id: 'jou-001',
    tipo: 'journaling',
    titulo: 'Mis creencias sobre el dinero',
    descripcionCorta: 'Descubre y reescribe las creencias que heredaste sobre el dinero y que todavía gobiernan tu cuenta bancaria.',
    categoria: 'Dinero',
    categoriaEmoji: '💰',
    area: 'Dinero',
    duracionMin: 20,
    textContent:
      'Las creencias sobre el dinero no son tuyas — las heredaste. De tu familia, de tu cultura, de lo que escuchaste de pequeña. El problema es que actúan como un software que corre en segundo plano y toma decisiones por ti sin que lo sepas.',
    audioDurationSec: 0,
    audioEstado: 'none',
    premium: false,
    destacado: true,
    tags: ['dinero', 'creencias', 'bloqueos', 'journaling', 'inconsciente'],
    introduccion:
      'Este ejercicio puede ser incómodo — eso es señal de que estás llegando a algo real. No lo edites mientras escribes. Escribe lo primero que te venga, aunque sea "tonto" o "vergonzoso".',
    preguntasGuia: [
      '¿Qué decían en tu casa sobre el dinero cuando eras pequeña? ¿Qué frases recuerdas?',
      '¿Qué significa para ti "tener dinero"? ¿Qué tipo de persona eres si tienes mucho?',
      '¿Cuándo fue la primera vez que sentiste que el dinero era un problema? ¿Qué pasó?',
      '¿Qué creencia sobre el dinero todavía crees que es "verdad" aunque racionalmente sabes que no lo es?',
      'Si esa creencia no fuera tuya, ¿de quién sería? ¿Qué harías diferente si no la tuvieras?',
    ],
    accionDespues: 'Elige una creencia que quieres reescribir. Escribe la creencia nueva que quieres instalar en su lugar.',
    victoriaClose: 'Las creencias que encontraste hoy ya no pueden gobernarte en secreto.',
  },

  {
    id: 'jou-002',
    tipo: 'journaling',
    titulo: '¿Qué busco realmente en el amor?',
    descripcionCorta: 'Clarifica qué necesitas de verdad en una relación — más allá de las características de lista.',
    categoria: 'Amor',
    categoriaEmoji: '💗',
    area: 'Amor',
    duracionMin: 20,
    textContent:
      'La mayoría de las personas tienen una lista de características del amor ideal. Pero lo que realmente atrae y retiene no son las características — son las necesidades emocionales debajo. Este journaling llega ahí.',
    audioDurationSec: 0,
    audioEstado: 'none',
    premium: false,
    destacado: false,
    tags: ['amor', 'relaciones', 'necesidades', 'claridad', 'journaling'],
    introduccion:
      'Escribe sin censura. No estás escribiendo una bio de app de citas — estás siendo honesta contigo misma sobre lo que realmente necesitas.',
    preguntasGuia: [
      '¿Cómo te quieres sentir en una relación? No cómo quieres que sea la persona — cómo quieres sentirte TÚ.',
      '¿Qué necesidad emocional más profunda buscas que llene una relación? (seguridad, ser vista, diversión, expansión…)',
      '¿Qué patrón se ha repetido en tus relaciones que ya no quieres reproducir?',
      '¿Qué de lo que buscas en una pareja podrías darte tú misma?',
      '¿Qué estarías dispuesta a comprometer y qué jamás?',
    ],
    accionDespues: 'Escribe en una sola frase lo que más necesitas sentir en tu relación ideal.',
    victoriaClose: 'Saber qué necesitas de verdad es el primer paso para poder recibirlo.',
  },

  {
    id: 'jou-003',
    tipo: 'journaling',
    titulo: 'Carta de amor a ti misma',
    descripcionCorta: 'Escríbete la carta que necesitabas recibir hace años — desde el amor que ahora puedes darte.',
    categoria: 'Autoestima',
    categoriaEmoji: '🌸',
    area: 'Autoestima',
    duracionMin: 25,
    textContent:
      'Esta carta no es sobre tus logros — es sobre quién eres. La versión más compasiva y sabia de ti misma le escribe a la versión que todavía se juzga, se compara y no se cree suficiente.',
    audioDurationSec: 0,
    audioEstado: 'none',
    premium: true,
    destacado: false,
    tags: ['autoestima', 'amor propio', 'carta', 'compasión', 'journaling'],
    introduccion:
      'Antes de empezar, siéntate en un lugar cómodo, respira profundo y pon la mano en el corazón. Escribe despacio. Si lloras, bien — eso es que está llegando a donde necesita llegar.',
    preguntasGuia: [
      'Empieza con: "Querida [tu nombre]:" y escribe lo que llevas tiempo necesitando escuchar.',
      '¿Qué le dirías a la versión de ti que más te cuesta querer? ¿La que se equivocó, la que eligió mal, la que todavía duda?',
      '¿Qué ves en ti que ella todavía no puede ver?',
      '¿Qué promesa te quieres hacer?',
      'Cierra la carta con: "Te amo porque..."',
    ],
    accionDespues: 'Guarda la carta. Léela de nuevo en un mes — especialmente en los días difíciles.',
    victoriaClose: 'Esa carta que escribiste fue la más honesta que has escrito en mucho tiempo.',
  },

  {
    id: 'jou-004',
    tipo: 'journaling',
    titulo: '¿Dónde me veo en 3 años?',
    descripcionCorta: 'Una reflexión profunda sobre tu dirección profesional y personal para los próximos 3 años.',
    categoria: 'Trabajo',
    categoriaEmoji: '🚀',
    area: 'Trabajo',
    duracionMin: 20,
    textContent:
      'Tres años es el horizonte perfecto: suficientemente lejos para imaginar con ambición, suficientemente cerca para que las acciones de hoy tengan consecuencias visibles. Este journaling ayuda a trazar la dirección antes de que el día a día la trace por ti.',
    audioDurationSec: 0,
    audioEstado: 'none',
    premium: true,
    destacado: false,
    tags: ['trabajo', 'visión', 'carrera', 'propósito', '3 años'],
    introduccion:
      'No pienses en metas todavía — piensa en cómo quieres sentirte y quién quieres ser. Las metas concretas vendrán después de que la dirección esté clara.',
    preguntasGuia: [
      '¿En qué trabajo o proyecto te ves en 3 años? Descríbelo con detalle sensorial — no solo "soy exitosa".',
      '¿Cuánto ganas? ¿Cómo es tu agenda? ¿Con quién trabajas?',
      '¿Qué habilidad o conocimiento que todavía no tienes necesitarías para llegar ahí?',
      '¿Qué de tu trabajo actual quieres mantener, ampliar o dejar ir?',
      '¿Qué te detiene de ir en esa dirección ahora mismo?',
    ],
    accionDespues: 'Identifica una acción concreta que podrías tomar esta semana en esa dirección.',
    victoriaClose: 'La dirección importa más que la velocidad. Saberla ya es avanzar.',
  },

  {
    id: 'jou-005',
    tipo: 'journaling',
    titulo: 'El hogar que mi corazón pide',
    descripcionCorta: 'Explora qué necesitas realmente en un hogar — más allá de los metros cuadrados y la ubicación.',
    categoria: 'Hogar',
    categoriaEmoji: '🏡',
    area: 'Hogar',
    duracionMin: 15,
    textContent:
      'El hogar ideal no es una lista de características de Airbnb. Es una sensación. Es el tipo de vida que se vive adentro. Este journaling ayuda a clarificar qué vida quieres que tenga tu hogar.',
    audioDurationSec: 0,
    audioEstado: 'none',
    premium: true,
    destacado: false,
    tags: ['hogar', 'espacio', 'vida ideal', 'sueños', 'journaling'],
    introduccion: 'Escribe sin presupuesto en mente. Primero clarifica qué quieres — después viene cómo.',
    preguntasGuia: [
      '¿Cómo quieres que se sienta tu hogar cuando entras? ¿Qué palabra lo describe?',
      '¿Qué parte de tu hogar actual te quita energía? ¿Qué parte te recarga?',
      '¿Qué tipo de vida sucede en el hogar que deseas? ¿Hay personas? ¿Hay silencio? ¿Hay naturaleza?',
      '¿Qué pequeño cambio en tu hogar actual lo acercaría más a esa sensación?',
    ],
    accionDespues: 'Haz ese pequeño cambio esta semana — aunque sea mover un mueble o poner una planta.',
    victoriaClose: 'El hogar que mereces empieza por ser intencional con el que ya tienes.',
  },

  {
    id: 'jou-006',
    tipo: 'journaling',
    titulo: '¿Qué quiero crear desde cero?',
    descripcionCorta: 'Para quien está en un punto de reinicio y necesita claridad sobre qué construir de nuevo.',
    categoria: 'Nuevos Comienzos',
    categoriaEmoji: '🌱',
    area: 'Nuevos Comienzos',
    duracionMin: 20,
    textContent:
      'Los nuevos comienzos son un lienzo en blanco. Y eso puede ser liberador o paralizante. Este journaling ayuda a convertir el vacío en dirección.',
    audioDurationSec: 0,
    audioEstado: 'none',
    premium: true,
    destacado: false,
    tags: ['nuevos comienzos', 'reinicio', 'creación', 'dirección', 'journaling'],
    introduccion:
      'Este ejercicio funciona mejor cuando ya dejaste ir algo — una relación, un trabajo, una etapa. Si todavía estás en el duelo del cierre, primero haz el journaling de soltar.',
    preguntasGuia: [
      '¿Qué de tu vida anterior NO quieres llevar a lo que sigue? Sé específica.',
      '¿Qué parte de ti misma estaba dormida en la etapa anterior que ahora quieres despertar?',
      '¿Si pudieras diseñar los próximos 12 meses desde cero, cómo empezarías?',
      '¿Qué necesitas perdonarte de la etapa anterior para poder entrar libre a la siguiente?',
      '¿Cuál es el primer gesto concreto del nuevo comienzo?',
    ],
    accionDespues: 'Haz ese primer gesto hoy — aunque sea pequeño. El primer paso rompe la inercia.',
    victoriaClose: 'El lienzo en blanco no es el problema — es el regalo.',
  },

  {
    id: 'jou-007',
    tipo: 'journaling',
    titulo: 'Las veces que confié y funcionó',
    descripcionCorta: 'Construye tu archivo personal de evidencias de confianza para los momentos en que la duda gana.',
    categoria: 'Confianza',
    categoriaEmoji: '🦋',
    area: 'Confianza',
    duracionMin: 15,
    textContent:
      'La confianza en ti misma no es una creencia — es una colección de evidencias. Cuando la duda llega, el cerebro busca pruebas de que algo va a salir mal. Este journaling crea el archivo opuesto.',
    audioDurationSec: 0,
    audioEstado: 'none',
    premium: true,
    destacado: false,
    tags: ['confianza', 'evidencias', 'recursos internos', 'historial', 'journaling'],
    introduccion:
      'No filtres por tamaño. Las "pequeñas" victorias de confianza son tan válidas como las grandes.',
    preguntasGuia: [
      'Recuerda 3 momentos en que tomaste una decisión sin certeza completa y salió bien.',
      '¿Qué decías en esos momentos, antes de decidir? ¿Cómo te moviste a pesar del miedo?',
      '¿Qué aprendiste sobre ti misma en esas situaciones?',
      '¿Qué consejo te darías hoy, basada en todas esas veces que confiaste?',
    ],
    accionDespues: 'Guarda este journaling como tu "archivo de confianza". Léelo cada vez que la duda quiera convencerte.',
    victoriaClose: 'La evidencia de que eres capaz ya existe — a veces solo hay que ir a buscarla.',
  },

  {
    id: 'jou-008',
    tipo: 'journaling',
    titulo: 'Lo que estoy lista para soltar',
    descripcionCorta: 'Un inventario honesto de lo que ya no te sirve y estás lista para dejar ir.',
    categoria: 'Soltar',
    categoriaEmoji: '🕊️',
    area: 'Soltar',
    duracionMin: 20,
    textContent:
      'Soltar no es decidir en un momento — es un proceso de reconocimiento. Este journaling ayuda a ver claramente qué estás cargando que ya no te pertenece.',
    audioDurationSec: 0,
    audioEstado: 'none',
    premium: true,
    destacado: false,
    tags: ['soltar', 'inventario', 'claridad', 'liberación', 'journaling'],
    introduccion:
      'Escribe sin juzgarte. Puede salir cualquier cosa — personas, creencias, roles, hábitos, rencores, versiones de ti misma. Todos tienen su lugar aquí.',
    preguntasGuia: [
      '¿Qué estás cargando que ya no te pertenece? ¿Qué llevas que no pediste llevar?',
      '¿Qué persona, situación o creencia ocupa más espacio mental del que merece?',
      '¿Qué versión de ti misma ya superaste pero todavía actúas como si fuera?',
      '¿Qué te costaría soltar eso? ¿Qué ganarías?',
      '¿Cuándo estarás "lista" para soltarlo? ¿Esa condición es real o es una excusa?',
    ],
    accionDespues: 'Elige una cosa de la lista — la que más pesa — y da un primer paso de soltar esta semana.',
    victoriaClose: 'Ya lo nombraste. Nombrarlo es el primer acto de soltarlo.',
  },

  {
    id: 'jou-009',
    tipo: 'journaling',
    titulo: 'Mis fuentes de paz',
    descripcionCorta: 'Mapea lo que genuinamente te calma para tenerlo disponible cuando más lo necesites.',
    categoria: 'Calma',
    categoriaEmoji: '🌿',
    area: 'Calma',
    duracionMin: 15,
    textContent:
      'En los momentos de mayor ansiedad, el cerebro no recuerda qué funciona — solo recuerda el estrés. Este journaling crea un mapa de recursos para cuando más lo necesites.',
    audioDurationSec: 0,
    audioEstado: 'none',
    premium: true,
    destacado: false,
    tags: ['calma', 'paz', 'recursos', 'ansiedad', 'journaling'],
    introduccion:
      'Escribe desde la honestidad — no desde lo que "debería" calmarte. Lo que realmente funciona para ti puede ser diferente de lo que funciona para otras personas.',
    preguntasGuia: [
      '¿Cuándo fue la última vez que te sentiste genuinamente en paz? ¿Qué estaba pasando?',
      '¿Qué actividades, lugares o personas te bajan la frecuencia de ansiedad de forma real y rápida?',
      '¿Qué haces cuando estás muy estresada que empeora las cosas (aunque en el momento sienta bien)?',
      '¿Qué necesitas hacer MÁS seguido para mantener la calma como estado base?',
      '¿Qué le dirías a la versión de ti que está muy ansiosa ahora mismo?',
    ],
    accionDespues: 'Guarda la lista de tus fuentes de paz donde la puedas ver. Úsala la próxima vez que la necesites antes de hacer otra cosa.',
    victoriaClose: 'La calma no es ausencia de problemas. Es saber que tienes herramientas.',
  },

  {
    id: 'jou-010',
    tipo: 'journaling',
    titulo: 'Mi manifiesto personal',
    descripcionCorta: 'Escribe el documento que define quién eres, qué valoras y cómo quieres vivir.',
    categoria: 'General',
    categoriaEmoji: '✨',
    duracionMin: 30,
    textContent:
      'Un manifiesto personal no es una lista de metas — es una declaración de identidad. Es el documento al que regresas cuando el ruido externo intenta definirte. Este es tuyo.',
    audioDurationSec: 0,
    audioEstado: 'none',
    premium: true,
    destacado: false,
    tags: ['identidad', 'valores', 'manifiesto', 'propósito', 'journaling'],
    introduccion:
      'Dedica al menos 30 minutos a esto. No lo hagas de prisa. Este es el documento más importante que escribirás en la aplicación.',
    preguntasGuia: [
      'Yo soy alguien que... (escribe 5 afirmaciones de identidad que sean verdaderas o que estás construyendo)',
      'Mis valores más profundos son... (no los que "deberían" serlo — los que de verdad guían tus decisiones)',
      'Lo que no estoy dispuesta a negociar es...',
      'La vida que quiero vivir se ve así...',
      'Mi compromiso con la versión que quiero ser es...',
    ],
    accionDespues: 'Guarda tu manifiesto. Léelo cada semana durante un mes. Actualízalo cuando sientas que ha cambiado algo.',
    victoriaClose: 'Esto que escribiste es tu brújula. Vuelve a ella cada vez que pierdas el norte.',
  },

  // ── GRATITUD (8) ─────────────────────────────────────────────────────────
  {
    id: 'gra-001',
    tipo: 'gratitud',
    titulo: 'Las 5 cosas de la mañana',
    descripcionCorta: 'La práctica de gratitud más simple y más poderosa para empezar el día en la frecuencia correcta.',
    categoria: 'General',
    categoriaEmoji: '🙏',
    area: 'Calma',
    duracionMin: 5,
    textContent:
      'La gratitud matutina no es optimismo forzado — es entrenamiento neurológico. Cuando buscas activamente lo bueno al inicio del día, estás literalmente recableando el filtro con que tu cerebro procesa todo lo que viene después.',
    audioDurationSec: 300,
    audioEstado: 'placeholder',
    premium: false,
    destacado: false,
    tags: ['gratitud', 'mañana', 'diario', 'práctica', 'neurológico'],
    introduccion: 'No vale "mi familia y mi salud" todos los días. La gratitud poderosa es específica: ¿qué pasó ayer exactamente que aprecias?',
    preguntasGuia: [
      '¿Qué 5 cosas específicas de ayer — grandes o pequeñas — puedo agradecer hoy?',
      '¿Qué persona me aportó algo ayer? ¿Qué fue exactamente?',
      '¿Qué de mi cuerpo, mi mente o mi espíritu funcionó bien ayer?',
      '¿Qué oportunidad tuve ayer que a veces doy por sentado?',
      '¿Qué me alegró aunque sea un momento?',
    ],
    accionDespues: 'Di gracias en voz alta por al menos una de las 5 cosas. Con palabras reales, no solo en tu cabeza.',
    victoriaClose: 'Lo que agradeces crece. Empieza el día buscando lo que ya tienes.',
  },

  {
    id: 'gra-002',
    tipo: 'gratitud',
    titulo: 'Gratitud por la abundancia que ya tengo',
    descripcionCorta: 'Una práctica específica de gratitud financiera para cambiar tu relación con el dinero que ya existe.',
    categoria: 'Dinero',
    categoriaEmoji: '💰',
    area: 'Dinero',
    duracionMin: 8,
    textContent:
      'La mente tiende a enfocarse en lo que falta. Este ejercicio activa deliberadamente el reconocimiento de la abundancia que ya existe — y eso cambia la frecuencia desde la que atraes más.',
    audioDurationSec: 480,
    audioEstado: 'placeholder',
    premium: false,
    destacado: false,
    tags: ['gratitud', 'dinero', 'abundancia', 'presente', 'reconocimiento'],
    introduccion: 'No esperes a tener más para agradecer el dinero. La gratitud por lo que ya tienes es lo que abre el camino a recibir más.',
    preguntasGuia: [
      '¿Qué cosas en tu vida fue posible gracias a que tienes dinero? (Incluye lo que das por sentado: internet, comida, techo)',
      '¿Qué ingreso recibiste este mes, por pequeño que sea?',
      '¿Qué puedo comprar hoy que hace 5 años no podía?',
      '¿Qué momento reciente de "me lo pude dar" puedo agradecer?',
    ],
    accionDespues: 'Cuando pagues algo hoy — lo que sea — di mentalmente: "Gracias por tener esto disponible."',
    victoriaClose: 'La abundancia no empieza cuando tienes más. Empieza cuando reconoces lo que ya tienes.',
  },

  {
    id: 'gra-003',
    tipo: 'gratitud',
    titulo: 'Gratitud por el amor que ya existe',
    descripcionCorta: 'Para reconocer y honrar el amor que ya hay en tu vida — romántico, familiar, de amistad o propio.',
    categoria: 'Amor',
    categoriaEmoji: '💗',
    area: 'Amor',
    duracionMin: 8,
    textContent:
      'A veces buscamos tanto el amor que aún no llegó que no vemos el que ya está. Este ejercicio redirige la atención hacia el amor que ya existe — y esa atención lo amplifica.',
    audioDurationSec: 0,
    audioEstado: 'none',
    premium: true,
    destacado: false,
    tags: ['gratitud', 'amor', 'relaciones', 'reconocimiento', 'presente'],
    introduccion: 'El amor no es solo romántico. Incluye amistades, familia, tu relación contigo misma, la calidez de desconocidos.',
    preguntasGuia: [
      '¿Quién te demostró amor esta semana, aunque fuera de forma pequeña?',
      '¿Qué acto de amor propio hiciste recientemente que merece ser reconocido?',
      '¿Qué relación en tu vida te hace mejor persona? ¿Qué es lo específico de esa relación que agradeces?',
      '¿En qué momento reciente te sentiste verdaderamente querida?',
    ],
    accionDespues: 'Dile a alguien que lo quieres hoy — de forma directa, sin ocasión especial.',
    victoriaClose: 'El amor que ya tienes merece la misma energía que el que buscas.',
  },

  {
    id: 'gra-004',
    tipo: 'gratitud',
    titulo: 'Gratitud por mi trabajo y mis talentos',
    descripcionCorta: 'Para honrar lo que haces, lo que sabes y los talentos que a veces das por sentado.',
    categoria: 'Trabajo',
    categoriaEmoji: '🚀',
    area: 'Trabajo',
    duracionMin: 8,
    textContent:
      'Es fácil ver lo que falta en el trabajo — el cliente que no llegó, el reconocimiento que no vino, el proyecto que se cayó. Esta práctica entrena al cerebro a ver lo que ya funciona.',
    audioDurationSec: 0,
    audioEstado: 'none',
    premium: true,
    destacado: false,
    tags: ['gratitud', 'trabajo', 'talentos', 'reconocimiento', 'habilidades'],
    introduccion: 'Esto incluye los talentos que no "cuentan" porque son naturales para ti. Especialmente esos.',
    preguntasGuia: [
      '¿Qué hice bien en mi trabajo esta semana? Nombra al menos 3 cosas, aunque sean pequeñas.',
      '¿Qué habilidad o talento usé esta semana que a veces doy por sentado?',
      '¿Qué logré profesionalmente en el último año que merece ser celebrado?',
      '¿Qué me gusta de mi trabajo, incluso en los días difíciles?',
    ],
    accionDespues: 'Anota un logro tuyo de los últimos 30 días. No lo minimices — escríbelo en grande.',
    victoriaClose: 'Tus talentos son reales aunque no los veas todos los días.',
  },

  {
    id: 'gra-005',
    tipo: 'gratitud',
    titulo: 'Gratitud por mi cuerpo',
    descripcionCorta: 'Una práctica para sanar la relación con el cuerpo a través del reconocimiento de todo lo que hace por ti.',
    categoria: 'Autoestima',
    categoriaEmoji: '🌸',
    area: 'Autoestima',
    duracionMin: 10,
    textContent:
      'La mayoría de las personas pasan más tiempo criticando su cuerpo que agradeciéndolo. Y sin embargo, ese cuerpo trabaja 24 horas al día para mantenerte viva. Esta práctica cambia la relación.',
    audioDurationSec: 0,
    audioEstado: 'none',
    premium: true,
    destacado: false,
    tags: ['gratitud', 'cuerpo', 'autoestima', 'imagen corporal', 'salud'],
    introduccion: 'No necesitas amar tu cuerpo para empezar — solo estar dispuesta a reconocer lo que hace.',
    preguntasGuia: [
      '¿Qué hizo tu cuerpo hoy que funciona y normalmente no notas? (respirar, ver, moverse, digerir…)',
      '¿Qué parte de tu cuerpo ha estado especialmente bien esta semana?',
      '¿En qué momento reciente tu cuerpo te dio placer, fuerza o alegría?',
      '¿Qué le agradecerías a tu cuerpo si lo trataras como a tu mejor amiga?',
    ],
    accionDespues: 'Haz algo que tu cuerpo disfrute hoy — no como compensación ni como castigo. Solo porque lo merece.',
    victoriaClose: 'Tu cuerpo te lleva a todos lados. Merece más gratitud de la que recibe.',
  },

  {
    id: 'gra-006',
    tipo: 'gratitud',
    titulo: 'Gratitud por mi hogar',
    descripcionCorta: 'Honra el espacio que te protege, te alberga y te permite descansar — aunque no sea perfecto.',
    categoria: 'Hogar',
    categoriaEmoji: '🏡',
    area: 'Hogar',
    duracionMin: 8,
    textContent:
      'El hogar perfecto no existe — pero el hogar que tienes existe y hace cosas concretas por ti todos los días. Esta práctica activa la gratitud por el refugio que ya tienes mientras construyes el que quieres.',
    audioDurationSec: 0,
    audioEstado: 'none',
    premium: true,
    destacado: false,
    tags: ['gratitud', 'hogar', 'refugio', 'espacio', 'reconocimiento'],
    introduccion: 'Camina por tu hogar mientras haces este ejercicio si puedes. El movimiento físico activa la gratitud encarnada.',
    preguntasGuia: [
      '¿Qué hace tu hogar por ti que das por sentado? (Protección, privacidad, calor, espacio para descansar…)',
      '¿Cuál es el rincón de tu hogar que más te gusta y por qué?',
      '¿Qué memoria buena tienes en este espacio?',
      '¿Qué mejoría — aunque sea pequeña — has hecho en tu hogar que merece reconocimiento?',
    ],
    accionDespues: 'Dile gracias a tu hogar en voz alta mientras entras hoy. Suena raro — eso es exactamente por qué funciona.',
    victoriaClose: 'El hogar que construyes empieza por honrar el que ya tienes.',
  },

  {
    id: 'gra-007',
    tipo: 'gratitud',
    titulo: 'Gratitud en los momentos difíciles',
    descripcionCorta: 'Una práctica avanzada de gratitud para cuando todo parece ir mal y necesitas un punto de anclaje.',
    categoria: 'Calma',
    categoriaEmoji: '🌿',
    area: 'Calma',
    duracionMin: 10,
    textContent:
      'La gratitud en los buenos momentos es fácil. La gratitud cuando todo está difícil es la práctica avanzada — y la más transformadora. No se trata de fingir que está bien, sino de encontrar lo que todavía está.',
    audioDurationSec: 0,
    audioEstado: 'none',
    premium: true,
    destacado: false,
    tags: ['gratitud', 'dificultad', 'resiliencia', 'anclaje', 'momentos difíciles'],
    introduccion:
      'Este ejercicio no niega el dolor — lo acompaña. Puede ser que lo primero que encuentres sea pequeño ("que hoy amaneció"). Eso cuenta.',
    preguntasGuia: [
      '¿Qué todavía está bien, aunque muchas cosas estén difíciles?',
      '¿Qué aprendiste o estás aprendiendo de esta situación difícil?',
      '¿Qué persona, aunque sea una, está contigo en esto?',
      '¿Qué capacidad tuya está siendo activada por esta dificultad?',
      '¿Cómo se verá este momento dentro de 5 años?',
    ],
    accionDespues: 'Escribe una cosa — solo una — que todavía está bien. Ponla donde la puedas ver.',
    victoriaClose: 'Encontrar gratitud en lo difícil no es ingenuidad. Es resistencia real.',
  },

  {
    id: 'gra-008',
    tipo: 'gratitud',
    titulo: 'Cierre de día con gratitud',
    descripcionCorta: 'Transforma la última emoción del día — en lugar de terminar en el scroll, termina en la paz.',
    categoria: 'General',
    categoriaEmoji: '🙏',
    area: 'Calma',
    duracionMin: 5,
    textContent:
      'La última emoción antes de dormir queda activa en el subconsciente durante las horas de sueño. Esta práctica asegura que sea gratitud — no ansiedad, no scroll, no preocupaciones.',
    audioDurationSec: 300,
    audioEstado: 'placeholder',
    premium: true,
    destacado: false,
    tags: ['gratitud', 'noche', 'cierre', 'diario', 'sueño'],
    introduccion: 'Hazlo en la cama, antes de cerrar los ojos. No necesitas papel — solo tres preguntas mentales.',
    preguntasGuia: [
      '¿Cuál fue el mejor momento de hoy — aunque haya sido pequeño?',
      '¿A quién agradezco hoy? ¿Por qué específicamente?',
      '¿Qué hice bien hoy que merece ser reconocido?',
    ],
    accionDespues: 'Cierra el teléfono después de este ejercicio. Deja que sea lo último del día.',
    victoriaClose: 'Un día que termina en gratitud siempre fue un buen día.',
  },

  // ── SCRIPTING GUIADO (7) ─────────────────────────────────────────────────
  {
    id: 'scr-001',
    tipo: 'scripting-guiado',
    titulo: 'Script del dinero — versión completa',
    descripcionCorta: 'Una guía de scripting estructurada para manifestar abundancia económica paso a paso.',
    categoria: 'Dinero',
    categoriaEmoji: '💰',
    area: 'Dinero',
    duracionMin: 15,
    textContent:
      'El scripting de dinero funciona porque le habla directamente al inconsciente en el idioma que entiende: imágenes, emociones y tiempo presente. Esta guía te lleva por tres fases: recibir, agradecer y expandir.',
    audioDurationSec: 300,
    audioEstado: 'placeholder',
    premium: false,
    destacado: false,
    tags: ['scripting', 'dinero', 'guiado', 'escritura'],
    introduccion:
      'Antes de empezar: ten papel y bolígrafo (no el teléfono). Escribe a mano — el cerebro procesa diferente cuando escribes físicamente. Pon música instrumental si ayuda. No te preocupes por la ortografía.',
    pasos: [
      'FASE 1 — RECIBIR: Escribe "Hoy recibí [cantidad concreta] de [fuente inesperada]." Sé específica con la cantidad. Escribe como si ya pasó.',
      'FASE 2 — DESCRIBIR: ¿Cómo te enteraste? ¿Qué hiciste primero? ¿Cómo se sintió en tu cuerpo? Escribe al menos 3 párrafos.',
      'FASE 3 — AGRADECER: "Gracias, universo, porque este dinero llegó cuando lo necesitaba. Gracias porque confié. Gracias porque recibo."',
      'FASE 4 — EXPANDIR: ¿Qué harás con ese dinero? Escribe los primeros tres usos — uno que cubra una necesidad, uno que sea un placer, uno que ayude a alguien más.',
    ],
    accionDespues: 'Guarda lo que escribiste. Léelo de nuevo antes de dormir esta noche.',
    victoriaClose: 'Lo que escribiste hoy ya está sembrado. El dinero sabe el camino.',
  },

  {
    id: 'scr-002',
    tipo: 'scripting-guiado',
    titulo: 'Script del amor — abriendo el corazón',
    descripcionCorta: 'Escribe sobre el amor que quieres recibir como si ya fuera tu realidad hoy.',
    categoria: 'Amor',
    categoriaEmoji: '💗',
    area: 'Amor',
    duracionMin: 12,
    textContent:
      'El scripting de amor funciona mejor cuando describes CÓMO TE SIENTES en la relación, no cómo se ve la otra persona. El universo trabaja con emociones, no con características físicas.',
    audioDurationSec: 240,
    audioEstado: 'placeholder',
    premium: false,
    destacado: false,
    tags: ['scripting', 'amor', 'relaciones', 'escritura'],
    introduccion:
      'Esta guía te lleva por cuatro dimensiones del amor: cómo te sientes contigo misma en esa relación, cómo es la conexión, qué comparten y cómo llega un día ordinario juntas.',
    pasos: [
      'YO: "En esta relación, me siento..." — Describe cómo te sientes contigo misma. ¿Más segura? ¿Más libre? ¿Más tú?',
      'NOSOTROS: "Lo que más me gusta de nuestra conexión es..." — Describe la energía entre ustedes. No lo que hacen — cómo se SIENTEN juntas.',
      'EL DÍA: Describe un martes ordinario juntas. No un viaje o una cena especial — un día normal. ¿Qué pasa en ese día?',
      'GRATITUD: "Gracias por este amor. Gracias porque lo merecía. Gracias porque estaba disponible para mí."',
    ],
    accionDespues: 'Lee lo que escribiste y subraya la parte que te haya movido más. Eso es lo que más necesitas atraer.',
    victoriaClose: 'El amor que describiste es real. Ya lo conoces porque ya lo sientes.',
  },

  {
    id: 'scr-003',
    tipo: 'scripting-guiado',
    titulo: 'Script del trabajo soñado',
    descripcionCorta: 'Escribe en pasado sobre el día en que ya conseguiste el trabajo o proyecto que más deseas.',
    categoria: 'Trabajo',
    categoriaEmoji: '🚀',
    area: 'Trabajo',
    duracionMin: 15,
    textContent:
      'El scripting de trabajo funciona mejor cuando describes la experiencia de adentro — cómo te sientes haciendo ese trabajo — no solo las condiciones externas (salario, empresa, título).',
    audioDurationSec: 0,
    audioEstado: 'none',
    premium: true,
    destacado: false,
    tags: ['scripting', 'trabajo', 'carrera', 'escritura', 'manifestación'],
    introduccion:
      'Escribe en tiempo pasado, como si ya ocurrió: "Hoy fue mi primer día en..." o "Acabo de recibir la noticia de que..." El pasado le habla directamente al inconsciente.',
    pasos: [
      'EL MOMENTO: Describe el momento exacto en que recibiste la noticia o iniciaste el trabajo. ¿Dónde estabas? ¿Qué pasó primero?',
      'EL DÍA: Describe cómo fue el primer día completo. Qué hiciste, con quién hablaste, cómo te sentiste.',
      'EL CUERPO: ¿Cómo se sentía tu cuerpo en ese trabajo? ¿Energía? ¿Orgullo? ¿Propósito?',
      'LA COMPENSACIÓN: Escribe específicamente cuánto ganas. No uses rangos vagos — usa una cifra.',
      'GRATITUD: "Gracias por este trabajo. Gracias porque mis talentos son valorados. Gracias porque lo merecía."',
    ],
    accionDespues: 'Envía hoy una aplicación, mensaje o propuesta que te acerque a ese trabajo — aunque no esté "perfecta".',
    victoriaClose: 'El trabajo que describiste existe. Solo falta que sigas caminando hacia él.',
  },

  {
    id: 'scr-004',
    tipo: 'scripting-guiado',
    titulo: 'Script de la mejor versión de mí',
    descripcionCorta: 'Escribe en primera persona un día ordinario de la vida de la versión más plena de ti misma.',
    categoria: 'Autoestima',
    categoriaEmoji: '🌸',
    area: 'Autoestima',
    duracionMin: 20,
    textContent:
      'Este scripting trabaja la identidad, no las metas. No es sobre lo que tienes — es sobre quién eres. La mejor versión de ti no es perfecta: es auténtica, equilibrada y en paz consigo misma.',
    audioDurationSec: 0,
    audioEstado: 'none',
    premium: true,
    destacado: false,
    tags: ['scripting', 'autoestima', 'identidad', 'versión futura', 'escritura'],
    introduccion:
      'Escribe en presente o pasado inmediato, como si fuera el diario de esa versión de ti. No el diario de lo que logró — el diario de cómo se siente siendo quien es.',
    pasos: [
      'MAÑANA: Describe cómo empieza el día esa versión de ti. ¿Cuál es su primera acción? ¿Su primer pensamiento?',
      'RELACIÓN CONSIGO MISMA: ¿Cómo se habla? ¿Qué no hace que tú haces ahora (compararse, disculparse por existir)?',
      'RELACIONES: ¿Cómo se relaciona con las personas que quiere? ¿Cuánto espacio ocupa?',
      'CUERPO: ¿Cómo cuida su cuerpo? No con disciplina rígida — con amor real.',
      'CIERRE DEL DÍA: ¿Cómo termina su día esa versión de ti? ¿Con qué emoción se duerme?',
    ],
    accionDespues: 'Adopta UN hábito de esa versión de ti hoy. Solo uno — el más pequeño posible.',
    victoriaClose: 'Esa versión tuya que escribiste no está lejos. Está en las decisiones de hoy.',
  },

  {
    id: 'scr-005',
    tipo: 'scripting-guiado',
    titulo: 'Script del hogar ideal',
    descripcionCorta: 'Describe en detalle sensorial el hogar en el que ya vives en tu mejor versión de vida.',
    categoria: 'Hogar',
    categoriaEmoji: '🏡',
    area: 'Hogar',
    duracionMin: 15,
    textContent:
      'El scripting del hogar funciona mejor cuando usas los cinco sentidos — lo que ves, lo que hueles, lo que tocas, lo que escuchas, lo que saboreas. El cerebro no distingue entre experiencia real e imaginada cuando la emoción es genuina.',
    audioDurationSec: 0,
    audioEstado: 'none',
    premium: true,
    destacado: false,
    tags: ['scripting', 'hogar', 'espacio', 'escritura', 'manifestación'],
    introduccion:
      'No limites por presupuesto ahora. Escribe lo que realmente quieres, y confía en que el cómo llegará después de que el qué esté claro.',
    pasos: [
      'LA ENTRADA: Describe cómo se siente entrar a ese hogar. ¿Qué ves primero? ¿Qué hueles?',
      'LOS ESPACIOS: Describe uno a uno los espacios que más importan. ¿La cocina? ¿El cuarto? ¿El lugar favorito?',
      'LA VIDA: ¿Qué tipo de vida sucede en ese hogar? ¿Hay personas? ¿Hay rutinas? ¿Hay momentos especiales?',
      'LA SENSACIÓN: En una frase, ¿cómo se SIENTE ese hogar? ¿Qué emoción te da cuando llegas?',
      'GRATITUD: "Gracias por este hogar. Gracias porque aquí soy yo misma. Gracias porque este espacio me nutre."',
    ],
    accionDespues: 'Agrega hoy un elemento de ese hogar ideal a tu espacio actual — aunque sea simbólico.',
    victoriaClose: 'El hogar que escribiste ya vive en ti. Solo está esperando el espacio físico.',
  },

  {
    id: 'scr-006',
    tipo: 'scripting-guiado',
    titulo: 'Script del año nuevo personal',
    descripcionCorta: 'Escribe, al final de un ciclo, todo lo que vas a crear en el siguiente — como si ya ocurrió.',
    categoria: 'Nuevos Comienzos',
    categoriaEmoji: '🌱',
    area: 'Nuevos Comienzos',
    duracionMin: 20,
    textContent:
      'Este scripting funciona como un ancla de intención para el año — o el ciclo — que estás iniciando. Es más poderoso que una lista de metas porque trabaja con la emoción de haber llegado.',
    audioDurationSec: 0,
    audioEstado: 'none',
    premium: true,
    destacado: false,
    tags: ['scripting', 'año nuevo', 'intención', 'ciclo', 'manifestación'],
    introduccion:
      'Escríbelo desde el final del año: es diciembre y miras atrás. ¿Qué pasó? ¿Cómo fue? ¿Quién te convertiste?',
    pasos: [
      'EL AÑO EN TRES PALABRAS: ¿Cuáles son las tres palabras que mejor describen el año que acaba de pasar (el que estás manifestando)?',
      'EL LOGRO MÁS IMPORTANTE: ¿Qué es lo más significativo que lograste o experimentaste?',
      'LA PERSONA QUE FUISTE: ¿En qué eres diferente a quien eras al inicio del año?',
      'LO INESPERADO: ¿Qué bueno llegó que no esperabas?',
      'GRATITUD TOTAL: "Gracias por este año. Por lo que llegó y por lo que se fue. Por quien me convertí."',
    ],
    accionDespues: 'Imprime o guarda este scripting. Ábrelo en diciembre de ese año.',
    victoriaClose: 'Lo que escribiste hoy ya está plantado en el campo. El año lo va a expresar.',
  },

  {
    id: 'scr-007',
    tipo: 'scripting-guiado',
    titulo: 'Mi vida en 5 años',
    descripcionCorta: 'El scripting más expansivo del catálogo — para quienes se atreven a imaginar sin límites.',
    categoria: 'General',
    categoriaEmoji: '✨',
    duracionMin: 25,
    textContent:
      'Cinco años es un horizonte donde todo puede cambiar. Este scripting está diseñado para las que están dispuestas a imaginar más allá de lo que ahora parece "realista".',
    audioDurationSec: 0,
    audioEstado: 'none',
    premium: true,
    destacado: false,
    tags: ['scripting', 'visión', '5 años', 'expansión', 'manifestación'],
    introduccion:
      'Regla: nada de filtros. La autocensura es el mayor bloqueador del scripting. Si la mente dice "eso no es posible", escribe exactamente eso. Después sigue.',
    pasos: [
      'DÓNDE VIVES: Describe tu hogar, tu ciudad, tu entorno. ¿Con quién? ¿Cómo es un martes ordinario?',
      'TU TRABAJO: ¿Qué haces? ¿Para quién? ¿Cuánto ganas? ¿Qué impacto tiene?',
      'TUS RELACIONES: ¿Con quién estás? ¿Cómo son tus amistades, tu familia, tu pareja?',
      'TU CUERPO Y TU SALUD: ¿Cómo te sientes físicamente? ¿Cómo te cuidas?',
      'TU VERSIÓN: ¿Quién eres en 5 años que no eres todavía? ¿Qué dejaste atrás? ¿Qué construiste?',
      'GRATITUD: "Gracias por los 5 años que construí. Por cada elección que me trajo aquí."',
    ],
    accionDespues: 'Guarda este scripting y léelo dentro de 6 meses. Te sorprenderá lo que ya está pasando.',
    victoriaClose: 'Lo que imaginas hoy con emoción real se convierte en la dirección que toman tus decisiones.',
  },

  // ── AUTOESTIMA (5) ────────────────────────────────────────────────────────
  {
    id: 'aut-001',
    tipo: 'autoestima',
    titulo: 'Los logros que me sorprenden',
    descripcionCorta: 'Un ejercicio de reconocimiento honesto de todo lo que has construido y que a veces no ves.',
    categoria: 'Autoestima',
    categoriaEmoji: '🌸',
    area: 'Autoestima',
    duracionMin: 15,
    textContent:
      'El síndrome del impostor vive de la amnesia de tus logros. Este ejercicio activa el antídoto: el inventario honesto de lo que has construido, sobrevivido y logrado.',
    audioDurationSec: 0,
    audioEstado: 'none',
    premium: false,
    destacado: true,
    tags: ['autoestima', 'logros', 'reconocimiento', 'impostor', 'inventario'],
    introduccion:
      'No filtre por tamaño. Un logro no tiene que ser impresionante para otros — tiene que haber costado algo para ti.',
    preguntasGuia: [
      '¿Cuáles son los 5 logros de los que más te enorgulleces en los últimos 3 años? (Personales, profesionales, cualquier tipo)',
      '¿Qué situación difícil superaste que en su momento creíste que no podrías?',
      '¿Qué has aprendido en los últimos 2 años que hace 5 años no sabías?',
      '¿Qué has construido — una relación, un hábito, un proyecto, una versión de ti — que merece ser celebrado?',
      '¿Qué te diría alguien que te conoce bien sobre tus logros que tú no ves?',
    ],
    accionDespues: 'Comparte uno de tus logros con alguien hoy — sin minimizarlo. Solo cuéntalo.',
    victoriaClose: 'Todo lo que eres hoy es resultado de todo lo que ya superaste. Eso importa.',
  },

  {
    id: 'aut-002',
    tipo: 'autoestima',
    titulo: 'Límites desde el amor propio',
    descripcionCorta: 'Aprende a poner límites sin culpa y desde el amor — a ti misma y a las demás personas.',
    categoria: 'Autoestima',
    categoriaEmoji: '🌸',
    area: 'Autoestima',
    duracionMin: 20,
    textContent:
      'Un límite no es un muro — es una definición de cómo quieres ser tratada. No se pone desde el enojo: se pone desde la claridad de lo que necesitas para estar bien. Este ejercicio ayuda a identificarlos y practicar comunicarlos.',
    audioDurationSec: 0,
    audioEstado: 'none',
    premium: true,
    destacado: false,
    tags: ['autoestima', 'límites', 'amor propio', 'comunicación', 'bienestar'],
    introduccion:
      'Antes de definir límites con otros, necesitas definirlos contigo misma. ¿Qué sí puedes sostener? ¿Qué ya no?',
    preguntasGuia: [
      '¿En qué áreas de tu vida sientes que das más de lo que puedes sostener?',
      '¿Qué situaciones o personas te dejan constantemente sin energía?',
      '¿Qué límite llevas tiempo necesitando poner pero no te has atrevido? ¿Por qué?',
      '¿Qué le dirías a alguien que quieres sobre ese límite, en una frase simple y directa?',
      '¿Qué necesitas de ti misma para respetar tus propios límites cuando hay presión?',
    ],
    accionDespues: 'Pon hoy el límite más pequeño de la lista. No el más grande — el más pequeño para empezar.',
    victoriaClose: 'Poner límites no te hace difícil. Te hace honesta contigo misma y con los demás.',
  },

  {
    id: 'aut-003',
    tipo: 'autoestima',
    titulo: 'Mi cuerpo es sagrado',
    descripcionCorta: 'Una práctica de reconciliación y amor hacia el cuerpo que vives — tal como está hoy.',
    categoria: 'Autoestima',
    categoriaEmoji: '🌸',
    area: 'Autoestima',
    duracionMin: 15,
    textContent:
      'Vivimos en cuerpos que criticamos constantemente — y ese ruido interno drena una energía que podría usarse para crear, amar y vivir. Esta práctica no pide que ames cada parte — pide que empieces con respeto.',
    audioDurationSec: 0,
    audioEstado: 'none',
    premium: true,
    destacado: false,
    tags: ['autoestima', 'cuerpo', 'imagen corporal', 'respeto', 'sagrado'],
    introduccion:
      'Este ejercicio puede hacerse con los ojos abiertos frente a un espejo o con los ojos cerrados. Elige lo que se sienta más accesible hoy.',
    preguntasGuia: [
      '¿Cuál es la parte de tu cuerpo que más criticas? ¿Qué hace esa parte que nunca le agradeces?',
      '¿En qué momentos tu cuerpo te ha dado placer, fuerza o capacidad que das por sentado?',
      '¿Qué le dirías a tu cuerpo si lo trataras como tratas a alguien que amas?',
      '¿Qué pequeño gesto de amor hacia tu cuerpo podrías hacer hoy que no sea "merecerlo" sino simplemente darlo?',
    ],
    accionDespues: 'Haz algo que tu cuerpo disfrute hoy — no para mejorarlo. Solo porque merece placer.',
    victoriaClose: 'Tu cuerpo es tu compañero de vida. Vale la pena llevarse bien con él.',
  },

  {
    id: 'aut-004',
    tipo: 'autoestima',
    titulo: 'La voz crítica interna',
    descripcionCorta: 'Identifica, entiende y transforma el crítico interno que sabotea tu autoestima.',
    categoria: 'Autoestima',
    categoriaEmoji: '🌸',
    area: 'Autoestima',
    duracionMin: 20,
    textContent:
      'El crítico interno no es el enemigo — es una parte de ti que aprendió que criticarte primero la protegía del rechazo externo. Entenderlo es el primer paso para transformarlo.',
    audioDurationSec: 0,
    audioEstado: 'none',
    premium: true,
    destacado: false,
    tags: ['autoestima', 'crítico interno', 'autocrítica', 'transformación', 'psicología'],
    introduccion:
      'Escribe sin editar. La voz crítica es más honesta cuando no la filtras. Después vendrá la transformación.',
    preguntasGuia: [
      '¿Qué dice tu voz crítica con más frecuencia? Escribe las frases exactas — las más comunes.',
      '¿A quién le suena esa voz? ¿De dónde crees que viene?',
      '¿Qué está intentando protegerte esa voz? (Hay una intención positiva detrás, aunque su método no funcione)',
      '¿Qué le dirías a esa voz si fuera una persona que amas pero que te está haciendo daño?',
      '¿Cuál sería la versión compasiva de esa crítica? (El mismo mensaje, desde el amor en lugar del miedo)',
    ],
    accionDespues: 'La próxima vez que escuches al crítico interno, nómbralo: "Ahí está mi crítico. Gracias por querer protegerme. No lo necesito ahora."',
    victoriaClose: 'Conocer al crítico interno es quitarle poder. Ahora ya sabes de dónde viene.',
  },

  {
    id: 'aut-005',
    tipo: 'autoestima',
    titulo: 'Quién soy cuando nadie me ve',
    descripcionCorta: 'Explora tu identidad más auténtica — la que existe independientemente de la validación externa.',
    categoria: 'Autoestima',
    categoriaEmoji: '🌸',
    area: 'Autoestima',
    duracionMin: 20,
    textContent:
      'La autoestima real no depende de la mirada externa — viene de la relación contigo misma cuando nadie está mirando. Este ejercicio explora quién eres en ese espacio.',
    audioDurationSec: 0,
    audioEstado: 'none',
    premium: true,
    destacado: false,
    tags: ['autoestima', 'identidad auténtica', 'validación', 'quién soy', 'interno'],
    introduccion:
      'Imagina que nadie va a leer esto. Escribe desde ahí.',
    preguntasGuia: [
      '¿Qué haces, piensas o sientes cuando estás completamente sola y sin presión de nadie?',
      '¿Qué versión de ti aparece cuando no tienes que complacer, impresionar ni proteger a nadie?',
      '¿Qué valoras de verdad — no lo que "debería" valorar, sino lo que realmente valoras?',
      '¿Qué partes de ti escondes en público que son algunas de tus partes más genuinas?',
      '¿Qué necesita esa versión más auténtica tuya que todavía no le estás dando?',
    ],
    accionDespues: 'Dale a esa versión auténtica de ti un espacio hoy — aunque sea 20 minutos sin audiencia.',
    victoriaClose: 'La persona que eres cuando nadie te ve es la más real de todas. Esa merece tu amor primero.',
  },
];

// ── Acceso rápido ─────────────────────────────────────────────────────────
export function getByTipo(tipo: TipoContenido): ContenidoBiblioteca[] {
  return CATALOGO.filter((c) => c.tipo === tipo);
}

export function getByCategoria(categoria: CategoriaContenido): ContenidoBiblioteca[] {
  return CATALOGO.filter((c) => c.categoria === categoria);
}

export function getByArea(area: AreaVida): ContenidoBiblioteca[] {
  return CATALOGO.filter((c) => c.area === area);
}

export function getById(id: string): ContenidoBiblioteca | undefined {
  return CATALOGO.find((c) => c.id === id);
}

export function getDestacados(): ContenidoBiblioteca[] {
  return CATALOGO.filter((c) => c.destacado);
}

// Rota el destacado del día según el día del año — nunca muestra siempre el mismo
export function getDestacadoDelDia(): ContenidoBiblioteca {
  const destacados = getDestacados();
  if (destacados.length === 0) return CATALOGO[0];
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000
  );
  return destacados[dayOfYear % destacados.length];
}

export function buscar(q: string): ContenidoBiblioteca[] {
  const term = q.toLowerCase().trim();
  if (!term) return CATALOGO;
  return CATALOGO.filter(
    (c) =>
      c.titulo.toLowerCase().includes(term) ||
      c.descripcionCorta.toLowerCase().includes(term) ||
      c.categoria.toLowerCase().includes(term) ||
      (c.area ?? '').toLowerCase().includes(term) ||
      c.tags.some((t) => t.includes(term)) ||
      c.tipo.includes(term)
  );
}

// Sugerencias editoriales para un tema libre (usado por la capa de IA)
export function getSugerenciasPorTema(tema: string, limite = 4): ContenidoBiblioteca[] {
  const term = tema.toLowerCase().trim();
  if (!term) return CATALOGO.filter((c) => c.destacado).slice(0, limite);
  const scored = CATALOGO.map((c) => {
    let score = 0;
    if (c.titulo.toLowerCase().includes(term)) score += 3;
    if (c.descripcionCorta.toLowerCase().includes(term)) score += 2;
    if (c.tags.some((t) => t.includes(term))) score += 2;
    if ((c.area ?? '').toLowerCase().includes(term)) score += 1;
    if (c.categoria.toLowerCase().includes(term)) score += 1;
    return { c, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limite)
    .map((s) => s.c);
}

// Labels de display para tipos
export const TIPO_LABEL: Record<TipoContenido, string> = {
  ritual: 'Ritual',
  afirmacion: 'Afirmación',
  decreto: 'Decreto',
  visualizacion: 'Visualización',
  'scripting-guiado': 'Scripting',
  senal: 'Señal',
  journaling: 'Journaling',
  gratitud: 'Gratitud',
  autoestima: 'Autoestima',
};

export const TIPO_EMOJI: Record<TipoContenido, string> = {
  ritual: '🕯️',
  afirmacion: '✨',
  decreto: '📜',
  visualizacion: '🌅',
  'scripting-guiado': '📝',
  senal: '🔢',
  journaling: '📓',
  gratitud: '🙏',
  autoestima: '🌸',
};
