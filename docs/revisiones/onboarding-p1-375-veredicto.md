# VEREDICTO revisor-visual — Onboarding Pantalla 1 (ronda 5)
Fecha: 2026-11-04 00:00
Screenshot: docs/revisiones/onboarding-p1-375-v4.jpg
Usabilidad: 32/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA

Detalle usabilidad (h1-h10): h1:4 h2:4 h3:3 h4:3 h5:3 h6:4 h7:3 h8:2 h9:3 h10:3
Detalle craft: jerarquía:3 profundidad:2 identidad:3 movimiento:3 encaje:3

Top defectos:
1. [Bajo título, toda la pantalla] Cuatro indicadores de progreso simultáneos dicen lo mismo: barra superior, "11%", "Pregunta 1 de 4" y el círculo numerado "1" junto al título → eliminar uno (recomendado: quitar el círculo numerado o el "11%") y dejar máximo 2 señales de progreso.
2. [Fondo del panel, de header a ~240px] El degradado interno (primary 9% → background) sigue sin percibirse como profundidad a 375px: el fondo base YA es lila cercano al tinte, así que el color-mix se funde con él mismo → usar un salto tonal más fuerte y perceptible (p. ej. superficie base más oscura ~6-8% o un límite de sombra/línea sutil donde termina el degradado), no solo un gradiente del mismo hue sobre sí mismo.
3. [Nota "TUS RESPUESTAS SON PRIVADAS...", debajo de los chips] El texto en mayúsculas + bold + ícono sigue teniendo peso visual de instrucción/advertencia (compite con los chips justo arriba) pese a ya no tener fondo de pill → bajar a normal-case y peso regular, dejarlo claramente secundario.
4. [Esquina inferior izquierda, círculo oscuro con "N"] Elemento redondo oscuro flotante no presente en el código de la pantalla (page.tsx) — si es parte del render real (no un overlay del navegador/herramienta), es un objeto con apariencia interactiva sin función definida → verificar su origen; si es de la app, darle función o quitarlo.
5. [Lista de chips] Todos los chips —seleccionados o no— llevan sombra tintada, lo que reduce el contraste entre "superficie base" y "superficie elevada" que debería dar la sensación de profundidad de 3 niveles → reservar la sombra más marcada solo para el estado seleccionado/hover, chips en reposo con sombra casi nula.
