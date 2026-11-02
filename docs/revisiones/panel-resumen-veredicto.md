# VEREDICTO revisor-visual — panel-resumen
Fecha: 2026-11-02 00:00
Screenshot: docs/revisiones/panel-resumen-375.png
Usabilidad: 33/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1. [Mitad inferior de la pantalla, debajo de las 4 tarjetas] casi la mitad del viewport (900px reales) queda vacía sin contenido — para un dashboard que promete "lo mas importante, de un vistazo" sobra espacio sin usar → agregar un bloque mas (mini-grafico de usuarios activos en el tiempo, o lista de ultima actividad) para llenar el espacio util. 2. [Toda la pantalla: tarjetas de dato heroe, nav, avisos] cero movimiento implementado — page.tsx y ui.tsx no importan Motion, los numeros heroe (4, 2, 1, US$0,01) aparecen estaticos en vez de contar desde 0, y no hay transicion entre pestanas del nav → agregar conteo animado en DatoHeroe y un fade/stagger sutil de entrada, con prefers-reduced-motion respetado. 3. [Franja superior, encima de las 4 tarjetas] no hay selector de rango de fechas (hoy/7d/30d/custom) para un panel que es software de productividad para un usuario experto — fuerza a releer "Activos (7 dias)" sin poder cambiar el periodo → agregar selector de rango que afecte las 4 metricas. 4. [Etiquetas de las tarjetas: "Activos (7 dias)", "Gasto de IA (24h)"] no hay tooltip/aclaracion de que cuenta como "activo" o como se calcula el gasto de IA — el dueno debe adivinar la regla → icono de info con definicion en hover/tap. 5. [Icono de nav, sidebar] los 6 iconos de navegacion son line-icons genericos sin relacion con el dispositivo ownable de la ficha (anillo de progreso) — no es grave pero es una oportunidad de marca perdida en la unica pantalla de uso diario del dueno → opcional, no bloqueante.
