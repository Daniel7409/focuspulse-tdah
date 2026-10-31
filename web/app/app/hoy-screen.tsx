"use client";

import { useEffect, useRef, useState } from "react";
import {
  crearTareaHoy,
  cambiarTareaHoy,
  elegirDuracion,
  completarTarea,
  deshacerCierre,
} from "./actions";
import SugerenciaIA from "./sugerencia-ia";

type Tarea = {
  id: string;
  content: string;
  status: "pending" | "completed" | "rolled_over";
  duration_minutes: 15 | 25 | 45 | null;
  completed_at: string | null;
};

const DURACIONES = [15, 25, 45] as const;

export default function HoyScreen({ tareaInicial }: { tareaInicial: Tarea | null }) {
  const [tarea, setTarea] = useState(tareaInicial);
  const [enEnfoque, setEnEnfoque] = useState(false);
  const [duracion, setDuracion] = useState<15 | 25 | 45>(tareaInicial?.duration_minutes ?? 25);
  const [editando, setEditando] = useState(false);
  const [errorGlobal, setErrorGlobal] = useState("");

  if (!tarea) {
    return <SinTarea onCreada={(t) => setTarea(t)} />;
  }

  if (tarea.status === "completed") {
    return (
      <Cierre
        tarea={tarea}
        duracion={duracion}
        error={errorGlobal}
        onDeshacer={async () => {
          try {
            const actualizada = await deshacerCierre(tarea.id);
            setTarea(actualizada as Tarea);
            setErrorGlobal("");
          } catch {
            setErrorGlobal("No pudimos deshacer. Revisa tu conexión e intenta de nuevo.");
          }
        }}
      />
    );
  }

  if (enEnfoque) {
    return (
      <Enfoque
        texto={tarea.content}
        minutos={duracion}
        onSalir={() => setEnEnfoque(false)}
        onTerminar={async () => {
          try {
            const actualizada = await completarTarea(tarea.id);
            setTarea(actualizada as Tarea);
            setErrorGlobal("");
          } catch {
            setErrorGlobal("No pudimos guardar que terminaste. Revisa tu conexión e intenta de nuevo.");
          } finally {
            setEnEnfoque(false);
          }
        }}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <div className="w-11 h-11 rounded-[14px] bg-[var(--bg-hund,theme(colors.secondary))] shadow-[inset_0_2px_5px_rgba(110,90,158,0.18)] flex items-center justify-center mb-3.5">
        <IconTask className="w-5 h-5 text-primary" />
      </div>
      <p className="text-xs font-bold text-primary uppercase tracking-wide">Tu única tarea de hoy</p>
      <h1 className="text-[21px] font-bold leading-snug mt-1.5 max-w-[280px]">
        Una sola cosa. Nada más compite por tu atención.
      </h1>

      <div className="w-full mt-5 bg-card border border-primary/16 rounded-[var(--radius-card)] p-5 shadow-[0_8px_24px_-14px_rgba(110,90,158,0.4)]">
        <p className="text-[16px] font-bold leading-snug">{tarea.content}</p>
      </div>

      {errorGlobal && <p className="text-xs text-destructive font-semibold mt-2.5">{errorGlobal}</p>}

      <div className="flex gap-2 mt-4 w-full">
        {DURACIONES.map((m) => (
          <button
            key={m}
            onClick={async () => {
              const anterior = duracion;
              setDuracion(m);
              try {
                await elegirDuracion(tarea.id, m);
                setErrorGlobal("");
              } catch {
                setDuracion(anterior);
                setErrorGlobal("No pudimos guardar la duración. Intenta de nuevo.");
              }
            }}
            className={`flex-1 min-h-11 rounded-full border-[1.5px] text-xs font-semibold transition ${
              duracion === m
                ? "border-primary border-2 bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground"
            }`}
          >
            {m} min
          </button>
        ))}
      </div>

      <div className="w-full mt-5">
        <button
          onClick={() => setEnEnfoque(true)}
          className="w-full min-h-[54px] rounded-[var(--radius-btn)] bg-primary text-primary-foreground font-semibold text-base shadow-[0_10px_24px_-12px_rgba(110,90,158,0.45)]"
        >
          Empezar enfoque · {duracion} min
        </button>
      </div>

      <SugerenciaIA tarea={tarea.content} />

      <button
        onClick={() => setEditando(true)}
        className="flex items-center gap-1.5 justify-center mt-3.5 min-h-11 text-xs text-muted-foreground font-semibold"
      >
        <IconEdit className="w-3.5 h-3.5" /> Cambiar mi tarea
      </button>

      {editando && (
        <ModalEditarTarea
          valorInicial={tarea.content}
          onCancelar={() => setEditando(false)}
          onGuardar={async (nuevo) => {
            const actualizada = await cambiarTareaHoy(tarea.id, nuevo);
            setTarea(actualizada as Tarea);
            setEditando(false);
          }}
        />
      )}
    </div>
  );
}

function SinTarea({ onCreada }: { onCreada: (t: Tarea) => void }) {
  const [valor, setValor] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(false);
  const [errorServidor, setErrorServidor] = useState("");

  async function guardar() {
    if (!valor.trim()) {
      setError(true);
      return;
    }
    setGuardando(true);
    try {
      const nueva = await crearTareaHoy(valor);
      onCreada(nueva as Tarea);
    } catch {
      setGuardando(false);
      setErrorServidor("No pudimos guardar tu tarea. Revisa tu conexión e intenta de nuevo.");
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <div className="w-11 h-11 rounded-[14px] bg-secondary flex items-center justify-center mb-3.5">
        <IconTask className="w-5 h-5 text-primary" />
      </div>
      <p className="text-xs font-bold text-primary uppercase tracking-wide">Tu única tarea de hoy</p>
      <h1 className="text-[21px] font-bold leading-snug mt-1.5 max-w-[280px]">
        ¿Qué es lo ÚNICO que tienes que hacer ahora?
      </h1>
      <div className="w-full mt-5">
        <input
          autoFocus
          value={valor}
          onChange={(e) => {
            setValor(e.target.value);
            if (e.target.value.trim()) setError(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && guardar()}
          placeholder="Escribe tu única tarea…"
          className="w-full min-h-[52px] rounded-[var(--radius-btn)] border-[1.5px] border-border bg-card px-4 text-[15.5px] text-foreground outline-none focus:border-primary"
        />
        {error && <p className="text-xs text-destructive font-semibold mt-1.5">Escribe algo para continuar</p>}
        {errorServidor && <p className="text-xs text-destructive font-semibold mt-1.5">{errorServidor}</p>}
      </div>
      <button
        onClick={guardar}
        disabled={guardando}
        className="w-full min-h-[54px] mt-4 rounded-[var(--radius-btn)] bg-primary text-primary-foreground font-semibold text-base disabled:opacity-60"
      >
        {guardando ? "Guardando…" : "Empezar con esta tarea"}
      </button>
    </div>
  );
}

function ModalEditarTarea({
  valorInicial,
  onGuardar,
  onCancelar,
}: {
  valorInicial: string;
  onGuardar: (v: string) => Promise<void>;
  onCancelar: () => void;
}) {
  const [valor, setValor] = useState(valorInicial);
  const [error, setError] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errorServidor, setErrorServidor] = useState("");

  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onCancelar();
    }
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onCancelar]);

  async function guardar() {
    if (!valor.trim()) {
      setError(true);
      return;
    }
    setGuardando(true);
    try {
      await onGuardar(valor);
    } catch {
      setGuardando(false);
      setErrorServidor("No pudimos guardar el cambio. Intenta de nuevo.");
    }
  }

  return (
    <div
      className="fixed inset-0 bg-foreground/40 flex items-end justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onCancelar()}
    >
      <div className="w-full max-w-[430px] bg-card rounded-t-[var(--radius-card)] p-6 pb-[max(20px,env(safe-area-inset-bottom))]">
        <p className="text-[15px] font-medium mb-2.5">¿Qué es lo ÚNICO que quieres lograr ahora?</p>
        <input
          autoFocus
          value={valor}
          onChange={(e) => {
            setValor(e.target.value);
            if (e.target.value.trim()) setError(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && guardar()}
          className="w-full min-h-[52px] rounded-[var(--radius-btn)] border-[1.5px] border-border bg-background px-4 text-[15.5px] text-foreground outline-none focus:border-primary"
        />
        {error && <p className="text-xs text-destructive font-semibold mt-1.5">Escribe algo para continuar</p>}
        {errorServidor && <p className="text-xs text-destructive font-semibold mt-1.5">{errorServidor}</p>}
        <div className="flex flex-col gap-2.5 mt-4">
          <button
            onClick={guardar}
            disabled={guardando}
            className="min-h-[52px] rounded-[var(--radius-btn)] bg-primary text-primary-foreground font-semibold disabled:opacity-60"
          >
            {guardando ? "Guardando…" : "Guardar"}
          </button>
          <button onClick={onCancelar} className="min-h-[52px] rounded-[var(--radius-btn)] bg-secondary text-foreground font-medium">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

function Enfoque({
  texto,
  minutos,
  onSalir,
  onTerminar,
}: {
  texto: string;
  minutos: number;
  onSalir: () => void;
  onTerminar: () => void;
}) {
  const total = minutos * 60;
  const [restante, setRestante] = useState(total);
  const terminadoRef = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      setRestante((s) => {
        if (s <= 1) {
          clearInterval(id);
          if (!terminadoRef.current) {
            terminadoRef.current = true;
            onTerminar();
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const m = String(Math.floor(restante / 60)).padStart(2, "0");
  const s = String(restante % 60).padStart(2, "0");
  const circunferencia = 502;
  const pct = (total - restante) / total;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#342c45] via-[#241f30] to-foreground text-background flex flex-col items-center justify-center gap-6">
      <div className="relative w-[188px] h-[188px]">
        <svg viewBox="0 0 188 188" className="-rotate-90 w-full h-full">
          <circle cx="94" cy="94" r="80" fill="none" stroke="rgba(239,234,246,0.14)" strokeWidth="10" />
          <circle
            cx="94"
            cy="94"
            r="80"
            fill="none"
            stroke="var(--background)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circunferencia}
            strokeDashoffset={circunferencia - circunferencia * pct}
            style={{ transition: "stroke-dashoffset .9s cubic-bezier(.22,.9,.3,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-[40px] font-bold tabular-nums">
          {m}:{s}
        </div>
      </div>
      <p className="text-base font-semibold max-w-[260px] text-center">{texto}</p>
      <button
        onClick={onSalir}
        className="flex items-center gap-1.5 bg-white/14 border border-white/22 rounded-full text-[13px] font-bold px-4.5 py-2.5 opacity-75"
      >
        <IconBack className="w-3.5 h-3.5" /> Terminar por ahora
      </button>
    </div>
  );
}

function Cierre({
  tarea,
  duracion,
  onDeshacer,
  error,
}: {
  tarea: Tarea;
  duracion: number;
  onDeshacer: () => void;
  error?: string;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3.5 text-center">
      <video
        className="w-[132px] h-[132px] rounded-[var(--radius-card)] object-cover border border-primary/20 shadow-[0_10px_26px_-14px_rgba(110,90,158,0.45)]"
        autoPlay
        muted
        loop
        playsInline
        poster="/assets/isotipo-512.png"
      >
        <source src="/assets/logro.mp4" type="video/mp4" />
      </video>
      <h2 className="text-[21px] font-bold max-w-[280px]">Hiciste lo que tenías que hacer</h2>
      <p className="text-sm text-muted-foreground max-w-[280px] leading-relaxed">
        Lo demás ya se movió a mañana. Sin culpa, sin números rojos.
      </p>
      <div className="flex gap-2.5 mt-2">
        <Pill valor="1" etiqueta="tarea hecha" />
        <Pill valor={`${tarea.duration_minutes ?? duracion}m`} etiqueta="de enfoque" />
      </div>
      <button onClick={onDeshacer} className="text-sm text-muted-foreground font-medium mt-2">
        Deshacer
      </button>
      {error && <p className="text-xs text-destructive font-semibold">{error}</p>}
    </div>
  );
}

function Pill({ valor, etiqueta }: { valor: string; etiqueta: string }) {
  return (
    <div className="bg-card border border-border rounded-[14px] px-4 py-3 text-center">
      <b className="block text-[19px] font-extrabold">{valor}</b>
      <span className="text-[10.5px] text-muted-foreground">{etiqueta}</span>
    </div>
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
function IconEdit({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}
function IconBack({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
