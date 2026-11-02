"use client";

import { useState, type FormEvent } from "react";
import { agregarUsuario } from "../actions";
import { Tarjeta } from "../ui";

type Estado = "inicial" | "guardando" | "error" | "listo";

const MENSAJE_ERROR: Record<string, string> = {
  CORREO_INVALIDO: "Ese correo no parece válido.",
  NOMBRE_VACIO: "Escribe un nombre.",
  CORREO_YA_EXISTE: "Ya existe una cuenta con ese correo.",
};

export default function AgregarUsuarioForm() {
  const [abierto, setAbierto] = useState(false);
  const [correo, setCorreo] = useState("");
  const [nombre, setNombre] = useState("");
  const [estado, setEstado] = useState<Estado>("inicial");
  const [error, setError] = useState("");
  const [resultado, setResultado] = useState<{ email: string; enlaceAcceso: string } | null>(null);
  const [copiado, setCopiado] = useState(false);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setEstado("guardando");
    setError("");
    try {
      const r = await agregarUsuario(correo, nombre);
      setResultado(r);
      setEstado("listo");
      setCorreo("");
      setNombre("");
    } catch (err) {
      const codigo = err instanceof Error ? err.message : "";
      setError(MENSAJE_ERROR[codigo] ?? "No pudimos crear el usuario. Intenta de nuevo.");
      setEstado("error");
    }
  }

  function copiarEnlace() {
    if (!resultado) return;
    navigator.clipboard?.writeText(resultado.enlaceAcceso).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  }

  if (!abierto) {
    return (
      <button
        onClick={() => setAbierto(true)}
        className="self-start min-h-11 px-5 rounded-[var(--radius-btn)] bg-primary text-primary-foreground font-semibold text-sm transition active:scale-[.98]"
      >
        + Agregar usuario
      </button>
    );
  }

  return (
    <Tarjeta>
      {resultado ? (
        <div className="flex flex-col gap-3">
          <p className="font-bold text-sm">Listo — cuenta creada para {resultado.email}</p>
          <p className="text-[0.8125rem] text-muted-foreground leading-relaxed">
            Mándale este enlace por donde prefieras (WhatsApp, correo). Al abrirlo, entra directo a la app sin pedirle contraseña.
          </p>
          <div className="flex gap-2 items-center">
            <input
              readOnly
              value={resultado.enlaceAcceso}
              onFocus={(e) => e.target.select()}
              className="flex-1 min-w-0 min-h-10 rounded-[var(--radius-btn)] border border-border bg-background px-3 text-xs text-foreground"
            />
            <button
              onClick={copiarEnlace}
              className="min-h-10 px-4 rounded-[var(--radius-btn)] bg-secondary font-semibold text-xs shrink-0"
            >
              {copiado ? "Copiado" : "Copiar"}
            </button>
          </div>
          <div className="flex gap-2.5 mt-1">
            <button
              onClick={() => { setResultado(null); setEstado("inicial"); }}
              className="text-xs font-semibold text-primary"
            >
              Agregar otro
            </button>
            <button onClick={() => { setResultado(null); setAbierto(false); setEstado("inicial"); }} className="text-xs font-semibold text-muted-foreground">
              Cerrar
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={enviar} className="flex flex-col gap-3 max-w-md">
          <p className="font-bold text-sm">Agregar usuario manualmente</p>
          <input
            type="text"
            required
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="min-h-11 rounded-[var(--radius-btn)] border border-border bg-background px-3.5 text-sm outline-none focus:border-primary"
          />
          <input
            type="email"
            required
            placeholder="correo@ejemplo.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="min-h-11 rounded-[var(--radius-btn)] border border-border bg-background px-3.5 text-sm outline-none focus:border-primary"
          />
          {estado === "error" && <p className="text-xs font-semibold text-destructive">{error}</p>}
          <div className="flex gap-2.5">
            <button
              type="submit"
              disabled={estado === "guardando"}
              className="min-h-11 px-5 rounded-[var(--radius-btn)] bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-60"
            >
              {estado === "guardando" ? "Creando…" : "Crear cuenta"}
            </button>
            <button type="button" onClick={() => setAbierto(false)} className="min-h-11 px-4 text-sm font-semibold text-muted-foreground">
              Cancelar
            </button>
          </div>
        </form>
      )}
    </Tarjeta>
  );
}
