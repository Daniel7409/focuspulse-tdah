import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente con la clave secreta: salta RLS. SOLO se importa desde código de servidor
 * (route handlers de app/api, nunca desde un componente cliente ni de un Server Component
 * que luego se renderice con datos sensibles sin filtrar explícitamente por user_id).
 */
export function createAdminClient() {
  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error("SUPABASE_URL / SUPABASE_SECRET_KEY no configuradas");
  }

  return createSupabaseClient(url, secretKey, {
    auth: { persistSession: false },
  });
}
