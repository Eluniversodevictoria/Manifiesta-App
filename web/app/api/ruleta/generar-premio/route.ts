import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdmin } from '@supabase/supabase-js';

const ai = new Anthropic();
const AI_MODEL = process.env.AI_MODEL ?? 'claude-haiku-4-5-20251001';

// Prompt específico por tipo de premio
const PROMPTS: Record<string, (deseo: string) => string> = {
  meditacion: (deseo) => `Eres Victoria, guía espiritual cálida. Escribe una meditación guiada de manifestación de 8-10 minutos para una usuaria cuyo deseo es: "${deseo}".

Estructura:
1. **Preparación** (2-3 oraciones): postura, respiración, cierre de ojos.
2. **Entrada al cuerpo** (3-4 oraciones): relajación progresiva desde los pies hasta la cabeza.
3. **El lugar sagrado** (4-5 oraciones): visualización de un lugar seguro y hermoso.
4. **El encuentro con tu deseo** (5-6 oraciones): ver, sentir y vivir el deseo ya cumplido — específico para "${deseo}".
5. **La recepción** (3-4 oraciones): el universo confirma, la usuaria agradece.
6. **El regreso** (2-3 oraciones): volver suavemente, llevar la sensación consigo.

Escribe en segunda persona (tú), tono suave y presente, como si fuera un audio. Sin markdown de cabeceras — usa solo el nombre de cada sección en negrita. Español neutro.`,

  ritual_lunar: (deseo) => `Eres Victoria, guía espiritual. Escribe un ritual de luna llena de 3 pasos para amplificar la manifestación de una usuaria cuyo deseo es: "${deseo}".

Cada paso tiene:
- **Nombre del paso** (ej: "Paso 1 — La intención")
- Instrucción concreta de 3-4 oraciones, específica para su deseo
- Un elemento físico simple que necesita (vela, papel, agua, cristal, etc.)

Cierra con una frase corta de cierre sagrado. Tono cálido, misterioso y práctico. Español neutro.`,

  afirmacion_vip: (deseo) => `Eres Victoria, guía espiritual. Crea un set de 7 afirmaciones de alta frecuencia para una usuaria cuyo deseo es: "${deseo}".

Cada afirmación:
- En primera persona ("Yo soy", "Yo tengo", "Yo recibo"...)
- Específica para su deseo, no genérica
- En tiempo presente
- Máximo 15 palabras

Después de las 7 afirmaciones, escribe una instrucción de 2 oraciones sobre cómo usarlas (cuándo, cómo, con qué energía). Español neutro.`,

  script_magico: (deseo) => `Eres Victoria, guía espiritual. Escribe un script de scripting guiado de 5 minutos para una usuaria cuyo deseo es: "${deseo}".

El scripting es escribir a mano como si el deseo ya ocurrió. Guía así:
1. **Apertura** (2 oraciones): invita a tomar papel y lápiz, respirar.
2. **La instrucción del script** (3-4 oraciones): explica exactamente qué escribir — desde qué perspectiva, en qué tiempo, qué incluir — específico para "${deseo}".
3. **Ejemplo de inicio** (1 párrafo de 4-5 oraciones): escribe tú el comienzo del script como si fuera la voz de la usuaria, en primera persona y pasado/presente perfecto ("Hoy amanecí sintiendo..."). Hazlo específico para su deseo.
4. **Cierre** (2 oraciones): cómo terminar y qué hacer con el papel.

Tono cálido y práctico. Español neutro.`,

  decreto_especial: (deseo) => `Eres Victoria, guía espiritual. Crea un decreto de manifestación de alta vibración para una usuaria cuyo deseo es: "${deseo}".

El decreto:
- 5-7 líneas, en primera persona, tiempo presente
- Rítmico y poderoso — se siente bien pronunciarlo en voz alta
- Específico para su deseo, no frases genéricas
- Empieza con "YO DECRETO que..."

Después del decreto, escribe una instrucción corta de 2-3 oraciones: cuándo pronunciarlo, cuántas veces, con qué actitud. Español neutro.`,

  mensaje_secreto: (deseo) => `Eres Victoria, mensajera del universo. La usuaria acaba de tirar las cartas y el universo tiene un mensaje importante para ella en relación a su deseo: "${deseo}".

Escribe el mensaje del universo:
- 4-6 oraciones en segunda persona (tú)
- Específico para su deseo — no genérico
- Tono místico, amoroso y directo
- Incluye una señal o sincronía que debe observar esta semana
- Cierra con una frase corta de afirmación poderosa

No uses frases cliché como "el universo conspira". Habla con claridad y misterio. Español neutro.`,

  sorpresa: (deseo) => `Eres Victoria, guía espiritual. La usuaria acaba de ganar un ritual exclusivo de manifestación creado solo para su deseo: "${deseo}".

Crea un ritual sorpresa único de 4 pasos que no sea luna llena ni scripting — algo original:
- Puede ser con elementos como el espejo, la voz, movimiento, agua, incienso, visualización activa, música, etc.
- Cada paso: **nombre** + instrucción de 3-4 oraciones + qué necesita
- El ritual debe sentirse especial y diferente a lo habitual

Termina con una promesa de 1-2 oraciones sobre lo que este ritual activa específicamente para su deseo. Tono misterioso y emocionante. Español neutro.`,

  joya_biblioteca: (deseo) => `Eres Victoria, guía espiritual. La usuaria acaba de desbloquear el Ritual de los 33 días — uno de los más poderosos para manifestar. Su deseo es: "${deseo}".

Explica el ritual de los 33 días adaptado a su deseo:
1. **Qué es** (2-3 oraciones): el origen y por qué funciona.
2. **Cómo hacerlo** (4-5 oraciones): instrucción exacta día a día — qué escribir, cuántas veces, en qué momento, en qué cuaderno — específico para "${deseo}".
3. **Reglas sagradas** (3 reglas cortas en lista): qué NO hacer durante los 33 días.
4. **El día 33** (2 oraciones): cómo cerrar el ciclo.

Tono serio, sagrado y emocionante. Español neutro.`,
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { giro_id, premio_id } = await req.json() as { giro_id: string; premio_id: string };
  if (!giro_id || !premio_id) return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 });

  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // Verificar que el giro pertenece a esta usuaria
  const { data: giro } = await admin
    .from('ruleta_giros')
    .select('contenido_generado')
    .eq('id', giro_id)
    .eq('user_id', user.id)
    .single();

  if (!giro) return NextResponse.json({ error: 'Giro no encontrado' }, { status: 404 });

  // Cache: devolver si ya se generó antes
  if (giro.contenido_generado) {
    return NextResponse.json({ contenido: giro.contenido_generado });
  }

  // Obtener el deseo activo de la usuaria para personalizar
  const { data: manifestacion } = await supabase
    .from('manifestaciones')
    .select('deseo')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const deseo = (manifestacion as { deseo: string } | null)?.deseo ?? 'vivir con abundancia, paz y amor';

  const promptFn = PROMPTS[premio_id];
  if (!promptFn) return NextResponse.json({ error: 'Premio desconocido' }, { status: 400 });

  const message = await ai.messages.create({
    model: AI_MODEL,
    max_tokens: 1024,
    messages: [{ role: 'user', content: promptFn(deseo) }],
  });

  const contenido = (message.content[0] as { type: string; text: string }).text.trim();

  // Guardar en DB para no regenerar
  await admin
    .from('ruleta_giros')
    .update({ contenido_generado: contenido })
    .eq('id', giro_id);

  return NextResponse.json({ contenido });
}
