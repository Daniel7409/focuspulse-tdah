import { connection } from "next/server";
import { erroresRecientes } from "../data";
import { Tarjeta, TituloSeccion, Aviso, formatoFechaHora } from "../ui";

export const instant = false;

export default async function PanelSalud() {
  await connection();
  const errores = await erroresRecientes(30);

  return (
    <div className="flex flex-col gap-6">
      <TituloSeccion subtitulo="Errores reales que les pasaron a tus usuarios">Salud de la app</TituloSeccion>

      {errores.length === 0 ? (
        <Aviso tono="bien" titulo="✅ No se ha registrado ningún error">
          Desde que se activó este registro, nadie se topó con una falla dentro de la app.
        </Aviso>
      ) : (
        <Tarjeta className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-bold text-muted-foreground uppercase tracking-wide border-b border-border">
                  <th className="px-5 py-3">Cuándo</th>
                  <th className="px-5 py-3">Pantalla</th>
                  <th className="px-5 py-3">Qué pasó</th>
                </tr>
              </thead>
              <tbody>
                {errores.map((e) => (
                  <tr key={e.id} className="border-b border-border last:border-0 align-top">
                    <td className="px-5 py-3 text-muted-foreground whitespace-nowrap">{formatoFechaHora(e.creado_en)}</td>
                    <td className="px-5 py-3 text-muted-foreground whitespace-nowrap">{e.pantalla ?? "—"}</td>
                    <td className="px-5 py-3 font-mono text-xs leading-relaxed">{e.mensaje}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tarjeta>
      )}
    </div>
  );
}
