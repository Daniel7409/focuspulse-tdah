// Copy derivado de FICHA-AVATAR.md (Carlos Mendoza): tuteo, "cero culpa", sin regañar ni meter
// prisa falsa — el dolor real es la culpa/vergüenza, así que el tono es de aliado, no de cobrador.

// Enlace de texto simple (subrayado, sin caja de color): un botón grande hace que Gmail
// clasifique el correo como "Promociones" incluso en avisos urgentes de cuenta — confirmado
// en una prueba real de esta sesión (el correo con botón cayó en Promociones, entregado pero
// con menos visibilidad). Un enlace de texto se lee más como correo personal.
const ENLACE = (href: string, texto: string) => `
  <a href="${href}" style="color:#6E5A9E;font-weight:600;text-decoration:underline">${texto}</a>
`;

/** Bienvenida y activación — día 1: reforzar el mecanismo (rollover sin culpa) recién llegado. */
export function emailBienvenidaD1(nombre: string, linkApp: string) {
  return {
    subject: "Un consejo para tu primer día en FocusPulse",
    preheader: "Solo necesitas UNA tarea hoy — el resto puede esperar.",
    bodyHtml: `
      <p style="margin:0 0 16px;font-size:16px">Hola ${nombre || ""},</p>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.5">
        Ayer entraste por primera vez a FocusPulse TDAH. Un consejo para que te sirva de verdad:
        no intentes meter toda tu lista de pendientes — escribe SOLO la tarea más importante de hoy.
        Lo demás, si no lo haces, pasa solo a mañana. Sin números rojos, sin culpa.
      </p>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.5">
        ${ENLACE(linkApp, "Entra y escribe tu única tarea de hoy")}.
      </p>
    `,
  };
}

/** Bienvenida y activación — día 3: check-in breve, sin presión, oferta de ayuda real. */
export function emailBienvenidaD3(nombre: string, linkApp: string) {
  return {
    subject: "¿Cómo te ha ido estos 3 días?",
    preheader: "Si algo no te quedó claro, respóndenos este correo.",
    bodyHtml: `
      <p style="margin:0 0 16px;font-size:16px">Hola ${nombre || ""},</p>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.5">
        Llevas 3 días con FocusPulse TDAH. Si ya le agarraste el ritmo, genial — si todavía no,
        no pasa nada: el "Pase Cero Culpa" está para eso, no hay que ser perfecto desde el día 1.
      </p>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.5">
        ¿Algo no te quedó claro o no te funcionó como esperabas? Respóndenos este correo, lo
        leemos de verdad. Y si quieres seguir, ${ENLACE(linkApp, "aquí está tu tarea de hoy")}.
      </p>
    `,
  };
}

/** Bienvenida y activación — día 7: cierre de la primera semana, sin presión de venta. */
export function emailBienvenidaD7(nombre: string, linkApp: string) {
  return {
    subject: "Completaste tu primera semana",
    preheader: "Una semana con una app nueva ya dice algo — sigamos.",
    bodyHtml: `
      <p style="margin:0 0 16px;font-size:16px">Hola ${nombre || ""},</p>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.5">
        Ya llevas una semana con FocusPulse TDAH — para alguien con TDAH, seguir probando algo
        una semana entera ya es una victoria real, no es poca cosa.
      </p>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.5">
        Si te está sirviendo, lo mejor que puedes hacer es seguir con la misma rutina: una sola
        tarea, cada día. ${ENLACE(linkApp, "Sigue con tu racha")}.
      </p>
    `,
  };
}

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

/** Carrito abandonado — se dispara UNA vez, al confirmarse `PURCHASE_OUT_OF_SHOPPING_CART`. */
export function emailCarritoAbandonado(nombre: string, linkCheckout: string) {
  const subjectVariants = [
    "¿Te quedó alguna duda sobre FocusPulse?",
    "Tu lugar en FocusPulse TDAH sigue disponible",
  ];
  return {
    subject: subjectVariants[0],
    subjectVariants,
    preheader: "Sin presión — si algo no te quedó claro, respondemos aquí mismo.",
    bodyHtml: `
      <p style="margin:0 0 16px;font-size:16px">Hola ${nombre || ""},</p>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.5">
        Viste FocusPulse TDAH hace poco y no llegaste a completar tu compra. No hay ningún
        apuro — si te quedó alguna duda (precio, cómo funciona, si te sirve para tu caso),
        respóndenos este correo y te ayudamos directamente.
      </p>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.5">
        Y si solo se te pasó, ${ENLACE(linkCheckout, "aquí puedes retomarlo")}.
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
