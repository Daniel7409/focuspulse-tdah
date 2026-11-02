// Piezas compartidas por las 6 pantallas del panel — evita repetir el mismo
// marcado de tarjeta/estado vacío en cada página.

import ValorAnimado from "./dato-animado";

export function Tarjeta({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`rounded-[var(--radius-card)] bg-card border border-border p-5 ${className}`} style={style}>
      {children}
    </div>
  );
}

export function TituloSeccion({ children, subtitulo }: { children: React.ReactNode; subtitulo?: string }) {
  return (
    <div className="mb-5">
      <h1 className="text-[1.375rem] font-extrabold">{children}</h1>
      {subtitulo && <p className="text-sm text-muted-foreground mt-1">{subtitulo}</p>}
    </div>
  );
}

export function DatoHeroe({
  valor,
  numero,
  formato,
  etiqueta,
  insight,
  explicacion,
}: {
  /** Texto ya formateado (sin animar) — úsalo cuando el dato no es un número que cuente desde 0. */
  valor?: string;
  /** Si lo pasas junto con `numero`, el dato cuenta desde 0 al aparecer en pantalla. */
  numero?: number;
  /** Cómo mostrar `numero` una vez animado. Por defecto, entero. */
  formato?: "entero" | "porcentaje" | "usd";
  etiqueta: string;
  insight?: string;
  /** Texto corto que explica qué significa este dato — aparece como tooltip nativo al pasar el mouse. */
  explicacion?: string;
}) {
  return (
    <div>
      <div className="text-[2rem] font-extrabold tabular-nums leading-none">
        {numero !== undefined ? <ValorAnimado objetivo={numero} formato={formato} /> : valor}
      </div>
      <div
        className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-1.5"
        title={explicacion}
        style={explicacion ? { textDecoration: "underline dotted", textUnderlineOffset: "3px", cursor: "help" } : undefined}
      >
        {etiqueta}
      </div>
      {insight && <div className="text-[0.8125rem] text-foreground/75 mt-1">{insight}</div>}
    </div>
  );
}

export function SinDatos({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius-btn)] bg-secondary px-4 py-3.5 text-[0.8125rem] text-muted-foreground leading-relaxed">
      <span className="font-semibold text-foreground">Sin datos. </span>
      {children}
    </div>
  );
}

export function Aviso({
  tono,
  titulo,
  children,
}: {
  tono: "bien" | "atencion" | "info";
  titulo: string;
  children?: React.ReactNode;
}) {
  const estilos =
    tono === "bien"
      ? "bg-[color-mix(in_oklab,var(--chart-1)_10%,var(--card))] border-[var(--chart-1)]/25 text-foreground"
      : tono === "atencion"
        ? "bg-[color-mix(in_oklab,var(--destructive)_10%,var(--card))] border-[var(--destructive)]/30 text-foreground"
        : "bg-secondary border-border text-foreground";
  return (
    <div className={`rounded-[var(--radius-card)] border px-4.5 py-4 ${estilos}`}>
      <p className="font-bold text-sm">{titulo}</p>
      {children && <div className="text-[0.8125rem] text-foreground/80 mt-1 leading-relaxed">{children}</div>}
    </div>
  );
}

export function formatoUSD(n: number): string {
  return n.toLocaleString("es-CO", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatoFecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
}

export function formatoFechaHora(iso: string): string {
  return new Date(iso).toLocaleString("es-CO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}
