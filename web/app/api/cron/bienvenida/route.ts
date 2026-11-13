import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendMktEmail } from "@/lib/email/resend-client";
import { emailBienvenidaD1, emailBienvenidaD3, emailBienvenidaD7 } from "@/lib/email/templates";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://focuspulse-tdah.vercel.app";

const PLANTILLA_POR_DIA = {
  1: emailBienvenidaD1,
  3: emailBienvenidaD3,
  7: emailBienvenidaD7,
} as const;

// Fail-secure (igual que hotmart-verify.ts): sin CRON_SECRET configurado, se rechaza todo —
// nunca se asume "sin secreto = abierto". Vercel manda este header solo/siempre en sus
// invocaciones reales de Cron Jobs cuando la variable está puesta.
export async function GET(req: NextRequest) {
  const secreto = process.env.CRON_SECRET;
  if (!secreto) {
    console.error("CRON_SECRET no configurado — cron de bienvenida rechazado");
    return NextResponse.json({ error: "not configured" }, { status: 500 });
  }
  if (req.headers.get("authorization") !== `Bearer ${secreto}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const resumen: Record<string, number> = {};

  for (const dia of [1, 3, 7] as const) {
    const { data: perfiles, error } = await admin.rpc("perfiles_para_bienvenida", { p_dia: dia });
    if (error) {
      console.error("error consultando perfiles_para_bienvenida", { dia, mensaje: error.message });
      continue;
    }

    let enviados = 0;
    for (const perfil of (perfiles ?? []) as { user_id: string; email: string; display_name: string | null }[]) {
      // Idempotencia ANTES de enviar: si el log falla en insertarse (p. ej. una carrera entre dos
      // ejecuciones del cron), el insert con PK (user_id, dia) choca y no se duplica el correo.
      const { error: errorLog } = await admin
        .from("bienvenida_email_log")
        .insert({ user_id: perfil.user_id, dia });
      if (errorLog) continue; // ya registrado (o error real) — no se manda dos veces

      const { data: linkData } = await admin.auth.admin.generateLink({
        type: "magiclink",
        email: perfil.email,
      });
      const linkApp = linkData?.properties?.action_link ?? `${SITE_URL}/login`;

      const plantilla = PLANTILLA_POR_DIA[dia](perfil.display_name ?? "", linkApp);
      try {
        await sendMktEmail({
          to: perfil.email,
          subject: plantilla.subject,
          preheader: plantilla.preheader,
          bodyHtml: plantilla.bodyHtml,
        });
        enviados++;
      } catch (e) {
        console.error("error enviando correo de bienvenida", { dia, mensaje: String(e) });
      }
    }
    resumen[`dia_${dia}`] = enviados;
  }

  return NextResponse.json({ ok: true, enviados: resumen });
}
