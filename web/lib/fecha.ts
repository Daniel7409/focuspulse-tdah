import "server-only";
import { cookies } from "next/headers";

/** Colombia: mercado primario de la app (ver FICHA-MERCADO.md) — se usa solo si el navegador aún no mandó su zona real. */
const ZONA_HORARIA_DEFECTO = "America/Bogota";

function formatearISO(fecha: Date, tz: string): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(fecha);
  } catch {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: ZONA_HORARIA_DEFECTO,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(fecha);
  }
}

/** "Hoy" (YYYY-MM-DD) en la zona horaria real del usuario (cookie `tz`), no la del servidor. */
export async function hoyISO(): Promise<string> {
  const store = await cookies();
  const tz = store.get("tz")?.value || ZONA_HORARIA_DEFECTO;
  return formatearISO(new Date(), tz);
}

/** El mismo "hoy" como día calendario puro (ancla a mediodía UTC), para restarle/sumarle días sin que una zona horaria real lo desplace. */
export async function hoyComoDiaCalendario(): Promise<Date> {
  const [y, m, d] = (await hoyISO()).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12));
}
