# VEREDICTO revisor-visual — landing
Fecha: 2026-08-17 14:30
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): NO VERIFICABLE — FICHA-AVATAR.md ausente; copy gate no puede aplicarse
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA

Top defectos:
1. [§4 Solución, mobile 375px] Barra de progreso horizontal marcada `hidden md:block` — invisible a 375px, que es el ancho donde se evalúa. Los 3 pasos no tienen conector visual en mobile. FIX: añadir separador vertical de 1px entre chips de número en mobile (pseudoelemento o `div w-0.5 h-4 bg-accent/20 ml-5.5` entre cada `<li>`).
2. [Global — copy] FICHA-AVATAR.md no existe. El copy no puede trazarse a dolores/deseos/objeciones reales del avatar. FIX: completar PLANTILLA-FICHA-AVATAR.md antes del lanzamiento y re-pasar la rúbrica 4 /20.
3. [§8 Oferta / Pricing] El ancla de precio post-trial ("después $X/mes") no es inmediatamente visible junto al CTA en el screenshot — el usuario debe hacer scroll para ver cuánto cuesta continuar. FIX: añadir microlinea "después $[precio]/mes · cancela cuando quieras" directamente bajo el CTA de trial.
4. [§1 Hero, titular] "hecho para ti" en acento rosa cumple la regla de énfasis, pero la palabra que más vende ("manifestar") aparece sin peso diferenciado. El eyebrow en champagne es muy tenue a este tamaño. FIX: evaluar si el eyebrow necesita acento en lugar de champagne, o subir a `text-sm` para garantizar legibilidad a 375px.
5. [§2 Demo] La sección Demo posterior al hero ocupa espacio sin datos semilla visibles en el screenshot. Si renderiza vacía o con placeholder, destruye la percepción de producto. FIX: garantizar que Demo muestra contenido semilla realista antes del lanzamiento (afirmación, scripting o ritual de ejemplo completo).
