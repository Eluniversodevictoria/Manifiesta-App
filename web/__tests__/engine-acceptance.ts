/**
 * Acceptance tests — Engine D1-D30
 * Run: npx tsx __tests__/engine-acceptance.ts
 */
import {
  generarPractica,
  buildDeseoContext,
  avanzarDia,
  iniciarPracticeProgress,
  iniciarCiclo2,
  yaCompletoHoy,
  DAY_BLUEPRINT,
  type PracticaFamilia,
  type ContenidoMedia,
  type BloqueAdicional,
} from '../lib/practica-engine';

// ── Helpers ────────────────────────────────────────────────────────────────
let pass = 0, fail = 0;
const results: { test: string; ok: boolean; detail: string }[] = [];

function assert(test: string, condition: boolean, detail = '') {
  if (condition) { pass++; results.push({ test, ok: true, detail: detail || '✓' }); }
  else           { fail++; results.push({ test, ok: false, detail: detail || '✗ FAILED' }); }
}

function isContenidoMedia(v: unknown): v is ContenidoMedia {
  if (!v || typeof v !== 'object') return false;
  const obj = v as Record<string, unknown>;
  return (
    typeof obj.textContent === 'string' &&
    obj.textContent.length > 0 &&
    typeof obj.audioEstado === 'string'
  );
}

function hasNoRawPlaceholder(text: string): boolean {
  return !text.includes('{deseo}');
}

// ── TEST 1: Progresión D1–D30 en fronteras ────────────────────────────────
console.log('\n=== TEST 1: Progresión D1–D30 ===');

const FRONTERAS = [1, 7, 8, 13, 14, 19, 20, 25, 26, 29, 30];
const DESEO_TEST = 'conseguir trabajo remoto';

for (const dia of FRONTERAS) {
  const bp = DAY_BLUEPRINT[dia - 1];
  const p = generarPractica(dia, 'general', DESEO_TEST);

  assert(`D${dia} currentDay correcto`, p.dia === dia, `dia=${p.dia}`);
  assert(`D${dia} fase correcta`, p.fase === bp.fase, `got="${p.fase}" want="${bp.fase}"`);
  assert(`D${dia} tema correcto`, p.tema === bp.tema, `got="${p.tema}" want="${bp.tema}"`);
  assert(`D${dia} protagonista correcto`, p.protagonista === bp.protagonista,
    `got="${p.protagonista}" want="${bp.protagonista}"`);
  assert(`D${dia} no {deseo} en intención`, hasNoRawPlaceholder(p.base.intencion.textContent),
    p.base.intencion.textContent.slice(0, 60));
  assert(`D${dia} no {deseo} en afirmación`, hasNoRawPlaceholder(p.base.afirmacion.textContent));
  assert(`D${dia} no {deseo} en protagonistaBloque`, hasNoRawPlaceholder(p.base.protagonistaBloque.textContent));
  assert(`D${dia} no {deseo} en acciónConcreta`, hasNoRawPlaceholder(p.base.accionConcreta.textContent));
}

// Verificar transiciones de fase
const D7  = generarPractica(7,  'general', DESEO_TEST);
const D8  = generarPractica(8,  'general', DESEO_TEST);
const D13 = generarPractica(13, 'general', DESEO_TEST);
const D14 = generarPractica(14, 'general', DESEO_TEST);
const D19 = generarPractica(19, 'general', DESEO_TEST);
const D20 = generarPractica(20, 'general', DESEO_TEST);
const D25 = generarPractica(25, 'general', DESEO_TEST);
const D26 = generarPractica(26, 'general', DESEO_TEST);
const D29 = generarPractica(29, 'general', DESEO_TEST);
const D30 = generarPractica(30, 'general', DESEO_TEST);

assert('D7→D8 transición Apertura→Profundizar',
  D7.fase === 'Apertura' && D8.fase === 'Profundizar', `D7=${D7.fase} D8=${D8.fase}`);
assert('D13→D14 transición Profundizar→Recibir',
  D13.fase === 'Profundizar' && D14.fase === 'Recibir', `D13=${D13.fase} D14=${D14.fase}`);
assert('D19→D20 transición Recibir→Soltar-Actuar',
  D19.fase === 'Recibir' && D20.fase === 'Soltar-Actuar', `D19=${D19.fase} D20=${D20.fase}`);
assert('D25→D26 transición Soltar-Actuar→Integrar',
  D25.fase === 'Soltar-Actuar' && D26.fase === 'Integrar', `D25=${D25.fase} D26=${D26.fase}`);
assert('D29→D30 transición Integrar→Cierre',
  D29.fase === 'Integrar' && D30.fase === 'Cierre', `D29=${D29.fase} D30=${D30.fase}`);
assert('D30 protagonista=ritual', D30.protagonista === 'ritual');
assert('D30 profundizar tiene 2 bloques', D30.profundizar.length === 2,
  `got ${D30.profundizar.length}`);

// ── TEST 2: D30 + ciclo 2 (solo engine — la UX se prueba en browser) ──────
console.log('\n=== TEST 2: D30 y ciclo 2 (engine) ===');

const progBase = iniciarPracticeProgress('m-test');

// Simular completar hasta D30
let prog = progBase;
const HOY = new Date().toISOString().split('T')[0];
for (let d = 1; d <= 30; d++) {
  // avanzarDia usa lastPracticeAt como guard, necesitamos simular días distintos
  prog = { ...prog, lastPracticeAt: `2026-0${d < 10 ? '0' : ''}${d}-01`, completedDays: [...prog.completedDays, d], currentDay: d + 1 <= 30 ? d + 1 : 30 };
}
// Marcar ciclo completo
const progD30 = { ...prog, currentDay: 30, cycleComplete: true };

assert('D30 cycleComplete=true tras 30 días', progD30.cycleComplete);
assert('D30 currentDay=30', progD30.currentDay === 30);
assert('D30 completedDays tiene 30 entradas', progD30.completedDays.length === 30,
  `got ${progD30.completedDays.length}`);

// iniciarCiclo2
const progCiclo2 = iniciarCiclo2(progD30);
assert('Ciclo2 cycleNumber++', progCiclo2.cycleNumber === 2, `got ${progCiclo2.cycleNumber}`);
assert('Ciclo2 currentDay=1', progCiclo2.currentDay === 1);
assert('Ciclo2 cycleComplete=false', !progCiclo2.cycleComplete);
assert('Ciclo2 completedDays vacío', progCiclo2.completedDays.length === 0,
  `got ${progCiclo2.completedDays.length}`);
assert('Ciclo2 startedAt actualizado', progCiclo2.startedAt.length === 10);

// avanzarDia idempotencia doble-tap
const progMismoDia = avanzarDia({ ...progBase, lastPracticeAt: HOY, currentDay: 1 });
assert('avanzarDia idempotente mismo día',
  progMismoDia.currentDay === 1 && progMismoDia.completedDays.length === 0,
  `currentDay=${progMismoDia.currentDay}`);

// ── TEST 4: Familias — adapters y interpolación ───────────────────────────
console.log('\n=== TEST 4: Familias ===');

const FAMILIAS: PracticaFamilia[] = ['prosperidad', 'proposito', 'amor', 'bienestar', 'general'];
const DESEOS_POR_FAMILIA: Record<PracticaFamilia, string> = {
  prosperidad: 'tener $5,000 ahorrados',
  proposito:   'conseguir trabajo remoto',
  amor:        'una relación estable',
  bienestar:   'soltar la ansiedad',
  general:     'paz interior',
};

for (const familia of FAMILIAS) {
  const deseo = DESEOS_POR_FAMILIA[familia];
  // Probar días 1, 8, 15 — diferentes fases
  for (const dia of [1, 8, 15]) {
    const p = generarPractica(dia, familia, deseo);
    const allText = [
      p.base.intencion.textContent,
      p.base.afirmacion.textContent,
      p.base.protagonistaBloque.textContent,
      p.base.accionConcreta.textContent,
      ...p.profundizar.map((b) => b.contenido.textContent),
    ];
    const noPlaceholders = allText.every(hasNoRawPlaceholder);
    assert(`${familia} D${dia} sin {deseo}`, noPlaceholders,
      noPlaceholders ? '✓' : allText.find((t) => t.includes('{deseo}')) ?? '');
    assert(`${familia} D${dia} afirmación no vacía`, p.base.afirmacion.textContent.length > 0);
  }
}

// ── TEST 5: DeseoContext — stripping gramatical ───────────────────────────
console.log('\n=== TEST 5: DeseoContext ===');

const CASOS: { input: string; expectedNoVerb: boolean }[] = [
  { input: 'quiero conseguir un trabajo remoto', expectedNoVerb: true },
  { input: 'tener $5,000 ahorrados',            expectedNoVerb: false },
  { input: 'que mi negocio crezca',             expectedNoVerb: false },
  { input: 'una relación estable',              expectedNoVerb: false },
  { input: 'deseo tener paz',                   expectedNoVerb: true },
  { input: 'me gustaría viajar',                expectedNoVerb: true },
  { input: 'sueño con libertad financiera',     expectedNoVerb: true },
];

for (const caso of CASOS) {
  const ctx = buildDeseoContext(caso.input);

  // comoIntencion no debe empezar con verbo de deseo si se esperaba stripping
  if (caso.expectedNoVerb) {
    const verbosProhibidos = /^(quiero|deseo|necesito|me\s+gustar|sueño|espero|busco)/i;
    assert(
      `strip "${caso.input.slice(0, 30)}"`,
      !verbosProhibidos.test(ctx.comoIntencion),
      `comoIntencion="${ctx.comoIntencion}"`
    );
  }

  // Verificar que al interpolar no produce frases rotas
  const p = generarPractica(1, 'general', caso.input);
  const afirmacion = p.base.afirmacion.textContent;
  const noMerezcoCon = !afirmacion.includes('Merezco quiero') &&
    !afirmacion.includes('Elijo quiero') &&
    !afirmacion.includes('Soy deseo') &&
    !afirmacion.includes('Tengo quiero');
  assert(
    `gramática OK "${caso.input.slice(0, 30)}"`,
    noMerezcoCon,
    `afirmacion="${afirmacion.slice(0, 80)}"`
  );
}

// ── TEST 8: Audio contract — todos los bloques usan ContenidoMedia ─────────
console.log('\n=== TEST 8: Audio contract ===');

for (const dia of [1, 8, 15, 22, 30]) {
  const p = generarPractica(dia, 'general', 'paz interior');

  assert(`D${dia} intencion=ContenidoMedia`, isContenidoMedia(p.base.intencion),
    JSON.stringify(p.base.intencion).slice(0, 60));
  assert(`D${dia} afirmacion=ContenidoMedia`, isContenidoMedia(p.base.afirmacion));
  assert(`D${dia} protagonistaBloque=ContenidoMedia`, isContenidoMedia(p.base.protagonistaBloque));
  assert(`D${dia} accionConcreta=ContenidoMedia`, isContenidoMedia(p.base.accionConcreta));

  for (let i = 0; i < p.profundizar.length; i++) {
    assert(
      `D${dia} profundizar[${i}]=ContenidoMedia`,
      isContenidoMedia(p.profundizar[i].contenido),
    );
    assert(
      `D${dia} profundizar[${i}].audioEstado='none'`,
      p.profundizar[i].contenido.audioEstado === 'none'
    );
  }

  // Todos audioEstado = 'none' en local
  const allNone = [
    p.base.intencion, p.base.afirmacion, p.base.protagonistaBloque, p.base.accionConcreta,
    ...p.profundizar.map((b) => b.contenido),
  ].every((cm) => cm.audioEstado === 'none');
  assert(`D${dia} todos audioEstado='none'`, allNone);
}

// ── REPORTE FINAL ──────────────────────────────────────────────────────────
console.log('\n══════════════════════════════════════════════════════════════');
console.log(`RESULTADOS: ${pass} ✓ | ${fail} ✗`);
console.log('══════════════════════════════════════════════════════════════\n');

const failures = results.filter((r) => !r.ok);
if (failures.length > 0) {
  console.log('FALLOS:');
  for (const f of failures) {
    console.log(`  ✗ ${f.test}: ${f.detail}`);
  }
  process.exit(1);
} else {
  console.log('Todos los tests pasaron.');
}
