"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/** Registra un error real de la app para el panel de admin. Nunca lanza — un fallo al
 * registrar no debe sumarse al error que ya estaba pasando. */
export async function registrarError(mensaje: string, contexto?: string, pantalla?: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const admin = createAdminClient();
    await admin.from("error_log").insert({
      user_id: user?.id ?? null,
      mensaje: mensaje.slice(0, 2000),
      contexto: contexto?.slice(0, 2000) ?? null,
      pantalla: pantalla ?? null,
    });
  } catch {
    // Sin SUPABASE_SECRET_KEY en local, o cualquier otro fallo: se ignora en silencio.
  }
}
