"use client";

import { useState } from "react";

type Estado = "inicial" | "cargando" | "lista" | "error";

export default function SugerenciaIA({ tarea }: { tarea: string }) {
  const [estado, setEstado] = useState<Estado>("inicial");
  const [pasos, setPasos] = useState<string[]>([]);
  const [mensajeError, setMensajeError] = useState("");

  async function pedirSugerencia() {
    setEstado("cargando");
    try {
      const res = await fetch("/api/ai/sugerir-pasos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tarea }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMensajeError(json.mensaje ?? "No pudimos pensar sugerencias ahora mismo.");
        setEstado("error");
        return;
      }
      setPasos(json.pasos ?? []);
      setEstado("lista");
    } catch {
      setMensajeError("No pudimos conectar. Revisa tu conexión e intenta de nuevo.");
      setEstado("error");
    }
  }

  if (estado === "inicial") {
    return (
      <button
        onClick={pedirSugerencia}
        className="flex items-center gap-1.5 justify-center mt-3 min-h-11 w-full rounded-[var(--radius-btn)] border-[1.5px] border-primary/25 text-sm font-semibold text-primary"
      >
        <IconSpark className="w-4 h-4" /> ¿No sabes por dónde empezar? Pide 3 pasos
      </button>
    );
  }

  if (estado === "cargando") {
    return (
      <div className="mt-3 w-full rounded-[var(--radius-btn)] border-[1.5px] border-primary/18 px-4 py-3.5 text-sm text-muted-foreground font-medium flex items-center gap-2">
        <span className="w-3.5 h-3.5 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        Pensando 3 pasos pequeños…
      </div>
    );
  }

  if (estado === "error") {
    return (
      <div className="mt-3 w-full rounded-[var(--radius-btn)] border-[1.5px] border-destructive/30 bg-destructive/5 px-4 py-3.5 text-left">
        <p className="text-sm text-destructive font-semibold">{mensajeError}</p>
        <button onClick={pedirSugerencia} className="text-xs font-bold text-primary mt-1.5">
          Intentar otra vez
        </button>
      </div>
    );
  }

  return (
    <div className="mt-3 w-full rounded-[var(--radius-btn)] border-[1.5px] border-primary/18 bg-secondary/60 px-4 py-3.5 text-left">
      <p className="text-xs font-bold text-primary uppercase tracking-wide mb-2">3 pasos para arrancar</p>
      <ol className="flex flex-col gap-2">
        {pasos.map((paso, i) => (
          <li key={i} className="flex gap-2 text-[14px] leading-snug">
            <span className="w-5 h-5 shrink-0 rounded-full bg-primary/14 text-primary text-[11px] font-bold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            {paso}
          </li>
        ))}
      </ol>
      <p className="text-[11px] text-muted-foreground mt-2 leading-snug">
        Esto lo generó una IA — puede no aplicar a tu caso. No es consejo médico ni profesional.
      </p>
    </div>
  );
}

function IconSpark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3v3M12 18v3M5 12H2M22 12h-3M6.5 6.5 4.6 4.6M19.4 19.4l-1.9-1.9M6.5 17.5l-1.9 1.9M19.4 4.6l-1.9 1.9" />
      <circle cx="12" cy="12" r="3.3" />
    </svg>
  );
}
