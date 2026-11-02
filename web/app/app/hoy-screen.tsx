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

// Guarda cuándo termina el enfoque en localStorage, así una recarga de la página (o volver
// de otra pestaña de la app) no reinicia la cuenta regresiva desde cero.
function claveEnfoque(taskId: string) {
  return `focuspulse:enfoque:${taskId}`;
}

function leerFinEnfoque(taskId: string): number | null {
  try {
    const crudo = localStorage.getItem(claveEnfoque(taskId));
    if (!crudo) return null;
    const { finAt } = JSON.parse(crudo) as { finAt: number };
    return typeof finAt === "number" ? finAt : null;
  } catch {
    return null;
  }
}

function guardarFinEnfoque(taskId: string, finAt: number) {
  try {
    localStorage.setItem(claveEnfoque(taskId), JSON.stringify({ finAt }));
  } catch {
    // Sin localStorage (modo privado, cuota llena): el enfoque sigue funcionando, solo no sobrevive un recargo.
  }
}

function borrarFinEnfoque(taskId: string) {
  try {
    localStorage.removeItem(claveEnfoque(taskId));
  } catch {
    // Nada que limpiar si localStorage no está disponible.
  }
}

export default function HoyScreen({ tareaInicial }: { tareaInicial: Tarea | null }) {
  const [tarea, setTarea] = useState(tareaInicial);
  const [enEnfoque, setEnEnfoque] = useState(false);
  const [finEnfoque, setFinEnfoque] = useState<number | null>(null);
  const [duracion, setDuracion] = useState<15 | 25 | 45>(tareaInicial?.duration_minutes ?? 25);
  const [editando, setEditando] = useState(false);
  const [errorGlobal, setErrorGlobal] = useState("");

  const terminarEnfoque = async (taskId: string) => {
    try {
      const actualizada = await completarTarea(taskId);
      setTarea(actualizada as Tarea);
      setErrorGlobal("");
    } catch {
      setErrorGlobal("No pudimos guardar que terminaste. Revisa tu conexión e intenta de nuevo.");
    } finally {
      borrarFinEnfoque(taskId);
      setEnEnfoque(false);
      setFinEnfoque(null);
    }
  };

  // Al entrar a la pantalla (incluida una recarga), si había un enfoque en curso para esta
  // tarea, lo retoma; si ya debía haber terminado mientras no estabas, cierra la tarea sola.
  useEffect(() => {
    if (!tarea || tarea.status !== "pending" || enEnfoque) return;
    const finAt = leerFinEnfoque(tarea.id);
    if (finAt === null) return;
    if (finAt > Date.now()) {
      setFinEnfoque(finAt);
      setEnEnfoque(true);
    } else {
      terminarEnfoque(tarea.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tarea?.id, tarea?.status]);

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

  if (enEnfoque && finEnfoque !== null) {
    return (
      <Enfoque
        texto={tarea.content}
        minutos={duracion}
        finAt={finEnfoque}
        onSalir={() => {
          borrarFinEnfoque(tarea.id);
          setEnEnfoque(false);
          setFinEnfoque(null);
        }}
        onTerminar={() => terminarEnfoque(tarea.id)}
      />
    );
  }

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center text-center"
      style={{ backgroundImage: "radial-gradient(28rem 20rem at 50% -10%, color-mix(in oklab, var(--primary) 7%, transparent), transparent 65%)" }}
    >
      <div className="w-11 h-11 rounded-[var(--radius-btn)] bg-[var(--bg-hund,theme(colors.secondary))] shadow-[inset_0_2px_5px_rgba(110,90,158,0.18)] flex items-center justify-center mb-3.5 entrada-escalonada">
        <IconTask className="w-5 h-5 text-primary" />
      </div>
      <p className="text-xs font-bold text-primary uppercase tracking-wide entrada-escalonada" style={{ animationDelay: "40ms" }}>Tu única tarea de hoy</p>
      <h1 className="text-[1.3125rem] font-bold leading-snug mt-1.5 max-w-[17.5rem] entrada-escalonada" style={{ animationDelay: "80ms" }}>
        Una sola cosa. Nada más compite por tu atención.
      </h1>

      <button
        type="button"
        onClick={() => setEditando(true)}
        aria-label="Cambiar mi tarea"
        className="w-full mt-5 bg-card border border-primary/16 rounded-[var(--radius-card)] p-5 shadow-[0_8px_24px_-14px_rgba(110,90,158,0.4)] text-left transition active:scale-[.99] entrada-escalonada"
        style={{ animationDelay: "120ms" }}
      >
        <p className="text-[16px] font-bold leading-snug">{tarea.content}</p>
      </button>

      {errorGlobal && <p className="text-xs text-destructive font-semibold mt-2.5">{errorGlobal}</p>}

      <div className="flex gap-2 mt-4 w-full entrada-escalonada" style={{ animationDelay: "160ms" }}>
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

      <div className="w-full mt-5 entrada-escalonada" style={{ animationDelay: "200ms" }}>
        <button
          onClick={() => {
            const finAt = Date.now() + duracion * 60 * 1000;
            guardarFinEnfoque(tarea.id, finAt);
            setFinEnfoque(finAt);
            setEnEnfoque(true);
          }}
          className="w-full min-h-[3.375rem] rounded-[var(--radius-btn)] bg-primary text-primary-foreground font-semibold text-base shadow-[0_10px_24px_-12px_rgba(110,90,158,0.45)] transition active:scale-[.98]"
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
      <div className="w-11 h-11 rounded-[var(--radius-btn)] bg-secondary flex items-center justify-center mb-3.5">
        <IconTask className="w-5 h-5 text-primary" />
      </div>
      <p className="text-xs font-bold text-primary uppercase tracking-wide">Tu única tarea de hoy</p>
      <h1 className="text-[1.3125rem] font-bold leading-snug mt-1.5 max-w-[17.5rem]">
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
          className="w-full min-h-[3.25rem] rounded-[var(--radius-btn)] border-[1.5px] border-border bg-card px-4 text-[15.5px] text-foreground outline-none focus:border-primary"
        />
        {error && <p className="text-xs text-destructive font-semibold mt-1.5">Escribe algo para continuar</p>}
        {errorServidor && <p className="text-xs text-destructive font-semibold mt-1.5">{errorServidor}</p>}
      </div>
      <button
        onClick={guardar}
        disabled={guardando}
        className="w-full min-h-[3.375rem] mt-4 rounded-[var(--radius-btn)] bg-primary text-primary-foreground font-semibold text-base disabled:opacity-60"
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
      <div className="w-full max-w-[26.875rem] bg-card rounded-t-[var(--radius-card)] p-6 pb-[max(20px,env(safe-area-inset-bottom))]">
        <p className="text-[0.9375rem] font-medium mb-2.5">¿Qué es lo ÚNICO que quieres lograr ahora?</p>
        <input
          autoFocus
          value={valor}
          onChange={(e) => {
            setValor(e.target.value);
            if (e.target.value.trim()) setError(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && guardar()}
          className="w-full min-h-[3.25rem] rounded-[var(--radius-btn)] border-[1.5px] border-border bg-background px-4 text-[15.5px] text-foreground outline-none focus:border-primary"
        />
        {error && <p className="text-xs text-destructive font-semibold mt-1.5">Escribe algo para continuar</p>}
        {errorServidor && <p className="text-xs text-destructive font-semibold mt-1.5">{errorServidor}</p>}
        <div className="flex flex-col gap-2.5 mt-4">
          <button
            onClick={guardar}
            disabled={guardando}
            className="min-h-[3.25rem] rounded-[var(--radius-btn)] bg-primary text-primary-foreground font-semibold disabled:opacity-60"
          >
            {guardando ? "Guardando…" : "Guardar"}
          </button>
          <button onClick={onCancelar} className="min-h-[3.25rem] rounded-[var(--radius-btn)] bg-secondary text-foreground font-medium">
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
  finAt,
  onSalir,
  onTerminar,
}: {
  texto: string;
  minutos: number;
  finAt: number;
  onSalir: () => void;
  onTerminar: () => void;
}) {
  const total = minutos * 60;
  const calcularRestante = () => Math.max(0, Math.round((finAt - Date.now()) / 1000));
  const [restante, setRestante] = useState(calcularRestante);
  const terminadoRef = useRef(false);

  // Ancla la cuenta regresiva a `finAt` (un instante real, guardado en localStorage) en vez de
  // restar segundo a segundo: así sobrevive una recarga de la página y no se desfasa si el
  // navegador pausa el temporizador por estar la pestaña en segundo plano.
  useEffect(() => {
    const tick = () => {
      const s = calcularRestante();
      setRestante(s);
      if (s <= 0 && !terminadoRef.current) {
        terminadoRef.current = true;
        onTerminar();
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finAt]);

  const m = String(Math.floor(restante / 60)).padStart(2, "0");
  const s = String(restante % 60).padStart(2, "0");
  const circunferencia = 502;
  const pct = (total - restante) / total;

  return (
    <div
      className="fixed inset-0 z-50 text-background flex flex-col items-center justify-center gap-6"
      style={{
        backgroundImage:
          "linear-gradient(180deg, color-mix(in oklab, var(--foreground) 94%, black) 0%, color-mix(in oklab, var(--foreground) 88%, black) 55%, var(--foreground) 100%)",
      }}
    >
      <div className="relative w-[11.75rem] h-[11.75rem]">
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
        <div className="absolute inset-0 flex items-center justify-center text-[2.5rem] font-bold tabular-nums">
          {m}:{s}
        </div>
      </div>
      <p className="text-base font-semibold max-w-[16.25rem] text-center">{texto}</p>
      <div className="flex items-center gap-3">
        <button
          onClick={onTerminar}
          className="rounded-full bg-background text-foreground text-[0.8125rem] font-bold px-4.5 py-2.5 transition active:scale-[.97]"
        >
          Ya terminé
        </button>
        <button
          onClick={onSalir}
          className="flex items-center gap-1.5 bg-white/14 border border-white/22 rounded-full text-[0.8125rem] font-bold px-4.5 py-2.5 opacity-75 transition active:scale-[.97]"
        >
          <IconBack className="w-3.5 h-3.5" /> Salir por ahora
        </button>
      </div>
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
        className="w-[8.25rem] h-[8.25rem] rounded-[var(--radius-card)] object-cover border border-primary/20 shadow-[0_10px_26px_-14px_rgba(110,90,158,0.45)]"
        autoPlay
        muted
        loop
        playsInline
        poster="/assets/isotipo-512.png"
      >
        <source src="/assets/logro.mp4" type="video/mp4" />
      </video>
      <h2 className="text-[1.3125rem] font-bold max-w-[17.5rem]">Hiciste lo que tenías que hacer</h2>
      <p className="text-sm text-muted-foreground max-w-[17.5rem] leading-relaxed">
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
    <div className="bg-card border border-border rounded-[var(--radius-btn)] px-4 py-3 text-center">
      <b className="block text-[1.1875rem] font-extrabold">{valor}</b>
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
