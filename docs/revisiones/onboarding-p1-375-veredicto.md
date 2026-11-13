# VEREDICTO revisor-visual — Onboarding P1 (ronda nueva — tarjeta "Pase Cero Culpa")
Fecha: 2026-11-13 00:00
Screenshot: docs/revisiones/onboarding-p1-375.png
Usabilidad: 35/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Detalle usabilidad (h1-h10): h1:4 h2:4 h3:4 h4:2 h5:4 h6:4 h7:3 h8:3 h9:4 h10:3
Detalle craft: jerarquía:3 profundidad:4 identidad:3 movimiento:3 encaje:2

RESUMEN DEL CAMBIO EVALUADO:
Se agregó, bajo la nota de privacidad en P1, una tarjeta nueva "Así te vas a sentir con el Pase
Cero Culpa" que reutiliza `DemoRollover` (landing-interactions.tsx): dos mini-cards "Ayer"/"Hoy"
con la tarea tachándose y moviéndose automáticamente cada 3.8s, sobre un panel con fondo
recesado (color-mix con negro 8%) y sombra interior. Esto SÍ resuelve el defecto estructural que
venía repitiéndose rondas 6-8 (el hueco único de ~500px sin ningún elemento de marca): el gap
entre chips y borde inferior ahora está ocupado por contenido real, y de paso agrega el tercer
nivel de profundidad (base/elevado/hundido) y el dispositivo ownable de la ficha (tachado con
cariño) que antes no existía en esta pantalla. Pero introduce dos problemas nuevos que bajan el
puntaje por debajo del gate: (1) la mini-card "Ayer" pasa ~2.6 de los 3.8s del ciclo (68% del
tiempo) completamente vacía — opacity:0 en la línea ~222 de landing-interactions.tsx — por lo que
la MAYORÍA de las veces que alguien mira esta pantalla (incluida esta captura) ve una caja rota
con solo el label "Ayer" y nada dentro, no "la tarea resuelta"; (2) la corrección se aplicó SOLO a
P1 (`paso.id === "p1"` en la línea 382 de onboarding/page.tsx) — P2 y P4, que comparten el mismo
tipo "pregunta" y el mismo patrón de vacío denunciado en rondas previas, se quedaron exactamente
igual que antes, así que el usuario que avanza un paso más ve la pantalla "rica" seguida de dos
pantallas "vacías" — una inconsistencia perceptible dentro del mismo flujo de 4 preguntas.

¿CRUZA EL GATE (≥36/40 Y ≥16/20)?
NO. Usabilidad 35/40 (falta 1, por la inconsistencia P1 vs P2/P4 — h4 cae a 2) y Craft 15/20
(falta 1, por el encaje — la mini-card "Ayer" vacía la mayor parte del tiempo cuenta como
desencaje visible a simple vista, h/eje encaje:2). Es una mejora real sobre la ronda anterior
(craft 12→15, usabilidad 35→35) pero todavía no cierra.

POR QUÉ CADA CAMBIO SUBIÓ O BAJÓ (verificado en código + screenshot):
1. PROFUNDIDAD (3→4): ahora hay 3 niveles reales y consistentes con el resto de la app (el panel
   recesado usa la misma lógica que el fondo oscuro de PantallaEnfoque) — antes faltaba el nivel
   "hundido" en esta pantalla.
2. IDENTIDAD (2→3): el dispositivo ownable de la ficha ("tareas tachadas con cariño, nunca en
   rojo") por fin aparece en una pantalla de pregunta — coincide textualmente con FICHA-ARTE.md
   línea 24. No llega a 4 porque la tarjeta en sí es visualmente simple (sin textura/ilustración
   adicional) y porque este mismo motivo Ayer/Hoy se repite casi igual 2 pantallas después en la
   de "reconocimiento" (r1), diluyendo el efecto de descubrimiento.
3. ENCAJE (1→2, no a 3+): el hueco estructural de 500px desapareció (mejora real), pero se
   reemplaza por un desencaje más chico y constante: la mini-card "Ayer" se ve vacía/rota la
   mayoría del tiempo del ciclo. Sigue siendo un defecto que un usuario cualquiera nota sin
   buscarlo — justo lo que capturó esta screenshot.
4. CONSISTENCIA h4 (3→2): aplicar el fix solo a P1 convierte el "mismo componente" (pantalla
   tipo pregunta) en 2 apariencias distintas dentro del mismo flujo de 4 pasos — P2 y P4 siguen
   con el vacío de rondas anteriores. Es perceptible sin lupa: se nota al avanzar un paso.
5. El resto de heurísticas (h1,h2,h3,h5,h6,h9) se mantienen altas porque el cambio no tocó
   feedback, lenguaje, control/libertad, validación, reconocimiento ni mensajes de error.

RECOMENDACIÓN:
(a) Que "Ayer" nunca quede en blanco — reemplazar opacity:0 por un estado positivo visible (ícono
de check tenue, o texto "Nada pendiente") para que la caja jamás luzca rota. (b) Replicar la
misma tarjeta (con su propia micro-copia) en P2 y P4, no solo P1 — si el presupuesto no alcanza
para las 3, es preferible no ponerla en ninguna que dejarla en una sola y abrir la brecha de
consistencia. Con (a) resuelto, encaje sube a 3 y el craft cruza 16/20; con (b) resuelto, h4 sube
a 3-4 y la usabilidad cruza 36/40.

TOP DEFECTOS (máx 5, ordenados por impacto):
1. [Mini-card "Ayer" dentro de la tarjeta demo, bajo la nota de privacidad] Vacía durante ~68%
   del ciclo de animación (2.6s de 3.8s) — se ve como una caja incompleta/rota, no como "tarea
   resuelta" → reemplazar opacity:0 (landing-interactions.tsx ~línea 222) por un estado visible
   (check tenue o "Nada pendiente").
2. [Pasos P2 y P4 del mismo onboarding] El fix de la tarjeta de marca se aplicó solo en P1
   (`paso.id === "p1"`, onboarding/page.tsx línea 382) — P2 y P4 siguen con el mismo hueco vacío
   bajo los chips que rondas anteriores ya marcaron como defecto top → replicar el elemento (u
   otro del kit) en los 3 pasos tipo "pregunta", no solo en el primero.
3. [Esquina inferior izquierda de la captura] Overlay de desarrollo de Next.js ("N") sigue
   visible, tapando el borde del contenido — persiste desde la ronda anterior → confirmar que no
   aparece en el build de producción antes de volver a declarar la pantalla verificada.
4. [Tarjeta demo, label "Así te vas a sentir con el Pase Cero Culpa" + labels internos
   "Ayer"/"Hoy"] Introduce una tercera/cuarta variante de texto pequeño (11-13px) muy cercana a
   la ya existente de la nota de privacidad (12px) y el label de chip (12-13px) → unificar a un
   solo tamaño de caption en toda la pantalla.
5. [Chips de respuesta, navegación por teclado — código, onboarding/page.tsx líneas 346-353] Las
   flechas arriba/abajo mueven el foco entre chips pero no seleccionan la opción, a diferencia del
   comportamiento nativo esperado de un `radiogroup` → disparar `onElegir` también en
   ArrowUp/ArrowDown, o documentar la decisión si es intencional.
