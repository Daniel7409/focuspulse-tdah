"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { registrarEvento } from "@/lib/eventos-actions";

const checkIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export default function PaywallPage() {
  const [plan, setPlan] = useState<"anual" | "mensual">("anual");

  useEffect(() => {
    void registrarEvento("paywall_visto");
  }, []);

  return (
    <div
      className="min-h-dvh flex justify-center"
      style={{ background: "color-mix(in oklab, var(--primary) 10%, var(--background))" }}
    >
      <div className="w-full max-w-[26.875rem] min-h-dvh bg-background flex flex-col">
        <div className="flex justify-start px-4 pt-4">
          <Link href="/" aria-label="Cerrar" className="w-11 h-11 flex items-center justify-center rounded-full text-muted-foreground">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="20" height="20">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </Link>
        </div>

        <div className="px-5 pb-10 flex flex-col gap-5">
          <div className="flex gap-3.5 items-start entrada-escalonada">
            <span
              className="w-13 h-13 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "color-mix(in oklab, var(--primary) 14%, transparent)", border: "2px solid var(--primary)" }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            <div>
              <h1 className="text-xl font-bold leading-snug">
                Tu plan <span className="text-primary">personalizado</span> está listo
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Hecho con tus respuestas</p>
            </div>
          </div>

          <div className="rounded-[var(--radius-card)] p-4.5 bg-card flex flex-col gap-3.5 entrada-escalonada" style={{ border: "1px solid color-mix(in oklab, var(--primary) 12%, transparent)", animationDelay: "80ms" }}>
            {[
              "Una sola tarea a la vez, sin listas infinitas",
              "El Pase Cero Culpa: lo no hecho se mueve solo, nunca en rojo",
              "Racha adulta — sin mascotas ni niveles infantiles",
            ].map((texto) => (
              <div key={texto} className="flex items-center gap-3 text-sm">
                <span className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center" style={{ background: "color-mix(in oklab, var(--primary) 12%, transparent)" }}>
                  {checkIcon}
                </span>
                {texto}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 entrada-escalonada" style={{ animationDelay: "140ms" }}>
            <button
              onClick={() => setPlan("anual")}
              className="relative text-left rounded-[var(--radius-card)] px-4.5 py-4 bg-card transition active:scale-[.98]"
              style={{ border: plan === "anual" ? "2px solid var(--primary)" : "1.5px solid color-mix(in oklab, var(--muted-foreground) 16%, transparent)" }}
            >
              <span className="absolute -top-2.5 left-4 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-md">
                2 meses gratis
              </span>
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-semibold">Anual</span>
                <span className="text-xl font-bold tabular-nums">
                  $2.91<span className="text-xs font-medium">/mes</span>
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Se cobra $34.99/año</p>
            </button>
            <button
              onClick={() => setPlan("mensual")}
              className="text-left rounded-[var(--radius-card)] px-4.5 py-4 bg-card transition active:scale-[.98]"
              style={{ border: plan === "mensual" ? "2px solid var(--primary)" : "1.5px solid color-mix(in oklab, var(--muted-foreground) 16%, transparent)" }}
            >
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-semibold">Mensual</span>
                <span className="text-xl font-bold tabular-nums">
                  $4.99<span className="text-xs font-medium">/mes</span>
                </span>
              </div>
            </button>
          </div>

          <div className="flex flex-col entrada-escalonada" style={{ animationDelay: "200ms" }}>
            {[
              { titulo: "Hoy — acceso completo", texto: "Todo tu plan, sin límites", linea: true },
              { titulo: "Día 4 — te avisamos", texto: "Correo antes de cualquier cobro", linea: true },
              { titulo: `Día 5 — primer cobro: ${plan === "anual" ? "$34.99/año" : "$4.99/mes"}`, texto: "Cancela antes sin costo", linea: false },
            ].map((item, i, arr) => (
              <div key={item.titulo} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-3.5 h-3.5 rounded-full shrink-0 mt-1" style={{ background: i < 2 ? "var(--primary)" : "var(--card)", border: i < 2 ? "none" : "2px solid var(--primary)" }} />
                  {i < arr.length - 1 && <div className="w-0.5 flex-1 min-h-7" style={{ background: item.linea ? "var(--primary)" : "var(--muted)" }} />}
                </div>
                <div className="pb-4.5">
                  <div className="text-sm font-semibold">{item.titulo}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{item.texto}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="entrada-escalonada" style={{ animationDelay: "260ms" }}>
            <Link
              href="/login"
              className="w-full flex items-center justify-center min-h-13.5 rounded-[var(--radius-btn)] bg-primary text-primary-foreground font-semibold transition active:scale-[.98]"
            >
              Empezar mis 5 días gratis
            </Link>
            <div className="flex flex-col gap-1.5 items-center mt-3.5">
              {["Hoy no pagas nada", "Te avisamos el día 4, antes del cobro", "Cancela en 1 tap"].map((t) => (
                <div key={t} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" width="11" height="11">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {t}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-2.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
              </svg>
              Pago con Hotmart (PSE disponible) · Garantía Cero Culpa de 7 días
            </div>
            <p className="text-center text-[11px] text-muted-foreground/80 pt-1">
              Se renueva automáticamente al terminar cada período. Cancela cuando quieras desde tu cuenta.
            </p>
          </div>

          <div className="flex justify-center gap-4.5">
            <Link href="/" className="text-sm text-muted-foreground min-h-11 flex items-center">
              Ahora no
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
