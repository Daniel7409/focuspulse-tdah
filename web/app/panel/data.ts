import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type Usuario = {
  id: string;
  email: string;
  display_name: string | null;
  plan: string;
  role: string;
  trial_ends_at: string | null;
  created_at: string;
  ultima_actividad: string | null;
};

const VENTANA_ACTIVOS_DIAS = 7;

/** Todos los usuarios (perfil + correo, que solo vive en auth.users) con su última actividad real. */
export async function listarUsuarios(): Promise<Usuario[]> {
  const admin = createAdminClient();

  const [{ data: perfiles }, { data: listaAuth }, { data: tareas }, { data: eventos }] = await Promise.all([
    admin
      .from("profiles")
      .select("id, display_name, plan, role, trial_ends_at, created_at")
      .order("created_at", { ascending: false }),
    admin.auth.admin.listUsers({ perPage: 200 }),
    admin.from("tasks").select("user_id, updated_at"),
    admin.from("eventos").select("user_id, creado_en").not("user_id", "is", null),
  ]);

  const correoPorId = new Map((listaAuth?.users ?? []).map((u) => [u.id, u.email ?? ""]));

  const ultimaPorUsuario = new Map<string, string>();
  const marcar = (id: string | null, cuando: string | null) => {
    if (!id || !cuando) return;
    const actual = ultimaPorUsuario.get(id);
    if (!actual || cuando > actual) ultimaPorUsuario.set(id, cuando);
  };
  for (const t of tareas ?? []) marcar(t.user_id, t.updated_at);
  for (const e of eventos ?? []) marcar(e.user_id as string, e.creado_en as string);

  return (perfiles ?? []).map((p) => ({
    id: p.id,
    email: correoPorId.get(p.id) ?? "—",
    display_name: p.display_name,
    plan: p.plan,
    role: p.role,
    trial_ends_at: p.trial_ends_at,
    created_at: p.created_at,
    ultima_actividad: ultimaPorUsuario.get(p.id) ?? null,
  }));
}

export type MetricasUsuarios = {
  total: number;
  activos: number;
  retencion: { d1: number | null; d7: number | null; d30: number | null };
};

/** Activo = tuvo una tarea o un evento en los últimos 7 días. Retención D+N (definición
 * relajada y honesta): de quienes se registraron hace ≥N días, % que volvió a tener
 * actividad DESPUÉS del día N de su registro (no exactamente ese día). */
export function calcularMetricasUsuarios(usuarios: Usuario[]): MetricasUsuarios {
  const ahora = Date.now();
  const ventanaMs = VENTANA_ACTIVOS_DIAS * 24 * 60 * 60 * 1000;
  const activos = usuarios.filter(
    (u) => u.ultima_actividad && ahora - new Date(u.ultima_actividad).getTime() <= ventanaMs,
  ).length;

  function retencionD(dias: number): number | null {
    const umbralMs = dias * 24 * 60 * 60 * 1000;
    const elegibles = usuarios.filter((u) => ahora - new Date(u.created_at).getTime() >= umbralMs);
    if (elegibles.length === 0) return null;
    const volvieron = elegibles.filter((u) => {
      if (!u.ultima_actividad) return false;
      const signupMasN = new Date(u.created_at).getTime() + umbralMs;
      return new Date(u.ultima_actividad).getTime() >= signupMasN;
    }).length;
    return Math.round((volvieron / elegibles.length) * 100);
  }

  return {
    total: usuarios.length,
    activos,
    retencion: { d1: retencionD(1), d7: retencionD(7), d30: retencionD(30) },
  };
}

export type PasoFunnel = { nombre: string; etiqueta: string; conteo: number };

const ORDEN_FUNNEL: { nombre: string; etiqueta: string }[] = [
  { nombre: "onboarding_completado", etiqueta: "Terminó el recorrido de inicio" },
  { nombre: "paywall_visto", etiqueta: "Vio la pantalla de planes" },
  { nombre: "prueba_iniciada", etiqueta: "Empezó la prueba (entró a la app)" },
  { nombre: "tarea_completada", etiqueta: "Completó al menos una tarea" },
];

/** Embudo real desde `eventos` — cuenta personas distintas (user_id si lo hay, si no anon_id). */
export async function funnelUso(): Promise<PasoFunnel[]> {
  const admin = createAdminClient();
  const { data } = await admin.from("eventos").select("nombre, user_id, anon_id");

  const porPaso = new Map<string, Set<string>>();
  for (const fila of data ?? []) {
    const clave = (fila.user_id as string | null) ?? (fila.anon_id as string | null);
    if (!clave) continue;
    const set = porPaso.get(fila.nombre as string) ?? new Set<string>();
    set.add(clave);
    porPaso.set(fila.nombre as string, set);
  }

  return ORDEN_FUNNEL.map(({ nombre, etiqueta }) => ({
    nombre,
    etiqueta,
    conteo: porPaso.get(nombre)?.size ?? 0,
  }));
}

export type AccionPrincipal = { tareasCompletadasTotal: number; tareasCompletadasHoy: number };

export async function accionPrincipal(): Promise<AccionPrincipal> {
  const admin = createAdminClient();
  const desdeHoy = new Date();
  desdeHoy.setUTCHours(0, 0, 0, 0);

  const [{ count: total }, { count: hoy }] = await Promise.all([
    admin.from("tasks").select("id", { count: "exact", head: true }).eq("status", "completed"),
    admin
      .from("tasks")
      .select("id", { count: "exact", head: true })
      .eq("status", "completed")
      .gte("completed_at", desdeHoy.toISOString()),
  ]);

  return { tareasCompletadasTotal: total ?? 0, tareasCompletadasHoy: hoy ?? 0 };
}

export type MetricasIA = {
  costoTotalUsd: number;
  costo24hUsd: number;
  llamadasTotal: number;
  costoPromedioUsd: number;
  topUsuarios: { usuarioId: string; costoUsd: number; llamadas: number }[];
};

export async function metricasIA(): Promise<MetricasIA> {
  const admin = createAdminClient();
  const hace24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data: llamadas } = await admin.from("ai_calls").select("user_id, cost_usd, created_at");
  const filas = llamadas ?? [];

  const costoTotalUsd = filas.reduce((s, f) => s + Number(f.cost_usd ?? 0), 0);
  const costo24hUsd = filas
    .filter((f) => (f.created_at as string) >= hace24h)
    .reduce((s, f) => s + Number(f.cost_usd ?? 0), 0);

  const porUsuario = new Map<string, { costoUsd: number; llamadas: number }>();
  for (const f of filas) {
    const id = f.user_id as string;
    const actual = porUsuario.get(id) ?? { costoUsd: 0, llamadas: 0 };
    actual.costoUsd += Number(f.cost_usd ?? 0);
    actual.llamadas += 1;
    porUsuario.set(id, actual);
  }
  const topUsuarios = [...porUsuario.entries()]
    .map(([usuarioId, v]) => ({ usuarioId, ...v }))
    .sort((a, b) => b.costoUsd - a.costoUsd)
    .slice(0, 5);

  return {
    costoTotalUsd,
    costo24hUsd,
    llamadasTotal: filas.length,
    costoPromedioUsd: filas.length ? costoTotalUsd / filas.length : 0,
    topUsuarios,
  };
}

export type DistribucionPlanes = Record<string, number>;

/** Lo que la app tiene REGISTRADO localmente en `profiles.plan` — no es lo mismo que un
 * cobro confirmado por Hotmart (ese webhook todavía no está conectado). */
export async function distribucionPlanes(): Promise<DistribucionPlanes> {
  const admin = createAdminClient();
  const { data } = await admin.from("profiles").select("plan");
  const conteo: DistribucionPlanes = { trial: 0, active: 0, canceled: 0, expired: 0 };
  for (const fila of data ?? []) {
    const plan = fila.plan as string;
    conteo[plan] = (conteo[plan] ?? 0) + 1;
  }
  return conteo;
}

export type ErrorReciente = {
  id: string;
  mensaje: string;
  pantalla: string | null;
  creado_en: string;
};

export async function erroresRecientes(limite = 20): Promise<ErrorReciente[]> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("error_log")
    .select("id, mensaje, pantalla, creado_en")
    .order("creado_en", { ascending: false })
    .limit(limite);
  return data ?? [];
}

export type EventoActividad = { id: string; texto: string; cuando: string };

const ETIQUETA_EVENTO: Record<string, string> = {
  onboarding_completado: "terminó el recorrido de inicio",
  paywall_visto: "vio la pantalla de planes",
  prueba_iniciada: "empezó la prueba",
  tarea_completada: "completó una tarea",
};

/** Últimos movimientos reales de la app (eventos del funnel), para que el Resumen no se
 * quede en solo 4 números sueltos. */
export async function actividadReciente(limite = 6): Promise<EventoActividad[]> {
  const admin = createAdminClient();
  const [{ data: eventos }, usuarios] = await Promise.all([
    admin
      .from("eventos")
      .select("id, nombre, user_id, creado_en")
      .order("creado_en", { ascending: false })
      .limit(limite * 3),
    listarUsuarios(),
  ]);

  const nombrePorId = new Map(usuarios.map((u) => [u.id, u.display_name || u.email]));

  return (eventos ?? []).slice(0, limite).map((e) => {
    const quien = e.user_id ? (nombrePorId.get(e.user_id as string) ?? "Alguien") : "Un visitante";
    const accion = ETIQUETA_EVENTO[e.nombre as string] ?? (e.nombre as string);
    return { id: e.id as string, texto: `${quien} ${accion}`, cuando: e.creado_en as string };
  });
}

export async function errores24h(): Promise<number> {
  const admin = createAdminClient();
  const hace24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await admin
    .from("error_log")
    .select("id", { count: "exact", head: true })
    .gte("creado_en", hace24h);
  return count ?? 0;
}
