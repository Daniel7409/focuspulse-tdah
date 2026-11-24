# VEREDICTO revisor-visual — landing
Fecha: 2026-11-22 00:20
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 31/40
Craft: 15/20
Copy (si vende): 20/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Panel oscuro de contadores, landing-375-iconos-2.png] El sticky CTA mobile ("Empezar gratis") sigue tapando el subtítulo "de prueba gratis" de la tercera métrica ("5 días") durante el scroll — el padding inferior de la sección no deja espacio para la barra fija de 375px → sumar `scroll-margin-bottom`/padding extra al contenedor del panel o bajar el z-index del sticky mientras esta sección está en vista.
2. [FAQ, encabezado "Preguntas frecuentes", landing-375-faq-cta-final.png] El ícono `strikeMark` (el tachado de marca) antepuesto al H2 sigue sin relación semántica con "preguntas" — persiste de la ronda anterior, no se tocó → cambiarlo por un ícono de ayuda/pregunta o quitarlo.
3. [Precios, tarjeta "Mensual" vs "Anual"] El botón outline de "Elegir mensual" sigue en fuerte contraste visual contra el CTA sólido de "Elegir anual" — no se verificó si es jerarquía intencional o inconsistencia accidental, persiste de rondas previas sin cambio de código.
4. [Toda la landing] El CTA se repite en 6+ puntos (hero, sticky, entre "¿Te suena familiar?", panel oscuro, demo, precios, FAQ) — es el mismo CTA, no compite consigo mismo, pero el eje 8 (estético/minimalista) sigue penalizado por la cantidad de repeticiones al entrecerrar los ojos en el flujo completo.
5. [AnilloAnimado / Contador / DemoRollover, landing-interactions.tsx líneas 83-96, 189-195, 384-402] Estos tres componentes siguen usando `IntersectionObserver` con threshold 0.4-0.5 y SIN el `rootMargin` generoso que sí se aplicó a `Reveal` → mismo riesgo de quedar congelados a medio animar (anillo sin dibujar, contador en 0, demo sin rotar) ante un scroll rápido o salto por ancla, solo que no produce bloque en blanco por ir dentro de contenedores ya visibles → aplicar el mismo `rootMargin: "30% 0px 30% 0px"` por consistencia.

MEJORAS CONFIRMADAS vs ronda anterior:
- Bloque de ~300px en blanco antes de "Empieza gratis..." (landing-375-como-funciona-demo.png / landing-375-plan.png): YA NO APARECE. El fix de `Reveal` (threshold 0 + rootMargin 30%/30%, landing-interactions.tsx líneas 17-43) se confirma en el screenshot: scroll continuo sin huecos, secciones 02/03 y panel demo totalmente opacos.
- Los 4 íconos de "¿Te suena familiar?" (landing-375-iconos-1.png): ahora tienen el mismo peso visual (mismo chip, mismo violeta sólido) — confirmado en código: los 4 pasan por el helper único `chipIcon()` (page.tsx línea 19-31), que fija `stroke="var(--primary)"` y el mismo contenedor para cualquier `path`, eliminando la deriva de opacidad/grosor por ícono.
