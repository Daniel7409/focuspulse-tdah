"use client";

import { useEffect, useState } from "react";

export default function RachaNumero({ objetivo }: { objetivo: number }) {
  const [valor, setValor] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setValor(objetivo);
      return;
    }
    const duracion = 700;
    const inicio = performance.now();
    let frame: number;
    function tick(ahora: number) {
      const t = Math.min(1, (ahora - inicio) / duracion);
      const eased = 1 - Math.pow(1 - t, 3);
      setValor(Math.round(eased * objetivo));
      if (t < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [objetivo]);

  return <div className="text-[42px] font-extrabold text-primary tabular-nums leading-none">{valor}</div>;
}
