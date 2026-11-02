import { connection } from "next/server";
import { metricasIA, listarUsuarios } from "../data";
import { Tarjeta, TituloSeccion, DatoHeroe, SinDatos, formatoUSD } from "../ui";

export const instant = false;

export default async function PanelIA() {
  await connection();
  const [ia, usuarios] = await Promise.all([metricasIA(), listarUsuarios()]);
  const nombrePorId = new Map(usuarios.map((u) => [u.id, u.display_name || u.email]));

  return (
    <div className="flex flex-col gap-6">
      <TituloSeccion subtitulo="Cuánto te cuesta de verdad la inteligencia artificial de la app">Costo de la IA</TituloSeccion>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Tarjeta className="entrada-escalonada" style={{ animationDelay: "40ms" }}>
          <DatoHeroe numero={ia.costo24hUsd} formato="usd" etiqueta="Últimas 24 horas" />
        </Tarjeta>
        <Tarjeta className="entrada-escalonada" style={{ animationDelay: "80ms" }}>
          <DatoHeroe numero={ia.costoTotalUsd} formato="usd" etiqueta="Total acumulado" />
        </Tarjeta>
        <Tarjeta className="entrada-escalonada" style={{ animationDelay: "120ms" }}>
          <DatoHeroe numero={ia.llamadasTotal} etiqueta="Consultas hechas" />
        </Tarjeta>
        <Tarjeta className="entrada-escalonada" style={{ animationDelay: "160ms" }}>
          <DatoHeroe numero={ia.costoPromedioUsd} formato="usd" etiqueta="Promedio por consulta" />
        </Tarjeta>
      </div>

      <SinDatos>
        Todavía no puedo decirte si la IA te está costando más del 20% de lo que facturas, porque no hay ingresos reales conectados (falta el webhook de Hotmart). En cuanto esté, esta alerta se activa sola.
      </SinDatos>

      <Tarjeta className="entrada-escalonada" style={{ animationDelay: "200ms" }}>
        <p className="font-bold text-sm mb-1">Quién más usa la IA</p>
        <p className="text-[0.8125rem] text-muted-foreground mb-4">Los 5 usuarios que más te cuestan</p>
        {ia.topUsuarios.length === 0 ? (
          <SinDatos>Nadie ha usado la función de IA todavía.</SinDatos>
        ) : (
          <div className="flex flex-col gap-2.5">
            {ia.topUsuarios.map((u) => (
              <div key={u.usuarioId} className="flex items-center justify-between text-sm">
                <span className="font-semibold truncate">{nombrePorId.get(u.usuarioId) ?? "Usuario eliminado"}</span>
                <span className="tabular-nums text-muted-foreground">{formatoUSD(u.costoUsd)} · {u.llamadas} consultas</span>
              </div>
            ))}
          </div>
        )}
      </Tarjeta>
    </div>
  );
}
