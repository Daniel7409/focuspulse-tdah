# VEREDICTO revisor-visual — landing (ronda 5)
Fecha: 2026-11-04 00:00
Screenshot: docs/revisiones/landing-375-1-hero-v2.jpg, docs/revisiones/landing-375-2-problema-v2.jpg, docs/revisiones/landing-375-3-agitacion-solucion-v3.jpg, docs/revisiones/landing-375-4-oferta-v3.jpg, docs/revisiones/landing-375-5-faq-v3.jpg, docs/revisiones/landing-375-6-footer-v3.jpg
Usabilidad: 30/40
Craft: 15/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Detalle usabilidad (h1-h10): 3,4,3,3,3,3,2,3,3,3
Detalle craft (jerarquía,profundidad,identidad,movimiento,encaje): 3,3,3,3,3
Detalle copy (idea,especificidad,emoción,oferta,acción): 4,3,4,4,3

Gate doble requerido: ≥36/40 usabilidad Y ≥16/20 craft → NO se cumple (30/40 y 15/20). Copy pasa su umbral (18/20, ningún eje ≤2) pero no sustituye el gate de usabilidad/craft.

Confirmación de los 3 defectos "atacados" en esta ronda:
- Radio del FaqItem ahora usa var(--radius-card) (20px), coherente con el resto de tarjetas de la pantalla. Corregido.
- El texto de garantía bajo cada plan quedó corto ("7 días, sin preguntas") y la explicación completa ("Garantía de 7 días...") vive solo en la sección dedicada. La repetición literal 3 veces ya no ocurre. Corregido.
- La sección Oferta mantiene tinte propio y FAQ volvió a fondo base — ya no comparten exactamente el mismo fondo. Mejoró, pero ver defecto #2 abajo: la diferencia es apenas 4% de tinte, al límite de ser imperceptible en scroll rápido.

Defectos previos NO atacados (confirmados, esperado): sigue sin demo animada del mecanismo de rollover (defecto #1 abajo) y el nav sticky sigue sin resaltar la sección visible (defecto #3 abajo).

TOP DEFECTOS (máx 5, ordenados por impacto):
1. [Hero + sección "Solución" / #como-funciona] El mecanismo central que vende la app (rollover "tachado con cariño", nunca en rojo) sigue mostrándose solo en texto — el mockup del hero anima el anillo pero nunca muestra una tarea moviéndose/tachándose. Es la objeción #1 del avatar ("otra app milagrosa que voy a abandonar") y la ficha pide explícitamente resolverla mostrando el mecanismo, no prometiéndolo → animar en el mockup del hero (o en la tarjeta 03 de Solución) el instante en que la tarea de hoy se tacha suavemente y reaparece mañana.
2. [Límite entre sección Oferta (#oferta) y FAQ (#faq), scroll 4→5] La separación de fondo entre ambas secciones es solo `color-mix(primary 4%, background)` vs fondo base — una diferencia de apenas 4% que un usuario que hace scroll normal difícilmente nota como "cambio de sección" (el defecto de ronda 3 mejoró pero no se resolvió del todo) → subir el tinte de Oferta a 6-8% o agregar un separador/borde visible entre ambas secciones.
3. [Nav sticky superior, enlaces "Cómo funciona / Precio / Preguntas"] Ningún link cambia de estado al hacer scroll hacia su sección — el usuario no tiene forma de saber en qué parte de la página está sin mirar el contenido (heurística 6, reconocer vs recordar) → añadir un IntersectionObserver que marque con color-primary/subrayado el link de la sección visible.
4. [CTA repetido: nav, hero, cada plan, CTA final] El texto "Empezar gratis" se repite literal 6+ veces sin variación — funciona pero no refuerza el beneficio específico en el momento de pago (plan mensual/anual) → en los CTA de los planes, usar una variante en primera persona y con beneficio concreto (ej. "Quiero mi Pase Cero Culpa") y dejar "Empezar gratis" solo en nav/hero.
5. [Hero mockup / dark panel "No es falta de voluntad" / CTA final — todos `rounded-[1.75rem]` 28px — vs. tarjetas de Problema/Solución/Plan/FAQ — todas `var(--radius-card)` 20px] Conviven dos familias de radio sin que la ficha documente esto como sistema intencional (contenedor grande vs tarjeta) — un ojo entrenado lo nota al comparar screenshots 2 y 3 lado a lado → o unificar a un solo radio de "panel grande", o anotar explícitamente en FICHA-ARTE.md la jerarquía de 2 radios para que deje de leerse como accidente.
