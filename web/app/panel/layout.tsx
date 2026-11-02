import { connection } from "next/server";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import PanelNav from "./panel-nav";

export const instant = false;

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await connection();
  await requireAdmin();

  return (
    <div className="min-h-dvh flex" style={{ background: "color-mix(in oklab, var(--primary) 4%, var(--background))" }}>
      <aside className="w-[232px] shrink-0 border-r border-border bg-card hidden md:flex flex-col py-6 px-4">
        <Link href="/panel" className="flex items-center gap-2 font-extrabold text-[15px] px-2 mb-7">
          <span className="w-[9px] h-[9px] rounded-full bg-primary" />
          FocusPulse <span className="font-semibold text-muted-foreground text-[0.78em]">panel</span>
        </Link>
        <PanelNav />
        <Link
          href="/app"
          className="mt-auto flex items-center gap-2 px-3 py-2.5 rounded-[var(--radius-btn)] text-xs font-semibold text-muted-foreground"
        >
          ← Volver a la app
        </Link>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="md:hidden border-b border-border bg-card px-4 py-3">
          <PanelNav horizontal />
        </div>
        <main className="max-w-[72rem] mx-auto px-5 md:px-8 py-7">{children}</main>
      </div>
    </div>
  );
}
