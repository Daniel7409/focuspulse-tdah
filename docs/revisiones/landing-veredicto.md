# VEREDICTO revisor-visual — landing
Fecha: 2026-10-31 00:00
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 27/40
Craft: 14/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1. [Nav vs Hero vs Planes] El CTA primario usa 3 textos distintos para la misma acción ("Probar gratis" en nav línea 137, "Quiero mi Pase Cero Culpa" en hero/CTA final, "Quiero este plan" en tarjetas de precio) → unificar a un solo texto de CTA en toda la página. 2. [Secciones 2-9, scroll completo] Sigue habiendo 9 secciones; el fix de esta ronda (ancla "Cómo funciona" + menos padding entre Problema/Agitación) no reduce el recorrido real de scroll para un avatar con TDAH → fusionar Problema+Agitación en un solo bloque y recortar o eliminar "Tu app, por dentro" (5 mockups) para bajar a 5-6 secciones. 3. [Sección Agitación, los 3 chips de stats, page.tsx líneas 266-283] Solo el primer chip ("1 tarea") tiene box-shadow inset (área hundida); los otros dos se ven planos sin razón visual — inconsistencia de profundidad notable al verlos juntos → aplicar el mismo tratamiento a los 3 o justificar la diferencia con jerarquía clara. 4. [Botón CTA del nav vs hero/CTA final] Mismo componente visual (gradiente primario) con altura distinta: h-12/48px en nav (línea 131) vs h-13/52px en hero y CTA final (líneas 160, 489) → unificar la altura de todos los CTA primarios. 5. [Toda la landing, verificado en código] Heurística 7 (flexibilidad): fuera del nuevo skip-link no hay atajos para el usuario que ya decidió comprar (p.ej. ir directo a precio desde el hero sin scrollear todo) → agregar ancla visible "Ver precio" cerca del hero.
