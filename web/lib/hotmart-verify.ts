import "server-only";
import crypto from "node:crypto";

/** Comparación en tiempo constante (anti timing-attack). timingSafeEqual exige buffers de
 * igual longitud, así que primero se igualan los tamaños sin usar un early-return que filtre tiempo. */
function timingSafeEqualStr(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

/** Verifica el hottok recibido (header x-hotmart-hottok o campo hottok del body) contra el propio.
 * Fail-secure: si falta la variable de entorno, revienta en el primer pedido real (nunca corre
 * con un valor de juguete) — se revisa aquí adentro, no al cargar el módulo, para no tumbar
 * `next build` cuando el secreto todavía no existe en el entorno local. */
export function verifyHotmart(hottokRecibido: string | undefined | null): boolean {
  const HOTTOK = process.env.HOTMART_HOTTOK;
  if (!HOTTOK) throw new Error("FALTA HOTMART_HOTTOK — el webhook de Hotmart no puede operar de forma segura");
  if (!hottokRecibido) return false;
  return timingSafeEqualStr(hottokRecibido, HOTTOK);
}
