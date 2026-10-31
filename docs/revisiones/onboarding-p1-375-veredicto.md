# VEREDICTO revisor-visual — onboarding-p1 (ronda 2)
Fecha: 2026-10-31 00:00
Screenshot: docs/revisiones/onboarding-p1-375.png
Usabilidad: 33/40
Craft: 13/20
Copy (si vende): 14/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1. [Diálogo "¿Salir ahora?"] aparece sin transición de entrada (pop instantáneo) → envolver con fade/scale-in de ~200ms, igual que el resto de la pantalla. 2. [Transición al elegir chip] el fade-out dura 250ms pero el avance espera 700ms, dejando ~450ms de pantalla en blanco sin ningún indicio de progreso → bajar el timeout a ~300ms o mostrar un loader durante la espera. 3. [Cards de chips] solo llevan borde de 1px sobre fondo plano, sin la sombra tintada violeta que define FICHA-ARTE → aplicar esa sombra para dar el tercer nivel de profundidad. 4. [Ícono junto al título] el "anillo de progreso" prometido en FICHA-ARTE se implementó como círculo+punto estático, indistinguible de un radio button, sin relación con el anillo que SÍ se llena en Modo Enfoque → usar un trazo de anillo parcialmente lleno (ej. progreso 1 de 4). 5. [Titular de cada pregunta] va en texto plano, sin ninguna palabra clave resaltada en el acento violeta (regla de énfasis en pantallas de onboarding/conversión) → aplicar color de acento a la palabra que agita el dolor (ej. "parálisis").
