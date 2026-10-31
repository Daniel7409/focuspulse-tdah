# VEREDICTO revisor-visual — landing
Fecha: 2026-10-27 00:00
Screenshot: docs/revisiones/landing-01-hero.png (+ landing-02 a landing-07, cobertura completa 375px)
Usabilidad: 28/40
Craft: 10/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Top defectos:
1. [Las 7 capturas, cada sección] Vacío muerto masivo y sistemático: en TODAS las capturas el contenido real ocupa solo el 20-30% superior de la imagen y el resto es relleno plano del fondo (#efeaf6) sin ningún elemento — se repite en hero, problema, agitación, carrusel, oferta, garantía/FAQ y CTA final por igual. Rompe la regla "cero vacío muerto" y hace que la página parezca rota o a medio cargar → fix: verificar el alto real computado de cada `<section>`/`.hero`/`.agitacion` a 375px (sospecha: el contenedor `.telefono-mini` con `aspect-ratio:9/18` a 230px de ancho fija ~460px de alto y puede estar inflando el bloque padre) y volver a capturar con scroll proporcional al contenido, sin viewport/alto de captura sobredimensionado.
2. [CSS `.reveal`, línea 18-20 de landing.html] La animación de entrada usa `@keyframes` disparada al cargar la página (no IntersectionObserver), así que todo el contenido bajo el pliegue ya "reveló" antes de que el usuario haga scroll hasta ahí — el stagger de entrada (baseline de movimiento obligatoria) no se percibe nunca al navegar → fix: añadir una clase `.in-view` vía IntersectionObserver por sección y disparar la animación solo ahí.
3. [Carrusel "Tu app, por dentro", captura 04] El grid de 5 ítems en 2 columnas deja el último ítem (Rachas) solo en su fila, ocupando medio ancho con el otro lado vacío — asimetría visible al entrecerrar los ojos → fix: pasar a 3 columnas en ese breakpoint o usar un item final de ancho completo.
4. [Botones de plan, captura 05] El texto "Garantía de 15 días" bajo cada botón de compra es casi ilegible en la captura por su tamaño reducido junto al ruido del fondo con degradado → fix: subir `font-size` de `.garantia-mini` o aumentar contraste del ícono/texto.
5. [CTAs repetidos en todo el scroll] "Probar gratis 7 días" (nav/hero/oferta) vs "Empezar mi prueba gratis" (CTA final) son dos redacciones distintas para la misma acción primaria → fix: unificar a una sola frase en 1ª persona en los 4 puntos de conversión.
