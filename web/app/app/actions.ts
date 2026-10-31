"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { hoyISO } from "@/lib/fecha";
import { registrarEvento } from "@/lib/eventos-actions";

async function usuarioActual() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("NOT_AUTHENTICATED");
  return { supabase, user };
}

export async function crearTareaHoy(contenido: string) {
  const texto = contenido.trim();
  if (!texto) throw new Error("CONTENIDO_VACIO");

  const { supabase, user } = await usuarioActual();
  const dia = await hoyISO();
  const { data, error } = await supabase
    .from("tasks")
    .insert({ user_id: user.id, content: texto, task_date: dia })
    .select("id, content, status, duration_minutes, completed_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      const { data: existente, error: errorExistente } = await supabase
        .from("tasks")
        .select("id, content, status, duration_minutes, completed_at")
        .eq("user_id", user.id)
        .eq("task_date", dia)
        .single();
      if (errorExistente) throw errorExistente;
      revalidatePath("/app");
      return existente;
    }
    throw error;
  }

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
  const dia = await hoyISO();
  const { data, error } = await supabase.rpc("complete_task", { p_task_id: taskId, p_day: dia }).single();
  if (error) throw error;

  await registrarEvento("tarea_completada");
  revalidatePath("/app");
  revalidatePath("/app/rachas");
  return data;
}

export async function deshacerCierre(taskId: string) {
  const { supabase } = await usuarioActual();
  const dia = await hoyISO();
  const { data, error } = await supabase.rpc("undo_complete_task", { p_task_id: taskId, p_day: dia }).single();
  if (error) throw error;

  revalidatePath("/app");
  revalidatePath("/app/rachas");
  return data;
}
