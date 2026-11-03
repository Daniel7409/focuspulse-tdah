import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { env } from "@/lib/env";

/**
 * Kill-switch de gasto diario (30-INTEGRACION-IA.md): suma lo gastado hoy en `ai_calls`
 * y corta si se pasó del tope. Lectura barata antes de cada llamada cara a la IA.
 */
export async function dentroDelPresupuestoDiario(): Promise<boolean> {
  const admin = createAdminClient();
  const inicioDeHoy = new Date();
  inicioDeHoy.setHours(0, 0, 0, 0);

  const { data, error } = await admin
    .from("ai_calls")
    .select("cost_usd")
    .gte("created_at", inicioDeHoy.toISOString());

  if (error) {
    // Si no se puede leer el gasto, se falla CERRADO (no se llama a la IA) — nunca se gasta a ciegas.
    console.error("[ai-budget] no se pudo leer el gasto diario", error);
    return false;
  }

  const gastoHoy = data.reduce((acc, row) => acc + Number(row.cost_usd), 0);
  return gastoHoy < env.AI_DAILY_BUDGET_USD;
}

/** Tope por usuario (máximo N sugerencias en la última hora), revisado y reservado en
 * un solo paso atómico en la base de datos (`reservar_cupo_ia`) — antes era un SELECT
 * count() seguido de un INSERT por separado, y una ráfaga de pedidos simultáneos podía
 * saltarse el tope colándose entre esos dos pasos. Devuelve el id de la reserva, o
 * `null` si ya no hay cupo. */
export async function reservarCupoIA(userId: string, maxPorHora = 20): Promise<string | null> {
  const admin = createAdminClient();
  const { data, error } = await admin.rpc("reservar_cupo_ia", {
    p_user_id: userId,
    p_max_por_hora: maxPorHora,
  });

  if (error) {
    console.error("[ai-budget] no se pudo reservar el cupo por usuario", error);
    return null;
  }

  return data;
}

/** Confirma una reserva ya hecha con el costo y el tipo reales (tras llamar a la IA). */
export async function confirmarLlamadaIA(reservaId: string, kind: string, costoUSD: number) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("ai_calls")
    .update({ kind, cost_usd: costoUSD })
    .eq("id", reservaId);
  if (error) console.error("[ai-budget] no se pudo confirmar la llamada", error);
}

/** Si la llamada a la IA falló, deja la reserva en $0 con un tipo que lo deja claro
 * (sigue contando para el tope de la hora — evita que reintentar fallos sea gratis). */
export async function marcarLlamadaIAFallida(reservaId: string) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("ai_calls")
    .update({ kind: "fallido", cost_usd: 0 })
    .eq("id", reservaId);
  if (error) console.error("[ai-budget] no se pudo marcar la llamada fallida", error);
}
