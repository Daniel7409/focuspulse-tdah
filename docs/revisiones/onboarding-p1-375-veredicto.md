# VEREDICTO revisor-visual — onboarding (pasos pregunta: p1/p2/p4)
Fecha: 2026-11-23 00:00
Screenshot: docs/revisiones/onboarding-p1-375.png (+ onboarding-p2-375.png, onboarding-p4-375.png)
Usabilidad: 36/40
Craft: 17/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA

Nota de ronda: esta re-evaluación cubre los 3 pasos tipo "pregunta" (p1, p2, p4) con screenshots
recapturados en vivo y confirmados visualmente antes de guardar (la ronda anterior había detectado
un screenshot de p4 desactualizado — corregido). Se verificaron en código los 3 fixes reportados:
(1) `tituloTexto` como aria-label plano del radiogroup (línea 341 de page.tsx, antes `undefined`),
(2) título de p4 acortado a 7 palabras (confirmado en screenshot, 2 líneas limpias),
(3) `DemoRollover` recibe prop `tarea` distinto por paso (línea 410-414, confirmado visualmente:
"Llamar al dentista" / "Responder el correo del cliente" / "Organizar el escritorio").
Consistencia entre los 3 pasos verificada: misma topbar, radios, tipografía, card inferior,
candado de privacidad; p2/p4 sin subtítulo es intencional (dato no definido, correcto).

USABILIDAD: 36/40 (detalle: h1:4 h2:4 h3:4 h4:4 h5:3 h6:4 h7:4 h8:4 h9:3 h10:2)
CRAFT: 17/20 (detalle: jerarquía:4 profundidad:3 identidad:3 movimiento:3 encaje:4)

TOP DEFECTOS (máx 5):
1. [chips de opción, borde sin seleccionar] El anillo radio vacío usa borde al 42% de opacidad
   sobre fondo lila — en los 3 screenshots se percibe casi invisible a primera vista → subir a
   ~60-65% de opacidad o usar un color sólido tenue en vez de color-mix tan diluido.
2. [texto "Tus respuestas son privadas"] 11px (0.6875rem) a 70% de opacidad sobre fondo lila claro
   es de muy bajo contraste, al borde de ilegible en los 3 pasos → subir opacidad a ~85-90% o el
   tamaño a 12px mínimo para no arriesgar AA.
3. [ayuda contextual, h10] Ninguno de los 3 pasos tiene ayuda adicional más allá del mini-ejemplo
   fijo del "Pase Cero Culpa" — no hay tooltip ni aclaración de por qué se pide cada dato (menor,
   solo lo nota quien revisa con lupa, por eso no baja más el puntaje) → opcional: micro-texto de
   "por qué te lo preguntamos" si se detecta fricción real en analítica.
4. [DemoRollover, identidad ownable] El dispositivo "tachado con cariño" (rollover) de la ficha de
   arte no es visible en ninguna de las 3 capturas porque el ciclo de animación cayó en la fase
   "movido" (ya resuelto) al momento de la captura, no en "tachando" → no es un defecto de código
   (es timing de un loop), pero si se vuelve a capturar vale la pena fijar fase="tachando" para que
   el revisor vea el dispositivo ownable completo.
5. [craft/movimiento] No se verificó en esta ronda si existe conteo animado de números héroe en
   PantallaSlider/PantallaCarga (fuera del alcance de p1/p2/p4) — anotado para la próxima revisión
   de esos pasos si no se cubrieron antes.
