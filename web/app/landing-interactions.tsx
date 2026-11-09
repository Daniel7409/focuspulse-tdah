"use client";

import { useEffect, useRef, useState } from "react";

export function Reveal({
  children,
  delayMs = 0,
  className = "",
}: {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(14px)",
        transition: visible ? `opacity .5s cubic-bezier(.22,.9,.3,1) ${delayMs}ms, transform .5s cubic-bezier(.22,.9,.3,1) ${delayMs}ms` : "none",
      }}
    >
      {children}
    </div>
  );
}

export function AnilloAnimado({
  radio,
  grosor,
  offsetFinal,
  tamano,
}: {
  radio: number;
  grosor: number;
  offsetFinal: number;
  tamano: number;
}) {
  const ref = useRef<SVGCircleElement>(null);
  const circunferencia = 2 * Math.PI * radio;
  const [offset, setOffset] = useState(circunferencia);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setOffset(offsetFinal);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            requestAnimationFrame(() => setOffset(offsetFinal));
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el as unknown as Element);
    return () => io.disconnect();
  }, [offsetFinal]);

  const centro = tamano / 2;
  return (
    <svg width={tamano} height={tamano} viewBox={`0 0 ${tamano} ${tamano}`}>
      <circle cx={centro} cy={centro} r={radio} fill="none" strokeWidth={grosor} stroke="color-mix(in oklab, var(--primary) 16%, transparent)" />
      <circle
        ref={ref}
        cx={centro}
        cy={centro}
        r={radio}
        fill="none"
        strokeWidth={grosor}
        stroke="var(--primary)"
        strokeLinecap="round"
        strokeDasharray={circunferencia}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${centro} ${centro})`}
        style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.22,.9,.3,1)" }}
      />
    </svg>
  );
}

export function FaqItem({
  pregunta,
  respuesta,
  abiertoInicial = false,
}: {
  pregunta: string;
  respuesta: string;
  abiertoInicial?: boolean;
}) {
  const [abierto, setAbierto] = useState(abiertoInicial);
  return (
    <div
      className="rounded-[var(--radius-card)] px-4.5 py-4"
      style={{
        backgroundImage: "linear-gradient(165deg, var(--card) 0%, color-mix(in oklab, var(--card) 92%, white) 55%, color-mix(in oklab, var(--card) 88%, var(--background)) 100%)",
        border: "1px solid color-mix(in oklab, var(--muted-foreground) 14%, transparent)",
      }}
    >
      <button
        onClick={() => setAbierto((a) => !a)}
        aria-expanded={abierto}
        className="w-full cursor-pointer font-bold text-sm flex justify-between items-center text-left"
      >
        {pregunta}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--muted-foreground)"
          strokeWidth="2"
          strokeLinecap="round"
          className="shrink-0 ml-3"
          style={{ transform: abierto ? "rotate(180deg)" : "none", transition: "transform .25s cubic-bezier(.22,.9,.3,1)" }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div style={{ display: "grid", gridTemplateRows: abierto ? "1fr" : "0fr", transition: "grid-template-rows .3s cubic-bezier(.22,.9,.3,1)" }}>
        <div className="overflow-hidden">
          <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">{respuesta}</p>
        </div>
      </div>
    </div>
  );
}

export function DemoRollover() {
  const ref = useRef<HTMLDivElement>(null);
  const [fase, setFase] = useState<"inicial" | "tachando" | "movido">("inicial");
  const [enVista, setEnVista] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setFase("movido");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setEnVista(e.isIntersecting)),
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!enVista) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;
    let t3: ReturnType<typeof setTimeout>;
    function ciclo() {
      setFase("inicial");
      t1 = setTimeout(() => setFase("tachando"), 700);
      t2 = setTimeout(() => setFase("movido"), 1200);
      t3 = setTimeout(ciclo, 3800);
    }
    ciclo();
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [enVista]);

  const tareaPendiente = fase === "inicial";
  const tachada = fase === "tachando" || fase === "movido";
  const movida = fase === "movido";

  return (
    <div ref={ref} className="grid grid-cols-2 gap-3 text-left" aria-hidden="true">
      <div className="rounded-[var(--radius-card)] p-3.5" style={{ background: "var(--card)", border: "1px solid color-mix(in oklab, var(--muted-foreground) 14%, transparent)" }}>
        <p className="text-[0.6875rem] font-bold text-muted-foreground mb-2.5">Ayer</p>
        <div
          className="text-sm font-semibold flex items-center gap-2"
          style={{
            color: tareaPendiente ? "var(--foreground)" : "color-mix(in oklab, var(--muted-foreground) 70%, transparent)",
            transition: "color .4s cubic-bezier(.22,.9,.3,1)",
          }}
        >
          <span
            className="relative inline-block"
            style={{
              opacity: movida ? 0 : 1,
              transform: movida ? "translateY(-0.25rem)" : "none",
              transition: "opacity .4s cubic-bezier(.22,.9,.3,1), transform .4s cubic-bezier(.22,.9,.3,1)",
            }}
          >
            Llamar al dentista
            <span
              className="absolute left-0 top-1/2 h-[1.5px] rounded-full"
              style={{
                background: "color-mix(in oklab, var(--primary) 55%, var(--muted-foreground))",
                width: tachada ? "100%" : "0%",
                transition: "width .5s cubic-bezier(.22,.9,.3,1)",
              }}
            />
          </span>
        </div>
      </div>
      <div className="rounded-[var(--radius-card)] p-3.5" style={{ background: "var(--card)", border: "1px solid color-mix(in oklab, var(--primary) 30%, transparent)" }}>
        <p className="text-[0.6875rem] font-bold mb-2.5" style={{ color: "var(--primary)" }}>
          Hoy
        </p>
        <div
          className="text-sm font-semibold flex items-center gap-2"
          style={{
            color: "var(--foreground)",
            opacity: movida ? 1 : 0,
            transform: movida ? "none" : "translateY(0.375rem)",
            transition: "opacity .4s cubic-bezier(.22,.9,.3,1) .1s, transform .4s cubic-bezier(.22,.9,.3,1) .1s",
          }}
        >
          Llamar al dentista
        </div>
      </div>
    </div>
  );
}

export function NavSeccionActiva({ ids }: { ids: { id: string; href: string; label: string }[] }) {
  const [activo, setActivo] = useState<string | null>(null);

  useEffect(() => {
    const secciones = ids.map(({ id }) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (secciones.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActivo(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
    );
    secciones.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);

  return (
    <>
      {ids.map(({ id, href, label }) => (
        <a
          key={id}
          href={href}
          className="text-sm font-semibold transition-colors"
          style={{
            color: activo === id ? "var(--primary)" : "var(--muted-foreground)",
            textDecorationLine: activo === id ? "underline" : "none",
            textDecorationColor: "color-mix(in oklab, var(--primary) 50%, transparent)",
            textDecorationThickness: "2px",
            textUnderlineOffset: "0.25rem",
            transition: "color .2s cubic-bezier(.22,.9,.3,1)",
          }}
        >
          {label}
        </a>
      ))}
    </>
  );
}

export function Contador({ objetivo, sufijo = "" }: { objetivo: number; sufijo?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [valor, setValor] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setValor(objetivo);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const dur = 500;
            const start = performance.now();
            function tick(now: number) {
              const p = Math.min((now - start) / dur, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              setValor(Math.round(eased * objetivo));
              if (p < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [objetivo]);

  return (
    <span ref={ref}>
      {valor}
      {sufijo}
    </span>
  );
}
