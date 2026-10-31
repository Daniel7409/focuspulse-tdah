"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/app", label: "Hoy", match: (p: string) => p === "/app" },
  { href: "/app/rachas", label: "Rachas", match: (p: string) => p.startsWith("/app/rachas") },
  { href: "/app/perfil", label: "Perfil", match: (p: string) => p.startsWith("/app/perfil") },
] as const;

const ICONS: Record<string, React.ReactNode> = {
  Hoy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    </svg>
  ),
  Rachas: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2c0 4-5 5-5 10a5 5 0 0 0 10 0c0-2-1-3-1-3s-.5 2-2 2c-2 0-2-2-2-4 0-2 1-3 1-5Z" />
    </svg>
  ),
  Perfil: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
    </svg>
  ),
};

export default function Tabbar() {
  const pathname = usePathname();

  return (
    <nav
      className="flex items-stretch justify-around px-3 pt-2 border-t border-border bg-card/90 backdrop-blur-sm"
      style={{ paddingBottom: "max(10px, env(safe-area-inset-bottom))" }}
    >
      {TABS.map((tab) => {
        const activa = tab.match(pathname);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center gap-[3px] py-1.5 px-2.5 min-w-16 text-xs font-bold ${
              activa ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <span
              className={`flex items-center justify-center w-[38px] h-[26px] rounded-[9px] ${
                activa ? "bg-primary/14" : ""
              }`}
            >
              <span className="w-[19px] h-[19px] [&>svg]:w-full [&>svg]:h-full">{ICONS[tab.label]}</span>
            </span>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
