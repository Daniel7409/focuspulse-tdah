"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Pasos reales del funnel que queremos poder medir (hallazgo #9 de la auditoría de Sesión 8).
 * Una lista cerrada evita nombres sueltos/typos que luego no se pueden agrupar en un reporte.
 */
export type NombreEvento =
  | "onboarding_completado"
  | "paywall_visto"
  | "prueba_iniciada"
  | "tarea_completada";

async function idAnonimo(): Promise<string | null> {
  try {
    const store = await cookies();
    let id = store.get("aid")?.value;
    if (!id) {
      id = crypto.randomUUID();
      store.set("aid", id, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    }
    return id;
  } catch {
    // Server Component (no Server Action): no se puede escribir cookies aquí, se sigue sin anon_id.
    return null;
  }
}

/** Registra un evento del funnel. Nunca lanza — un fallo de analítica no debe romper la app. */
export async function registrarEvento(nombre: NombreEvento, propiedades: Record<string, unknown> = {}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const anonId = await idAnonimo();

    const admin = createAdminClient();
    await admin.from("eventos").insert({
      user_id: user?.id ?? null,
      anon_id: anonId,
      nombre,
      propiedades,
    });
  } catch {
    // Sin ANTHROPIC/SUPABASE_SECRET_KEY en local, o cualquier otro fallo: se ignora en silencio.
  }
}

/** Registra "prueba_iniciada" una sola vez por usuario (idempotente: no cuenta logins repetidos). */
export async function registrarPruebaIniciadaSiEsNueva(userId: string) {
  try {
    const admin = createAdminClient();
    const { count } = await admin
      .from("eventos")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("nombre", "prueba_iniciada");

    if (!count) {
      await admin.from("eventos").insert({ user_id: userId, nombre: "prueba_iniciada", propiedades: {} });
    }
  } catch {
    // Igual que arriba: la analítica nunca debe bloquear el login real.
  }
}
