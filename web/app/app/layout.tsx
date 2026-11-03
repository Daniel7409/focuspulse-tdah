import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { tieneAccesoVigente } from "@/lib/acceso";
import Tabbar from "./tabbar";

export const instant = false;

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await connection();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (!(await tieneAccesoVigente(supabase, user.id))) redirect("/paywall");

  const fecha = new Date().toLocaleDateString("es-CO", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <div className="min-h-dvh flex flex-col max-w-[430px] mx-auto w-full">
      <div className="flex items-center justify-between px-5 pt-[18px] pb-1">
        <div className="flex items-center gap-2 font-extrabold text-[16px]">
          <span className="w-[9px] h-[9px] rounded-full bg-primary" />
          FocusPulse
          <span className="font-semibold text-muted-foreground text-[0.78em] -ml-[7px]">TDAH</span>
        </div>
        <div className="text-[12.5px] text-muted-foreground font-semibold capitalize">{fecha}</div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 px-5 pt-3">{children}</div>

      <Tabbar />
    </div>
  );
}
