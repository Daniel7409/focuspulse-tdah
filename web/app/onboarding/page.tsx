"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Respuestas = {
  p1: string | null;
  p2: string | null;
  p3: number;
  p4: string | null;
  firstTask: string | null;
};

type Chip = { label: string; freeform?: boolean };

type PasoPregunta = {
  tipo: "pregunta";
  id: string;
  pct: number;
  titulo: string;
  sub?: string;
  key: "p1" | "p2" | "p4";
  chips: Chip[];
};

type PasoReconocimiento = {
  tipo: "reconocimiento";
  id: string;
  pct: number;
  titulo: string;
  cuerpo: (r: Respuestas) => React.ReactNode;
  cta: string;
  final?: boolean;
};

type PasoSlider = { tipo: "slider"; id: string; pct: number; titulo: string };
type PasoTarea = { tipo: "tarea"; id: string; pct: number };
type PasoEnfoque = { tipo: "enfoque"; id: string; pct: number };
type PasoCarga = { tipo: "carga"; id: string; pct: number };

type Paso = PasoPregunta | PasoReconocimiento | PasoSlider | PasoTarea | PasoEnfoque | PasoCarga;

const PASOS: Paso[] = [
  {
    tipo: "pregunta",
    id: "p1",
    pct: 11,
    titulo: "¿Cuál es tu mayor fuente de parálisis hoy?",
    sub: "Esto decide qué tanto simplificamos tu primer día",
    key: "p1",
    chips: [
      { label: "Listas con fechas en rojo" },
      { label: "Demasiadas tareas a la vez" },
      { label: "Empiezo y no termino nada" },
      { label: "Otra cosa (escribe la tuya)", freeform: true },
    ],
  },
  {
    tipo: "pregunta",
    id: "p2",
    pct: 24,
    titulo: "¿En qué momento del día más se te apaga el cerebro?",
    key: "p2",
    chips: [
      { label: "Al despertar" },
      { label: "Después de almorzar" },
      { label: "En la noche" },
      { label: "Varía cada día" },
    ],
  },
  {
    tipo: "reconocimiento",
    id: "r1",
    pct: 38,
    titulo: "No es falta de voluntad",
    cuerpo: () => (
      <>
        Ese bloqueo no es tuyo — es el diseño de listas que <b>castigan</b> lo que no hiciste.{" "}
        <span className="text-primary font-semibold">El Pase Cero Culpa</span> está pensado justo para eso.
      </>
    ),
    cta: "Continuar",
  },
  { tipo: "slider", id: "p3", pct: 55, titulo: "¿Cuántos días a la semana quieres usar FocusPulse?" },
  {
    tipo: "pregunta",
    id: "p4",
    pct: 72,
    titulo: "¿Ya intentaste otras apps de productividad?",
    key: "p4",
    chips: [
      { label: "Sí, Notion/Todoist/Trello… y las abandoné" },
      { label: "Agenda de papel" },
      { label: "Nunca probé ninguna" },
      { label: "Otra cosa (escribe la tuya)", freeform: true },
    ],
  },
  {
    tipo: "reconocimiento",
    id: "r2",
    pct: 88,
    titulo: "Tus respuestas te describen",
    final: true,
    cuerpo: () => (
      <>
        No es que tu cerebro sea &ldquo;un caso perdido&rdquo; — ya probaste herramientas que te pedían configurar
        todo antes de darte nada. <span className="text-primary font-semibold">El Pase Cero Culpa</span> hace lo
        contrario: una sola tarea, cero configuración, y lo que no hagas se mueve solo a mañana.
      </>
    ),
    cta: "Probarlo ahora",
  },
  { tipo: "tarea", id: "firsttask", pct: 94 },
  { tipo: "enfoque", id: "focusdemo", pct: 97 },
  { tipo: "carga", id: "load", pct: 100 },
];

const checkIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export default function OnboardingPage() {
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const [historial, setHistorial] = useState<number[]>([]);
  const [respuestas, setRespuestas] = useState<Respuestas>({ p1: null, p2: null, p3: 3, p4: null, firstTask: null });

  const paso = PASOS[idx];
  const preguntasIds = PASOS.filter((p) => p.tipo === "pregunta" || p.tipo === "slider").map((p) => p.id);
  const posicionPregunta = preguntasIds.indexOf(paso.id);

  function avanzar() {
    if (idx === PASOS.length - 1) {
      router.push("/paywall");
      return;
    }
    setHistorial((h) => [...h, idx]);
    setIdx((i) => i + 1);
  }

  function volver() {
    if (historial.length === 0) return;
    setHistorial((h) => h.slice(0, -1));
    setIdx(historial[historial.length - 1]);
  }

  const ocultarTopbar = paso.tipo === "carga" || paso.tipo === "enfoque";

  return (
    <div
      className="min-h-dvh flex justify-center"
      style={{ background: "color-mix(in oklab, var(--primary) 10%, var(--background))" }}
    >
      <div className="w-full max-w-[26.875rem] min-h-dvh bg-background flex flex-col relative overflow-hidden">
        {!ocultarTopbar && (
          <div className="flex items-center gap-2.5 px-5 pt-4.5">
            <button
              aria-label="Atrás"
              onClick={volver}
              className="w-11 h-11 flex items-center justify-center rounded-full text-muted-foreground shrink-0"
              style={{ opacity: historial.length === 0 ? 0 : 1, pointerEvents: historial.length === 0 ? "none" : "auto" }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div className="flex-1 flex flex-col gap-1">
              <div className="h-1 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-350"
                  style={{ width: `${paso.pct}%`, transitionDuration: "350ms" }}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {posicionPregunta >= 0 ? `Pregunta ${posicionPregunta + 1} de ${preguntasIds.length}` : ""}
              </div>
            </div>
            <div className="text-sm text-muted-foreground tabular-nums w-8 text-right">{paso.pct}%</div>
            <Link href="/" className="w-11 h-11 flex items-center justify-center rounded-full text-muted-foreground shrink-0" aria-label="Salir">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="18" height="18">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </Link>
          </div>
        )}

        <div key={paso.id} className="flex-1 flex flex-col px-5 pt-7 pb-16 relative">
          {paso.tipo === "pregunta" && (
            <PantallaPregunta
              paso={paso}
              valor={respuestas[paso.key]}
              onElegir={(v) => {
                setRespuestas((r) => ({ ...r, [paso.key]: v }));
              }}
              onAvanzar={avanzar}
            />
          )}
          {paso.tipo === "reconocimiento" && <PantallaReconocimiento paso={paso} respuestas={respuestas} onAvanzar={avanzar} />}
          {paso.tipo === "slider" && (
            <PantallaSlider
              valor={respuestas.p3}
              onCambiar={(v) => setRespuestas((r) => ({ ...r, p3: v }))}
              onAvanzar={avanzar}
            />
          )}
          {paso.tipo === "tarea" && (
            <PantallaTarea onConfirmar={(v) => setRespuestas((r) => ({ ...r, firstTask: v }))} onAvanzar={avanzar} />
          )}
          {paso.tipo === "enfoque" && <PantallaEnfoque tarea={respuestas.firstTask} onAvanzar={avanzar} />}
          {paso.tipo === "carga" && <PantallaCarga respuestas={respuestas} onAvanzar={avanzar} />}
        </div>
      </div>
    </div>
  );
}

function PantallaPregunta({
  paso,
  valor,
  onElegir,
  onAvanzar,
}: {
  paso: PasoPregunta;
  valor: string | null;
  onElegir: (v: string) => void;
  onAvanzar: () => void;
}) {
  const [freeform, setFreeform] = useState(false);
  const [texto, setTexto] = useState("");
  const [error, setError] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setFreeform(false);
    setTexto("");
    setError(false);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [paso.id]);

  function elegirChip(c: Chip) {
    if (c.freeform) {
      setFreeform(true);
      return;
    }
    onElegir(c.label);
    timeoutRef.current = setTimeout(onAvanzar, 700);
  }

  function enviarTexto() {
    if (!texto.trim()) {
      setError(true);
      return;
    }
    onElegir(texto.trim());
    onAvanzar();
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="mb-7">
        <h1 className="text-2xl font-bold leading-tight tracking-tight">{paso.titulo}</h1>
        {paso.sub && <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{paso.sub}</p>}
      </div>

      {!freeform ? (
        <div className="flex flex-col gap-3">
          {paso.chips.map((c) => (
            <button
              key={c.label}
              onClick={() => elegirChip(c)}
              className="flex items-center gap-3 w-full min-h-14.5 px-4.5 rounded-[var(--radius-btn)] text-left transition active:scale-[.98]"
              style={{
                border: valor === c.label ? "1.5px solid var(--primary)" : "1px solid color-mix(in oklab, var(--primary) 14%, transparent)",
                background: valor === c.label ? "color-mix(in oklab, var(--primary) 9%, var(--card))" : "var(--card)",
              }}
            >
              <span className="flex-1 text-sm font-medium">{c.label}</span>
              <span
                className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center"
                style={{
                  border: valor === c.label ? "none" : "1.5px solid color-mix(in oklab, var(--muted-foreground) 30%, transparent)",
                  background: valor === c.label ? "var(--primary)" : "transparent",
                  color: "var(--primary-foreground)",
                }}
              >
                {valor === c.label && checkIcon}
              </span>
            </button>
          ))}
          <p className="flex items-center justify-center gap-1.5 mt-7 text-sm text-foreground px-3.5 py-2.5 rounded-xl bg-muted">
            <LockIcon /> Tus respuestas son privadas — nunca se comparten
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <button onClick={() => setFreeform(false)} className="flex items-center gap-1.5 text-sm font-bold self-start py-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Volver a las opciones
          </button>
          <input
            autoFocus
            value={texto}
            onChange={(e) => {
              setTexto(e.target.value);
              if (e.target.value.trim()) setError(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && enviarTexto()}
            placeholder="Escribe aquí…"
            className="w-full min-h-13 rounded-[var(--radius-btn)] bg-card px-4.5 text-base"
            style={{ border: error ? "1.5px solid var(--destructive)" : "1.5px solid var(--primary)" }}
          />
          {error && <p className="text-sm text-destructive">Escribe algo para continuar</p>}
          <button onClick={enviarTexto} className="mt-4 w-full min-h-13.5 rounded-[var(--radius-btn)] bg-primary text-primary-foreground font-semibold">
            Continuar
          </button>
        </div>
      )}
    </div>
  );
}

function PantallaReconocimiento({ paso, respuestas, onAvanzar }: { paso: PasoReconocimiento; respuestas: Respuestas; onAvanzar: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center gap-5">
      <div className="flex gap-2.5">
        <div className="w-23 rounded-[var(--radius-btn)] p-3.5 bg-card" style={{ border: "1px solid color-mix(in oklab, var(--primary) 14%, transparent)" }}>
          <div className="text-xs text-muted-foreground font-semibold uppercase">Ayer</div>
          <div className="text-sm mt-2 line-through text-muted-foreground">Revisar propuesta</div>
        </div>
        <div className="w-23 rounded-[var(--radius-btn)] p-3.5" style={{ border: "1px solid var(--primary)", background: "color-mix(in oklab, var(--primary) 8%, var(--card))" }}>
          <div className="text-xs text-muted-foreground font-semibold uppercase">Hoy</div>
          <div className="text-sm mt-2 font-semibold">Enfocarte en 1 cosa</div>
        </div>
      </div>
      <h2 className="text-2xl font-bold tracking-tight">{paso.titulo}</h2>
      <p className="text-base text-muted-foreground leading-relaxed max-w-[20rem]">{paso.cuerpo(respuestas)}</p>
      <button onClick={onAvanzar} className="w-full mt-2 min-h-13.5 rounded-[var(--radius-btn)] bg-primary text-primary-foreground font-semibold">
        {paso.cta}
      </button>
    </div>
  );
}

function PantallaSlider({ valor, onCambiar, onAvanzar }: { valor: number; onCambiar: (v: number) => void; onAvanzar: () => void }) {
  const feedback = valor <= 2 ? "Arrancar suave está bien" : valor <= 5 ? "Meta realista para empezar" : "Ambiciosa — te acompañamos";
  return (
    <div className="flex-1 flex flex-col">
      <h1 className="text-2xl font-bold leading-tight tracking-tight mb-7">¿Cuántos días a la semana quieres usar FocusPulse?</h1>
      <div className="text-center mb-7">
        <div className="text-4xl font-extrabold text-primary tabular-nums">{valor}</div>
        <div className="text-sm text-muted-foreground mt-0.5">días/semana</div>
      </div>
      <input
        type="range"
        min={1}
        max={7}
        value={valor}
        onChange={(e) => onCambiar(Number(e.target.value))}
        className="w-full accent-primary"
      />
      <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
        <span>1</span>
        <span>7</span>
      </div>
      <div className="mt-5.5 px-3.5 py-3 rounded-xl bg-card text-sm text-muted-foreground flex items-center gap-2">
        <SparkIcon /> {feedback}
      </div>
      <button onClick={onAvanzar} className="mt-auto min-h-13.5 rounded-[var(--radius-btn)] bg-primary text-primary-foreground font-semibold">
        Fijar mi meta
      </button>
    </div>
  );
}

function PantallaTarea({ onConfirmar, onAvanzar }: { onConfirmar: (v: string) => void; onAvanzar: () => void }) {
  const [texto, setTexto] = useState("");
  const [error, setError] = useState(false);

  function submit() {
    if (!texto.trim()) {
      setError(true);
      setTimeout(() => setError(false), 1400);
      return;
    }
    onConfirmar(texto.trim());
    onAvanzar();
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
      <p className="text-xs font-bold uppercase tracking-wide text-primary">FocusPulse</p>
      <div className="w-full rounded-[var(--radius-card)] p-5.5 flex flex-col gap-3.5 bg-card" style={{ border: "1px solid color-mix(in oklab, var(--primary) 14%, transparent)" }}>
        <h1 className="text-xl font-bold leading-snug">¿Qué es lo ÚNICO que tienes que hacer ahora?</h1>
        <input
          autoFocus
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value);
            if (e.target.value.trim()) setError(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Ej. Enviar el diseño al cliente"
          className="w-full min-h-14 rounded-[var(--radius-btn)] bg-background px-4.5 text-base text-center"
          style={{ border: error ? "1.5px solid var(--destructive)" : "1.5px solid color-mix(in oklab, var(--muted-foreground) 25%, transparent)" }}
        />
        <p className={error ? "text-sm text-destructive font-semibold" : "text-sm text-muted-foreground"}>
          {error ? "Escribe tu única tarea para continuar" : "Solo esto. Lo demás puede esperar."}
        </p>
      </div>
      <button
        onClick={submit}
        className="w-full min-h-13.5 rounded-[var(--radius-btn)] bg-primary text-primary-foreground font-semibold transition"
        style={{ opacity: texto.trim() ? 1 : 0.55 }}
      >
        Listo, es esta
      </button>
    </div>
  );
}

function PantallaEnfoque({ tarea, onAvanzar }: { tarea: string | null; onAvanzar: () => void }) {
  const total = 5;
  const [restante, setRestante] = useState(total);
  const [terminado, setTerminado] = useState(false);
  const [mostrarPausa, setMostrarPausa] = useState(false);

  useEffect(() => {
    const pausaTimer = setTimeout(() => setMostrarPausa(true), 2200);
    return () => clearTimeout(pausaTimer);
  }, []);

  useEffect(() => {
    if (terminado) return;
    if (restante <= 0) {
      setTerminado(true);
      return;
    }
    const t = setTimeout(() => setRestante((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [restante, terminado]);

  const circunferencia = 465;
  const pct = (total - restante) / total;

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center gap-5.5 text-center rounded-[1.75rem] -mx-5 -mt-7 -mb-16 px-5 py-7"
      style={{
        backgroundImage:
          "radial-gradient(32.5rem 20rem at 50% 0%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 65%), linear-gradient(180deg, color-mix(in oklab, var(--foreground) 94%, black) 0%, color-mix(in oklab, var(--foreground) 86%, black) 55%, var(--foreground) 100%)",
        color: "var(--background)",
      }}
    >
      {!terminado ? (
        <>
          <div className="relative w-42 h-42">
            <svg viewBox="0 0 168 168" className="-rotate-90">
              <circle cx="84" cy="84" r="74" fill="none" strokeWidth="10" stroke="rgba(239,234,246,.14)" />
              <circle
                cx="84"
                cy="84"
                r="74"
                fill="none"
                strokeWidth="10"
                stroke="var(--background)"
                strokeLinecap="round"
                strokeDasharray={circunferencia}
                strokeDashoffset={circunferencia - circunferencia * pct}
                style={{ transition: "stroke-dashoffset .9s cubic-bezier(.22,.9,.3,1)" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold tabular-nums">0:0{restante}</div>
          </div>
          <div className="rounded-[var(--radius-card)] px-5 py-3.5" style={{ background: "rgb(239 234 246 / .06)" }}>
            <p className="text-lg font-semibold max-w-[17.5rem]">{tarea || "Enviar el diseño al cliente"}</p>
          </div>
          <p className="text-sm" style={{ color: "rgb(239 234 246 / .6)" }}>
            Así se siente el Modo Enfoque — nada más en pantalla
          </p>
          <button
            onClick={onAvanzar}
            className="flex items-center gap-1.5 rounded-full px-4.5 py-2.5 text-sm font-bold transition"
            style={{
              background: "rgb(239 234 246 / .14)",
              border: "1px solid rgb(239 234 246 / .22)",
              opacity: mostrarPausa ? 1 : 0.75,
            }}
          >
            Salir del enfoque
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="w-13 h-13 rounded-full flex items-center justify-center" style={{ background: "rgb(239 234 246 / .12)" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--background)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <p className="text-base font-semibold max-w-[16.25rem]">Sentiste el Modo Enfoque. Así se ve cada tarea tuya, una a la vez.</p>
          <button onClick={onAvanzar} className="min-h-13.5 px-7 rounded-[var(--radius-btn)] font-semibold bg-background text-foreground">
            Ver mi plan
          </button>
        </div>
      )}
    </div>
  );
}

function PantallaCarga({ respuestas, onAvanzar }: { respuestas: Respuestas; onAvanzar: () => void }) {
  const pasosTexto = [
    <>Analizando tu bloqueo: <b>{respuestas.p1 || "listas con fechas en rojo"}</b></>,
    <>Ajustando tu horario de enfoque: <b>{respuestas.p2 || "al despertar"}</b></>,
    <>Fijando tu meta de <b>{respuestas.p3} días/semana</b></>,
    <>Guardando tu primera tarea: <b>{respuestas.firstTask || "tu tarea"}</b></>,
  ];
  const [paso, setPaso] = useState(0);
  const pcts = [20, 45, 72, 100];
  const avanzarRef = useRef(onAvanzar);
  avanzarRef.current = onAvanzar;

  useEffect(() => {
    if (paso >= pasosTexto.length) {
      const t = setTimeout(() => avanzarRef.current(), 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPaso((p) => p + 1), 900);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paso]);

  const pctActual = paso === 0 ? 0 : pcts[Math.min(paso, pcts.length) - 1];
  const circunferencia = 301;

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-7">
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 120 120" className="-rotate-90">
          <circle cx="60" cy="60" r="48" fill="none" strokeWidth="9" stroke="var(--muted)" />
          <circle
            cx="60"
            cy="60"
            r="48"
            fill="none"
            strokeWidth="9"
            stroke="var(--primary)"
            strokeLinecap="round"
            strokeDasharray={circunferencia}
            strokeDashoffset={circunferencia - (circunferencia * pctActual) / 100}
            style={{ transition: "stroke-dashoffset .4s cubic-bezier(.22,.9,.3,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xl font-bold tabular-nums">{pctActual}%</div>
      </div>
      <div className="text-lg font-bold">Construyendo tu plan…</div>
      <div className="w-full rounded-[var(--radius-card)] p-4.5 bg-card flex flex-col gap-4">
        {pasosTexto.map((texto, i) => (
          <div key={i} className="flex items-center gap-3" style={{ opacity: i <= paso - 1 || i === paso ? 1 : 0.4 }}>
            <span
              className="w-5.5 h-5.5 rounded-full shrink-0 flex items-center justify-center"
              style={{
                border: i < paso ? "none" : "1.5px solid color-mix(in oklab, var(--muted-foreground) 30%, transparent)",
                background: i < paso ? "var(--primary)" : i === paso ? "color-mix(in oklab, var(--primary) 16%, transparent)" : "transparent",
              }}
            >
              {i < paso && (
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              )}
            </span>
            <span className="text-sm">{texto}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
    </svg>
  );
}
