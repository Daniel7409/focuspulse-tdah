import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import PerfilMenu from "./perfil-menu";

export const instant = false;

export default async function PerfilPage() {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: perfil } = await supabase
    .from("profiles")
    .select("plan, trial_ends_at")
    .eq("id", user!.id)
    .single();

  const correo = user!.email ?? "";
  const inicial = correo.charAt(0).toUpperCase() || "?";

  let planTexto = "Sin plan activo";
  let cobroTexto = "—";
  if (perfil?.trial_ends_at) {
    const fin = new Date(perfil.trial_ends_at);
    const diasRestantes = Math.ceil((fin.getTime() - Date.now()) / 86_400_000);
    if (diasRestantes > 0) {
      planTexto = "Prueba gratis de FocusPulse";
      cobroTexto = `Tu prueba termina el ${fin.toLocaleDateString("es-CO", { day: "numeric", month: "short" })}`;
    } else if (perfil.plan === "trial") {
      planTexto = "Tu prueba ya terminó";
      cobroTexto = "Elige un plan para seguir usando FocusPulse";
    } else {
      planTexto = `Plan ${perfil.plan ?? "FocusPulse"}`;
      cobroTexto = "Suscripción activa";
    }
  }

  return (
    <div className="flex flex-col pb-6">
      <div className="flex items-center gap-3.5 mt-1">
        <div className="w-[52px] h-[52px] rounded-full bg-primary text-primary-foreground flex items-center justify-center font-extrabold text-lg shrink-0">
          {inicial}
        </div>
        <div className="min-w-0">
          <div className="text-[17px] font-bold truncate">{correo.split("@")[0]}</div>
          <div className="text-[12.5px] text-muted-foreground truncate">{correo}</div>
        </div>
      </div>

      <div className="mt-5 rounded-[var(--radius-card)] border-[1.5px] border-primary bg-gradient-to-br from-card to-secondary p-[18px] shadow-[0_8px_22px_-14px_rgba(110,90,158,0.4)]">
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-bold">{planTexto}</span>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-primary/14 text-primary">Activo</span>
        </div>
        <p className="text-[13px] text-muted-foreground mt-1.5">{cobroTexto}</p>
      </div>

      <PerfilMenu horaRecordatorio="8:00 a.m." />
    </div>
  );
}
