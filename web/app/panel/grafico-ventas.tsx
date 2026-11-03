"use client";

import { useReducedMotion } from "motion/react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SemanaVentas } from "./data";

const FORMATO_USD = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function TarjetaTooltip({ active, label, payload }: { active?: boolean; label?: string; payload?: { value: number }[] }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[var(--radius-btn)] border border-border bg-card px-3 py-2 shadow-sm">
      <p className="text-xs font-medium text-muted-foreground">Semana del {label}</p>
      <p className="text-[0.9375rem] font-bold tabular-nums">{FORMATO_USD.format(payload[0].value)}</p>
    </div>
  );
}

/** Gráfico de ventas netas por semana. Lee `payment_transactions`, hoy vacía — las barras
 * ya están listas para llenarse solas en cuanto el aviso de pago de Hotmart quede conectado. */
export default function GraficoVentas({ semanas }: { semanas: SemanaVentas[] }) {
  const reducirMovimiento = useReducedMotion();

  return (
    <figure aria-label="Ventas netas por semana, últimas 8 semanas">
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={semanas} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
          <XAxis dataKey="etiqueta" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
          <YAxis
            width={44}
            axisLine={false}
            tickLine={false}
            tickCount={4}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            tickFormatter={(v: number) => FORMATO_USD.format(v)}
          />
          <Tooltip content={<TarjetaTooltip />} cursor={{ fill: "var(--secondary)" }} />
          <Bar dataKey="totalUsd" fill="var(--chart-1)" radius={[6, 6, 0, 0]} maxBarSize={28} isAnimationActive={!reducirMovimiento} />
        </BarChart>
      </ResponsiveContainer>
      <figcaption className="sr-only">
        <table>
          <caption>Ventas netas por semana</caption>
          <thead>
            <tr>
              <th scope="col">Semana</th>
              <th scope="col">Total (USD)</th>
            </tr>
          </thead>
          <tbody>
            {semanas.map((s) => (
              <tr key={s.etiqueta}>
                <th scope="row">{s.etiqueta}</th>
                <td>{s.totalUsd}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figcaption>
    </figure>
  );
}
