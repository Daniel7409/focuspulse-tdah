"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/panel", etiqueta: "Resumen", icono: IconoResumen },
  { href: "/panel/usuarios", etiqueta: "Usuarios", icono: IconoUsuarios },
  { href: "/panel/uso", etiqueta: "Cómo usan la app", icono: IconoUso },
  { href: "/panel/ia", etiqueta: "Costo de la IA", icono: IconoIA },
  { href: "/panel/ventas", etiqueta: "Ventas y ganancia", icono: IconoVentas },
  { href: "/panel/salud", etiqueta: "Salud de la app", icono: IconoSalud },
];

export default function PanelNav({ horizontal = false }: { horizontal?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className={horizontal ? "flex gap-1 overflow-x-auto" : "flex flex-col gap-1"}>
      {ITEMS.map(({ href, etiqueta, icono: Icono }) => {
        const activo = href === "/panel" ? pathname === "/panel" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--radius-btn)] text-[0.8125rem] font-semibold whitespace-nowrap transition ${
              activo ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            <Icono className="w-4 h-4 shrink-0" />
            {etiqueta}
          </Link>
        );
      })}
    </nav>
  );
}

function IconoResumen({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}
function IconoUsuarios({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="9" cy="8" r="3.2" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
      <circle cx="18" cy="8.5" r="2.3" /><path d="M16.3 14.2c2.6.3 4.2 2.3 4.2 5.3" />
    </svg>
  );
}
function IconoUso({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 4v16h16" /><path d="M7 15l4-5 3 3 5-7" />
    </svg>
  );
}
function IconoIA({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="7" width="16" height="12" rx="2.5" /><path d="M9 2.5 12 7l3-4.5" />
      <circle cx="9" cy="13" r="1.1" fill="currentColor" stroke="none" /><circle cx="15" cy="13" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconoVentas({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" /><path d="M9.5 15.2c.4.9 1.3 1.3 2.5 1.3 1.7 0 2.7-.8 2.7-1.9 0-2.6-5.2-1.2-5.2-3.8 0-1.1 1-1.9 2.7-1.9 1.2 0 2.1.4 2.5 1.3" />
      <path d="M12 6.5v11" />
    </svg>
  );
}
function IconoSalud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4.5 12h3l2-5 3 10 2-5h5" />
    </svg>
  );
}
