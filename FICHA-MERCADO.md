# FICHA DE MERCADO — FocusPulse TDAH

## Alcance de esta ficha
- Nicho/categoría exacta: apps de planificación diaria de una sola tarea para adultos con TDAH
- País(es) donde se va a vender: Colombia (mercado primario) + LATAM hispanohablante en general · Moneda de cobro: USD (checkout Hotmart, precios en dólares, pago local vía PSE en Colombia)
- Fecha de investigación: 2026-10-27 · **Vence el:** 2027-04-27 (6 meses)
- Pasarela/plataforma de venta elegida: Hotmart

## 1. PRECIO — contra qué se compara el tuyo
- Mediana de precio de la categoría (mensual): NO ENCONTRADO un estudio agregado de la categoría exacta "apps TDAH de una tarea"; referencia directa: Sprout ≈ £6.99/mes (~$8.80 USD) | fuente: TrustMRR/App Store | fecha: oct-2026
- Rango que cobran los líderes investigados en FICHA-ARTE.md (Tiimo ~$9-12/mes según región, Sprout ~$8.80/mes): $8.80 a $12/mes | fecha: oct-2026
- **Precio elegido para esta app:** $4.99/mes · $34.99/año · **Desvío respecto a la mediana:** aprox. -45% (por debajo del rango de los líderes)
- Razón del desvío: entrada deliberadamente más barata que la competencia en inglés para ganar el mercado hispanohablante sin competidor directo, y porque el costo de servir la app es bajo (sin IA generativa cara) — el gate de margen (40-UNIT-ECONOMICS) se revisa antes de construir el backend
- Precio por país/moneda: NO ENCONTRADO ajuste de price-parity específico — se revisa en la fase de venta (18) si se vende fuera de Colombia

## 2. CICLO DE DECISIÓN
- ¿Se compra el mismo día o se piensa?: esperable compra rápida (precio bajo, dolor agudo) — NO ENCONTRADO dato propio todavía (sin tráfico aún)
- **Ventana mínima antes de declarar que una campaña fracasó:** 14 días (criterio conservador por defecto, sin dato propio — se ajusta con datos reales en Sesión 8)

## 3. CÓMO PAGA ESTE MERCADO
- Medios de pago en Colombia vía Hotmart: tarjeta de crédito/débito + **PSE** confirmado | fuente: ayuda oficial de Hotmart (help.hotmart.com) | fecha: oct-2026
- Cuotas con tarjeta: el beneficio "Hotmart Cuotas" (hasta 12 cuotas) está confirmado para Brasil (ofertas en reales); **NO CONFIRMADO** si aplica para Colombia — verificar en el panel al configurar la oferta
- Penetración de tarjeta de crédito en Colombia: NO ENCONTRADO con fuente propia en esta investigación
- PIX/boleto: no aplica (son de Brasil) — en Colombia el método no-tarjeta relevante es PSE (débito bancario)
- **Consecuencia para el producto:** un modelo de suscripción recurrente por tarjeta excluye a quien solo tiene PSE/débito bancario sin recurrencia automática garantizada — revisar con soporte de Hotmart si PSE permite cobro recurrente o solo pago único antes de construir el webhook (18-VENTA-HOTMART.md)

## 4. PRUEBA Y GARANTÍA
- Plazos de prueba que admite la pasarela: NO ENCONTRADO el límite exacto de días de trial en la documentación pública consultada — se configura en el panel de Hotmart al crear la oferta
- Plazos de garantía/reembolso que admite Hotmart: **7, 15 o 30 días** (el productor elige) | fuente: ayuda oficial de Hotmart + Tecnoblog | fecha: oct-2026
- **Prueba elegida: 5 días · Garantía elegida: 7 días** (ajustado por el usuario — se acortó la prueba en vez de igualar la garantía, para no romper la regla dura de abajo)
- Comprobación regla dura: garantía (7) > prueba (5) → **SÍ** ✅ — cobertura real de 2 días tras el primer cobro
- ¿Desde cuándo cuenta la garantía (adhesión o primer cobro)?: NO CONFIRMADO — hasta confirmarlo con el panel real de Hotmart, el copy dirá "garantía de 7 días" sin fijar el evento que la dispara

## 5. CONVERSIÓN ESPERABLE
- Conversión típica visita→registro / prueba→pago del nicho: NO ENCONTRADO dato propio del nicho exacto — se usan como referencia de TECHO (no meta) los benchmarks generales de 02C (apps móviles, no checkout web)
- **Umbral de muestra antes de decidir:** 200 sesiones o 50 clics al paywall (criterio conservador por defecto hasta tener datos propios)

## 6. ESTACIONALIDAD Y CONTEXTO
- ¿Picos de demanda?: esperable un pico en enero (propósitos de año nuevo, patrón que HabitKit confirma con su +$112K en enero 2025 — ver FICHA-MODELO.md) | fuente: Substack del fundador de HabitKit | fecha: dic-2025
- Regulación relevante: ninguna crítica detectada (no es salud regulada, no es financiera) — revisar disclaimer de "no es tratamiento médico para TDAH" en 47-LEGAL-FISCAL-Y-PRIVACIDAD.md antes de vender
