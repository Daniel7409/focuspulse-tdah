# VEREDICTO revisor-visual — Paywall
Fecha: 2026-10-27 00:00
Screenshot: docs/revisiones/paywall-375.jpg
Usabilidad: 36/40
Craft: 16/20
Copy (si vende): 18/20
Fidelidad (si hubo referencia): N-A
Veredicto: LISTA
Top defectos:
1. [exit-row, pie de pantalla] "Restaurar compra" en acento+semibold vs "Ahora no" en gris crea dos pesos distintos en la fila de salida; un ojo entrenado nota la asimetría aunque no compite con el CTA primario → igualar ambos a texto terciario (gris, regular) y reservar el acento solo para el CTA principal.
2. [plans, badge "2 MESES GRATIS"] el badge de ahorro solo se renderiza sobre el plan que está seleccionado; si el usuario tapea "Mensual", el plan Anual pierde la etiqueta y el argumento de ahorro desaparece de la vista → fijar el badge "2 meses gratis" permanente en la fila Anual, independiente de cuál esté seleccionado.
3. [eje movimiento, código] no se pudo confirmar en el screenshot estático si las 7 baseline de movimiento (conteo de números, barras/anillos, tap <150ms, transición de tabs, modal suave, celebración, reduced-motion) están TODAS cubiertas en esta pantalla puntual más allá del ring-draw y los :active ya verificados → auditar `reduceMotion` también en el draw del ring (`.ring-arc` anima siempre, confirmar que respeta `prefers-reduced-motion`).
4. [timeline, "Día 5 — primer cobro"] el nodo outline (hueco) se distingue bien de los dos nodos "fill", pero la diferencia de contraste entre `t-line` y `t-line neutral` es sutil en foto comprimida → verificar en dispositivo real que el tramo "neutral" no se perciba como línea rota.
5. [value-stack] los tres checks de beneficios usan el mismo ícono y color que los checks del trust-row inferior, lo cual es consistente pero reduce la jerarquía entre "por qué este plan" y "qué pasa con el cobro" → diferenciar sutilmente el ícono de value-stack (p.ej. relleno) del ícono de trust3 (outline) para separar visualmente ambos bloques.
