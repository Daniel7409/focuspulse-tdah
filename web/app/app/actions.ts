"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function usuarioActual() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("NOT_AUTHENTICATED");
  return { supabase, user };
}

function hoyISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export async function crearTareaHoy(contenido: string) {
  const texto = contenido.trim();
  if (!texto) throw new Error("CONTENIDO_VACIO");

  const { supabase, user } = await usuarioActual();
  const { data, error } = await supabase
    .from("tasks")
    .insert({ user_id: user.id, content: texto, task_date: hoyISO() })
    .select("id, content, status, duration_minutes, completed_at")
    .single();
  if (error) throw error;

  revalidatePath("/app");
  return data;
}

export async function cambiarTareaHoy(taskId: string, nuevoContenido: string) {
  const texto = nuevoContenido.trim();
  if (!texto) throw new Error("CONTENIDO_VACIO");

  const { supabase } = await usuarioActual();
  const { data, error } = await supabase
    .from("tasks")
    .update({ content: texto })
    .eq("id", taskId)
    .select("id, content, status, duration_minutes, completed_at")
    .single();
  if (error) throw error;

  revalidatePath("/app");
  return data;
}

export async function elegirDuracion(taskId: string, minutos: 15 | 25 | 45) {
  const { supabase } = await usuarioActual();
  const { error } = await supabase
    .from("tasks")
    .update({ duration_minutes: minutos })
    .eq("id", taskId);
  if (error) throw error;

  revalidatePath("/app");
}

export async function completarTarea(taskId: string) {
  const { supabase } = await usuarioActual();
  const { data, error } = await supabase.rpc("complete_task", { p_task_id: taskId }).single();
  if (error) throw error;

  revalidatePath("/app");
  revalidatePath("/app/rachas");
  return data;
}

export async function deshacerCierre(taskId: string) {
  const { supabase } = await usuarioActual();
  const { data, error } = await supabase.rpc("undo_complete_task", { p_task_id: taskId }).single();
  if (error) throw error;

  revalidatePath("/app");
  revalidatePath("/app/rachas");
  return data;
}
