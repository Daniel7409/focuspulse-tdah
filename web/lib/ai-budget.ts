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

/** Tope simple por usuario: máximo N sugerencias en la última hora (protege contra un solo usuario/bot). */
export async function dentroDelLimitePorUsuario(userId: string, maxPorHora = 20): Promise<boolean> {
  const admin = createAdminClient();
  const haceUnaHora = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { count, error } = await admin
    .from("ai_calls")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", haceUnaHora);

  if (error) {
    console.error("[ai-budget] no se pudo leer el límite por usuario", error);
    return false;
  }

  return (count ?? 0) < maxPorHora;
}

export async function registrarLlamadaIA(userId: string, kind: string, costoUSD: number) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("ai_calls")
    .insert({ user_id: userId, kind, cost_usd: costoUSD });
  if (error) console.error("[ai-budget] no se pudo registrar la llamada", error);
}
