import { connection } from "next/server";
import { distribucionPlanes, ventasSemanales } from "../data";
import { Tarjeta, TituloSeccion, DatoHeroe, SinDatos, Aviso } from "../ui";
import GraficoVentas from "../grafico-ventas";

export const instant = false;

const ETIQUETA_PLAN: Record<string, string> = {
  trial: "En prueba gratis",
  active: "Pagando",
  canceled: "Canceló",
  expired: "Prueba vencida",
};

export default async function PanelVentas() {
  await connection();
  const [planes, semanas] = await Promise.all([distribucionPlanes(), ventasSemanales()]);
  const total = Object.values(planes).reduce((s, n) => s + n, 0);
  const huboVentas = semanas.some((s) => s.totalUsd !== 0);

  return (
    <div className="flex flex-col gap-6">
      <TituloSeccion subtitulo="Lo que factura tu app y lo que de verdad te queda limpio">Ventas y ganancia</TituloSeccion>

      <Aviso tono="info" titulo="Falta conectar el cobro real con Hotmart">
        Esta pantalla ya está lista para mostrar tus números reales en cuanto el aviso automático de pago de Hotmart quede conectado a la app (es el paso pendiente #1 que ya tienes anotado). Mientras tanto, nada aquí abajo está inventado: se marca &quot;Sin datos&quot;.
      </Aviso>

      <Tarjeta className="entrada-escalonada" style={{ animationDelay: "40ms" }}>
        <p className="font-bold text-sm mb-1">Ventas por semana</p>
        <p className="text-[0.8125rem] text-muted-foreground mb-4">
          {huboVentas
            ? "Lo que vendiste netamente cada semana, en las últimas 8 semanas."
            : "Todavía no hay ninguna venta registrada — en cuanto conectes Hotmart, esta gráfica se va llenando sola, semana a semana."}
        </p>
        <GraficoVentas semanas={semanas} />
      </Tarjeta>

      <Tarjeta className="entrada-escalonada" style={{ animationDelay: "80ms" }}>
        <p className="font-bold text-sm mb-1">Lo que la app tiene registrado hoy</p>
        <p className="text-[0.8125rem] text-muted-foreground mb-4">
          Esto es el estado guardado en tu base de datos, no un cobro confirmado por Hotmart todavía.
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(planes).map(([plan, n]) => (
            <div key={plan}>
              <DatoHeroe
                numero={n}
                etiqueta={ETIQUETA_PLAN[plan] ?? plan}
                insight={total ? `${Math.round((n / total) * 100)}%` : undefined}
              />
            </div>
          ))}
        </div>
      </Tarjeta>

      <div className="grid md:grid-cols-2 gap-4">
        <Tarjeta className="entrada-escalonada" style={{ animationDelay: "120ms" }}>
          <p className="font-bold text-sm mb-2.5">Ingresos y ganancia real</p>
          <SinDatos>MRR, cancelaciones, y lo que te queda tras Hotmart + impuestos + IA + infraestructura.</SinDatos>
        </Tarjeta>
        <Tarjeta className="entrada-escalonada" style={{ animationDelay: "160ms" }}>
          <p className="font-bold text-sm mb-2.5">Por canal (LTV, CAC, payback)</p>
          <SinDatos>De dónde llega cada cliente y si ese canal te da ganancia o te la quita.</SinDatos>
        </Tarjeta>
      </div>
    </div>
  );
}
