# VEREDICTO revisor-visual — onboarding
Fecha: 2026-08-17 16:10
Screenshot: docs/revisiones/onboarding-375-v3.png
Usabilidad: 35/40
Craft: 13/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

## Defectos [ordenados por impacto]

1. **[Zona inferior paso 0 — H8]** ~35% del dvh queda vacío después del link "Algo más específico". El `flex-1` del step container existe pero el div interior de chips termina con `pb-8` sin nada que empuje el escape hatch al fondo — el vacío es visible sin buscarlo. Fix: añadir `flex-1` como spacer entre el bloque de chips y el link de escape, o mover "Algo más específico" al fondo del step container con `margin-top: auto`.

2. **[Fondo global — EJE 2]** Solo 2 niveles de profundidad perceptibles: base #FEF7F8 y chips #FFEBF0 con shadow-1. Sin plano hundido. Fix: añadir `inset-shadow` o fondo `color-mix(in oklab, var(--accent) 4%, transparent)` al bloque de links de escape y/o al input personalizado cuando se abre, creando un tercer plano visualmente hundido.

3. **[Esquina superior derecha + global — EJE 3]** Pétalo SVG a opacity:0.12 sobre #FEF7F8 es prácticamente invisible en el render. Grain a opacity:0.07 tampoco se registra. El único dispositivo ownable no se percibe. Playfair Display + blush rosa sin diferenciador visible es indistinguible de Bloom/Insight Timer. Fix: subir pétalo a opacity:0.22 y grain a opacity:0.12; o añadir un segundo ownable con mayor contraste (ornamento tipográfico, textura SVG bautizada, o hairline degradé 1px en los chips principales).

4. **[Header — EJE 3 + identidad]** El logotext "MANIFIESTA" usa DM Sans 15px semibold con un cuadrado de color sólido como símbolo. No proyecta la identidad editorial/espiritual de la app en el punto de mayor repetición. Fix: aplicar Playfair Display al nombre en el header, o crear un logotipo SVG con carácter (pétalo, luna, pluma) en lugar del cuadrado genérico.

5. **[Barra de progreso — track — EJE 5]** El track unfilled a `color-mix(in oklab, var(--accent) 12%, transparent)` sobre fondo crema es casi invisible — el usuario no distingue cuánto falta. Fix: subir el track a accent/22% o usar un gris neutro `rgba(0,0,0,0.10)` con más contraste perceptivo.

## Nota
Los 5 fixes de v3 se aplicaron correctamente y se verificaron en código y screenshot: (1) íconos en OBSTACULOS ✓ — H4 sube de 2 a 4; (2) grain subido a 0.07 ✓ — sigue sin percibirse; (3) pétalo SVG agregado ✓ — sigue sin percibirse; (4) "Ver más opciones" con 4+2 ✓ — gate cognitivo cumplido; (5) CTA custom sin disabled ✓ — hint inline funciona; (6) PROGRESO[0] = 22 ✓ — alineado con "1/4". El aumento de H4 (2→4) y H5 (2→4) explica la ganancia de 4 puntos en usabilidad (31→35). Los gates siguen sin pasar porque el vacío muerto (H8:2) y la doble falla de craft en profundidad (EJE 2:2) e identidad (EJE 3:2) no fueron parte de los fixes. Prioridad para v4: defecto 1 (vacío muerto) + defecto 3 (ownable visible).
