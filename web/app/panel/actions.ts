"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export type UsuarioAgregado = { email: string; enlaceAcceso: string };

/** Crea una cuenta real (como si la persona se hubiera registrado sola) y devuelve un
 * enlace de un solo uso para que el dueño se lo mande a mano por donde prefiera, por si
 * el correo automático no le llega. Nunca se guarda contraseña. */
export async function agregarUsuario(correo: string, nombre: string): Promise<UsuarioAgregado> {
  await requireAdmin();

  const email = correo.trim().toLowerCase();
  const nombreLimpio = nombre.trim();
  if (!email || !email.includes("@")) throw new Error("CORREO_INVALIDO");
  if (!nombreLimpio) throw new Error("NOMBRE_VACIO");

  const admin = createAdminClient();

  const { data: creado, error } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { display_name: nombreLimpio },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already been registered")) {
      throw new Error("CORREO_YA_EXISTE");
    }
    throw error;
  }
  if (!creado.user) throw new Error("NO_SE_PUDO_CREAR");

  const { data: link, error: errorLink } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });
  if (errorLink || !link) throw new Error("NO_SE_PUDO_GENERAR_ENLACE");

  revalidatePath("/panel/usuarios");
  return { email, enlaceAcceso: link.properties.action_link };
}
