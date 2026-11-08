import "server-only";

export type EstadoHotmart =
  | "trialing"
  | "active"
  | "past_due"
  | "cancelled"
  | "expired"
  | "refunded"
  | "chargeback";

// ⚠️ PLACEHOLDER — verificar con una compra sandbox real antes de confiar del todo: es plausible
// que Hotmart dispare PURCHASE_APPROVED con valor 0 al iniciar el trial, en vez de un evento propio.
// Si es así, tratarlo como 'trialing' (no 'active') o la métrica trial→pago queda rota en silencio.
const TRIAL_START_EVENT = "SUBSCRIPTION_TRIAL_START";

const EVENTO_A_ESTADO: Record<string, EstadoHotmart> = {
  [TRIAL_START_EVENT]: "trialing",
  PURCHASE_APPROVED: "active",
  PURCHASE_COMPLETE: "active",
  PURCHASE_DELAYED: "past_due",
  SUBSCRIPTION_CANCELLATION: "cancelled",
  PURCHASE_EXPIRED: "expired",
  PURCHASE_REFUNDED: "refunded",
  PURCHASE_CHARGEBACK: "chargeback",
};

export const EVENTO_CAMBIO_DE_PLAN = "SWITCH_PLAN";

const NEGATIVOS_TERMINALES: EstadoHotmart[] = ["refunded", "chargeback"];

/** ¿Es legal pasar de `desde` a `hacia`? Bloquea que un evento viejo reentregado
 * reactive a alguien que ya quedó en reembolso o contracargo. */
export function transicionLegal(desde: string | null, hacia: EstadoHotmart): boolean {
  if (desde === null) return true;
  if (NEGATIVOS_TERMINALES.includes(desde as EstadoHotmart) && (hacia === "active" || hacia === "trialing")) {
    return false;
  }
  return true;
}

export function estadoParaEvento(evento: string): EstadoHotmart | null {
  return EVENTO_A_ESTADO[evento] ?? null;
}
