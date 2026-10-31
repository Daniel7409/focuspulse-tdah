# VEREDICTO revisor-visual — Hoy (app interna)
Fecha: 2026-10-28 00:00
Screenshot: docs/revisiones/app-hoy-375.jpg
Usabilidad: 37/40
Craft: 18/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos:
1. [Toast "Deshacer"] Sin aria-live/role="status" en el toast (app.html showUndoToast) → agregar role="status" aria-live="polite" para que lectores de pantalla anuncien el cierre del día y la ventana de deshacer.
2. [Cerrar el día] Solo hay deshacer (ventana 4.5s), sin confirmación previa para una acción que reescribe racha+historial → para una audiencia TDAH, considerar persistir el deshacer en un historial corto accesible después de expirar el toast, no solo durante 4.5s.
3. [App completa] Sigue existiendo un único caso de error real (input vacío en editar tarea) → cuando se conecte backend, replicar el mismo patrón (qué pasó + qué hacer) en errores de red/guardado fallido.
4. [Captura] El archivo app-hoy-375.jpg no llena el viewport de 375px — el contenido del teléfono ocupa una fracción pequeña de un lienzo mucho más grande, lo que limita verificar encaje óptico fino (padding, radios) a simple vista → recapturar a 375×812 real, contenido a ancho completo.
