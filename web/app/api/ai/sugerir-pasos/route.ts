import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { sugerirPasos } from "@/lib/ai-adapter";
import { dentroDelPresupuestoDiario, reservarCupoIA, confirmarLlamadaIA, marcarLlamadaIAFallida } from "@/lib/ai-budget";
import { tieneAccesoVigente } from "@/lib/acceso";

const BodySchema = z.object({
  tarea: z.string().min(1).max(500),
});

export async function POST(request: NextRequest) {
  // 1) Autenticación real desde la cookie de sesión — nunca confiar en un user_id del body.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "NOT_AUTHENTICATED" }, { status: 401 });
  }
  if (!(await tieneAccesoVigente(supabase, user.id))) {
    return NextResponse.json({ error: "SIN_ACCESO_VIGENTE" }, { status: 402 });
  }

  // 2) Validar el body con zod.
  const parsedBody = BodySchema.safeParse(await request.json().catch(() => null));
  if (!parsedBody.success) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  // 3) Kill-switch de presupuesto global, y tope por usuario reservado de forma
  // atómica en la base (nunca "revisar y luego guardar" por separado) — ANTES de
  // gastar un centavo.
  const dentroDelTope = await dentroDelPresupuestoDiario();
  if (!dentroDelTope) {
    return NextResponse.json(
      { error: "PRESUPUESTO_DIARIO_AGOTADO", mensaje: "La IA está en pausa por hoy. Vuelve a intentarlo mañana." },
      { status: 429 },
    );
  }
  const reservaId = await reservarCupoIA(user.id);
  if (!reservaId) {
    return NextResponse.json(
      { error: "LIMITE_POR_USUARIO", mensaje: "Has pedido muchas sugerencias en la última hora. Intenta más tarde." },
      { status: 429 },
    );
  }

  // 4) Llamar a la IA (reintentos + salida estructurada + zod viven en el adaptador).
  try {
    const { sugerencias, costoUSD } = await sugerirPasos(parsedBody.data.tarea);
    await confirmarLlamadaIA(reservaId, "sugerencia_pasos", costoUSD);
    return NextResponse.json({ pasos: sugerencias.pasos });
  } catch (error) {
    console.error("[api/ai/sugerir-pasos]", error);
    await marcarLlamadaIAFallida(reservaId);
    return NextResponse.json(
      { error: "IA_NO_DISPONIBLE", mensaje: "No pudimos pensar sugerencias ahora mismo. Intenta de nuevo en un momento." },
      { status: 502 },
    );
  }
}
