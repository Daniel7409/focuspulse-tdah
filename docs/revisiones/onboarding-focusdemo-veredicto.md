# VEREDICTO revisor-visual — Modo Enfoque (demo) onboarding FocusPulse
Fecha: 2026-10-27 00:00
Screenshot: docs/revisiones/onboarding-focusdemo-375.jpg
Usabilidad: 31/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [botón "Salir del enfoque", `.fd-pause`] el texto usa `color:var(--bg)` sólido (correcto), pero el PROPIO elemento sigue con `opacity:.75` en CSS — esa opacidad de compuesto diluye también el texto sólido contra el fondo oscuro, dando ~3:1 en vez del 4.5:1 que exige texto normal de 13px → fix: quitar `opacity` del elemento y controlar la visibilidad de entrada solo con el color de fondo/alpha del borde, nunca con `opacity` sobre todo el nodo que contiene el texto.
2. [captura general] el archivo `onboarding-focusdemo-375.jpg` no es una captura limpia a 375px: el contenido real ocupa una franja minúscula en la esquina superior izquierda rodeada de un lienzo lila vacío fuera de la app — invalida la verificación fina de contraste/espaciado aunque se vea "el degradado completo" → fix: re-capturar con el viewport real a 375×auto recortado al elemento `.stage`, sin relleno de lienzo.
3. [botón "Salir del enfoque"] usa `border-radius:999px` (píldora) mientras el resto de la pantalla usa `--radius-card:20px` (tarjeta de tarea) y `--radius-btn:14px` (CTA "Ver mi plan") → 3 familias de radio distintas visibles en una sola pantalla rompe el encaje óptico → fix: si la píldora es un componente deliberadamente distinto, documentarlo como tal en FICHA-ARTE; si no, alinear a `--radius-btn`.
4. [pantalla completa] cero atajos de teclado/gesto para saltar el demo de 5s antes de que aparezca el botón — el usuario encerrado sin salida visible los primeros ~0-200ms antes de pintar el pill (igual visible desde el inicio a .75, mitiga parcialmente) → fix: permitir Esc/tap en cualquier parte para salir del demo.
5. [`.fd-pause`] la lógica de aparición (opacity .75 por defecto → clase `.show` a opacity 1) mezcla el control de "estado de entrada" con la opacidad final de legibilidad del texto — frágil ante cualquier futuro ajuste de timing que vuelva a bajar el valor por defecto → fix: separar en dos propiedades (fondo/alpha para la pastilla, variable de solo-aparición con transform/translate en vez de opacity del nodo completo).
