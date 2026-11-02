import { connection } from "next/server";
import { funnelUso, accionPrincipal } from "../data";
import { Tarjeta, TituloSeccion, DatoHeroe, SinDatos } from "../ui";

export const instant = false;

export default async function PanelUso() {
  await connection();
  const [funnel, accion] = await Promise.all([funnelUso(), accionPrincipal()]);
  const maximo = Math.max(1, ...funnel.map((p) => p.conteo));
  const hayDatos = funnel.some((p) => p.conteo > 0);

  return (
    <div className="flex flex-col gap-6">
      <TituloSeccion subtitulo="Qué hace la gente de verdad dentro de tu app">Cómo usan la app</TituloSeccion>

      <div className="grid grid-cols-2 gap-4">
        <Tarjeta className="entrada-escalonada" style={{ animationDelay: "40ms" }}>
          <DatoHeroe numero={accion.tareasCompletadasHoy} etiqueta="Tareas completadas hoy" />
        </Tarjeta>
        <Tarjeta className="entrada-escalonada" style={{ animationDelay: "80ms" }}>
          <DatoHeroe numero={accion.tareasCompletadasTotal} etiqueta="Tareas completadas (total)" insight="La acción principal de la app" />
        </Tarjeta>
      </div>

      <Tarjeta className="entrada-escalonada" style={{ animationDelay: "120ms" }}>
        <p className="font-bold text-sm mb-1">El camino de inicio (embudo)</p>
        <p className="text-[0.8125rem] text-muted-foreground mb-4">Cuántas personas distintas llegaron a cada paso</p>

        {!hayDatos ? (
          <SinDatos>Todavía nadie pasó por el recorrido de inicio desde que se activó este registro.</SinDatos>
        ) : (
          <div className="flex flex-col gap-3.5">
            {funnel.map((paso, i) => {
              const anterior = i > 0 ? funnel[i - 1].conteo : null;
              const conversion = anterior && anterior > 0 ? Math.round((paso.conteo / anterior) * 100) : null;
              return (
                <div key={paso.nombre}>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-sm font-semibold">{paso.etiqueta}</span>
                    <span className="text-sm tabular-nums">
                      <b>{paso.conteo}</b>
                      {conversion !== null && <span className="text-muted-foreground font-medium"> · {conversion}% del paso anterior</span>}
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.max(4, (paso.conteo / maximo) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Tarjeta>
    </div>
  );
}
