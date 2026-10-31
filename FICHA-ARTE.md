# FICHA-ARTE — FocusPulse TDAH

## Protocolo usado
Sin referencia visual del usuario → Protocolo A/B/C (54): 3 fusiones de líderes del nicho, luego combinación final ajustada por el usuario.

## TABLA DE LÍDERES
| App | Tipografía | Lógica de color | Radius/cards | Cómo gamifica | Patrón robado |
|---|---|---|---|---|---|
| Tiimo | geométrica cálida (DM Sans/Sora) | claro, acento suave, accesible | cards redondeadas | visual, sin mascota agresiva | calma visual |
| Things 3 | sans neutra precisa | mucho blanco, cero ruido | radios medios | — | minimalismo extremo |
| Streaks | sans del sistema | 1 acento, modo oscuro posible | botón/anillo grande | racha simple, sin mascota | anillo/botón de progreso |

## Opciones presentadas (direcciones-abc.html)
- **A — Respiro:** cálida, DM Sans, tarjeta suave, acento terracota.
- **B — Modo Enfoque:** ajustada por el usuario de oscura a lila calmante, acento violeta, Geist, anillo de progreso.
- **C — Bitácora cálida:** editorial, Newsreader + Instrument Sans, rollover visualizado como tachado con cariño.

## DIRECCIÓN ELEGIDA (fusión final — fusion-final.html)
- **Fondo:** lila calmante #EFEAF6 · superficie #F9F6FC (pedido explícito del usuario sobre la Opción B).
- **Texto:** #2C2638 (primario) / #65607A (secundario) / #9089A8 (terciario/caption) — ajustado desde el #7C7490 inicial al implementar landing.html y onboarding.html, para pasar contraste AA sobre el fondo lila en texto de 13-14px.
- **Acento:** violeta sobrio #6E5A9E — un solo acento, sin neón, sin glow.
- **Tipografía:** DM Sans, familia única (patrón más seguro de apps líderes — Duolingo/Revolut/Linear; confirmada contra fila "Bienestar/meditación" de 29, que es la que usa Tiimo).
- **Radius:** cards 20px · botones 14px.
- **Dispositivo ownable:** anillo de progreso de enfoque (de Streaks) + tareas movidas mostradas TACHADAS CON CARIÑO, nunca en rojo (idea propia, de la dirección "Bitácora cálida").
- **Gamificación:** racha en puntos/días — adulta, sin mascotas ni niveles infantiles (ajuste pedido por el usuario sobre Sprout).
- **Sombra:** tintada en violeta (110 90 158), nunca negra pura.

## Tour de la app (vista-previa-app.html) — 5 vistas aprobadas
1. Bienvenida — cero fricción, sin cuenta.
2. Primera tarea — campo único "¿Qué es lo ÚNICO que tienes que hacer ahora?".
3. Enfoque activo — pantalla completa oscura (invertida del lila, "apaga el ruido"), anillo + timer grande.
4. Cierre del día — celebración, resumen sin culpa, rollover confirmado.
5. Rachas — gamificación adulta, semana en chips, nota anti-culpa.

## Trazabilidad
- Comparativa completa (incluidas descartadas A y C): `direcciones-abc.html`
- Fusión final: `fusion-final.html`
- Tour aprobado: `vista-previa-app.html`
- Mapa de rutas: `/` → `/onboarding` → `/paywall` → `/login` → `/app`
