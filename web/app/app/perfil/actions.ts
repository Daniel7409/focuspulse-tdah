"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/** Borra la cuenta del usuario que hace la llamada (nunca la de otro) y, por los
 * `on delete cascade` del esquema, arrastra sus tareas, rachas y llamadas a la IA.
 * Lo que queda es solo lo anónimo (logs de error/analítica con user_id en null). */
export async function eliminarMiCuenta() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("NOT_AUTHENTICATED");

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) throw error;

  await supabase.auth.signOut();
}
