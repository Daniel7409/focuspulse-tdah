"use client";

import { useEffect, useRef, useState } from "react";

const FORMATEADORES: Record<string, (n: number) => string> = {
  entero: (n) => String(Math.round(n)),
  porcentaje: (n) => `${Math.round(n)}%`,
  usd: (n) =>
    n.toLocaleString("es-CO", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }),
};

/** Mismo patrón de conteo que `Contador` de la landing (IntersectionObserver + easing +
 * respeta prefers-reduced-motion), pero admite varios formatos (moneda, %, entero).
 * Recibe el TIPO de formato (no una función) porque una función no puede cruzar el
 * límite servidor→cliente de React — estas páginas son Server Components. */
export default function ValorAnimado({
  objetivo,
  formato = "entero",
  duracionMs = 800,
}: {
  objetivo: number;
  formato?: "entero" | "porcentaje" | "usd";
  duracionMs?: number;
}) {
  const formatear = FORMATEADORES[formato];
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
            const start = performance.now();
            function tick(now: number) {
              const p = Math.min((now - start) / duracionMs, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              setValor(eased * objetivo);
              if (p < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [objetivo, duracionMs]);

  return <span ref={ref}>{formatear(valor)}</span>;
}
