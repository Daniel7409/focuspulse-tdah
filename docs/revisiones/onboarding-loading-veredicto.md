# VEREDICTO revisor-visual — onboarding-loading
Fecha: 2026-10-27 00:00
Screenshot: docs/revisiones/onboarding-loading-375.jpg
Usabilidad: 32/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) Loading sin salida (topbar oculto, sin cancelar/volver) durante ~4.5s — si el flujo se traba el usuario queda atrapado; agregar botón cancelar o timeout con salida. 2) El número del ring (ring-pct) salta de golpe entre pasos (20→45→72→100) en vez de animarse con conteo, incumpliendo la baseline de "conteo animado de números héroe"; interpolar con rAF como en setProgress(). 3) Pantalla plana: ring y texto flotan sobre el fondo degradado sin ninguna superficie elevada, rompe la lógica de profundidad de 3 niveles del resto del onboarding. 4) Sin manejo de error/timeout visible si la carga no avanza (nada que decirle al usuario si se cuelga). 5) (baja confianza por resolución de imagen) verificar en navegador que el texto en opacity:.4 de las líneas pendientes cumpla AA sobre el fondo lila.
