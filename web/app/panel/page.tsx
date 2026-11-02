import { connection } from "next/server";
import Link from "next/link";
import {
  listarUsuarios,
  calcularMetricasUsuarios,
  accionPrincipal,
  metricasIA,
  errores24h,
  actividadReciente,
} from "./data";
import { Tarjeta, TituloSeccion, DatoHeroe, Aviso, SinDatos, formatoUSD, formatoFechaHora } from "./ui";

export const instant = false;

export default async function PanelResumen() {
  await connection();

  const [usuarios, accion, ia, erroresRecientes24h, actividad] = await Promise.all([
    listarUsuarios(),
    accionPrincipal(),
    metricasIA(),
    errores24h(),
    actividadReciente(),
  ]);
  const metricasUser = calcularMetricasUsuarios(usuarios);

  return (
    <div className="flex flex-col gap-6">
      <TituloSeccion subtitulo="Lo más importante de tu app, de un vistazo">Resumen</TituloSeccion>

      <div className="entrada-escalonada">
        {erroresRecientes24h > 0 ? (
          <Aviso tono="atencion" titulo={`${erroresRecientes24h} error${erroresRecientes24h === 1 ? "" : "es"} en las últimas 24 horas`}>
            Algo le falló a algún usuario mientras usaba la app. Revisa{" "}
            <Link href="/panel/salud" className="font-semibold underline">Salud de la app</Link> para ver el detalle y decidir si hay que corregir algo.
          </Aviso>
        ) : (
          <Aviso tono="bien" titulo="✅ Todo en orden este mes">
            No se registró ningún error en las últimas 24 horas.
          </Aviso>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Tarjeta className="entrada-escalonada" style={{ animationDelay: "40ms" }}>
          <DatoHeroe numero={metricasUser.total} etiqueta="Usuarios totales" />
        </Tarjeta>
        <Tarjeta className="entrada-escalonada" style={{ animationDelay: "80ms" }}>
          <DatoHeroe
            numero={metricasUser.activos}
            etiqueta="Activos (7 días)"
            explicacion="Tuvo una tarea o una acción registrada en los últimos 7 días"
            insight={metricasUser.total ? `${Math.round((metricasUser.activos / metricasUser.total) * 100)}% del total` : undefined}
          />
        </Tarjeta>
        <Tarjeta className="entrada-escalonada" style={{ animationDelay: "120ms" }}>
          <DatoHeroe numero={accion.tareasCompletadasHoy} etiqueta="Tareas completadas hoy" insight={`${accion.tareasCompletadasTotal} en total`} />
        </Tarjeta>
        <Tarjeta className="entrada-escalonada" style={{ animationDelay: "160ms" }}>
          <DatoHeroe
            numero={ia.costo24hUsd}
            formato="usd"
            etiqueta="Gasto de IA (24h)"
            explicacion="Suma de lo que costó cada consulta real a la IA en las últimas 24 horas"
            insight={`${formatoUSD(ia.costoTotalUsd)} en total`}
          />
        </Tarjeta>
      </div>

      <Tarjeta className="entrada-escalonada" style={{ animationDelay: "200ms" }}>
        <p className="font-bold text-sm mb-1">Actividad reciente</p>
        <p className="text-[0.8125rem] text-muted-foreground mb-4">Los últimos movimientos reales dentro de tu app</p>
        {actividad.length === 0 ? (
          <SinDatos>Todavía no hay ninguna acción registrada.</SinDatos>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {actividad.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-2.5 text-sm first:pt-0 last:pb-0">
                <span>{a.texto}</span>
                <span className="text-muted-foreground text-xs whitespace-nowrap ml-3">{formatoFechaHora(a.cuando)}</span>
              </div>
            ))}
          </div>
        )}
      </Tarjeta>

      <Aviso tono="info" titulo="Pendiente: conectar el cobro con Hotmart">
        Todavía no puedo mostrarte ventas, ganancia real ni de qué canal llega cada cliente porque el aviso automático de pago de Hotmart no está conectado.
        Esas secciones (<Link href="/panel/ventas" className="font-semibold underline">Ventas y ganancia</Link>) muestran su estructura, pero marcada &quot;Sin datos&quot; hasta que lo conectemos.
      </Aviso>
    </div>
  );
}
