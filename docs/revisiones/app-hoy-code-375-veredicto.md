# VEREDICTO revisor-visual — app-hoy (Hoy, FocusPulse TDAH) — Ronda 2
Fecha: 2026-10-31 00:00
Screenshot: docs/revisiones/app-hoy-code-375.png
Usabilidad: 27/40
Craft: 11/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Parte superior de la pantalla "Hoy", estado pendiente] Caja vacía de ~150-190px de alto con degradado/gris plano entre el header y el ícono de la tarea, sin contenido — se lee como una imagen rota o un placeholder sin terminar y domina el primer vistazo → verificar en un navegador real (no solo en la captura) que el radial-gradient de fondo se renderiza como halo sutil y no como un bloque sólido con bordes duros; si es espacio muerto por el `justify-center` del contenedor, llenarlo de contenido real o quitarlo.
2. [hoy-screen.tsx, ModalEditarTarea ~línea 308-341] El defecto de ronda 1 "sin transición de modal" sigue sin corregirse: el overlay y la hoja aparecen de golpe, sin fade ni slide-up, pese a reportarse como solucionado → agregar animación de entrada/salida (Motion o transición CSS) respetando prefers-reduced-motion.
3. [hoy-screen.tsx, chips de duración ~línea 158-180] No tienen `active:scale` ni ningún feedback táctil, a diferencia del resto de botones de la pantalla (CTA, tarjeta de tarea, botones del modo enfoque) → agregar `active:scale-[.97]` para consistencia.
4. [hoy-screen.tsx, tarjeta de la tarea ~línea 145-153] Ahora es un `<button>` real pero sigue sin ninguna señal visual de que es tocable (sin ícono de lápiz, sin estado hover/active distinto) y duplica exactamente la acción del enlace "Cambiar mi tarea" de abajo → unificar: quitar el onClick redundante de la tarjeta o darle una señal visible de edición.
5. [Modo Enfoque, botón "Pausar por ahora" ~línea 415-426] El nombre sugiere que se puede retomar el conteo donde quedó, pero `onSalir` solo borra el temporizador guardado — al volver a "Empezar enfoque" arranca de cero → renombrar a algo más preciso ("Salir por ahora") o implementar pausa real que conserve el tiempo restante.
