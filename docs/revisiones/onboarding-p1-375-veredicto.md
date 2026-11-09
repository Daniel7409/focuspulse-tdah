# VEREDICTO revisor-visual — Onboarding Pantalla 1 (ronda 8, "decisiva")
Fecha: 2026-11-08 00:00
Screenshot: docs/revisiones/onboarding-p1-375-v8.jpg
Usabilidad: 35/40
Craft: 12/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Detalle usabilidad (h1-h10): h1:4 h2:4 h3:4 h4:3 h5:4 h6:4 h7:3 h8:2 h9:4 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:2 movimiento:3 encaje:1

COMPARATIVA RONDA 6/7 → RONDA 8:
Usabilidad 35/40 → 35/40 (sin cambio). Craft 15/20 → 12/20 (RETROCESO de 3 puntos).

VEREDICTO EXPLÍCITO SOBRE LA HIPÓTESIS DEL USUARIO:
Confirmado — mover todo el vacío a una sola franja grande se percibe PEOR que tenerlo repartido
arriba/abajo. En el screenshot v8, entre el último chip ("Otra cosa...") y la nota de privacidad
anclada al fondo hay un hueco único de ~500px sobre ~1600px de viewport total (≈31% de la
pantalla) completamente vacío, sin textura, sin detalle de marca, sin transición de superficie.
En las rondas 6/7 el mismo volumen de aire estaba repartido en dos franjas más pequeñas (arriba
de la pregunta y debajo de la nota), lo cual, aunque tampoco ideal, no leía como un "agujero"
porque cada hueco individual era menor y estaba flanqueado por contenido en ambos lados. Aquí el
ojo entra directo al vacío de 500px sin nada que lo justifique — es el tipo de defecto que un
usuario cualquiera nota sin buscarlo (criterio del "2 vs 3": aquí incluso baja a 1 en encaje,
porque no es solo "hay aire de más", es un desencaje estructural visible a simple vista).

POR QUÉ BAJÓ CADA EJE (verificado en código y screenshot):
1. ENCAJE ÓPTICO (3→1): el `mt-auto` en la nota de privacidad (línea 400 de PantallaPregunta)
   junto con el `flex-1 flex flex-col` del wrapper (línea 324) empuja TODO el espacio sobrante
   del viewport a una sola franja entre los chips y la nota. A 375px con solo 4 chips cortos, esa
   franja es enorme (~500px) y no tiene ningún elemento que la llene — ni textura, ni ilustración,
   ni el dispositivo ownable de la ficha (el anillo de Streaks). Un desencaje de este tamaño es
   el peor defecto de toda la revisión.
2. ESTÉTICO/MINIMALISTA, h8 (3→2): "cada elemento se gana su lugar" falla de forma visible — la
   nota de privacidad, antes integrada al final del bloque de contenido, ahora flota aislada en
   el extremo inferior, separada del resto por tanto espacio que pierde relación visual con la
   pregunta que la precede. Se lee como un elemento "perdido" en la pantalla, no como cierre del
   flujo.
3. IDENTIDAD OWNABLE (3→2): al quitar el anillo en la ronda 7 (por el bug de 62% fijo + lectura
   de spinner congelado) y no reemplazarlo por ningún otro dispositivo de marca en esta pantalla
   de pregunta, la franja central vacía que antes al menos contenía intento de identidad ahora no
   contiene NADA. El patrón "contenido arriba + nota anclada abajo" es genérico de cualquier
   formulario de encuesta — no hay un solo elemento en esta pantalla que la distinga de un
   typeform genérico (chips + texto + nota legal).
4. JERARQUÍA y PROFUNDIDAD se mantienen en 3 — el título, subtítulo, chips y label siguen
   leyéndose en 4 niveles correctos y el gradiente radial del wrapper sigue dando 2 niveles de
   profundidad real. No empeoraron, pero tampoco se tocaron.
5. USABILIDAD se mantiene en 35/40: el cambio es puramente estructural/visual, no afecta
   feedback, control, prevención de errores ni lenguaje. Solo h8 (estético/minimalista) bajó de
   3 a 2 porque ahora el espaciado desigual SÍ es perceptible sin lupa.

¿CRUZA EL GATE (≥36/40 Y ≥16/20)?
NO, y además es peor que la versión anterior que tampoco cruzaba. Usabilidad se mantiene en
35/40 (falta 1) pero Craft CAYÓ de 15/20 a 12/20 (falta 8, no 5). Esta ronda es un retroceso neto
en craft, no un avance.

RECOMENDACIÓN FINAL (ronda decisiva — una sola línea de acción, no otra lista):
REVERTIR el anclaje `mt-auto` de la nota de privacidad y volver al layout de la ronda 6/7
(bloque título+chips+nota centrado como grupo único) — esa versión, con 35/40 y 15/20, es la
mejor lograda en 8 rondas y el punto de partida correcto. NO seguir iterando sobre esta pantalla
con más ajustes de espaciado: 3 rondas (6, 7, 8) probando variantes de "dónde poner el aire"
produjeron +1/+1, +0/+0 y -0/-3 — la curva de retorno de este tipo de cambio ya es negativa. Si se
quiere cerrar el hueco real (que existe en AMBAS versiones, solo que repartido vs concentrado), la
única corrección con probabilidad de cruzar el gate es añadir contenido real a la pantalla (no
reposicionar lo existente): un elemento del dispositivo ownable de la ficha (variante simplificada
y SIN bug de progreso del anillo de Streaks, o un micro-detalle visual distinto) entre los chips y
la nota. Si el usuario no quiere invertir una ronda 9, la recomendación es aceptar la versión de
ronda 6/7 (35/40, 15/20) como el estado final de esta pantalla y mover el esfuerzo de revisión a
otras pantallas — los rendimientos decrecientes en P1 ya están confirmados en 3 rondas consecutivas.

TOP DEFECTOS (máx 5, ordenados por impacto):
1. [Franja central, entre el último chip y la nota de privacidad, ~500px / 31% del viewport]
   Vacío único sin ningún contenido, textura ni detalle de marca — el defecto más visible de la
   pantalla → revertir el `mt-auto` de la línea 400 y volver al centrado de grupo de la ronda 6/7,
   o llenar la franja con un elemento real (no reposicionar).
2. [Nota de privacidad, anclada al fondo absoluto] Queda aislada y sin relación visual con la
   pregunta que la precede, por la distancia que la separa del resto del contenido → si se
   mantiene el anclaje al fondo, acercarla visualmente con algo que la conecte (ej. una línea
   divisoria sutil o reducir la distancia máxima permitida).
3. [Pantalla de pregunta completa] Cero dispositivo ownable visible — tras quitar el anillo en la
   ronda 7, no quedó ningún guiño de identidad de marca en este tipo de pantalla (se repite en P2
   y P4) → diseñar un elemento de marca liviano y sin bugs para esta franja, no un parche más de
   espaciado.
4. [Esquina inferior izquierda] Overlay "N" (indicador de dev de Next.js) visible tapando el
   borde del contenido en la captura → confirmar que no aparece en producción antes de dar la
   pantalla por verificada.
5. [Heurística 7 — flexibilidad, 4 rondas sin cambios: 5, 6, 7, 8] Persistir la respuesta al
   volver atrás con las flechas de navegación entre chips sigue sin implementarse.
