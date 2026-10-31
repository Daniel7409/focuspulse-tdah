import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hoyComoDiaCalendario } from "@/lib/fecha";
import RachaNumero from "./racha-numero";

export const instant = false;

const DIAS_INI = ["L", "M", "M", "J", "V", "S", "D"];

// `hoy` llega como día calendario puro (ancla a mediodía UTC, ver lib/fecha.ts) — toda
// la aritmética usa getters/setters UTC para que una zona horaria real nunca lo desplace.
function aISO(d: Date) {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

function calcularRacha(dias: Set<string>, hoy: Date): number {
  const cursor = new Date(hoy);
  if (!dias.has(aISO(cursor))) cursor.setUTCDate(cursor.getUTCDate() - 1);
  let racha = 0;
  while (dias.has(aISO(cursor))) {
    racha++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return racha;
}

function diasDeEstaSemana(dias: Set<string>, hoy: Date): boolean[] {
  // lunes=0 ... domingo=6
  const offsetLunes = (hoy.getUTCDay() + 6) % 7;
  const lunes = new Date(hoy);
  lunes.setUTCDate(hoy.getUTCDate() - offsetLunes);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(lunes);
    d.setUTCDate(lunes.getUTCDate() + i);
    return dias.has(aISO(d));
  });
}

export default async function RachasPage() {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const hoy = await hoyComoDiaCalendario();

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
  const racha = calcularRacha(dias, hoy);
  const semana = diasDeEstaSemana(dias, hoy);

  return (
    <div className="flex flex-col pb-6">
      <div>
        <h1 className="text-[1.375rem] font-extrabold">Tu racha</h1>
        <p className="text-[0.8125rem] text-muted-foreground mt-0.5">
          Días seguidos presentándote, aunque sea con una sola tarea
        </p>
      </div>

      <div className="mt-[1.125rem] rounded-[var(--radius-card)] bg-card border border-primary/18 shadow-[0_8px_22px_-14px_rgba(110,90,158,0.4)] px-5 py-[1.375rem] text-center">
        <RachaNumero objetivo={racha} />
        <div className="text-xs text-muted-foreground font-semibold mt-0.5">DÍAS DE CALMA SEGUIDOS</div>
      </div>

      <div className="flex gap-[0.4375rem] justify-center mt-5">
        {DIAS_INI.map((ini, i) => (
          <div
            key={i}
            className={`w-9 h-[2.625rem] rounded-[0.6875rem] flex flex-col items-center justify-center gap-[0.1875rem] text-[0.65625rem] font-bold border ${
              semana[i]
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-secondary text-muted-foreground border-border"
            }`}
          >
            <span className="text-[0.5625rem] opacity-80">{ini}</span>
            {semana[i] && <IconCheck className="w-3 h-3" />}
          </div>
        ))}
      </div>

      <div className="mt-[1.125rem] bg-secondary rounded-[var(--radius-btn)] px-4 py-3.5 text-[0.78125rem] text-muted-foreground text-center leading-relaxed shadow-[inset_0_2px_5px_rgba(110,90,158,0.14)]">
        Un día sin abrir la app no rompe tu racha de verdad — solo cuenta si vuelves.
      </div>

      <div className="mt-[1.375rem]">
        <h3 className="text-[0.8125rem] font-bold text-muted-foreground uppercase tracking-wide mb-2.5">
          Lo que ya lograste
        </h3>
        {(!historial || historial.length === 0) && (
          <p className="text-sm text-muted-foreground px-1">Aún no cierras ningún día — tu primera tarea hecha aparecerá aquí.</p>
        )}
        {historial?.map((h) => (
          <div key={h.id} className="flex items-center gap-3 px-3.5 py-[0.6875rem] bg-card rounded-[var(--radius-btn)] border border-border mb-2">
            <span className="w-[2.125rem] h-[2.125rem] rounded-[0.625rem] bg-primary/14 flex items-center justify-center shrink-0">
              <IconTask className="w-4 h-4 text-primary" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[0.84375rem] font-semibold truncate">{h.content}</div>
              <div className="text-[0.6875rem] text-muted-foreground mt-px">
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
