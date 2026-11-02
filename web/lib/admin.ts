import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Verifica el rol de admin leyendo `profiles.role` EN CADA LLAMADA, no por una ruta
 * oculta ni por una lista de correos (26-AUTH-MODERNO.md, "Rutas de prueba y acceso
 * administrativo"). Se llama al inicio de cada página del panel Y de cada Server Action
 * que toque datos de admin — la ruta protegida por sí sola no basta (IDOR).
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: perfil } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (perfil?.role !== "admin") redirect("/app");

  return { user };
}
