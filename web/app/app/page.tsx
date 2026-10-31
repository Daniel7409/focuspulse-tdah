import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hoyISO } from "@/lib/fecha";
import HoyScreen from "./hoy-screen";

export const instant = false;

export default async function HoyPage() {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // El layout ya redirige a /login si no hay sesión; `user` existe siempre aquí.
  const { data: tarea } = await supabase
    .from("tasks")
    .select("id, content, status, duration_minutes, completed_at")
    .eq("user_id", user!.id)
    .eq("task_date", await hoyISO())
    .in("status", ["pending", "completed"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return <HoyScreen tareaInicial={tarea} />;
}
