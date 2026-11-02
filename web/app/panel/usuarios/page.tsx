import { connection } from "next/server";
import { listarUsuarios, calcularMetricasUsuarios } from "../data";
import { Tarjeta, TituloSeccion, DatoHeroe, formatoFecha, formatoFechaHora } from "../ui";
import AgregarUsuarioForm from "./agregar-usuario-form";

export const instant = false;

const ETIQUETA_PLAN: Record<string, string> = {
  trial: "Prueba",
  active: "Pagando",
  canceled: "Canceló",
  expired: "Vencido",
};

export default async function PanelUsuarios() {
  await connection();
  const usuarios = await listarUsuarios();
  const metricas = calcularMetricasUsuarios(usuarios);

  return (
    <div className="flex flex-col gap-6">
      <TituloSeccion subtitulo="Todas las personas que tienen cuenta en tu app">Usuarios</TituloSeccion>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Tarjeta className="entrada-escalonada" style={{ animationDelay: "40ms" }}><DatoHeroe numero={metricas.total} etiqueta="Total" /></Tarjeta>
        <Tarjeta className="entrada-escalonada" style={{ animationDelay: "80ms" }}><DatoHeroe numero={metricas.activos} etiqueta="Activos (7 días)" /></Tarjeta>
        <Tarjeta className="entrada-escalonada" style={{ animationDelay: "120ms" }}>
          {metricas.retencion.d7 === null ? (
            <DatoHeroe valor="—" etiqueta="Volvieron tras 7 días" insight="De quienes llevan 7+ días registrados" />
          ) : (
            <DatoHeroe numero={metricas.retencion.d7} formato="porcentaje" etiqueta="Volvieron tras 7 días" insight="De quienes llevan 7+ días registrados" />
          )}
        </Tarjeta>
        <Tarjeta className="entrada-escalonada" style={{ animationDelay: "160ms" }}>
          {metricas.retencion.d30 === null ? (
            <DatoHeroe valor="—" etiqueta="Volvieron tras 30 días" insight="De quienes llevan 30+ días registrados" />
          ) : (
            <DatoHeroe numero={metricas.retencion.d30} formato="porcentaje" etiqueta="Volvieron tras 30 días" insight="De quienes llevan 30+ días registrados" />
          )}
        </Tarjeta>
      </div>

      <AgregarUsuarioForm />

      <Tarjeta className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-bold text-muted-foreground uppercase tracking-wide border-b border-border">
                <th className="px-5 py-3">Nombre</th>
                <th className="px-5 py-3">Correo</th>
                <th className="px-5 py-3">Plan</th>
                <th className="px-5 py-3">Se registró</th>
                <th className="px-5 py-3">Última actividad</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-6 text-muted-foreground text-center">Todavía no hay usuarios registrados.</td></tr>
              )}
              {usuarios.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 font-semibold">
                    {u.display_name || "Sin nombre"}
                    {u.role === "admin" && (
                      <span className="ml-2 text-[10px] font-bold uppercase tracking-wide text-primary bg-primary/12 rounded-full px-2 py-0.5">Admin</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-semibold bg-secondary rounded-full px-2.5 py-1">{ETIQUETA_PLAN[u.plan] ?? u.plan}</span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{formatoFecha(u.created_at)}</td>
                  <td className="px-5 py-3 text-muted-foreground">{u.ultima_actividad ? formatoFechaHora(u.ultima_actividad) : "Nunca"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Tarjeta>
    </div>
  );
}
