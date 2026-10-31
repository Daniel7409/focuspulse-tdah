# VEREDICTO revisor-visual — paywall
Fecha: 2026-10-31 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 31/40
Craft: 13/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [bloque inferior, link "Restaurar compra"] apunta a /login sin ninguna lógica de restauración real (mismo destino que el CTA principal) → fix: implementar verificación real de compra existente o, si no es viable aún, quitar el link hasta tenerla (un link que promete algo y no lo hace es peor que no tenerlo).
2. [cards de Anual/Mensual y value-stack] son planas, solo borde de 1-1.5px, sin la sombra tintada en violeta que especifica FICHA-ARTE.md → fix: agregar box-shadow sutil tintada (rgb 110 90 158 / baja opacidad) para dar el 2º nivel de profundidad.
3. [toda la pantalla] no aparece el dispositivo ownable de la ficha (anillo de progreso / tachado con cariño) — el layout es un pricing card genérico intercambiable con cualquier app de suscripción → fix: introducir al menos un detalle de marca distintivo (ej. el check-circle del value-stack con el trazo del anillo, o un motivo visual recurrente del resto de la app).
4. [captura] un badge circular negro con "N" se superpone sobre la fila de confianza al final de la pantalla → fix: verificar que no sea un overlay de dev tools filtrándose al screenshot de evaluación; recapturar en build limpio.
5. [timeline Día 4 / Día 5] sin stagger propio dentro de la lista (el bloque completo entra junto) y sin animación de "dibujo" de la línea vertical → fix: opcional, dar un pequeño delay escalonado item por item del timeline para reforzar el movimiento ya agregado.
