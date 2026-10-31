import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import RachaNumero from "./racha-numero";

export const instant = false;

const DIAS_INI = ["L", "M", "M", "J", "V", "S", "D"];

function aISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function calcularRacha(dias: Set<string>): number {
  const cursor = new Date();
  if (!dias.has(aISO(cursor))) cursor.setDate(cursor.getDate() - 1);
  let racha = 0;
  while (dias.has(aISO(cursor))) {
    racha++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return racha;
}

function diasDeEstaSemana(dias: Set<string>): boolean[] {
  const hoy = new Date();
  // lunes=0 ... domingo=6
  const offsetLunes = (hoy.getDay() + 6) % 7;
  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() - offsetLunes);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(lunes);
    d.setDate(lunes.getDate() + i);
    return dias.has(aISO(d));
  });
}

export default async function RachasPage() {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: streakRows }, { data: historial }] = await Promise.all([
    supabase.from("streak_days").select("day").eq("user_id", user!.id),
    supabase
      .from("tasks")
      .select("id, content, completed_at")
      .eq("user_id", user!.id)
      .eq("status", "completed")
      .order("completed_at", { ascending: false })
      .limit(4),
  ]);

  const dias = new Set((streakRows ?? []).map((r) => r.day as string));
  const racha = calcularRacha(dias);
  const semana = diasDeEstaSemana(dias);

  return (
    <div className="flex flex-col pb-6">
      <div>
        <h1 className="text-[22px] font-extrabold">Tu racha</h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">
          Días seguidos presentándote, aunque sea con una sola tarea
        </p>
      </div>

      <div className="mt-[18px] rounded-[var(--radius-card)] bg-card border border-primary/18 shadow-[0_8px_22px_-14px_rgba(110,90,158,0.4)] px-5 py-[22px] text-center">
        <RachaNumero objetivo={racha} />
        <div className="text-xs text-muted-foreground font-semibold mt-0.5">DÍAS DE CALMA SEGUIDOS</div>
      </div>

      <div className="flex gap-[7px] justify-center mt-5">
        {DIAS_INI.map((ini, i) => (
          <div
            key={i}
            className={`w-9 h-[42px] rounded-[11px] flex flex-col items-center justify-center gap-[3px] text-[10.5px] font-bold border ${
              semana[i]
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-secondary text-muted-foreground border-border"
            }`}
          >
            <span className="text-[9px] opacity-80">{ini}</span>
            {semana[i] && <IconCheck className="w-3 h-3" />}
          </div>
        ))}
      </div>

      <div className="mt-[18px] bg-secondary rounded-[14px] px-4 py-3.5 text-[12.5px] text-muted-foreground text-center leading-relaxed shadow-[inset_0_2px_5px_rgba(110,90,158,0.14)]">
        Un día sin abrir la app no rompe tu racha de verdad — solo cuenta si vuelves.
      </div>

      <div className="mt-[22px]">
        <h3 className="text-[13px] font-bold text-muted-foreground uppercase tracking-wide mb-2.5">
          Lo que ya lograste
        </h3>
        {(!historial || historial.length === 0) && (
          <p className="text-sm text-muted-foreground px-1">Aún no cierras ningún día — tu primera tarea hecha aparecerá aquí.</p>
        )}
        {historial?.map((h) => (
          <div key={h.id} className="flex items-center gap-3 px-3.5 py-[11px] bg-card rounded-[14px] border border-border mb-2">
            <span className="w-[34px] h-[34px] rounded-[10px] bg-primary/14 flex items-center justify-center shrink-0">
              <IconTask className="w-4 h-4 text-primary" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] font-semibold truncate">{h.content}</div>
              <div className="text-[11px] text-muted-foreground mt-px">
                {h.completed_at
                  ? new Date(h.completed_at).toLocaleDateString("es-CO", { day: "numeric", month: "short" })
                  : ""}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function IconTask({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}
