# VEREDICTO revisor-visual — landing (ronda 5)
Fecha: 2026-11-08 00:00
Screenshot: docs/revisiones/landing-375-v5-1-hero.jpg, docs/revisiones/landing-375-v5-2-solucion-demo.jpg, docs/revisiones/landing-375-v5-3-oferta.jpg, docs/revisiones/landing-375-v5-4-faq-separacion.jpg, docs/revisiones/landing-375-v5-5-cta-footer.jpg
Usabilidad: 33/40
Craft: 17/20
Copy (si vende): 19/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Detalle usabilidad (h1-h10): h1:4 h2:4 h3:3 h4:4 h5:3 h6:4 h7:2 h8:3 h9:3 h10:3
Detalle craft (jerarquía,profundidad,identidad,movimiento,encaje): 3,3,3,4,4
Detalle copy (idea,especificidad,emoción,oferta,acción): 4,3,4,4,4

Gate doble requerido: ≥36/40 usabilidad Y ≥16/20 craft → NO se cumple (33/40, aunque craft 17/20 y copy 19/20 sí pasan). La usabilidad subió de 30→33 pero sigue 3 puntos bajo el umbral.

ESTADO DE LOS 5 DEFECTOS DE RONDA 4:
1. Demo animada del mecanismo de rollover → RESUELTO. `DemoRollover` (visible en screenshot 2) muestra "Llamar al dentista" tachándose en "Ayer" y reapareciendo en "Hoy" en un ciclo de ~4s, con fallback estático en `prefers-reduced-motion`. Ataca directamente la objeción #1 del avatar.
2. Separación Oferta/FAQ apenas 4% → MEJORADO / RESUELTO. El tinte subió a 8% (`color-mix(in oklab, var(--primary) 8%, var(--background))`) y la sección FAQ agrega `borderTop` hairline. En el screenshot 4 el cambio de fondo entre la tarjeta de garantía y "Preguntas frecuentes" ya es perceptible en scroll normal.
3. Nav sticky sin resaltar sección activa → RESUELTO (verificado en código). `NavSeccionActiva` usa `IntersectionObserver` con `rootMargin: "-40% 0px -50% 0px"` y colorea/subraya el link de la sección visible. No verificable en screenshot estático, pero la lógica es correcta y cubre los 3 enlaces del nav.
4. CTA "Empezar gratis" repetido 6+ veces sin variación → RESUELTO. Planes ahora dicen "Elegir mensual" / "Elegir anual" (screenshot 3) y el CTA final dice "Quiero mi primer día sin culpa" (screenshot 5). Nav y hero mantienen "Empezar gratis" (aceptable, son los puntos de entrada).
5. Dos familias de radio (28px vs 20px) sin documentar → RESUELTO. FICHA-ARTE.md ahora documenta `--radius-xl` (28px, paneles grandes) como segundo tier intencional junto a `--radius-card` (20px, tarjetas), y el código usa el token en los 4 lugares que antes tenían el valor hardcodeado.

TOP DEFECTOS (máx 5, ordenados por impacto):
1. [Heurística 7, código global de la landing] Sigue sin haber ningún atajo/mecanismo de eficiencia para el usuario que repite la visita (ni deep-link al plan, ni recordar preferencia) — es el eje más débil de usabilidad en ambas rondas → agregar un query param que preseleccione el plan (p. ej. `?plan=anual`) para campañas, o recordar la última sección vista.
2. [Jerarquía, screenshots 2-3] Las tarjetas de "¿Te suena familiar?", "Solución" y cada "Plan" comparten casi el mismo tratamiento visual (surfaceGrad + borde 1-1.5px + radius-card) — al entrecerrar los ojos cuesta separar "card informativa" de "card de acción/compra" como dos niveles distintos → diferenciar el peso o el fondo de las cards de los planes (que SÍ llevan una decisión de dinero) del resto.
3. [Profundidad, toda la pantalla] Solo existen 2 niveles reales de superficie (base lila + superficie con gradiente sutil) más 1 panel oscuro aislado ("No es falta de voluntad") — falta un nivel "hundido" consistente (inputs, badges, contadores) repetido en más secciones para que la sensación de profundidad no dependa de un solo bloque.
4. [Planes, screenshot 3] "Elegir mensual" (fondo blanco + borde) luce visualmente secundario frente a "Elegir anual" (relleno sólido) — es jerarquía intencional por ser el plan recomendado, pero para un avatar con parálisis por decisión conviene reforzar con texto que ambos son igual de válidos (ya existe "Ahorra 42%" en Anual, podría bastar con un micro-ajuste de contraste en Mensual).
5. [Overlay "N" circular, esquina inferior izquierda, presente en las 5 capturas] Confirmado en código: no pertenece a `page.tsx` ni a `landing-interactions.tsx` — es un indicador de herramienta de desarrollo (Next.js dev indicator), no un elemento de la UI real. No cuenta como defecto de diseño, pero verificar que no aparezca en capturas de producción/marketing.
