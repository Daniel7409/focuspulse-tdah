// Copy derivado de FICHA-AVATAR.md (Carlos Mendoza): tuteo, "cero culpa", sin regañar ni meter
// prisa falsa — el dolor real es la culpa/vergüenza, así que el tono es de aliado, no de cobrador.

// Enlace de texto simple (subrayado, sin caja de color): un botón grande hace que Gmail
// clasifique el correo como "Promociones" incluso en avisos urgentes de cuenta — confirmado
// en una prueba real de esta sesión (el correo con botón cayó en Promociones, entregado pero
// con menos visibilidad). Un enlace de texto se lee más como correo personal.
const ENLACE = (href: string, texto: string) => `
  <a href="${href}" style="color:#6E5A9E;font-weight:600;text-decoration:underline">${texto}</a>
`;

/** Dunning — se dispara UNA vez, al primer momento en que un pago queda `past_due`. */
export function emailPagoFallido(nombre: string, linkActualizarPago: string) {
  const subjectVariants = [
    "Tu pago no pasó — se arregla en 1 minuto",
    "FocusPulse: no pudimos cobrar tu plan",
  ];
  return {
    subject: subjectVariants[0],
    subjectVariants,
    preheader: "No perdiste nada todavía. Solo actualiza tu método de pago para seguir con tu racha.",
    bodyHtml: `
      <p style="margin:0 0 16px;font-size:16px">Hola ${nombre || "de nuevo"},</p>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.5">
        Intentamos cobrar tu plan de FocusPulse TDAH y el banco lo rechazó — pasa todo el tiempo,
        casi siempre es la tarjeta vencida o un límite del día.
      </p>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.5">
        Mientras tanto tu acceso sigue activo, pero si no se resuelve vas a perder tu racha y el
        Pase Cero Culpa. Puedes ${ENLACE(linkActualizarPago, "actualizar tu método de pago aquí")}.
      </p>
    `,
  };
}

/** Win-back — se dispara UNA vez, al confirmarse `SUBSCRIPTION_CANCELLATION`. */
export function emailCancelacion(nombre: string, linkReactivar: string) {
  const subjectVariants = [
    "Tu Pase Cero Culpa quedó en pausa",
    "Antes de que te vayas del todo…",
  ];
  return {
    subject: subjectVariants[0],
    subjectVariants,
    preheader: "Sin presión. Si quieres volver, tu progreso te está esperando.",
    bodyHtml: `
      <p style="margin:0 0 16px;font-size:16px">Hola ${nombre || ""},</p>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.5">
        Vimos que cancelaste tu plan de FocusPulse TDAH. No hay ningún reproche — a veces una app
        deja de encajar, o simplemente no era el momento.
      </p>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.5">
        Si fue por otra razón (precio, algo que no funcionó como esperabas), cuéntanoslo respondiendo
        este correo — lo leemos de verdad. Y si en algún momento quieres volver, tu racha y tu
        historial siguen ahí: ${ENLACE(linkReactivar, "aquí puedes retomarlo")}.
      </p>
    `,
  };
}
