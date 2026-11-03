import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Hallazgo crítico de la auditoría de seguridad (Sesión 13): nada revisaba, en el
 * servidor, si la prueba gratis seguía vigente o el plan estaba activo — cualquiera
 * que se registrara entraba para siempre, prueba vencida o no. Esta función es la
 * única fuente de verdad sobre "¿esta persona puede usar la app hoy?". */
export async function tieneAccesoVigente(
  supabase: SupabaseClient,
  userId: string,
): Promise<boolean> {
  const { data: perfil } = await supabase
    .from("profiles")
    .select("plan, trial_ends_at")
    .eq("id", userId)
    .single();

  if (!perfil) return false;
  if (perfil.plan === "active") return true;
  if (perfil.plan === "trial" && perfil.trial_ends_at) {
    return new Date(perfil.trial_ends_at).getTime() > Date.now();
  }
  return false;
}
