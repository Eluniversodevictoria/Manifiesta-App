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
      'Buenos días. Soy Victoria, y estoy aquí contigo en este momento quieto, antes de que el día empiece a pedirte cosas.\n\nEste ritual trabaja el campo energético de la abundancia desde las primeras horas del día, cuando la mente todavía está receptiva y los filtros del ego están bajos. No necesitas creer en todo para que funcione. Solo abrirte. Solo estar presente. Eso es suficiente.\n\nVamos a empezar.\n\nSiéntate en un lugar cómodo. Si puedes, con los pies en el suelo. Pon la mano sobre tu corazón, ahí mismo, en el centro del pecho. Siente el calor de tu propia mano.\n\nAhora respira. Profundo, lento. Inhala... y exhala. De nuevo. Inhala... y exhala. Una vez más. Inhala... y suelta todo.\n\nBien.\n\nTienes un vaso de agua cerca. Tómalo. Bebe un sorbo lento, como si fuera el primer regalo que el día te da. El agua que llega a tu cuerpo en este momento es abundancia. Sencilla, real, tuya.\n\nAhora quiero que digas en voz alta —sí, en voz alta, aunque sea en susurro—: "Hoy estoy abierta a recibir dinero de formas inesperadas y maravillosas."\n\nDilo de nuevo. Esta vez con un poco más de convicción. No como un deseo distante — como una declaración.\n\nBien. Ahora cierra los ojos.\n\nEn tu mente, imagina una cifra de dinero. La primera que llegue. No la censures, no la juzgues por pequeña o por grande — solo déjala aparecer. Mantenla ahí, en tu mente, y siente cómo se siente recibirla. ¿Hay alivio? ¿Hay alegría? ¿Hay un suspiro de paz?\n\nQuédate con esa sensación un momento.\n\nAhora, si tienes tu cuaderno a mano, escribe esta frase exacta — o dila en voz alta si no tienes dónde escribir: "Gracias por esa cifra. Ya la recibí." En pasado. Como si ya pasó. El universo recibe las instrucciones en tiempo presente y pasado, no en futuro.\n\nYa casi terminamos. Solo necesito que repitas conmigo, tres veces:\n\n"Confío. Recibo. Soy próspera."\n"Confío. Recibo. Soy próspera."\n"Confío. Recibo. Soy próspera."\n\nPerfecto.\n\nHoy, cuando algo llegue a ti — un café que alguien te invita, un elogio que no esperabas, una oportunidad que aparece de la nada — detente un segundo antes de responder y di mentalmente: "Gracias." Esa práctica de recepción consciente es parte del ritual.\n\nBien hecho. Empezaste el día desde la gratitud y desde la apertura. Eso lo cambia todo.',
    audioDurationSec: 620,
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
      'Bienvenida a este ritual de luna nueva. Soy Victoria, y estoy aquí para acompañarte en uno de los momentos más poderosos del ciclo lunar.\n\nLa luna nueva es el lienzo en blanco del mes. Es el momento más oscuro del cielo — y paradójicamente, el más lleno de posibilidades. Es el momento para plantar semillas: deseos, intenciones, decisiones que quieres ver crecer en los próximos 28 días.\n\nAntes de empezar, tómate un momento para llegar aquí de verdad. Si encendiste una vela, obsérvala. Siente la quietud que hay en este espacio. Respira tres veces, lento. Deja que el día se quede afuera.\n\nTienes papel frente a ti. Quiero que escribas tres deseos. No una lista de tareas, no metas de productividad — deseos reales, de esos que viven en lo profundo y que a veces no te atreves a decir en voz alta. Escríbelos sin filtrar. El papel no te juzga. La luna no te juzga. Yo no te juzgo.\n\nEscríbelos ahora. Tómate el tiempo que necesites.\n\nCuando estés lista, quiero que leas cada uno en voz alta, en tiempo presente, como si ya fuera real. Por ejemplo: si escribiste "quiero más dinero", lo lees así: "Tengo abundancia económica que me permite vivir con paz. Gracias."\n\nDi cada deseo en voz alta, como verdad. No como pedido — como reconocimiento de algo que ya viene.\n\nAhora dobla el papel. Con cuidado, como si guardara algo precioso — porque lo guarda. Ponlo en un lugar especial: una cajita, tu agenda, tu libro favorito. No lo leas hasta la luna llena, en 14 días.\n\nSiéntate en silencio cinco minutos más. No hagas nada. Solo respira y confía. Deja que la luna haga su trabajo.\n\nCuando sientas que estás lista, antes de levantarte, di en voz alta: "Planto estas semillas con fe. El universo ya está trabajando en mi favor."\n\nLa luna ya recibió tus intenciones. Ahora confía y actúa — porque las intenciones sin acción son solo sueños, y las acciones con intención son magia.',
    audioDurationSec: 1260,
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
      'Hola. Soy Victoria. Viniste aquí porque hay algo que pesa. Algo que llevas demasiado tiempo cargando. Y hoy vamos a soltarlo.\n\nSoltar no es rendirse — es elegir. Es reconocer, con todo el amor que puedes tener por ti misma, que hay algo que ya no pertenece a quien eres ahora. Y ese reconocimiento crea espacio. Espacio para lo que viene.\n\nAntes de escribir, cierra los ojos. Pon una mano en el centro del pecho. Respira profundo. Y pregúntate en silencio: ¿qué es lo que más pesa hoy? No lo pienses demasiado. Deja que llegue solo.\n\nAhora escríbelo. Sin filtrar, sin editar, sin juzgarte. Puede ser una persona. Un trabajo. Una creencia que heredaste y que nunca fue tuya. Un sueño que se rompió. Una versión de ti que ya superaste pero a la que todavía te aferras. Escribe todo lo que necesites escribir. El papel aguanta.\n\nCuando termines, lee lo que escribiste en voz alta. No como condena — como testigo compasivo de tu propia experiencia. Léelo despacio.\n\nAhora, para cada cosa que escribiste, di en voz alta: "[lo que escribiste], te agradezco lo que me enseñaste. Hoy elijo soltarte con amor."\n\nYa lo dijiste. Ahora el gesto físico. Rompe el papel. Lento, conscientemente, en pedazos cada vez más pequeños. Mientras lo haces, imagina que cada pedazo se lleva un poco de lo que ya no te sirve. No con violencia — con intención.\n\nRespira profundo cuando termines. Siente el espacio que se acaba de crear en tu pecho. En tu mente. En tu vida.\n\nEse espacio es real. Y lo que lo llena ahora es posibilidad.\n\nAcabas de crear espacio. Lo nuevo ya puede entrar.',
    audioDurationSec: 920,
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
      'Hola, aquí soy Victoria. Vine a acompañarte en este ritual para el corazón.\n\nEl corazón se cierra para protegerse — y eso es inteligente, no es malo. Después de una decepción, después de una pérdida, después de dar demasiado sin recibir suficiente, el corazón aprende a guardarse. Pero a veces ese mecanismo de protección se queda encendido demasiado tiempo, y entonces no entra ni el dolor ni el amor.\n\nEste ritual no fuerza la apertura. La invita. Trabajamos con el cuerpo primero, porque el corazón siente antes de que la mente entienda.\n\nSiéntate con la espalda recta. Pon las dos manos sobre el centro de tu pecho. Siente el calor — el calor de tus propias manos, que también es el calor del corazón que late debajo.\n\nRespira lento. Inhala cuatro tiempos: uno, dos, tres, cuatro. Retén el aire dos tiempos. Exhala seis tiempos, lento: uno, dos, tres, cuatro, cinco, seis. Hazlo cinco veces, sin prisa. Te guío: inhala, dos, tres, cuatro. Retén, dos. Exhala, dos, tres, cuatro, cinco, seis.\n\nOtra vez. Inhala, dos, tres, cuatro. Retén, dos. Exhala, dos, tres, cuatro, cinco, seis.\n\nBien. Sigue respirando suave.\n\nAhora, con los ojos cerrados, piensa en una persona o en un momento de tu vida que te hizo sentir completamente amada. No lo busques con la mente — deja que llegue solo. Puede ser reciente o antiguo. Una persona, una escena, una sensación.\n\nCuando llegue, quédate con eso. Siente cómo esa memoria se asienta en el pecho, bajo tus manos.\n\nDi en voz baja, con suavidad: "Gracias por ese amor. Ya sé cómo se siente. Estoy abierta a recibirlo de nuevo."\n\nAhora abre los brazos hacia los lados. Como si estuvieras abriendo puertas. El pecho disponible, los hombros atrás, el corazón expuesto. Mantén esa postura treinta segundos, respirando. Siente la vulnerabilidad de esa apertura — y siente también que estás bien dentro de ella.\n\nCierra con estas palabras, dícelas en voz alta: "Mi corazón está disponible. No cerrado — abierto, con sabiduría."\n\nEso que sientes ahora en el pecho es tu corazón recordando que sabe amar.',
    audioDurationSec: 740,
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
      'Buenos días. Soy Victoria, y estoy aquí contigo antes de que empieces la semana.\n\nLa mayoría de las semanas comienzan en modo reacción: el teléfono suena, llega el primer correo, aparece lo urgente, y de repente el lunes ya te está dirigiendo a ti en lugar de que tú lo dirijas a él. Este ritual cambia eso. Pone tu intención primero.\n\nY eso, lo que parece pequeño, cambia el tono de todo lo que viene después.\n\nSiéntate. Respira. No planifiques todavía — solo respira dos minutos. Si la mente quiere adelantarse a las tareas de la semana, dile suavemente: "Ya. Primero esto."\n\nCuando sientas que estás más presente, hazte esta pregunta: ¿cuál es la cosa más importante que quiero lograr esta semana? No una lista. Una cosa. La que más importa. La que, si solo hicieras esa, te sentirías satisfecha.\n\nEscríbela o dila en voz alta. Una sola cosa.\n\nAhora la segunda pregunta: ¿qué persona quiero ser en el trabajo esta semana? No qué quieres lograr — quién quieres ser. Una cualidad. ¿Paciente? ¿Creativa? ¿Valiente? ¿Presente? Elige una.\n\nY la última: ¿hay algo de la semana pasada que quieras dejar atrás antes de empezar esta? Un peso, un malentendido, una frustración. Solo reconócelo y di: "Lo dejo en la semana pasada. Esta semana es nueva."\n\nAhora cierra con estas palabras en voz alta, como declaración: "Esta semana trabajo con intención, no con urgencia. Lo importante primero."\n\nBien. Ya tienes tu dirección. Una semana con intención clara vale más que tres semanas en modo apagafuegos.',
    audioDurationSec: 500,
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
      'Hola. Soy Victoria. Estás frente al espejo. Esto va a ser incómodo — y eso está bien.\n\nLouise Hay popularizó este ritual por algo. Mirar a los propios ojos y decir "te amo" toca el núcleo de la relación que tienes contigo misma. Y si hay incomodidad — si hay ganas de reírte, de apartar la mirada, de sentirte tonta — esa incomodidad es exactamente la señal de que estás tocando algo real.\n\nAsí que vamos.\n\nPárate frente al espejo. Levanta la mirada. Búscate los ojos — no el cabello, no la piel, no lo que no te gusta hoy. Tus ojos. Quédate ahí.\n\nRespira. Y di, en voz alta, mirándote: "Te amo. Eres suficiente. Estoy orgullosa de ti."\n\nSi sentiste resistencia, bien. Si sentiste que era mentira, bien. Sigue de todas formas. Repítelo: "Te amo. Eres suficiente. Estoy orgullosa de ti."\n\nAhora agrega algo específico. Piensa en algo real de ti — no tiene que ser físico, puede ser tu forma de amar, tu tenacidad, tu sentido del humor, tu honestidad. Y dilo: "Hoy me gusta mi [lo que elegiste]."\n\nY termina con esto, mirándote directo: "Cuento contigo. Eres mi persona favorita."\n\nQuédate un momento más frente al espejo. Sin hacer nada. Solo estando contigo.\n\nLo más valiente que puedes hacer es mirarte y quedarte.',
    audioDurationSec: 310,
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
      'Hola. Soy Victoria, y hoy vamos a limpiar el espacio donde vives — no con escoba, sino con intención.\n\nTu espacio físico refleja y afecta tu estado interno. Un hogar con energía estancada — de discusiones, de preocupaciones, de momentos difíciles — puede mantenerte en esa frecuencia sin que te des cuenta. La buena noticia es que puedes cambiarlo hoy, y no necesitas nada costoso para hacerlo.\n\nAntes de empezar, quiero que te tomes un momento. Para en el centro de tu hogar — en el lugar donde más tiempo pasas. Pon las manos a los lados del cuerpo, abre los dedos. Respira profundo tres veces. Y con cada exhalación, imagina que sueltas cualquier carga que el espacio haya acumulado. No con esfuerzo — solo con intención.\n\nEste ritual trabaja en tres niveles: el físico, el simbólico y el energético. El físico lo haces tú con tus manos. El simbólico lo hacemos juntas con las palabras. El energético lo activa la combinación de los dos.\n\nNo tienes que creer que funciona al cien por ciento para que funcione. Solo tienes que hacerlo con presencia y con la intención de que tu hogar sea un lugar que te nutra. Eso es suficiente.\n\nVamos a empezar. Abre las ventanas si puedes. El aire fresco es lo primero — siempre.',
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
      'Soy Victoria. Y estoy aquí contigo en el umbral.\n\nUn umbral es cualquier punto de transición real: un nuevo empleo, una mudanza, una relación que empieza o que termina, una decisión que sabes que te va a cambiar. Son esos momentos que marcan un antes y un después en tu historia. Y la mayoría de las personas los cruzan sin darse cuenta — con el teléfono en la mano, corriendo hacia lo siguiente, sin detenerse a marcar el momento.\n\nEste ritual cambia eso. Te invita a cruzar con conciencia — reconociendo lo que dejas, honrando lo que llevas, y eligiendo activamente lo que quieres construir del otro lado.\n\nNecesitas diez minutos de silencio y un cuaderno. Si no tienes cuaderno, puedes decirlo en voz alta — pero escribirlo tiene un poder especial porque lo vuelve tangible. Real. Tuyo.\n\nSiéntate en un lugar cómodo. Respira profundo tres veces. Deja que la mente se calme un poco antes de empezar a escribir. No tienes que tener todo claro — el ritual mismo te ayuda a aclararlo.\n\nY si en este momento no sabes exactamente a qué umbral estás entrando, eso también es parte del proceso. A veces lo más honesto es reconocer que estás en una transición aunque no sepas todavía hacia dónde.\n\nVamos.',
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
      'Hola. Soy Victoria. Y hoy vamos a hacer algo que parece simple y que cambia más de lo que crees.\n\nLa confianza en ti misma no es una creencia — es una sensación física. Reside en el cuerpo antes de llegar a la mente. Cuando te encoges, cuando bajas la voz, cuando te disculpas por ocupar espacio, el cuerpo está operando desde un código antiguo que dice: "Hazte pequeña. No molestes. No te arriesgues."\n\nEse código llegó a ti de algún lado — de un momento de crítica que dolió demasiado, de una voz que repetiste tanto que se volvió tuya, de un ambiente que enseñó que ser visible era peligroso. No es tu verdad. Es algo que aprendiste. Y lo que se aprende, se puede desaprender.\n\nEste ritual trabaja desde el cuerpo hacia arriba, porque la postura física cambia la química cerebral. Hay estudios que lo confirman — pero tú no necesitas los estudios. Solo necesitas probarlo.\n\nPárate donde estés ahora. Asegúrate de tener espacio para abrir los brazos. Esto toma menos de siete minutos y el efecto dura horas si lo usas justo antes de la situación que lo necesita.\n\nRespira profundo. Y vamos.',
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
      'Hola. Soy Victoria. Es de noche, y estás aquí — eso ya es una elección.\n\nLa mayoría de las personas llevan el día completo a la cama. Las preocupaciones del trabajo. Los correos que no respondieron. Los "debería haber dicho" y los "qué van a pensar". Y ese ruido mental se lleva a las almohadas y se convierte en la primera cosa que reciben por la mañana. Un ciclo que se repite sin que te des cuenta.\n\nEste ritual rompe ese ciclo. Crea un corte limpio entre el día que fue y la noche que viene. Porque dormir bien no es solo cuestión de cansancio físico — es cuestión de qué estado emocional llevas a esa transición entre el despertar y el descanso.\n\nLa ciencia del sueño lo confirma: la última emoción que procesas antes de dormir influye en la calidad del descanso y en el estado con que amaneces. Si es ansiedad, mañana empiezas desde ahí. Si es gratitud, mañana empiezas desde ahí.\n\nEste ritual toma ocho minutos. Necesitas un lugar cómodo — la cama misma está bien — y si tienes un cuaderno a la mano, mejor. Si no, todo funciona en tu cabeza.\n\nPon el teléfono boca abajo ahora. En serio — esto funciona mejor sin notificaciones posibles.\n\nRespira. El día terminó. Ahora vamos a cerrarlo bien.',
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
      'Hola. Soy Victoria. Hoy vamos a hacer algo que parece sencillo y que trabaja en capas mucho más profundas de lo que imaginas.\n\nEscribir un cheque a tu nombre — de una cantidad que te emociona y no te aterra — le habla al inconsciente en un lenguaje que entiende: imágenes físicas, texto concreto y emociones reales. Es una técnica que Jim Carrey practicó cuando era un comediante desconocido y que documentó en la historia más citada sobre manifestación. Escribió un cheque a su nombre por diez millones de dólares en 1985. En 1994 recibió exactamente esa cantidad por "Tonto y más tonto". Puedes creerlo o no. Lo que sí es comprobable es que el acto físico de escribir une la imagen mental con la emoción del cuerpo de una manera que el pensamiento solo no logra.\n\nLa cantidad que eliges importa: tiene que emocionarte sin que el ego la rechace de inmediato. Si escribes un número que tu mente bloquea con "eso es imposible", no funciona — hay que encontrar el rango donde conviven la aspiración y la creencia. Ese rango es diferente para cada persona.\n\nNecesitas papel y bolígrafo. Puedes dibujar un cheque a mano o descargar uno en blanco para imprimir — lo que tengas disponible funciona. Lo que importa es el acto de escribir, no la calidad del papel.\n\nVamos.',
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
      'Hola. Soy Victoria. La luna llena está afuera ahora mismo, y tú estás aquí. Eso ya es poderoso.\n\nLa luna llena amplifica lo que ya está activo en ti. Si hay apertura en el corazón, la expande. Si hay bloqueos — miedos viejos, heridas guardadas, creencias que dicen "no mereces ese amor" — los saca a la superficie para que los puedas ver con luz. Y eso, aunque duela al principio, es exactamente lo que necesitas para liberarlos.\n\nEste ritual trabaja con las dos cosas. Primero soltamos lo que bloquea. Después abrimos lo que se expandirá.\n\nNecesitas privacidad. Esta noche, aunque sea treinta minutos, solo para ti. Si puedes ver la luna desde alguna ventana, mejor. Si no, la luna sabe dónde estás de todas formas.\n\nEnciende la vela si tienes. Ese pequeño gesto de fuego es un símbolo de transformación que tiene miles de años de historia — no porque sea magia, sino porque activa algo en el cerebro que dice: esto es un momento especial, aquí pasan cosas reales.\n\nSiéntate con el papel frente a ti. Pon la mano sobre el corazón. Respira profundo tres veces.\n\nLa luna llena ya sabe qué necesitas liberar. Tu trabajo es solo escribirlo.',
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
      'Hola. Soy Victoria. Estás a punto de entrar a algo importante, y yo estoy aquí contigo en estos cinco minutos que tienes antes.\n\nLos nervios que sientes no son una señal de que algo está mal — son energía que todavía no tiene dirección. El cuerpo no distingue entre la excitación y la ansiedad en términos de química: es la misma adrenalina, la misma frecuencia cardiaca elevada, el mismo sistema nervioso activado. La diferencia es el relato que pones encima. Si dices "estoy nerviosa", el cuerpo lee amenaza. Si dices "estoy lista", el cuerpo lee oportunidad.\n\nEste ritual de cinco minutos hace tres cosas: regula el sistema nervioso con la respiración, ancla la confianza en el cuerpo con la postura, y cambia el relato con las palabras. Los tres juntos crean un estado diferente al que tendrías si entraras directo desde la ansiedad.\n\nDonde estás ahora mismo — el baño, el pasillo, el estacionamiento, el ascensor — es suficiente. No necesitas nada especial. Solo necesitas estos cinco minutos que ya tienes.\n\nRespira. Y vamos. Tienes esto.',
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
      'Hola. Soy Victoria. Viniste aquí por algo que cargas desde hace tiempo. Y eso que cargas tiene un nombre: culpa. O arrepentimiento. O vergüenza. O los tres juntos.\n\nEl perdón propio es el más difícil de todos porque somos más duras con nosotras mismas que con cualquier otra persona. Le perdonamos a las personas que amamos cosas que no nos perdonaríamos nunca a nosotras. Y esa doble vara crea una carga que se vuelve crónica — una voz que repite lo que hiciste mal, lo que elegiste cuando no debías, lo que no supiste en ese momento y ahora sabes.\n\nEste ritual no justifica lo que pasó. No borra nada. No dice que todo estuvo bien.\n\nLo que hace es esto: reconoce que aquella persona que tomó esa decisión — la tú de ese momento — era una persona con información limitada, con herramientas imperfectas, con el nivel de consciencia que tenía entonces y no el que tienes ahora. Juzgarla con los ojos de quien eres hoy es injusto. No porque lo que pasó no importara, sino porque la medida no es justa.\n\nPerdonarte no es soltar la responsabilidad — es soltar el castigo continuado. Es decidir que ya aprendiste lo que había que aprender, y que cargar la culpa más tiempo no te hace mejor persona, solo más pesada.\n\nNecesitas privacidad, papel y tiempo sin interrupciones. Si sientes que esto va a mover mucho, ten agua cerca. Eso es normal.\n\nVamos.',
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
      'Hola. Soy Victoria. Es domingo, o algo parecido al domingo — ese momento de cierre antes de que empiece lo que sigue.\n\nLa gratitud no es solo optimismo ni positividad forzada — es una práctica neurológica concreta. Cuando documentas lo bueno de la semana de forma activa e intencional, entrenas al cerebro a buscarlo. El sistema reticular activador — la parte del cerebro que filtra qué información te llega y cuál no — aprende a priorizar los datos que coinciden con lo que buscas. Si cada semana buscas lo que funcionó, el cerebro empieza a notarlo mientras ocurre, no solo después. Y lo que buscas, lo encuentras. Y lo que encuentras, lo atraes.\n\nEsta práctica semanal toma quince minutos. Necesitas un cuaderno o tu aplicación de notas. Hazlo en un lugar tranquilo — no en el coche, no con la televisión de fondo. Merece atención real.\n\nY una cosa importante antes de empezar: no vale hacerlo en piloto automático. "Agradezco mi familia, mi salud y mi trabajo" — si eso es lo mismo que escribiste la semana pasada y la anterior, no está trabajando. La gratitud poderosa es específica: ¿qué pasó esta semana exactamente, que no hubiera pasado igual si no estuviera ahí?\n\nEse nivel de precisión es lo que activa el cambio real.\n\nAbre el cuaderno. Empieza.',
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
      'Hola. Soy Victoria. Pon la mano sobre el corazón ahora mismo. En serio — hazlo. Siente el calor de tu propia mano. Siente que tu corazón late debajo. Eso es vida. Y la vida ya es abundancia.\n\nHoy vamos a trabajar la afirmación más poderosa de prosperidad que existe — no porque las palabras sean mágicas, sino porque cuando las dices con emoción real, cambian la frecuencia desde la que operas. Cambian lo que notas. Cambian lo que atraes.\n\nRespira profundo. Inhala contando cuatro tiempos. Exhala seis. De nuevo. Una vez más. Cuando sientas que llegaste aquí de verdad, seguimos.\n\nAhora repite conmigo, en voz alta:\n\n"Soy próspera y abundante."\n\nDilo de nuevo, más lento, sintiendo cada palabra:\n\n"Soy próspera. Y abundante."\n\nY ahora la versión completa — repítela conmigo:\n\n"El dinero llega a mí con facilidad, constancia y gratitud. Recibo sin culpa, gasto con intención y ahorro con amor. La abundancia es mi estado natural."\n\nOtra vez, desde el principio:\n\n"Soy próspera y abundante. El dinero llega a mí con facilidad, constancia y gratitud. Recibo sin culpa, gasto con intención y ahorro con amor. La abundancia es mi estado natural."\n\nUna vez más. Esta vez con los ojos cerrados y la mano todavía en el corazón:\n\n"Soy próspera y abundante. El dinero llega a mí con facilidad, constancia y gratitud. Recibo sin culpa, gasto con intención y ahorro con amor. La abundancia es mi estado natural."\n\nPerfecto. Quédate un momento en silencio. No te muevas todavía. Deja que lo que acabas de declarar aterrice en el cuerpo.',
    audioDurationSec: 150,
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
      'Hola. Soy Victoria. Esta afirmación es para el corazón — y el corazón necesita un poco más de espacio que la mente para recibirla. Así que antes de empezar, cierra los ojos. No para siempre — solo un momento. Y pon la mano en el centro del pecho.\n\nSiente el pecho debajo de la mano. Si hay tensión, si hay un nudo, si hay algo cerrado — no lo pelees. Solo obsérvalo. Respira hacia ese lugar con suavidad. Inhala hacia el pecho. Exhala liberando. Tres veces así.\n\nEl amor profundo y recíproco no llega solo a las personas que ya no tienen miedo — llega a las personas que se atreven a estar abiertas aunque todavía tengan miedo. La valentía del corazón no es no sentir el temor. Es seguir disponibles a pesar de él.\n\nRepite conmigo, lento:\n\n"Soy digna de un amor profundo, recíproco y libre."\n\nOtra vez:\n\n"Soy digna de un amor profundo, recíproco y libre."\n\nAhora la afirmación completa — repítela conmigo:\n\n"El amor que deseo ya existe y está encontrando el camino hacia mí. Abro mi corazón para dar y recibir sin miedo, sin condiciones, sin pretender ser alguien que no soy."\n\nDe nuevo, desde el principio:\n\n"Soy digna de un amor profundo, recíproco y libre. El amor que deseo ya existe y está encontrando el camino hacia mí. Abro mi corazón para dar y recibir sin miedo, sin condiciones, sin pretender ser alguien que no soy."\n\nSiente esas palabras en el pecho. No en la mente — en el pecho. Ahí es donde viven.',
    audioDurationSec: 150,
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
      'Hola. Soy Victoria. Sé que en este momento la impaciencia está haciendo ruido. Sé que llevas tiempo esperando, actuando, creyendo — y que a veces la duda llega y dice: "¿Y si no funciona? ¿Y si llegó demasiado tarde? ¿Y si simplemente no va a pasar?"\n\nEsa voz es humana. No es verdad, pero es humana.\n\nEsta afirmación es para esos momentos. Para cuando la mente quiere convencerte de que el tiempo se está acabando, de que tendrías que haber llegado más lejos para ahora, de que todo llega a las demás menos a ti.\n\nRespira conmigo. Inhala despacio. Exhala más lento aún. Dos veces más así.\n\nBien. Ahora repite conmigo en voz alta, como una declaración — no como un deseo:\n\n"Todo llega en el momento exacto."\n\nOtra vez:\n\n"Todo llega en el momento exacto. No antes, no después — exacto."\n\nY ahora la versión completa:\n\n"Confío en el proceso aunque no pueda ver los resultados todavía. Lo que es mío ya viene hacia mí y nada puede detenerlo."\n\nDesde el principio, toda la afirmación:\n\n"Todo llega en el momento exacto. No antes, no después — exacto. Confío en el proceso aunque no pueda ver los resultados todavía. Lo que es mío ya viene hacia mí y nada puede detenerlo."\n\nUna vez más, con la mano en el corazón:\n\n"Todo llega en el momento exacto. Confío. Lo que es mío viene hacia mí."\n\nSiente la paz que hay en confiar. Aunque sea por un momento — esa paz es real.',
    audioDurationSec: 150,
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
      'Hola. Soy Victoria. Esta afirmación es para esos días donde el síndrome del impostor habla más fuerte que tu propia voz. Donde la mente dice "¿quién soy yo para cobrar eso, para pedir ese aumento, para enviar esa propuesta?" — y la respuesta de la mente es que no eres suficiente.\n\nEsa mente no tiene razón. Pero no se le puede convencer con lógica sola. Necesita una voz más fuerte que la suya. Esta afirmación le da esa voz.\n\nPonte de pie si puedes. La afirmación de trabajo funciona mejor cuando el cuerpo está erguido, cuando hay una postura que dice "estoy aquí".\n\nRespira profundo. Hombros atrás. Mentón levantado. Y repite conmigo con voz firme:\n\n"Tengo talentos únicos que el mundo necesita."\n\nOtra vez:\n\n"Tengo talentos únicos que el mundo necesita."\n\nContinúa:\n\n"Mi trabajo tiene valor real y merece ser reconocido y bien pagado."\n\nY el cierre:\n\n"No tengo que ganarme el derecho a estar aquí — ya estoy aquí y eso es suficiente."\n\nDesde el principio, la afirmación completa:\n\n"Tengo talentos únicos que el mundo necesita. Mi trabajo tiene valor real y merece ser reconocido y bien pagado. No tengo que ganarme el derecho a estar aquí — ya estoy aquí y eso es suficiente."\n\nDe nuevo. Esta vez más fuerte:\n\n"Tengo talentos únicos que el mundo necesita. Mi trabajo tiene valor. Ya estoy aquí. Y eso es suficiente."\n\nBien. Mantén esa postura. Entra a lo que viene desde ahí.',
    audioDurationSec: 150,
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
      'Hola. Soy Victoria. Esta es la afirmación más difícil de creer — y eso la hace la más importante.\n\nEl mundo nos enseñó desde muy pequeñas que el valor es condicional. Que cuando logres más, serás suficiente. Que cuando te veas diferente, serás suficiente. Que cuando tengas la relación, el trabajo, el cuerpo, el dinero que "deberías" tener — entonces sí, entonces podrás aceptarte.\n\nEse entonces nunca llega. Porque el problema no es lo que todavía te falta — el problema es la creencia de que faltarte algo te hace menos.\n\nTu valor no es algo que construyes. Es algo que reconoces. Ya está ahí.\n\nRespira despacio. Cierra los ojos. Y repite conmigo, muy lento, como si cada palabra necesitara espacio para aterrizar:\n\n"Soy suficiente ahora mismo."\n\nPausa. Siente la resistencia si hay resistencia — esa resistencia es exactamente el lugar que necesita esta afirmación.\n\nDe nuevo:\n\n"Soy suficiente ahora mismo. No cuando adelgace, no cuando logre más, no cuando tenga más dinero o mejor relación. Ahora."\n\nY el cierre:\n\n"Mi valor no es algo que construyo — es algo que reconozco. Ya soy suficiente."\n\nLa afirmación completa. Repítela conmigo:\n\n"Soy suficiente ahora mismo. No cuando adelgace, no cuando logre más. Ahora. Mi valor no es algo que construyo — es algo que reconozco. Ya soy suficiente."\n\nUna vez más. Esta vez con los ojos abiertos si los tienes cerrados, mirando al frente:\n\n"Ya soy suficiente. Ahora mismo. Exactamente como soy."',
    audioDurationSec: 165,
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
      'Hola. Soy Victoria. Esta afirmación se trabaja diferente — no con los ojos cerrados, sino con los ojos abiertos y el cuerpo moviéndose por el espacio.\n\nCamina por tu hogar mientras escuchas. Toca las paredes, los muebles. Activa los sentidos. Mira un rincón que te guste. Nota la temperatura del aire. Esta afirmación funciona mejor cuando el cuerpo está presente en el espacio, no solo la mente.\n\nRespira profundo. Y repite conmigo, en voz alta, mientras caminas:\n\n"Mi hogar es mi refugio."\n\nOtra vez:\n\n"Mi hogar es mi refugio. Aquí me siento segura, en paz y yo misma."\n\nContinúa caminando y repite:\n\n"El espacio donde vivo me apoya, me recarga y me abraza."\n\nAhora el cierre:\n\n"Vivo rodeada de belleza, orden y amor — aunque sea en pequeño."\n\nLa afirmación completa. Repítela caminando por tu espacio:\n\n"Mi hogar es mi refugio. Aquí me siento segura, en paz y yo misma. El espacio donde vivo me apoya, me recarga y me abraza. Vivo rodeada de belleza, orden y amor — aunque sea en pequeño."\n\nDetente. Mira tu espacio desde donde estás. No con los ojos del "todavía no es suficiente" — con los ojos de quien ya está en casa.\n\nEste espacio te protege ahora mismo. Eso merece gratitud.',
    audioDurationSec: 150,
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
      'Hola. Soy Victoria. Si estás escuchando esta afirmación, algo en tu vida está cambiando — o está a punto de cambiar. Y algo en ti tiene miedo de eso.\n\nEl miedo al cambio es de los más universales que existen. No porque el cambio sea malo, sino porque la mente prefiere lo conocido — aunque lo conocido duela — a lo desconocido que podría ser mejor. Es un mecanismo de supervivencia que en otro contexto nos protegía, pero que hoy nos frena más de lo que nos cuida.\n\nEsta afirmación le habla directamente a ese mecanismo. Lo reconoce. Y le ofrece una narrativa diferente.\n\nSiéntate con los pies en el suelo o quédate de pie, mirando hacia adelante. Respira profundo cinco tiempos, exhala ocho. Hazlo dos veces.\n\nBien. Ahora repite conmigo, con los ojos abiertos, mirando al frente:\n\n"Cada nuevo comienzo es una oportunidad de ser quien quiero ser."\n\nOtra vez:\n\n"El cambio no es una amenaza — es una invitación."\n\nContinúa:\n\n"Estoy lista para lo nuevo."\n\nY el cierre:\n\n"Confío en mi capacidad de adaptarme, crecer y florecer en cualquier terreno."\n\nLa afirmación completa. Cinco veces, mirando siempre hacia adelante:\n\n"Cada nuevo comienzo es una oportunidad de ser quien quiero ser. El cambio no es una amenaza — es una invitación. Estoy lista para lo nuevo. Confío en mi capacidad de adaptarme, crecer y florecer en cualquier terreno."\n\nSiente la diferencia entre miedo y emoción. Son casi idénticos en el cuerpo. Tú eliges cómo llamarlo.',
    audioDurationSec: 165,
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
      'Hola. Soy Victoria. Estás frente a algo que pide que confíes en ti misma — y hay una voz adentro que dice "¿y si me equivoco?"\n\nEsa pregunta es razonable. La duda es humana. Pero cuando esa pregunta se convierte en parálisis, en buscar la aprobación de todos antes de moverte, en esperar que alguien más te diga que está bien lo que ya sabes que está bien — entonces ya no es prudencia. Es desconfianza en ti misma disfrazada de cautela.\n\nTu intuición tiene un historial. Ha tomado decisiones por ti antes. Y aunque no todas salieron perfectas, las que tomaste desde tu centro — no desde el miedo ni desde el querer gustar — casi siempre fueron las correctas.\n\nPonte de pie. Respira profundo tres veces, largas y completas. Y cuando estés lista, repite conmigo con voz firme:\n\n"Confío en mi criterio."\n\nOtra vez:\n\n"Confío en mi intuición."\n\nContinúa:\n\n"Confío en mi capacidad de manejar lo que venga."\n\nY el cierre:\n\n"No necesito certeza absoluta para actuar — me muevo con la confianza que tengo y eso es suficiente."\n\nLa afirmación completa. Repítela tres veces, cada vez con más convicción:\n\n"Confío en mi criterio. Confío en mi intuición. Confío en mi capacidad de manejar lo que venga. No necesito certeza absoluta para actuar — me muevo con la confianza que tengo y eso es suficiente."\n\nEsa confianza que sientes ahora mismo, aunque sea pequeña — es real. Úsala.',
    audioDurationSec: 155,
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
      'Hola. Soy Victoria. Esta afirmación es para los momentos en que algo ya terminó — lo sientes en el cuerpo — pero la mente no quiere soltarlo todavía.\n\nAferrarse es humano. Cuando algo nos dio seguridad, amor, identidad o propósito — aunque ya no funcione —, el cerebro lo registra como necesario para sobrevivir. Por eso soltar se siente a veces como perder. Como caer sin red.\n\nPero hay algo que el miedo no nos dice: el espacio que se crea al soltar es exactamente el espacio que necesita lo nuevo para llegar. No puedes llenar una mano que ya está cerrada. El vacío es el prerequisito de lo siguiente.\n\nRespira. Cierra los ojos un momento. Piensa en lo que quieres soltar — sin nombrarlo todavía. Solo siente su peso. Y ahora, con cada exhalación, imagina que ese peso se hace un poco más ligero.\n\nRepite conmigo, en voz suave pero clara:\n\n"Suelto con amor y gratitud lo que ya cumplió su ciclo en mi vida."\n\nOtra vez:\n\n"No me aferro por miedo al vacío."\n\nY el cierre:\n\n"Confío en que el espacio que creo al soltar es el espacio que necesita lo nuevo para llegar."\n\nLa afirmación completa, tres veces:\n\n"Suelto con amor y gratitud lo que ya cumplió su ciclo en mi vida. No me aferro por miedo al vacío. Confío en que el espacio que creo al soltar es el espacio que necesita lo nuevo para llegar."\n\nSuelta. Y confía.',
    audioDurationSec: 155,
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
      'Hola. Soy Victoria. En este momento, la ansiedad quizás está haciendo ruido. El cuerpo tenso, la mente corriendo, la sensación de que hay demasiadas cosas y muy poco tiempo o control. Eso está bien. Estás aquí. Y eso es suficiente para empezar.\n\nLa paz no es la ausencia de problemas — nunca va a serlo. La paz es la capacidad de estar presente dentro de los problemas sin que te arrastren. Es el ojo del huracán: quieto en el centro mientras todo gira alrededor.\n\nEse estado está disponible para ti ahora mismo. No hay que construirlo — hay que recordarlo. Esta afirmación te lo recuerda.\n\nPara. Deja de caminar si estás caminando. Siéntate si puedes. Pon las dos manos sobre las piernas, palmas hacia arriba.\n\nRespira. Inhala por la nariz cuatro tiempos. Retén dos. Exhala por la boca seis tiempos. Hazlo tres veces. No apures — el cuerpo necesita estos segundos.\n\nBien. Ahora repite conmigo, despacio:\n\n"La paz no es ausencia de problemas — es saber que puedo manejarlos."\n\nOtra vez:\n\n"Mi estado natural es la calma, no la urgencia."\n\nY continúa:\n\n"Cada vez que regreso a mi respiración, regreso a mí misma."\n\nEl cierre:\n\n"Soy paz."\n\nLa afirmación completa, tres veces:\n\n"La paz no es ausencia de problemas — es saber que puedo manejarlos. Mi estado natural es la calma, no la urgencia. Cada vez que regreso a mi respiración, regreso a mí misma. Soy paz."\n\nQuédate en silencio diez segundos más. Eso es tuyo.',
    audioDurationSec: 170,
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
      'Hola. Soy Victoria. Esta afirmación es para los días en que el dinero se siente escaso — cuando las cifras no coinciden con lo que necesitas, cuando alguien más parece prosperar con facilidad mientras tú trabajas doble, cuando el miedo a no alcanzar vive más cerca de lo que quisieras.\n\nLa escasez es un estado mental antes de ser un estado financiero. No minimizo las realidades económicas — son reales. Pero la mente en frecuencia de escasez cierra oportunidades antes de verlas, toma decisiones desde el pánico, repele exactamente lo que necesita atraer.\n\nEsta afirmación cambia la frecuencia. No el banco todavía — la frecuencia. Y la frecuencia afecta las decisiones. Las decisiones afectan los resultados.\n\nRespira profundo. Pon la mano sobre el estómago. Siente el movimiento. Exhala despacio. Dos veces más.\n\nRepite conmigo:\n\n"Mis ingresos crecen constantemente de formas que a veces esperaba y otras no."\n\nOtra vez:\n\n"Soy buena con el dinero — lo recibo, lo cuido y lo hago crecer."\n\nY el cierre:\n\n"La prosperidad es un proceso continuo y yo voy en la dirección correcta."\n\nLa afirmación completa, tres veces:\n\n"Mis ingresos crecen constantemente de formas que a veces esperaba y otras no. Soy buena con el dinero — lo recibo, lo cuido y lo hago crecer. La prosperidad es un proceso continuo y yo voy en la dirección correcta."\n\nConfía en el proceso. El dinero responde a quien lo trata como si ya viniera.',
    audioDurationSec: 160,
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
      'Hola. Soy Victoria. Esta afirmación es para ti — estés soltera o en pareja. Si estás soltera, es una invitación activa. Si estás en pareja, es un reconocimiento y una declaración de lo que mereces seguir construyendo.\n\nEl amor profundo y recíproco existe. No es fantasía ni cuento de hadas — es una elección consciente de dos personas que se ven de verdad, que se eligen cuando hay otras opciones, que se sostienen sin perderse a sí mismas.\n\nEse amor es posible para ti. Y empieza por creer que lo mereces — no cuando seas "la mejor versión de ti", no cuando hayas sanado todo, no cuando tengas tu vida "en orden". Ahora. Con quien eres hoy.\n\nCierra los ojos. Respira. Pon la mano en el corazón.\n\nRepite conmigo:\n\n"Tengo o estoy atrayendo una relación donde soy completamente vista, elegida y amada."\n\nSiente esas palabras: vista, elegida, amada. No una o dos — las tres.\n\nContinúa:\n\n"Una relación que me da alas en lugar de cortarlas."\n\nY el cierre:\n\n"Profunda, honesta, apasionada y libre."\n\nLa afirmación completa. Repítela con el corazón abierto:\n\n"Tengo o estoy atrayendo una relación donde soy completamente vista, elegida y amada. Una relación que me da alas en lugar de cortarlas. Profunda, honesta, apasionada y libre."\n\nDos veces más. Cada vez con más convicción, más apertura, más certeza:\n\n"Ese amor existe. Y me está buscando."',
    audioDurationSec: 160,
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
      'Hola. Soy Victoria. ¿Cuántas veces en los últimos días guardaste una idea porque te preguntaste si era suficientemente buena? ¿Cuántas veces esperaste a que alguien más dijera lo que tú ya estabas pensando, y después te arrepentiste de no haberlo dicho?\n\nEsa voz que dice "¿quién soy yo para hablar?" tiene nombre: síndrome del impostor. Y es especialmente fuerte en las mujeres que saben más de lo que creen, que se preparan más que nadie, que se juzgan con estándares más altos que los que les aplican a los demás.\n\nTus ideas no tienen que ser perfectas para ser valiosas. No tienes que ser la más experta de la sala para tener algo importante que decir. Tu perspectiva — única, construida desde tu historia, tus experiencias y tu forma de ver el mundo — es exactamente lo que algunas conversaciones necesitan para completarse.\n\nPonte de pie. Hombros atrás. Respira profundo.\n\nRepite conmigo con voz clara:\n\n"Mis ideas tienen valor."\n\nOtra vez:\n\n"Lo que pienso merece ser dicho, propuesto y defendido."\n\nY el cierre:\n\n"No tengo que esperar a ser la más experta de la sala para contribuir — mi perspectiva única es exactamente lo que algunas conversaciones necesitan."\n\nLa afirmación completa, tres veces:\n\n"Mis ideas tienen valor. Lo que pienso merece ser dicho. Mi perspectiva única es exactamente lo que algunas conversaciones necesitan."\n\nAhora entra a la reunión, manda el correo, publica el contenido. Tu voz importa.',
    audioDurationSec: 160,
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
      'Hola. Soy Victoria. Esta es la afirmación maestra de Louise Hay — la que ella usó durante décadas y la que enseñó a miles. Y es la que más resistencia genera. Porque amar y aceptar completamente incluye las partes que no nos gustan, los errores que no hemos terminado de procesar, las versiones de nosotras mismas que todavía nos cuesta mirar.\n\nSi sientes incomodidad al decirla — si hay una voz que dice "pero yo no me amo completamente, tengo estas partes que..." — eso es exactamente la señal de que la necesitas más.\n\nLa afirmación no describe cómo te sientes ahora. Describe hacia dónde te mueves. Repetirla con constancia cambia el patrón. No de inmediato. Con el tiempo. Pero cambia.\n\nSi puedes, ve al espejo. Mira tus ojos — no tu piel, no lo que no te gusta. Tus ojos. Y cuando estés lista, repite conmigo:\n\n"Me amo y me acepto completamente."\n\nPausa. Siente la resistencia si aparece. Y repite de todas formas:\n\n"Me amo y me acepto completamente."\n\nAhora la versión completa:\n\n"Mis sombras y mis luces. Mis errores y mis aciertos. Mi cuerpo, mi mente, mi historia. No necesito ser diferente para merecer amor — me lo doy ahora, exactamente como soy."\n\nLa afirmación completa. Tres veces, mirándote:\n\n"Me amo y me acepto completamente. Mis sombras y mis luces. No necesito ser diferente para merecer amor — me lo doy ahora, exactamente como soy."\n\nEse amor que sientes aunque sea un poco — es el punto de partida. Desde ahí crece.',
    audioDurationSec: 170,
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
      'Hola. Soy Victoria. Esta es la afirmación maestra — la que cambia todo cuando la internalizas de verdad.\n\nSer la creadora de tu realidad no significa que controlas todo lo que pasa. El mundo tiene sus propias fuerzas, sus propias leyes, sus propias caos. Lo que sí controlas es la relación que tienes con lo que pasa. La interpretación. La respuesta. La dirección que eliges desde ahí.\n\nLas personas que viven como creadoras de su realidad no tienen menos problemas que las demás. Tienen una relación diferente con los problemas — los ven como datos, como oportunidades de redirigir, no como prueba de que la vida está en su contra.\n\nEsa es la diferencia entre quien crea y quien reacciona.\n\nEstás aquí eligiendo esta afirmación. Eso ya es ser creadora — ya estás tomando la realidad en tus manos aunque sea en este pequeño gesto.\n\nRespira profundo. Y repite conmigo con autoridad, no con esperanza:\n\n"Soy la creadora de mi realidad."\n\nOtra vez:\n\n"Mis pensamientos, mis palabras y mis acciones construyen el mundo en que vivo."\n\nContinúa:\n\n"No soy víctima de las circunstancias — soy arquitecta de mi vida."\n\nEl cierre:\n\n"Elijo conscientemente lo que quiero crear."\n\nLa afirmación completa. Tres veces, con plena convicción:\n\n"Soy la creadora de mi realidad. Mis pensamientos, mis palabras y mis acciones construyen el mundo en que vivo. No soy víctima de las circunstancias — soy arquitecta de mi vida. Elijo conscientemente lo que quiero crear."\n\nEl pincel está en tu mano. El lienzo es hoy.',
    audioDurationSec: 165,
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
      'Soy Victoria. Y hoy decretas. No pides — decretas. Esa distinción es importante.\n\nUn decreto no es un deseo enviado al universo como carta al correo. Es una declaración de autoridad. Es hablarle a la realidad como si ya la estuvieras construyendo — porque la estás construyendo. Cada palabra que dices en voz alta con convicción real genera una vibración que mueve energía. Eso no es metáfora — es física. El sonido afecta la materia. Tu voz afecta tu estado. Tu estado afecta tus decisiones. Tus decisiones construyen tu vida.\n\nPonte de pie. Los pies bien plantados en el suelo, a la altura de los hombros. La columna recta. Los hombros atrás. El pecho disponible. Respira profundo tres veces y cuando llegues a este estado de presencia total, empieza.\n\nDi en voz alta, con autoridad real — no susurres, no lo leas como si fuera un texto cualquiera:\n\n"Yo decreto y declaro que la abundancia fluye hacia mí en todas sus formas. Decreto que el dinero llega a mí de formas esperadas e inesperadas, de forma constante y en cantidades cada vez mayores. Decreto que soy una receptora poderosa de la prosperidad del universo. Decreto que merezco vivir con riqueza, en paz, con salud y amor. Y así es."\n\nRespira. Y repítelo una vez más, esta vez cerrando los ojos:\n\n"Yo decreto abundancia total. El dinero llega. La prosperidad es mía. Y así es."\n\nBien. Ese decreto acaba de salir de ti. El universo lo recibió.',
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
      'Soy Victoria. Este decreto lo pronuncias frente al espejo — si puedes. Si no, también funciona donde estás. Lo que importa es que lo digas en voz alta, mirándote si es posible a los ojos, con la convicción de quien ya sabe lo que vale.\n\nEl amor propio no llega como revelación de un día. Se construye con actos pequeños y constantes — y uno de los más poderosos es este: decretar en voz alta, con testigos o sin ellos, que eres suficiente ahora mismo.\n\nSi sientes resistencia al decirlo, bien. La resistencia es la señal de que toca exactamente ahí. Di el decreto de todas formas. No tienes que creerlo al 100% para que empiece a funcionar — solo necesitas decirlo con intención real.\n\nRespira. Y di en voz alta:\n\n"Yo decreto que me amo y me acepto completamente, con mis sombras y mis luces. Decreto que no necesito la aprobación de nadie para saber que soy suficiente. Decreto que mi valor no depende de lo que produzco, de lo que peso ni de lo que logro. Existo. Eso es suficiente. Y así es."\n\nRespira. Y una vez más:\n\n"Me amo. Soy suficiente. Mi valor es incondicional. Y así es."',
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
      'Soy Victoria. Cuando las puertas parecen cerradas y nada avanza, el primer trabajo no es cambiar la estrategia — es cambiar la frecuencia desde la que actúas. Porque la frecuencia de escasez cierra puertas antes de verlas. La frecuencia de apertura las vuelve visibles.\n\nEste decreto no reemplaza la acción — la precede. Lo dices para calibrar la mente antes de entrar al mundo. Para que cuando llegue la oportunidad, la veas. Para que cuando alguien valioso cruce tu camino, estés presente para reconocerlo.\n\nPonte de pie. Respira profundo. Y di con plena convicción:\n\n"Yo decreto que las oportunidades perfectas para mí están llegando ahora. Decreto que las personas correctas me encuentran, me ven y reconocen mi valor. Decreto que estoy en el lugar correcto, en el momento correcto, con los talentos correctos. Las puertas abren. Y así es."\n\nRespira. Siente lo que ese decreto mueve en ti. Y una vez más:\n\n"Las oportunidades me encuentran. Las personas correctas me ven. Las puertas abren para mí. Y así es."',
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
      'Soy Victoria. Este decreto lo dices de pie. Con los pies bien plantados en el suelo. Sin disculparte por el espacio que ocupas.\n\nEl poder personal no es arrogancia — es la capacidad de pararte en tu lugar y hablar desde ahí sin encogerte, sin suavizar más de la cuenta, sin pedir permiso para existir. Muchas aprendimos desde pequeñas que nuestro poder molestaba, que ser demasiado era un problema, que la gracia era hacerse chiquita. Ese aprendizaje no es la verdad. Es una herencia que puedes elegir no seguir cargando.\n\nEste decreto declara quién eres — no quién quieres ser algún día. Quién eres ahora.\n\nPonte de pie. Hombros atrás. Barbilla levantada. Respira desde el vientre. Y di en voz firme:\n\n"Yo decreto que soy una mujer poderosa. Decreto que mi voz importa y merece ser escuchada. Decreto que ya no cedo mi poder por miedo a molestar, a decepcionar o a no gustar. Decreto que me paro en mi lugar con gracia y firmeza. Soy poderosa. Y así es."\n\nRespira. Nota cómo se siente el cuerpo en esa postura, con esas palabras. Y una vez más:\n\n"Soy poderosa. Mi voz importa. Me paro en mi lugar. Y así es."',
    audioDurationSec: 185,
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
      'Soy Victoria. Haz este decreto en el centro de tu hogar — de pie, en el lugar donde más tiempo pasas, o en la entrada. Puedes poner la mano sobre la pared mientras lo dices. El contacto físico con el espacio potencia la intención.\n\nTu hogar no es solo cuatro paredes. Es un campo de energía que responde a lo que piensas, sientes y dices dentro de él. Cuando decretas sobre tu espacio con intención real, lo estás programando. Suena poético pero también es práctico: lo que dices sobre tu hogar afecta cómo lo tratas, cómo lo cuidas, cómo te sientes dentro de él. Y cómo te sientes en casa afecta cómo llegás al mundo.\n\nRespira. Pon la mano en la pared si puedes. Y di en voz alta:\n\n"Yo decreto que mi hogar es próspero, abundante y lleno de amor. Decreto que en este espacio reina la paz, la salud y la alegría. Decreto que todo lo que entra a mi hogar es bienvenido con gratitud y todo lo que sale lo hace con bendición. Mi hogar refleja mi vida interior: ordenada, bella y en expansión. Y así es."\n\nRespira. Mira tu espacio. Y una vez más, con gratitud real:\n\n"Este hogar me cuida. Este espacio me nutre. Aquí vivo bien. Y así es."',
    audioDurationSec: 185,
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
      'Soy Victoria. Estás en un umbral. Algo está terminando o ya terminó, y lo nuevo todavía no se ve del todo claro. Ese espacio intermedio — entre el cierre y el comienzo — es uno de los más incómodos de habitar. La mente quiere certezas. El ego quiere control. Y el alma sabe que el único camino es la apertura.\n\nEste decreto no borra la incertidumbre. La transforma en confianza activa. Lo pronuncias no como petición, sino como declaración de quien ya eligió cruzar.\n\nRespira profundo. Cierra los ojos un momento. Imagina que sueltas algo pesado — lo que sea que todavía cargas del capítulo anterior. Siente ese peso irse con la exhalación. Y cuando estés lista, abre los ojos y di en voz alta:\n\n"Yo decreto que estoy completamente abierta a lo nuevo. Decreto que suelto el pasado con amor y creo espacio para lo que quiero construir. Decreto que cada comienzo me encuentra más fuerte, más clara y más lista. Lo nuevo llega. Y así es."\n\nRespira. Siente el espacio que se acaba de crear en ti. Y una vez más:\n\n"Estoy abierta. Suelto con amor. Lo nuevo llega. Y así es."',
    audioDurationSec: 185,
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
      'Soy Victoria. Estás frente a algo que pide que confíes en ti — y la validación externa no alcanza. Nadie más puede decirte si esto está bien. Solo tú sabes. Y esa soledad de la decisión puede sentirse como vértigo.\n\nEste decreto es para ese momento. No dice que no tendrás dudas. Dice que confías en tu proceso aunque haya dudas. Esa es la diferencia entre la fe real y la certeza perfecta que nunca llega.\n\nPonte de pie. Respira desde el vientre. Tres respiraciones largas. Y cuando sientas que llegaste aquí de verdad, di en voz alta con calma y autoridad:\n\n"Yo decreto que confío en mí misma. Decreto que mi intuición es confiable y me guía hacia lo correcto. Decreto que no necesito la validación de otros para saber que estoy tomando las decisiones correctas. Confío en mi proceso. Confío en mi camino. Y así es."\n\nRespira. Nota la diferencia en el cuerpo entre antes y después del decreto. Y una vez más:\n\n"Confío en mí. Mi intuición me guía. No necesito permiso externo para avanzar. Y así es."',
    audioDurationSec: 185,
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
      'Soy Victoria. Pon las manos sobre el cuerpo mientras haces este decreto. Donde sientas que necesita atención — el abdomen, el pecho, la cabeza, las manos. El contacto físico de la propia mano sobre el cuerpo es una forma de comunicarle que lo estás viendo. Que te importa.\n\nVivimos en una cultura que trata el cuerpo como proyecto: siempre hay algo que mejorar, reducir, fortalecer, corregir. Y ese ruido constante de insatisfacción tiene un costo energético enorme. Este decreto cambia la relación — de proyecto a compañero.\n\nTu cuerpo es inteligente. Sabe sanar. Sabe regular. Sabe pedir lo que necesita si le prestas atención. Lo que a veces no tiene es la voz que le diga "confío en ti. Te cuido con amor, no con castigo. Eres suficiente."\n\nEsa es esa voz.\n\nRespira profundo. Manos en el cuerpo. Y di en voz baja pero clara:\n\n"Yo decreto que soy sana, vital y llena de energía. Decreto que mi cuerpo es inteligente y sabe sanar. Decreto que cuido mi cuerpo con amor, no con castigo. Decreto que el descanso, la alimentación y el movimiento son actos de amor propio, no de disciplina. Soy salud. Y así es."\n\nRespira. Siente el calor de tus manos sobre el cuerpo. Y una vez más:\n\n"Soy sana. Me cuido con amor. Mi cuerpo me escucha. Y así es."',
    audioDurationSec: 185,
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
      'Soy Victoria. Este es el decreto de la liberación real. No de la liberación fácil — de la que cuesta porque hay apego, porque hay historia, porque hay parte de ti que todavía se pregunta si soltarlo es perderlo.\n\nLa respuesta es no. Soltar no es perder. Es crear espacio. Es decirle al universo: "Ya entendí la lección de esta etapa. Estoy lista para lo siguiente." Y esa declaración mueve cosas — porque la energía que se usaba en sostener lo que ya no sirve queda disponible para algo nuevo.\n\nCierra los ojos. Respira. Piensa en algo específico que quieres soltar — una persona, una situación, una creencia, una versión de ti que ya superaste. No tienes que saber exactamente cómo soltarlo. El decreto empieza el proceso.\n\nRespira profundo. Y di con convicción, con los ojos cerrados:\n\n"Yo decreto que me libero de todo lo que ya no me sirve. Decreto que suelto con amor y sin resentimiento todo vínculo, creencia o situación que ya cumplió su ciclo. Decreto que no necesito aferrarme para sentirme segura — mi seguridad viene de dentro. Suelto. Confío. Recibo lo nuevo. Y así es."\n\nRespira. Exhala lentamente. Siente el espacio que se acaba de crear en ti. Y una vez más:\n\n"Suelto con amor. Mi seguridad viene de dentro. Lo nuevo llega. Y así es."',
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
      'Soy Victoria. Este es el decreto maestro. El que abarca todo. El que haces al inicio de un año, de un ciclo nuevo, de un capítulo que empieza con la decisión de hacerlo diferente.\n\nUn año tiene 365 días. Y la diferencia entre un año transformador y uno más que pasa es en gran medida la intención con que lo abres. No la lista de metas que escribiste el primero de enero y olvidaste en febrero — la intención profunda de quién quieres ser y cómo quieres vivir mientras todo lo que tiene que pasar pasa.\n\nEste decreto declara eso. Lo dice en voz alta, con testigos o sin ellos, frente al universo entero. Eso no es pequeño.\n\nPonte de pie. De pie — este no se dice sentada. Los pies bien plantados. El cuerpo erguido. Respira profundo tres veces. Y di con la voz que tiene una persona que sabe quién es:\n\n"Yo decreto que este año es mi año más próspero, más amoroso y más auténtico hasta ahora. Decreto que recibo abundancia en dinero, salud, amor y propósito. Decreto que las personas correctas llegan a mi vida y las que ya cumplieron su ciclo se van con amor. Decreto que actúo con valentía, descanso con paz y celebro con gratitud. Este año me pertenece. Y así es."\n\nRespira. Quédate un momento en silencio. Deja que ese decreto vibre en el cuerpo. Y una vez más:\n\n"Este año me pertenece. Actúo con valentía. Vivo con propósito. Y así es."',
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
      'Soy Victoria. Siéntate en un lugar cómodo donde nadie te interrumpa los próximos diez minutos. Si puedes, pon los pies en el suelo. Cierra los ojos. Y empieza a respirar más lento de lo que venías respirando.\n\nInhala por la nariz, contando cuatro tiempos. Exhala por la boca, contando seis. Hazlo tres veces seguidas. No apures — cada ciclo de respiración le dice al sistema nervioso que estás a salvo. Que puede bajar la guardia. Que puede abrirse.\n\nInhala... uno, dos, tres, cuatro. Exhala... uno, dos, tres, cuatro, cinco, seis.\n\nDe nuevo. Inhala... y exhala despacio.\n\nUna vez más.\n\nBien. Ahora, con ese estado más tranquilo, quiero que imagines algo.\n\nImagina que mañana por la mañana te despiertas — y algo es diferente. La cuenta bancaria refleja una cantidad que te da paz real. No una cantidad para impresionar a nadie — una cantidad que a ti, específicamente a ti, te quita la presión del pecho. Sin deudas. Con reservas para emergencias. Con la libertad de decir que sí a lo que importa y que no a lo que no.\n\n¿Cómo se siente levantarte con eso?\n\nObserva esa sensación en el cuerpo — no el número, la sensación. ¿Hay alivio? ¿Hay un suspiro que sale solo? ¿Hay algo que se afloja en los hombros?\n\nAhora entra a ese día. No un día extraordinario — un martes ordinario, con esa cantidad en la cuenta. ¿Cómo caminas? ¿Hay una ligera diferencia en la postura? ¿La voz es más tranquila, más segura? ¿Las decisiones se toman desde un lugar diferente — no desde el miedo, sino desde la elección?\n\nImagina una conversación de dinero — una que normalmente te genera tensión. ¿Cómo la tienes desde esta versión de ti? ¿Qué dices que no dirías antes? ¿Qué pides que antes no pedirías?\n\nMantén esa sensación un poco más. No la imagen — la sensación. La persona que eres cuando no tienes miedo al dinero. Su postura. Su calma. Su claridad.\n\nEsa persona ya existe en ti. No en un futuro lejano — en ti ahora mismo, debajo de las capas de preocupación. Este ejercicio no la crea. La recuerda. La saca a la superficie para que puedas reconocerla.\n\nRespira profundo. Y cuando estés lista, abre los ojos despacio. Trae esa sensación contigo al resto del día.',
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
      'Soy Victoria. Siéntate o recuéstate en un lugar cómodo. Cierra los ojos. Respira y suelta — no intentes controlar nada de lo que viene. Solo observa. Solo recibe.\n\nInhala profundo. Exhala soltando cualquier tensión que cargues en los hombros. En la mandíbula. En las manos. De nuevo. Inhala, y exhala aflojando el pecho. Una vez más — inhala, y exhala completamente.\n\nBien. Ahora quiero que imagines un lugar. Un lugar donde te sientes completamente tú misma. Puede ser real — un lugar que conoces — o puede ser inventado por ti ahora mismo. No importa si existe o no. Lo que importa es la sensación de seguridad que tiene ese lugar. La luz, la temperatura, los sonidos. Entra en ese espacio con todos los sentidos.\n\n¿Qué ves? ¿Hay naturaleza? ¿Hay silencio? ¿Hay un cierto tipo de luz?\n\nEstás ahí. Relajada. Completamente tú.\n\nAhora, dentro de esa escena, algo cambia suavemente. Alguien llega. No necesitas ver su cara. No necesitas un nombre. Solo siente la energía de esa presencia — la de alguien que te ve de verdad. Que te elige. Que te cuida sin quitarte tu espacio. Que está contigo sin necesitar que cambies nada de quien eres.\n\n¿Cómo se siente esa presencia cerca de ti? ¿Hay ligereza en el pecho? ¿Hay un calor que no sofoca? ¿Hay risa, o silencio cómodo, o las dos cosas?\n\nNo forces una imagen específica. Solo permanece en la emoción. La seguridad de ser vista. La calidez de ser elegida. La libertad de ser completamente tú dentro de una relación.\n\nQuédate ahí un momento más. Respira con esa sensación. Déjala asentarse en el cuerpo.\n\nEse amor existe en el campo. Tu corazón ya lo conoce — lo acabas de sentir. No lo estás invocando desde la fantasía. Lo estás recordando desde algo que ya está disponible para ti.\n\nRespira profundo. Exhala. Y cuando estés lista, abre los ojos. Lleva esa sensación contigo.',
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
      'Soy Victoria. Esto es para cuando la mente no para de correr. Para cuando hay demasiados pensamientos, demasiadas preocupaciones, demasiado ruido interno y no sabes cómo apagarlo.\n\nNo hay que apagarlo. Solo hay que dejar de luchar con él.\n\nSiéntate o recuéstate. Cierra los ojos. Empieza a respirar más despacio de lo que crees que necesitas. Mucho más despacio. Inhala por la nariz durante cinco tiempos. Exhala por la boca durante siete. Sin forzar — fluido, continuo.\n\nInhala... uno, dos, tres, cuatro, cinco. Exhala... uno, dos, tres, cuatro, cinco, seis, siete.\n\nDe nuevo. Inhala cinco. Exhala siete. Siente cómo el cuerpo empieza a asentarse.\n\nUna vez más. Inhala... y exhala largo.\n\nBien.\n\nAhora quiero que uses una imagen. Imagina que tu mente es un lago. No el lago que quisieras tener — el lago que tienes ahora mismo. Si está agitado, con olas, con barro removido desde el fondo, con objetos flotando en la superficie — eso está bien. Solo obsérvalo. Sin juzgar. Sin intentar calmarlo por la fuerza. El lago es como es ahora. Eso está permitido.\n\nSigue respirando. Observa el lago desde la orilla. No estás dentro de él — estás mirándolo. Hay distancia entre tú y el ruido. Esa distancia es la clave.\n\nMientras respiras, algo empieza a pasar solo. El lago, sin que hagas nada, empieza a calmarse. No porque lo estés forzando — porque la respiración lenta y la observación sin resistencia le permite autorregularse. El barro se asienta. Las olas se hacen más pequeñas. La superficie se vuelve más lisa.\n\nNo tienes que hacer nada. Solo observa. Solo respira.\n\nA medida que el lago se calma, algo se hace visible que antes no podías ver: el fondo. Debajo de toda la agitación hay una quietud que siempre estuvo ahí. Una paz que no creaste — que encontraste. Porque siempre estuvo disponible para ti, debajo de todo el ruido.\n\nQuédate en esa imagen un momento más. El lago quieto. El fondo visible. Tú, respirando desde la orilla, en paz.\n\nEsa paz es tuya. No la pierdes cuando el lago vuelva a agitarse. Ahora ya sabes dónde encontrarla.\n\nRespira. Y cuando estés lista, abre los ojos lentamente.',
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
      'Soy Victoria. Cierra los ojos. Respira profundo tres veces — inhala completamente, exhala soltando todo lo que trae el día.\n\nInhala... y exhala lento. De nuevo. Una vez más.\n\nBien. Ahora lleva la atención a tu trabajo. No con la mente analítica que evalúa y planifica — con la intuición que siente. Lleva la atención a lo que haces, a lo que ofreces, a lo que creas. Lo que sea que constituye tu trabajo ahora mismo.\n\nY ahora imagina que ese trabajo está floreciendo. No de forma vaga y abstracta — de forma concreta y sensorial. Imagina que han pasado dieciocho meses desde hoy.\n\n¿Cuántos clientes tienes, o cuántas personas usas lo que ofreces? No el número ideal de otra persona — el número que a ti te parecería transformador. Imagina sus caras, sus palabras. ¿Qué te dicen sobre el impacto que tuvo en ellas lo que haces?\n\n¿Cómo se siente tu agenda? ¿Hay un equilibrio entre el trabajo y la vida que no habías logrado antes? ¿Hay reuniones que te cargan en lugar de agotarte?\n\nImagina un martes ordinario en ese trabajo. Te despiertas con energía para lo que viene. No con ansiedad — con anticipación. Llegas al trabajo, o empiezas desde donde trabajas, y hay una sensación de propósito que no requiere esfuerzo para activarse. Solo aparece.\n\nLas personas que necesitan lo que ofreces te encuentran. No tienes que perseguirlas — llegas a ellas de formas que a veces no esperabas.\n\n¿Cuánto ganas? No lo censures. Pon un número que te emocione de verdad — el que, si lo vieras en la cuenta, cambiaría algo fundamental en cómo vives. Visualiza ese número. Siente qué hace en el cuerpo.\n\n¿Cómo se siente tu cuerpo en ese trabajo? ¿Hay orgullo por lo que construiste? ¿Hay propósito en cada acción? ¿Hay alegría ordinaria — no solo en los grandes momentos, sino en el trabajo cotidiano?\n\nQuédate con esa sensación. La del cuerpo en ese trabajo que ya funciona. Eso que sientes es la dirección correcta.\n\nRespira profundo. Exhala. Y cuando estés lista, abre los ojos.',
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
      'Soy Victoria. Esta visualización trabaja la identidad — no lo que tienes o logras, sino quién eres cuando la confianza ya llegó. Siéntate cómodamente. Cierra los ojos. Respira y afloja los hombros — los hombros son donde cargamos mucho sin darnos cuenta.\n\nInhala profundo. Al exhalar, deja caer los hombros conscientemente. De nuevo. Inhala, y al exhalar afloja también la mandíbula. Una vez más — inhala, exhala soltando cualquier tensión que encuentres.\n\nBien. Ahora quiero que imagines que frente a ti, a unos pasos de distancia, aparece una versión de ti misma. No una versión perfecta — una versión que tiene lo que tú estás buscando: la confianza real. No la confianza que se actúa ni la que se finge — la paz profunda consigo misma.\n\nObsérvala. No con juicio — con curiosidad.\n\n¿Cómo está parada? ¿Qué hace su cuerpo diferente al tuyo ahora mismo? ¿Sus hombros están más atrás? ¿Hay una calma en la postura que no requiere esfuerzo?\n\n¿Cómo camina si se mueve? ¿Hay una ligereza o una presencia que notal?\n\n¿Cómo habla esa versión de ti? ¿Con qué tono? ¿Qué tanto espacio ocupa en una conversación? ¿Interrumpe menos? ¿Se disculpa menos? ¿Termina las frases sin subir la voz como pregunta?\n\nY ahora — ¿qué es lo que esa versión de ti ya no hace? ¿Qué ha dejado de necesitar? ¿La validación de cierta persona? ¿El permiso para actuar? ¿La certeza antes de moverse?\n\nAcércate a ella. Mírala a los ojos. Esos ojos son los tuyos — con más capas de confianza encima.\n\nPregúntale en silencio: "¿Qué necesito saber?"\n\nEscucha lo que venga. Sin filtrar, sin censurar. La primera respuesta suele ser la más verdadera.\n\nAhora — imagina que te acercas más. Y que, lentamente, te fusionas con ella. Que esa confianza que tiene se asienta en tu cuerpo. En los hombros. En el pecho. En la voz.\n\nEsa confianza no es de ella — siempre fue tuya. Solo estabas recordando dónde la guardaste.\n\nRespira. Y abre los ojos lentamente. Trae eso contigo.',
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
      'Soy Victoria. Cierra los ojos. No te preocupes por el presupuesto ahora. No hay filtros de "realismo" en esta visualización — solo hay la honestidad de lo que tu corazón pide.\n\nRespira profundo tres veces — largas, lentas. Inhala y exhala. Inhala y exhala. Una vez más.\n\nBien. Ahora imagina que llegas a un hogar. El hogar que tu corazón pide — no el que crees que puedes tener, no el que parece razonable, sino el que genuinamente te haría sentir en casa de verdad.\n\nEstás parada en la entrada. ¿Cómo es la puerta? ¿Cómo es la luz cuando entras? ¿Hay luz natural que entra por ventanas grandes, o es una luz cálida de interior que da sensación de refugio?\n\n¿Qué ves al entrar? ¿Cuál es lo primero que notas? El suelo bajo los pies. El aire. El olor — ¿a qué huele ese hogar? ¿A madera, a flores, a café, a limpio, a tierra?\n\nCamina por ese espacio. No en ruta fija — como llegas a casa después de un día largo. ¿Qué cuarto te llama primero?\n\nEntra a la cocina. ¿Cómo es? ¿Hay espacio para cocinar con calma? ¿Hay algo en el mesón que cuenta una historia sobre la vida que sucede aquí?\n\nEntra al cuarto principal. La cama. Las almohadas. La luz de ese espacio. ¿Cómo se siente estar en ese cuarto al final del día?\n\n¿Hay un espacio exterior? ¿Un balcón, un jardín, un patio pequeño? Si lo hay, sal ahí un momento. ¿Qué se ve desde ahí?\n\nAhora, parada en ese hogar, pregúntate: ¿Qué parte de mí respira diferente aquí? ¿Qué parte de mí se afloją que normalmente está tensa?\n\n¿Hay alguien contigo — o estás sola con paz? Las dos opciones son válidas. Lo que importa es que ese hogar te sostiene tal como eres.\n\nEse hogar existe. Ya sea este con mejoras que aún no llegaron, o uno que todavía estás camino de encontrar. El corazón que lo imagina ya lo conoce.\n\nRespira. Y abre los ojos despacio.',
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
      'Soy Victoria. Siéntate en un lugar cómodo. Esta visualización te va a llevar al futuro — no para perderte en fantasías, sino para que el cuerpo experimente la sensación de haber llegado. Esa sensación, cuando es real, cambia las decisiones que tomas hoy.\n\nCierra los ojos. Respira profundo. Inhala completamente — hasta que el vientre se expanda. Exhala largo y lento. De nuevo. Inhala, y exhala soltando lo que cargues del día de hoy. Una vez más.\n\nBien. Ahora viaja conmigo. Vamos 12 meses adelante.\n\nImagina que te despiertas. Es la mañana de este mismo día, pero un año después. La etapa que estabas esperando ya llegó. No perfectamente — la vida real nunca es perfecta — pero llegó bien. Mejor de lo que imaginabas en los momentos de más duda.\n\n¿Dónde estás? ¿En el mismo lugar o en uno diferente? Observa el espacio donde te despiertas. ¿Qué ves cuando abres los ojos?\n\n¿Cómo se siente el cuerpo al levantarte? ¿Hay algo que ya no pesa como antes? ¿Hay una ligereza que faltaba hace un año?\n\nImagina que caminas por tu mañana. ¿Cómo es el desayuno de esa versión de ti? ¿Qué piensas mientras comes?\n\nAhora pregúntate: ¿qué fue lo más difícil de este año que acaba de pasar? No lo evites — míralo. Hubo momentos difíciles. ¿Cómo los manejaste? ¿Qué aprendiste de ellos?\n\nY ahora la pregunta más importante: ¿qué fue lo más inesperadamente bueno? ¿Qué llegó que no esperabas y que cambió algo en ti?\n\n¿Quién eres ahora, al cabo de estos 12 meses? ¿En qué eres diferente a quien eras al empezar? ¿Qué dejaste ir? ¿Qué construiste?\n\nImagina que llamas a alguien que quieres. ¿Qué le cuentas sobre este año que pasó? ¿Qué palabras usas?\n\nSiente la gratitud de esta versión de ti. No agradecimiento abstracto — la emoción real de quien ya cruzó lo que tenía que cruzar y lo sabe.\n\nEsa eres tú dentro de 12 meses. Y las decisiones de hoy la construyen.\n\nRespira profundo. Exhala lento. Y cuando estés lista, abre los ojos y trae esa sensación al presente.',
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
      'Soy Victoria. Cierra los ojos. Respira despacio — no hay prisa aquí.\n\nInhala largo. Exhala soltando la tensión de los hombros. De nuevo. Inhala, y exhala aflojando el pecho. Una vez más.\n\nBien. Ahora quiero pedirte que hagas algo: lleva tu memoria a un momento real de tu vida cuando confiaste en ti misma. No tiene que ser un momento épico. Puede ser pequeño. Puede ser incómodo. Puede ser que en ese momento estabas muerta de miedo pero lo hiciste de todas formas.\n\nUna decisión que tomaste sin tener la certeza completa. Un riesgo que diste. Una conversación difícil que tuviste cuando lo más fácil era callar. Algo que hiciste sola, sin pedir permiso, confiando en tu propio criterio.\n\n¿Ya llegó ese momento a tu memoria? Si no, espera un poco más. A veces la memoria necesita tiempo para encontrar lo que buscamos.\n\nAhora revívelo. ¿Dónde estabas físicamente? ¿Qué hora del día era? ¿Había alguien más o estabas sola?\n\nRecuerda cómo se sentía el cuerpo antes de hacerlo. ¿Había tensión? ¿Había el nudo en el estómago que aparece cuando algo importa de verdad?\n\nAhora recuerda el momento en que lo hiciste. Lo que dijiste, o lo que decidiste, o el primer paso que diste. Ese momento exacto de confiar en ti.\n\n¿Cómo salió? No tiene que haber salido perfecto — pero lo manejaste. Estuviste presente. Te mantuviste.\n\n¿Cómo se sintió después? ¿Había un alivio? ¿Había algo de orgullo propio — no arrogancia, sino la satisfacción de haber honrado lo que sentías?\n\nQuédate con esa sensación. La del después. La sensación de haber confiado en ti y haberlo atravesado.\n\nEsa sensación está disponible para ti ahora mismo. No la dejaste en ese momento del pasado — la llevas contigo. Es evidencia de que eres capaz. De que cuando confías en ti, algo se mueve.\n\nAnclala en el cuerpo. Respira con ella. Nota dónde vive — en el pecho, en los hombros, en la postura.\n\nEsta eres tú cuando confías. Ahora ya sabes cómo se siente.\n\nRespira profundo. Y abre los ojos.',
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
      'Soy Victoria. Cierra los ojos. Estamos yendo a un lugar de paz. Respira profundo tres veces primero — lento, sin apuro.\n\nInhala completamente. Exhala largo. De nuevo. Inhala, y exhala soltando lo que sea que estás cargando justo ahora. Una vez más — inhala y exhala.\n\nBien. Ahora imagina que estás sentada a la orilla de un río.\n\nEste río existe en algún lugar del mundo — un río de montaña, tranquilo, constante. El sonido del agua sobre las rocas. El olor a tierra húmeda y a verde. La temperatura fresca del aire cerca del agua.\n\nSiéntate en la orilla. Pon las manos sobre las rodillas. Siente el suelo firme debajo de ti — la hierba, la tierra o las piedras.\n\nAhora observa el río. El agua fluye sin luchar. Cuando hay una roca en el camino, el río no intenta moverla — la rodea. Cuando hay una curva inesperada, el río no se preocupa — simplemente dobla. No tiene resistencia. No tiene agenda. Solo fluye.\n\nObserva la superficie. Hay hojas que flotan. Pequeñas ramas. Algunos objetos que el río lleva consigo sin aferrarse. El río no retiene nada — lo toma, lo lleva, lo deja ir.\n\nAhora pienso en algo que estás cargando. Una preocupación que vuelve una y otra vez. Una situación que no puedes controlar. Una persona que te ocupa demasiado espacio mental. Un miedo, una deuda emocional, algo que llevas y que pesa.\n\nTómalo con cuidado — como si lo pudieras sostener en las manos. Siente su peso real por un momento.\n\nY ahora ponlo en el río. No lo lances con fuerza — ponlo suavemente sobre la superficie. Observa cómo el río lo toma sin esfuerzo. Sin drama. Sin destruirlo — simplemente lo lleva. Se aleja. Se hace más pequeño. Desaparece más allá de donde alcanzas a ver.\n\nSiente en el cuerpo lo que se libera cuando sueltas eso. ¿Hay algo que se afloja en el pecho? ¿En los hombros? ¿En la mente?\n\nQuédate sentada a la orilla un momento más. Escuchando el agua. Respirando el aire fresco.\n\nEl río fluye. Sin esfuerzo. Sin resistencia.\n\nTú también puedes.\n\nRespira. Y cuando estés lista, abre los ojos.',
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
      'Soy Victoria. Esta es la visualización más completa del catálogo. Vamos a recorrer tu vida entera — todas las áreas — en su versión de 12 meses hacia adelante. Necesitas al menos quince minutos de silencio real. Apaga notificaciones. Cierra la puerta si puedes.\n\nSiéntate cómoda o recuéstate. Cierra los ojos.\n\nEmpieza a respirar más lento que lo habitual. Inhala por la nariz en cuatro tiempos. Exhala por la boca en seis. Tres ciclos, sin prisa.\n\nInhala... dos, tres, cuatro. Exhala... dos, tres, cuatro, cinco, seis.\n\nDe nuevo. Inhala, exhala.\n\nUna vez más.\n\nBien. Ahora viajamos.\n\nImagina que abres los ojos — pero no hoy. Es este mismo día, pero doce meses después. Te despiertas.\n\n¿Cómo es esa mañana? ¿Qué es lo primero que sientes al abrir los ojos? ¿Hay paz, expectativa, propósito? Obsérvalo sin juzgar.\n\nAhora recorre tu vida área por área.\n\nDinero: ¿Cómo está tu situación económica en estos 12 meses? No el número ideal — el número real que haría una diferencia significativa en cómo vives. ¿Cómo ganas? ¿Hay libertad o hay aún presión? ¿Cómo es tu relación con el dinero — de escasez, de suficiencia, de abundancia?\n\nAmor: ¿Qué relaciones tienes en tu vida? Si estás en pareja, ¿cómo está esa relación — más profunda, más honesta, más libre? Si buscas amor, ¿qué está pasando en esa área? ¿Cómo das y recibes amor en las relaciones que ya tienes — familia, amistades, contigo misma?\n\nTrabajo: ¿Qué estás haciendo? ¿Te emociona lo que haces? ¿Sientes que tiene impacto? ¿Cómo se siente tu cuerpo cuando trabajas — con energía, con propósito, con alegría ordinaria?\n\nCuerpo: ¿Cómo se siente tu cuerpo en estos 12 meses? No el cuerpo perfecto — el cuerpo que se siente bien, descansado, cuidado con amor. ¿Qué lo cuida? ¿Qué hábitos tiene esa versión de ti?\n\nHogar: ¿Dónde vives? ¿Con quién? ¿Cómo se siente ese espacio?\n\nAhora observa un día ordinario completo. Cómo te mueves por la mañana, el mediodía, la tarde, la noche. ¿Hay paz en esa rutina? ¿Hay propósito? ¿Hay momentos de alegría que no dependen de nada extraordinario?\n\nEsa vida que acabas de ver es posible. No lejana — posible. Construible. Con las decisiones de hoy.\n\nRespira profundo. Exhala. Y cuando estés lista, abre los ojos.',
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
      'El 111 es una señal de alineación. Cuando aparece — en la hora del teléfono, en un recibo, en una placa de carro, en el número de un edificio — el universo te está diciendo: "Lo que estás pensando ahora mismo es importante. Elige con cuidado." Es un portal de manifestación abierto. Los pensamientos que tienes en ese momento se están sembrando en el campo energético con más fuerza que en otros momentos. Si eran pensamientos de expansión, de gratitud, de posibilidad, expándelos. Si eran pensamientos de miedo o escasez, cámbialos de inmediato — respira y dirige la mente hacia lo que quieres.',
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
      'El 333 es la señal de los guías, del universo, de algo más grande que tú misma que camina contigo aunque no siempre lo sientas. Cuando aparece, te dice con claridad: "No estás cargando esto sola. Hay apoyo disponible para ti ahora mismo — solo tienes que pedirlo y recibirlo." El 3 es el número de la trinidad — mente, cuerpo y alma en alineación — y cuando aparece tres veces, amplifica esa energía de apoyo invisible pero real. Es una invitación a pedir ayuda: a una persona, al universo, o simplemente a admitirte a ti misma que no tienes que resolver todo sola.',
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
      'El 888 es la señal más poderosa de abundancia material en la numerología angélica. Cuando aparece — en una hora, en un precio, en cualquier lugar donde los números hablan — anuncia que un ciclo de recepción está abierto en este momento. El 8 es el símbolo del infinito girado verticalmente: ciclos sin fin, flujo continuo, abundancia que se regenera. Tres ochos juntos amplifican esa energía de cosecha. No es momento de dudar de si lo mereces — es momento de estar abierta, de recibir con gratitud, de reconocer la abundancia que ya llega aunque quizás no la estés viendo todavía.',
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
      'Soy Victoria. Bienvenida a uno de los journalings más importantes del catálogo.\n\nLas creencias sobre el dinero no son tuyas — las heredaste. De tu familia, de tu cultura, de lo que escuchaste de pequeña: "el dinero no alcanza", "los ricos son así", "pedir es de necesitados", "el dinero corrompe", "nosotros no somos de ese tipo de personas". Esas frases se instalaron en la mente cuando eras chica, antes de que pudieras filtrarlas con criterio propio. Y desde entonces actúan como un software que corre en segundo plano — tomando decisiones financieras por ti sin que te des cuenta. Decidiendo cuánto cobras. Qué pides. Cuánto crees que mereces. Si recibes sin culpa o si encuentras formas de sabotear lo que llega.\n\nEl trabajo de hoy es sacar ese software a la luz. Lo que está a la luz, puede ser cambiado. Lo que permanece en la sombra, sigue operando sin permiso.\n\nNecesitas papel y bolígrafo — escribir a mano activa el procesamiento emocional de forma más profunda que el teclado. Pon treinta minutos en el cronómetro. Y cuando el ejercicio se sienta incómodo — que puede pasar — es señal de que llegaste a algo real. No te detengas ahí. Eso es exactamente el lugar más valioso.\n\nNo edites mientras escribes. La primera respuesta, la que salta sin pensar, es la más verdadera.',
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
      'Soy Victoria. Bienvenida a este espacio de honestidad sobre el amor.\n\nLa mayoría de las personas, cuando se les pregunta qué quieren en una relación, dan una lista de características de la otra persona: atento, divertido, estable, con buenos valores, que me haga reír. Esa lista no está mal — pero suele ser la capa superficial. Debajo de las características viven las necesidades emocionales reales: querer sentirse segura, querer ser vista de verdad, querer expansión en lugar de contracción, querer ligereza después de haber cargado mucho.\n\nEsas necesidades emocionales son las que realmente guían lo que atrae y lo que retiene. Y cuando no están claras, se buscan en las personas equivocadas o se confunden con lo que se supone que hay que querer.\n\nEste journaling llega ahí. A lo que está debajo. A lo que de verdad necesitas, más allá de la lista de características que cualquiera podría escribir.\n\nSiéntate en un lugar cómodo. Pon el teléfono en silencio. Escribe desde la honestidad real — no desde lo que "debería" quererse o lo que queda bien decir. Nadie va a leer esto si no quieres. Este espacio es completamente tuyo.\n\nUsa al menos veinte minutos. Si salen lágrimas o surge incomodidad, eso es que estás llegando a algo verdadero. Sigue escribiendo.',
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
      'Soy Victoria. Lo que vas a escribir en los próximos minutos puede ser una de las cosas más importantes que hayas escrito en mucho tiempo.\n\nEsta carta no es sobre tus logros ni sobre lo que has construido — es sobre quién eres. La versión más compasiva y sabia de ti misma — la que ya sabe que eres suficiente, que ve tus sombras sin condena, que entiende el contexto de cada decisión que tomaste — le escribe a la versión que todavía se juzga, que se compara, que cree que necesita ser diferente para merecer amor.\n\nTodas cargamos esas dos versiones a la vez. La que sabe y la que duda. La que se cuida y la que se critica. La sabia y la asustada. Esta carta es un puente entre ellas.\n\nAntes de empezar, siéntate en un lugar que te haga sentir cómoda y segura. Pon la mano izquierda sobre el corazón. Respira profundo tres veces. Y con esas respiraciones, convoca a la versión más compasiva de ti — la que existe aunque no siempre la sientas cerca.\n\nEscribe despacio. No corrijas mientras escribes — la primera versión, sin editar, es la más verdadera. Si lloras, eso es que la carta llegó a donde necesitaba llegar. Eso es bueno.\n\nDeja al menos veinticinco minutos para esto. No lo hagas con prisa.',
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
      'Soy Victoria. Bienvenida a una reflexión profunda sobre tu dirección profesional.\n\nTres años es el horizonte perfecto para este tipo de trabajo: suficientemente lejos para imaginar con ambición real — para que la mente no se frene con el "eso no es posible para el mes que viene" — y suficientemente cerca para que las acciones de hoy tengan consecuencias visibles en ese momento. Un año es demasiado inmediato. Diez años es tan lejano que la mente lo convierte en fantasía. Tres años es el punto donde ambición y realidad se encuentran.\n\nY la realidad es esta: si no trazas tu dirección antes de que empiece la semana, la semana la traza por ti. Las urgencias del día a día, los mensajes que llegan, lo que otros necesitan de ti — todo eso construye una vida sin que la hayas elegido conscientemente.\n\nEste journaling es la oportunidad de elegir.\n\nSiéntate en un lugar tranquilo con un cuaderno. No empieces pensando en metas concretas — empieza pensando en cómo quieres sentirte. Los números y los títulos vienen después. La dirección emocional va primero.\n\nDeja al menos veinte minutos sin interrupciones. Escribe como si nadie fuera a leer esto — con la honestidad que solo existe cuando no hay audiencia.',
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
      'Soy Victoria. Antes de empezar a escribir sobre el hogar que quieres, necesito preguntarte algo: ¿sabes cuál es la sensación que buscas? No la descripción del espacio — la sensación de estar dentro de él.\n\nEl hogar ideal no es una lista de características como en un listado de Airbnb: "cocina amplia, luz natural, jardín, dos habitaciones". Esas son las condiciones físicas. Lo que realmente hace que un hogar se sienta como hogar es algo diferente — es el tipo de vida que sucede adentro, la sensación que tienes al llegar, la versión de ti que aparece cuando estás en ese espacio.\n\nHay personas que viven en apartamentos pequeños y los sienten como refugios perfectos. Y hay personas que viven en casas grandes que nunca logran sentir como propias. La diferencia no está en los metros cuadrados — está en la intención, en la energía, en cómo el espacio responde a quién eres tú.\n\nEste journaling te ayuda a clarificar primero la sensación, luego las condiciones. Porque cuando sabes qué sensación buscas, puedes encontrarla en el espacio que tienes ahora — con ajustes pequeños — mientras construyes el que quieres.\n\nSiéntate donde te sientas cómoda. Si puedes, camina por tu hogar actual antes de empezar — para activar la experiencia sensorial del espacio. Escribe sin presupuesto en mente. Primero la verdad, después la logística.',
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
      'Soy Victoria. Estás en un punto de reinicio. Algo terminó — o está terminando — y el lienzo está en blanco delante de ti. Eso puede sentirse como libertad o como vértigo. A veces como las dos cosas al mismo tiempo.\n\nLos nuevos comienzos son, en su esencia, oportunidades de elegir conscientemente en lugar de continuar por inercia. Pero sin trabajo de introspección, los nuevos comienzos a menudo reproducen los patrones anteriores — porque nos llevamos a nosotras mismas adonde vamos. El problema no era el trabajo, era el patrón. No era la relación, era la dinámica. No era el lugar, era la creencia.\n\nEste journaling es para romper ese ciclo. Para que el nuevo comienzo sea realmente nuevo — no la versión 2.0 de lo mismo.\n\nFunciona mejor cuando el cierre anterior ya fue procesado al menos parcialmente. Si todavía estás en el duelo del cierre de lo que terminó, primero haz el journaling de soltar — y después vuelves aquí.\n\nSi ya pasaste por ese proceso, bienvenida. Es hora de mirar hacia adelante con intención real.\n\nSiéntate en un lugar tranquilo. Escribe sin filtros. Veinte minutos mínimo, sin interrupciones. La primera respuesta que llega siempre es más verdadera que la que viene después de pensarlo demasiado.',
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
      'Soy Victoria. El cerebro humano tiene un sesgo de negatividad — recuerda los fracasos con más vividez y más detalle que los éxitos. Es un mecanismo evolutivo que sirvió cuando el peligro era físico, pero que hoy crea un archivo mental desequilibrado: las veces que algo salió mal están ahí, nítidas y disponibles. Las veces que confiaste en ti misma y funcionó, tienden a desvanecerse.\n\nLa confianza en ti misma no es una creencia que decides tener — es una colección de evidencias. Cuando la duda llega con fuerza y dice "no puedes, no sabes, no eres suficiente", el cerebro busca pruebas de que eso es verdad. Las encuentra porque las ha almacenado con más detalle.\n\nEste journaling crea el archivo opuesto. Un registro activo, intencionado, de las veces que confiaste en ti y algo se movió. No para ignorar los fracasos — sino para que el archivo esté equilibrado. Para que cuando la duda busque pruebas de que no puedes, también encuentre las pruebas de que sí puedes.\n\nNo filtres por tamaño. Una conversación difícil que tuviste aunque te costara. Una decisión pequeña que tomaste sola y fue correcta. Un riesgo mínimo que diste y que te enseñó algo. Todos cuentan.\n\nToma quince minutos. Escribe despacio, con detalle. Este archivo es tuyo para siempre.',
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
      'Soy Victoria. Soltar no es un acto de voluntad que se decide de repente — es un proceso de reconocimiento que empieza por ver claramente qué estás cargando. Porque hay cosas que cargamos sin darnos cuenta de que las llevamos. Se volvieron tan parte del paisaje interno que ya no las distinguimos del fondo.\n\nHay personas que cargamos mucho tiempo después de que la relación terminó. Creencias que nos instalaron de chicas y que seguimos ejecutando como adultas sin haberlas elegido. Roles que asumimos en algún momento — la fuerte, la responsable, la que no pide — y que ya no nos representan pero que nos cuesta soltar porque no sabemos quiénes somos sin ellos. Rencores que mantienen una conversación viva en la mente con alguien que hace años no tiene ese espacio en nuestra vida real.\n\nEste journaling es el inventario. El acto de sacar todo a la luz y mirarlo con honestidad, sin drama, sin condena, y preguntarse: ¿esto todavía me sirve? ¿O lo estoy cargando por miedo al vacío que dejaría?\n\nEscribe sin juzgarte. Todo lo que salga tiene su lugar aquí — personas, creencias, roles, hábitos, versiones de ti misma, rencores, miedos, proyectos que no terminaste. No hay respuesta incorrecta. Solo hay lo que es verdad para ti ahora mismo.\n\nDeja veinte minutos para esto. Escribe a mano si puedes.',
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
      'Soy Victoria. Existe un problema bien documentado en psicología: en los momentos de mayor ansiedad, el cerebro entra en modo de amenaza y el acceso a los recursos que normalmente tienes disponibles — razonamiento, memoria de lo que funciona, capacidad de autorregulación — se reduce. Es como si el estrés bloqueara exactamente las herramientas que necesitas para manejarlo.\n\nPor eso no sirve decirse "necesito calmarme" cuando ya estás en el pico de la ansiedad. Porque en ese momento no recuerdas qué te calma. Solo recuerdas el estrés.\n\nLa solución es crear el mapa en frío — cuando estás tranquila. Documentar qué funciona realmente para ti antes de necesitarlo. Y tener ese mapa disponible cuando el cerebro en modo amenaza no puede construirlo desde cero.\n\nEso es lo que hace este journaling: construye tu mapa personal de recursos de calma. No lo que "debería" funcionar según los artículos de bienestar — lo que funciona para ti, en tu cuerpo, en tu vida.\n\nLo que calma a alguien más puede no calmarte a ti. Tal vez para una persona es meditar y para ti es limpiar la cocina. Tal vez para ella es hablar con alguien y para ti es silencio total. No hay respuesta correcta — solo la tuya.\n\nToma quince minutos. Escribe desde la experiencia real. Este mapa que construyes hoy te sirve cuando más lo necesites.',
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
      'Soy Victoria. Este es el journaling más importante del catálogo. No lo hagas con prisa.\n\nUn manifiesto personal no es una lista de metas de año nuevo que olvidas en febrero. No es una declaración de misión corporativa. Es algo más esencial: una declaración de identidad. Es el documento que te dice quién eres, qué valoras, cómo quieres vivir — no cómo quieres verte desde afuera, sino cómo quieres habitar tu propia vida desde adentro.\n\nEs el documento al que regresas cuando el ruido externo intenta definirte. Cuando alguien dice quién deberías ser. Cuando las redes sociales hacen que parezcas insuficiente. Cuando una etapa difícil te hace cuestionar todo. Tu manifiesto es el norte. La brújula que no cambia aunque cambie el viento.\n\nLos manifiestos personales más poderosos no se escriben de una vez — se construyen a lo largo del tiempo. Pero tienes que empezar. Y el primer borrador siempre es el más honesto, porque todavía no está pulido para la audiencia.\n\nAntes de empezar, encuentra treinta minutos reales de silencio. Cierra el teléfono. Si quieres, pon música instrumental suave que no tenga letra.\n\nEscribe sin pensar en cómo suena. Escribe lo que es verdad para ti ahora mismo. El manifiesto evoluciona — lo que escribes hoy es la versión de este momento, y eso ya es valioso.\n\nEmpecemos.',
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
      'Soy Victoria. Buenos días. Antes de revisar el teléfono, antes de que el día empiece a pedir cosas, estás aquí. Eso ya importa.\n\nLa gratitud matutina no es optimismo forzado ni positividad tóxica que ignora lo difícil. Es entrenamiento neurológico real. El sistema reticular activador — la parte del cerebro que actúa como filtro y decide qué información te llega y cuál no — se programa a través de la repetición. Cuando cada mañana buscas activamente lo bueno con especificidad, le estás diciendo al cerebro: "Esto es importante, priorízalo." Y el cerebro aprende. Empieza a notarlo mientras ocurre durante el día, no solo cuando te sientas a hacer el ejercicio.\n\nEl efecto es acumulativo. Tres días no se nota mucho. Tres semanas sí. Tres meses cambia la forma en que procesas el mundo.\n\nPero hay una trampa: la gratitud genérica no entrena el cerebro. "Mi familia, mi salud, mi trabajo" — si es lo mismo todos los días, el cerebro lo procesa en automático sin realmente sentirlo. La gratitud poderosa es específica. No "mi salud" — "que ayer pude caminar 40 minutos y sentir el sol". No "mi trabajo" — "que ayer una cliente me dijo que la ayudé y lo sentí real".\n\nEsa especificidad es lo que activa la emoción. Y la emoción es lo que recablea el filtro.\n\nToma cinco minutos. Escribe o piensa en cinco cosas concretas de ayer.',
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
      'Soy Victoria. La mente humana tiene un sesgo hacia la escasez. Evolutivamente, era más seguro notar lo que falta — el peligro, la falta de recursos, el riesgo — que celebrar lo que está. Ese mecanismo sirvió para sobrevivir. Pero hoy, en la mayoría de los contextos de vida moderna, crea una percepción distorsionada: la mente amplia lo que falta y encoge lo que ya existe.\n\nEste ejercicio invierte esa tendencia de forma deliberada. No para negar la realidad ni para fingir que "todo está bien cuando no lo está" — sino para entrenar al cerebro a ver lo que también es verdad: la abundancia que ya existe ahora mismo, que frecuentemente ignoramos porque ya la tenemos.\n\nLas personas que practican esta forma específica de gratitud financiera — gratitud por la abundancia que ya existe, no por la que quieren tener — reportan un cambio real en su relación con el dinero. No solo emocional: también en las decisiones que toman, en lo que notan, en las oportunidades que detectan. La frecuencia de gratitud activa diferentes filtros de atención.\n\nLa gratitud que no espera a tener más para ser agradecida es la más poderosa de todas. Es la que dice: "Lo que tengo ahora ya es abundancia" — y esa declaración cambia cómo recibes lo que viene.\n\nToma ocho minutos. Escribe desde lo específico y concreto, no desde lo abstracto.',
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
      'Soy Victoria. Hay un patrón muy común en la búsqueda del amor: concentramos tanta energía en el amor que todavía no llegó — la pareja que no aparece, la relación que no avanza, la conexión que falta — que dejamos de ver el amor que ya existe y ya está activo en nuestra vida.\n\nY eso tiene consecuencias. La atención que ponemos en el amor ausente lo amplifica como problema. La atención que ponemos en el amor presente lo amplifica como realidad. Lo que observamos crece.\n\nEste ejercicio redirige la atención. No para hacerte conformar con menos de lo que mereces — sino para que puedas ver con claridad cuánto amor ya hay en tu vida ahora mismo, en formas que quizás no estás contando como amor porque estás buscando una forma específica de él.\n\nEl amor no es solo romántico. Es la amiga que te escribe para ver cómo estás. Es la familiar que te hizo espacio cuando lo necesitabas. Es la desconocida que te sostuvo la puerta con una sonrisa real. Es el amor que te das a ti misma cuando te cuidas, cuando te dices no a lo que te hace daño, cuando te eliges.\n\nEso también es amor. Y merece ser visto.\n\nToma ocho minutos para este ejercicio. Escribe desde la honestidad y la apertura.',
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
      'Soy Victoria. El trabajo es uno de los áreas donde el sesgo de negatividad tiene más fuerza. Cada error, cada fracaso, cada cliente perdido, cada proyecto que no salió como esperabas se registra con claridad y permanece. Cada éxito, cada logro, cada habilidad que ya tienes y usas sin darte cuenta — tiende a desvanecerse rápido, especialmente si alrededor tuyo hay un ambiente que normaliza el logro sin celebrarlo.\n\nEl resultado es que muchas personas tienen una percepción de su propio trabajo y sus talentos mucho más negativa de lo que la realidad justifica. El síndrome del impostor vive ahí: en la distancia entre lo que realmente has construido y lo que puedes ver cuando te miras.\n\nEsta práctica de gratitud laboral hace algo específico: fuerza al cerebro a inventariar lo que ya existe antes de seguir buscando lo que falta. No para quedarte donde estás — sino para que la mejora parta de una base honesta, no de la distorsión.\n\nHay talentos que das por sentado porque te salen con facilidad. Esa facilidad no significa que no son valiosos — significa que son parte de tu don. La facilidad es la señal de que eso es genuinamente tuyo.\n\nToma ocho minutos. Escribe desde la honestidad y el reconocimiento real, no desde la modestia automática.',
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
      'Soy Victoria. Un estudio mostró que las personas pasan en promedio varios minutos al día criticando su apariencia frente al espejo — notando lo que no les gusta, lo que cambiarían, lo que no cumple el estándar. Y casi ningún tiempo agradeciendo lo que ese cuerpo hace.\n\nY sin embargo, ese cuerpo trabaja veinticuatro horas al día sin descanso para mantenerte viva. Ahora mismo, mientras lees esto, tu corazón está latiendo, tus pulmones están respirando, tu sistema digestivo está procesando, tu cerebro está integrando millones de señales simultáneamente. Todo sin que hagas nada. Todo de forma automática, constante, silenciosa.\n\nEl cuerpo que tanto criticas es también el que te lleva a todos los lugares donde has vivido momentos significativos. El que abrazó a personas que amas. El que sintió el placer, el movimiento, el descanso. El que se recuperó de enfermedades que en otro tiempo hubieran sido irreparables.\n\nEsta práctica no te pide que ames cada parte de tu cuerpo de inmediato — eso puede ser demasiado para donde estás ahora. Te pide algo más accesible: reconocer lo que hace. Ver lo que existe antes de concentrarte en lo que cambiarías.\n\nEse reconocimiento es el punto de partida de una relación diferente con el cuerpo. Una relación más justa. Más compasiva. Más útil para ambas.\n\nToma diez minutos. Escribe desde la honestidad, no desde lo que "deberías" sentir.',
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
      'Soy Victoria. Vivimos en una cultura que nos enseña a ver constantemente la distancia entre donde estamos y donde queremos estar. En el hogar, eso se traduce en mirar las paredes y ver lo que falta: el espacio que no alcanza, los muebles que quisieramos, la ubicación que sería mejor, las mejoras que no llegaron todavía.\n\nEsa mirada tiene su lugar — ayuda a construir hacia algo mejor. Pero cuando es la única mirada que existe, agota. Nunca hay suficiente. Nunca se llega. El hogar ideal siempre está en el futuro y el que tenemos ahora nunca es suficiente.\n\nEsta práctica cambia el ángulo. No para que te conformes con menos de lo que mereces — sino para que puedas ver lo que el hogar que ya tienes hace por ti todos los días sin que lo notes.\n\nTu hogar te protege de los elementos. Te da privacidad. Te da un espacio para descansar. Tiene memoria de momentos que importaron. Hay cosas en él que elegiste con cuidado. Hay rincones que ya son tuyos, que llevan tu energía, que te conocen.\n\nGracia genuina por el refugio que ya tienes no es conformismo — es el punto de partida desde el que construyes hacia más con paz en lugar de construir desde la insatisfacción crónica.\n\nCamina por tu hogar antes de empezar a escribir si puedes. Hazlo con los sentidos activos — ve, toca, siente. Eso activa una gratitud más encarnada que la que se construye solo desde la mente.',
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
      'Soy Victoria. Hay gratitud y hay gratitud avanzada. La primera es relativamente accesible: cuando las cosas van bien, cuando hay logros, cuando la vida fluye, agradecer no cuesta mucho. La mente ya está en expansión.\n\nLa gratitud cuando todo está difícil es otro nivel completamente. Cuando hay pérdida, cuando hay incertidumbre, cuando el dolor es real y presente — encontrar algo por lo que agradecer puede sentirse falso, forzado, incluso irrespetuoso con lo que estás viviendo.\n\nPero hay una diferencia importante entre dos tipos de gratitud en los momentos difíciles: la que dice "todo está bien y deberías estar feliz" — que es falsa y no ayuda — y la que dice "esto es difícil Y todavía hay cosas que siguen estando. No en lugar del dolor, junto a él." Esa segunda forma es real. Y es poderosa.\n\nLa investigación de psicología positiva — particularmente el trabajo de Martin Seligman y Barbara Fredrickson — muestra que encontrar elementos de gratitud durante momentos difíciles no niega el dolor, sino que expande el campo cognitivo y emocional lo suficiente para que el cerebro pueda acceder a recursos de resiliencia que el estrés solo tiende a bloquear.\n\nNo se trata de fingir. Se trata de que el dolor y la gratitud puedan coexistir — porque pueden.\n\nEste ejercicio no niega lo difícil. Lo acompaña, y busca lo que todavía está.\n\nToma diez minutos. Escribe desde la honestidad total.',
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
      'Soy Victoria. Estás en la cama o a punto de estarlo. Es de noche y el día terminó.\n\nHay investigación que muestra algo interesante sobre el sueño: la última emoción que procesas antes de dormirte influye en la calidad del descanso y en el estado con que amaneces. El subconsciente no se apaga cuando te duermes — continúa procesando la información del día. Si la última cosa que le das es la pantalla llena de noticias o el scroll de redes, o la lista de lo que no terminaste, eso es lo que procesa. Si la última cosa que le das es gratitud — aunque sea mínima, aunque el día haya sido difícil — eso es lo que procesa.\n\nNo es magia. Es simplemente darle al cerebro una dirección antes de que trabaje en piloto automático durante las horas de descanso.\n\nEsta práctica toma tres minutos. Está diseñada para hacerse en la cama, en la oscuridad, sin papel si quieres — solo tres preguntas en la mente antes de cerrar los ojos. Si quieres escribir, mejor. Pero no es necesario.\n\nLo que sí es necesario: que sea lo último que hagas antes de dormir. No antes del scroll. Después. O mejor: en lugar del scroll.\n\nHazlo ahora.',
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
      'Soy Victoria. El scripting es una de las herramientas de manifestación más efectivas que existen — no por razones místicas, sino porque combina tres elementos que el inconsciente procesa con mucha fuerza: escritura a mano, tiempo pasado y emoción real.\n\nCuando escribes en pasado sobre algo que quieres ("Hoy recibí...") en lugar de en futuro ("Quiero recibir..."), el cerebro procesa esa escritura de forma diferente. El futuro activa el deseo. El pasado activa la experiencia. Y la experiencia emocional es lo que más influye en las decisiones, las creencias y la energía con que operas en el mundo.\n\nEl scripting de dinero le habla directamente al inconsciente en el idioma que entiende: imágenes concretas, emociones reales y tiempo presente-pasado. Esta guía te lleva por cuatro fases: recibir, describir, agradecer y expandir. Cada fase profundiza la experiencia emocional de la anterior.\n\nAntes de empezar: ten papel y bolígrafo físicos. No el teléfono, no el ordenador — papel. El cerebro procesa diferente cuando escribe a mano. Es más lento, más integrado, más emocional. Si tienes música instrumental que te guste, ponla. No te preocupes por la ortografía ni la caligrafía. No te detengas a corregir — fluye.\n\nToma al menos quince minutos para este ejercicio. Y cuando termines, guárdalo — léelo de nuevo antes de dormir esta noche.',
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
      'Soy Victoria. El scripting de amor es uno de los más poderosos — y también uno de los más malentendidos. Mucha gente lo usa para describir físicamente a la persona que quieren atraer: altura, color de ojos, profesión, características específicas. Y ese enfoque limita el campo de posibilidades a una imagen muy estrecha mientras pierde lo que realmente importa.\n\nEl scripting de amor funciona mejor — de forma significativamente más poderosa — cuando describes cómo te SIENTES en esa relación. No cómo se ve la otra persona. Cómo te sientes tú. Porque lo que tu corazón realmente busca no es una descripción física — es una experiencia emocional. La experiencia de sentirte vista. Elegida. Libre. Segura. Tú misma.\n\nY esa experiencia puede llegar en formas que la mente no puede predecir ni diseñar de antemano. Cuando te enfocas en la emoción en lugar de la imagen, abres el campo. Dejas que lo que te corresponde llegar en su forma real, no en la forma que imaginaste desde la limitación actual.\n\nAntes de empezar, pon la mano sobre el corazón. Respira tres veces. Conecta con la sensación de ser amada de verdad — aunque sea solo un instante de recuerdo o de imaginación. Esa sensación es tu punto de partida.\n\nEscribe en tiempo presente, como si este amor ya existe. Toma doce minutos mínimo. Escribe despacio, sintiendo cada palabra.',
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
      'Soy Victoria. La mayoría de los scriptings de trabajo se enfocan en las condiciones externas: el salario, el título, la empresa, las responsabilidades. Y esas condiciones importan. Pero hay algo que importa más y que suele perderse en esa lista: cómo se siente el trabajo desde adentro.\n\nEl scripting de trabajo funciona mejor cuando describes la experiencia interna — cómo te sientes al hacer ese trabajo, qué dice el cuerpo cuando llegás a él, qué nivel de energía tienes, cómo se siente tu identidad dentro de ese rol. Eso es lo que el inconsciente procesa con más fuerza. Eso es lo que calibra la dirección hacia la que tus decisiones y acciones se mueven.\n\nEscribir en tiempo pasado activa la experiencia emocional en el cerebro de una forma que el futuro no puede. Cuando escribes "Hoy fue mi primer día en..." o "Acabo de recibir la noticia de...", el cerebro activa redes neurológicas similares a las de un recuerdo real. Eso crea una impronta emocional que influye en las creencias y decisiones que vienen después.\n\nAntes de empezar: siéntate en silencio dos minutos. Cierra los ojos. Piensa en ese trabajo — lo más concreto que puedas. ¿Qué es? ¿Para quién o con quién? ¿Qué hace que sea exactamente lo que quieres? Cuando tengas una imagen, aunque sea borrosa, abre los ojos y empieza a escribir.\n\nEscribe en tiempo pasado. Toma quince minutos mínimo. No te detengas a corregir — fluye.',
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
      'Soy Victoria. Este es el scripting de identidad — el más profundo del catálogo porque trabaja quién eres, no lo que tienes o logras.\n\nLa mayoría de los scriptings y visualizaciones se enfocan en las condiciones externas de la vida ideal: el dinero, el trabajo, la relación, el hogar. Esos son válidos. Pero hay algo que va antes de todas esas condiciones: la identidad. La relación que tienes contigo misma. La forma en que te hablas, te cuidas, te permites ocupar espacio, te das valor.\n\nLa mejor versión de ti no es perfecta. No tiene todo resuelto. No ha logrado todo lo que quiere. La mejor versión de ti es auténtica, equilibrada y en paz consigo misma — lo que significa que se mueve por el mundo desde un lugar interno diferente, no desde la búsqueda de validación o desde el miedo a no ser suficiente.\n\nEse cambio interno es lo que cambia todo lo demás. La relación que tienes contigo misma es el filtro a través del cual procesas todo: el trabajo, el amor, el dinero, las oportunidades. Si ese filtro está lleno de autocrítica, las mejores circunstancias externas no se sienten bien. Si ese filtro es de paz y aceptación, hasta los momentos ordinarios tienen algo diferente.\n\nEscribe en presente o pasado inmediato, como si fuera el diario de esa versión de ti. No el diario de lo que logró — el diario de cómo se siente siendo quien es.\n\nToma veinte minutos. Escribe sin autocensura.',
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
      'Soy Victoria. El scripting del hogar tiene un principio específico que lo hace especialmente efectivo: los cinco sentidos.\n\nEl cerebro no distingue completamente entre una experiencia real y una imaginada con suficiente detalle emocional. Los estudios de neuroimagen muestran que imaginar una acción activa muchas de las mismas redes cerebrales que realizar esa acción. Eso es exactamente lo que usa el scripting sensorial: cuando describes lo que ves, lo que hueles, lo que tocas, lo que escuchas en ese hogar, el cerebro procesa esa descripción con una intensidad emocional que el pensamiento abstracto no puede generar.\n\nPor eso el scripting del hogar funciona mejor cuando es específico y sensorial. No "una casa bonita" — sino "la luz de la tarde que entra por la ventana oeste y calienta el piso de madera del cuarto". No "huele bien" — sino "huele a café y a algo de madera y a limpio, el olor que tiene un hogar cuando está habitado con cuidado".\n\nEsa especificidad activa la emoción. La emoción activa la impronta en el inconsciente. El inconsciente afecta las decisiones. Las decisiones construyen la realidad.\n\nAntes de empezar: cierra los ojos treinta segundos. Imagina que ya estás en ese hogar. Siente la temperatura del aire, la textura de lo que tocas, la luz del lugar. Cuando hayas entrado en esa experiencia aunque sea un momento, abre los ojos y empieza a escribir desde ahí.\n\nNo pongas límites de presupuesto. El scripting trabaja antes de que llegue la logística.',
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
      'Soy Victoria. La mayoría de las personas empiezan el año — o un ciclo nuevo — con una lista de metas. Y en febrero, esa lista está olvidada. No porque la gente sea irresponsable, sino porque las listas de metas trabajan con el pensamiento racional, que es el primero en claudicar cuando las circunstancias se ponen difíciles.\n\nLo que sostiene el camino cuando las circunstancias son difíciles es la emoción. La sensación de ya haber llegado. El ancla emocional de saber, en el cuerpo, cómo se siente la vida que quieres construir.\n\nEste scripting crea ese ancla. Funciona desde el final: te coloca en diciembre del año que estás iniciando, mirando hacia atrás. Ya pasó. Ya lo viviste. Y desde ahí describes lo que fue. Esa perspectiva activa emociones de gratitud, orgullo y satisfacción que ninguna lista de metas puede activar — porque esas emociones solo existen en el pasado, no en el futuro.\n\nEl cerebro que experimenta esas emociones, aunque sea en el scripting, las integra como recursos reales. Y esos recursos influyen en las decisiones que tomas cuando el año está siendo difícil.\n\nAntes de empezar: cierra los ojos. Imagina que es diciembre. Siente ese momento. El año pasó. ¿Cómo se siente tu cuerpo en esa imagen? ¿Hay satisfacción? ¿Hay gratitud? Cuando tengas aunque sea un atisbo de esa sensación, abre los ojos y empieza a escribir.\n\nToma veinte minutos. Escribe desde el corazón.',
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
      'Soy Victoria. Este es el scripting más expansivo del catálogo — y está diseñado para las que ya no se conforman con imaginar pequeño.\n\nCinco años es un horizonte donde todo puede cambiar. No gradualmente — radicalmente. En cinco años, personas que estaban en empleos que odiaban construyeron negocios que las apasionan. En cinco años, relaciones que se veían imposibles se volvieron profundas. En cinco años, personas que no conocían su propio potencial lo descubrieron y lo multiplicaron. Todo eso es posible. Y el scripting a cinco años es el ejercicio que más trabaja la imaginación expandida — la que ve más allá del "realismo" que suele ser solo el límite de lo que creemos merecer.\n\nHay una regla para este scripting: nada de filtros. Cero. Cuando la mente diga "eso no es posible", escribes exactamente eso y sigues. La autocensura es el mayor bloqueador del scripting. Y la autocensura suele camuflarse como "realismo" o "madurez".\n\nLo que escribas en este scripting no es una promesa ni un contrato — es una dirección. Una intención tan clara y tan sentida que empieza a afectar las decisiones pequeñas de los próximos cinco años. Y son esas decisiones pequeñas las que, acumuladas, construyen o no construyen esa vida.\n\nAntes de empezar: respira tres veces profundo. Cierra los ojos un momento. Imagina que han pasado cinco años. Solo el cuerpo, el silencio, esa imagen. Y cuando estés lista, abre los ojos y empieza sin frenos.\n\nDeja al menos veinticinco minutos para este scripting.',
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
      'Soy Victoria. El síndrome del impostor tiene un mecanismo muy específico: vive de la amnesia selectiva de tus logros. La mente en modo impostor recuerda los errores con nitidez y encoge los éxitos, los minimiza, los atribuye a la suerte o a las circunstancias. "Salió bien de casualidad." "Cualquiera hubiera podido." "Solo tuve suerte."\n\nEse mecanismo no es la verdad — es una distorsión cognitiva bien documentada que afecta más a personas de alto rendimiento que a las demás, precisamente porque quienes se esfuerzan más tienden a exigirse estándares más altos y a notar más la distancia entre donde están y donde creen que deberían estar.\n\nEl antídoto no es más esfuerzo ni más logros — es el inventario honesto de lo que ya has construido, sobrevivido y logrado. Traer a la conciencia, con detalle y sin minimizar, la evidencia real de tu capacidad.\n\nEste ejercicio activa ese inventario. No para que te quedes donde estás — para que lo que ya has construido te sirva de base sólida desde la cual seguir construyendo, en lugar de sentir que cada nuevo paso es el primero.\n\nUn logro no necesita ser impresionante para otros — necesita haber costado algo para ti. Necesita ser real. Eso es suficiente para que cuente.\n\nDeja quince minutos. Escribe sin minimizar. Sin el "pero" ni el "aunque". Solo lo que lograste, directo.',
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
      'Soy Victoria. Los límites tienen mala reputación. Muchas los asocian con ser difíciles, con cerrar puertas, con el conflicto. Pero un límite no es un muro — es una definición honesta de cómo necesitas ser tratada para poder dar lo mejor de ti en una relación, en un trabajo, en cualquier contexto donde compartes tu energía y tu tiempo.\n\nY hay algo importante sobre cómo se ponen los límites más efectivos: no se ponen desde el enojo acumulado, que suele salir con más fuerza de la que la situación requiere y que pone a la otra persona a la defensiva. Se ponen desde la claridad — desde el conocimiento tranquilo de lo que necesitas para estar bien, antes de llegar al punto de saturación.\n\nPara poner límites desde la claridad, primero hay que saber cuáles son. Y eso requiere tiempo de reflexión honesta, porque muchas de nosotras no tenemos claro qué necesitamos — solo sabemos cuándo algo cruza la línea porque el cuerpo lo dice con cansancio, resentimiento o distancia.\n\nEste ejercicio ayuda a hacer ese trabajo antes de que llegue la urgencia. A identificar los límites que ya necesitas poner pero que todavía no has articulado. A practicar cómo comunicarlos — en una frase simple, directa, desde el amor y no desde el enojo.\n\nNecesitas privacidad y al menos veinte minutos. Escribe desde la honestidad total — nadie va a leer esto si no quieres.',
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
      'Soy Victoria. Vivimos en una cultura que trata el cuerpo como proyecto permanente: siempre hay algo que mejorar, reducir, tonificar, corregir, hacer diferente. Y ese proyecto nunca termina, porque los estándares se mueven constantemente. El resultado es que muchas personas pasan años — a veces décadas — en guerra con su propio cuerpo. Criticándolo en el espejo. Comparándolo con otros. Esperando a sentirse bien consigo mismas solo cuando el cuerpo sea diferente a como es.\n\nEse ruido interno tiene un costo enorme. No solo emocional — también práctico. La energía que se gasta en la guerra con el cuerpo es energía que no está disponible para crear, conectar, vivir, construir lo que importa.\n\nEsta práctica no te pide que ames cada parte de tu cuerpo de inmediato. Eso puede ser demasiado, especialmente si llevas años en esa relación crítica. Lo que te pide es algo más accesible y honesto: empezar por el respeto. Por reconocer lo que el cuerpo hace antes de entrar en lo que te gustaría que fuera diferente.\n\nEl respeto no requiere que te guste todo. Solo requiere que reconozcas que este cuerpo está de tu lado — que trabaja para ti, no contra ti.\n\nEste ejercicio puede hacerse frente al espejo o con los ojos cerrados. Elige lo que hoy se sienta más accesible. Ambas opciones son válidas.\n\nDeja quince minutos. Escribe o reflexiona desde la honestidad y la apertura.',
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
      'Soy Victoria. La voz que te dice que no eres suficiente, que lo que haces no es bueno, que los demás te van a juzgar — esa voz no es el enemigo. Es una parte de ti que aprendió, en algún momento temprano de tu vida, que criticarte tú primero era una forma de protección. Si ya te señalabas los errores antes de que los demás lo hicieran, el golpe era más pequeño. Si ya te achicabas antes de que te pidieran que te achicaras, el rechazo dolía menos.\n\nEra una estrategia de supervivencia que en su momento tuvo sentido. El problema es que esa voz quedó activa mucho después de que dejó de ser necesaria. Y ahora opera en automático, criticando preventivamente situaciones que no representan ninguna amenaza real.\n\nEntender el origen del crítico interno — y reconocer que tiene una intención positiva aunque su método sea dañino — es el primer paso para transformarlo. No para silenciarlo por completo, lo cual suele ser imposible, sino para cambiar la relación que tienes con esa voz. Para no creerle automáticamente. Para poder responderle en lugar de obedecerla.\n\nEste ejercicio te lleva por ese proceso: identificar al crítico, entender su origen, reconocer su intención oculta, y construir una respuesta compasiva que lo transforma.\n\nEscribe sin editar. La voz crítica es más honesta cuando no la filtras. Y la transformación ocurre después, en la cuarta y quinta pregunta. Déjate llegar ahí.\n\nDeja veinte minutos de privacidad real.',
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
      'Soy Victoria. Hay una distinción que cambia todo cuando la entiendes: la diferencia entre autoestima y validación.\n\nLa validación es externa. Depende de lo que otros piensan, de los comentarios que recibes, del número de likes, de la aprobación de personas específicas. La validación fluctúa — sube cuando llega y baja cuando no. Es inestable por naturaleza, porque depende de factores fuera de tu control.\n\nLa autoestima real es interna. No depende de la mirada externa — viene de la relación que tienes contigo misma cuando nadie está mirando. De cómo te tratas cuando cometes un error. De lo que eliges cuando nadie te está evaluando. De quién eres en el silencio de tu vida privada.\n\nMuchas personas no conocen bien a esa versión de sí mismas — la que existe cuando no hay audiencia. Porque vivimos en una cultura que nos entrena para curar la imagen pública: lo que publicamos, cómo presentamos nuestra vida, qué mostramos y qué escondemos. Y esa performance se vuelve tan habitual que a veces ya no sabemos con claridad quiénes somos sin ella.\n\nEste ejercicio explora exactamente eso. Quién eres cuando nadie te ve. Qué valoras de verdad. Qué necesitas que todavía no te estás dando. Qué partes tuyas esconden que en realidad son de las más genuinas.\n\nEscribe como si nadie fuera a leer esto. Porque nadie va a hacerlo si no quieres. Este espacio es completamente tuyo.\n\nDeja veinte minutos de privacidad real.',
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
