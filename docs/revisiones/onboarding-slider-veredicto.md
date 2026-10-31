# VEREDICTO revisor-visual — onboarding-slider
Fecha: 2026-10-27 00:00
Screenshot: docs/revisiones/onboarding-slider-375.jpg
Usabilidad: 26/40
Craft: 4/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Pantalla completa] El contenedor `.stage` NO ocupa el viewport de 375px: se ve como una caja de ~100x215px pegada a la esquina superior izquierda, con ~75% del lienzo en lila sólido sin contenido — cualquier usuario lo nota de inmediato como "pantalla rota" → re-verificar en DevTools con viewport real 375x812 que `html,body{width:100%}` y `.stage{width:100%;max-width:430px;min-height:100dvh}` realmente se aplican (el CSS en onboarding.html líneas 22-31 ya los declara); si persiste en el navegador real y no solo en la captura, hay un contenedor padre con `width:fit-content`/`inline-block` heredado que lo está colapsando.
2. [Botón "Fijar mi meta"] Comprimido dentro de la caja rota, no se puede verificar que cumpla ancho completo ni altura ≥48px (el CSS pide `min-height:54px; width:100%` en `.btn-primary`/`.cta-fixed`) → confirmar con el viewport corregido antes de aprobar el CTA héroe.
3. [Eje profundidad / Eje encaje] Toda la decoración (gradiente radial, círculos sutiles de fondo) queda atrapada dentro de la caja colapsada; el resto del viewport es lila plano sin matiz — ningún eje de craft (jerarquía, profundidad, encaje) es evaluable con fiabilidad mientras el render esté roto → resolver el problema de renderizado/captura antes de la próxima ronda; no alcanza con "confiar" en que el CSS está bien escrito.
4. [renderSlider(), onboarding.html ~líneas 623-644] A diferencia de otras pantallas del mismo archivo (`recog`, `pay`) que sí usan `style="animation-delay:Xms"` por elemento, aquí `q-icon`, `q-head` y `.slider-wrap` comparten la clase `.reveal-item` sin delays escalonados → entran todos al mismo tiempo, sin el stagger de 50-80ms que exige el baseline de movimiento → agregar `animation-delay` incremental (0ms/70ms/140ms) a cada reveal-item de esta pantalla.
5. [Heurística 8 — estético/minimalista] Consecuencia directa del defecto #1: con el contenido reducido a una esquina, la jerarquía visual (número héroe > título > label) deja de leerse como "4 niveles nítidos" y pasa a ilegible a tamaño real → mismo fix que el defecto #1; no es un problema de composición del diseño sino del render.
