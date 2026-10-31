"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const CORREO_SOPORTE = "emprendecolombia340@gmail.com";

export default function PerfilMenu({ horaRecordatorio }: { horaRecordatorio: string }) {
  const router = useRouter();
  const [confirmando, setConfirmando] = useState(false);
  const [cerrando, setCerrando] = useState(false);
  const [aviso, setAviso] = useState("");

  async function cerrarSesion() {
    setCerrando(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/login");
      router.refresh();
    } catch {
      setCerrando(false);
      setConfirmando(false);
      proximamente("No pudimos cerrar tu sesión. Intenta de nuevo.");
    }
  }

  function proximamente(mensaje: string) {
    setAviso(mensaje);
    setTimeout(() => setAviso(""), 2200);
  }

  return (
    <div className="flex flex-col gap-2 mt-2.5">
      <MenuItem
        icono={<IconBell className="w-[18px] h-[18px]" />}
        texto={`Hora de tu recordatorio diario: ${horaRecordatorio}`}
        onClick={() => proximamente("Próximamente podrás elegir la hora desde aquí.")}
      />
      <MenuItem
        icono={<IconCard className="w-[18px] h-[18px]" />}
        texto="Gestionar mi suscripción"
        onClick={() => proximamente("Próximamente: portal de gestión de tu plan.")}
      />
      <MenuItem
        icono={<IconShield className="w-[18px] h-[18px]" />}
        texto="Privacidad y datos"
        href="/privacidad"
      />
      <MenuItem
        icono={<IconHelp className="w-[18px] h-[18px]" />}
        texto="Ayuda y soporte"
        href={`mailto:${CORREO_SOPORTE}`}
      />
      <MenuItem
        icono={<IconLogout className="w-[18px] h-[18px]" />}
        texto="Cerrar sesión"
        peligro
        onClick={() => setConfirmando(true)}
      />

      {aviso && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg z-50">
          {aviso}
        </div>
      )}

      {confirmando && (
        <div
          className="fixed inset-0 bg-foreground/40 flex items-center justify-center z-50 px-6"
          onClick={(e) => e.target === e.currentTarget && setConfirmando(false)}
        >
          <div className="w-full max-w-[340px] bg-card rounded-[var(--radius-card)] p-5">
            <p className="text-[15px] font-medium text-center">¿Seguro que quieres cerrar sesión?</p>
            <div className="flex flex-col gap-2.5 mt-4">
              <button
                onClick={cerrarSesion}
                disabled={cerrando}
                className="min-h-[48px] rounded-[var(--radius-btn)] bg-destructive text-destructive-foreground font-semibold disabled:opacity-60"
              >
                {cerrando ? "Cerrando…" : "Cerrar sesión"}
              </button>
              <button
                onClick={() => setConfirmando(false)}
                className="min-h-[48px] rounded-[var(--radius-btn)] bg-secondary text-foreground font-medium"
              >
                Seguir aquí
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icono,
  texto,
  onClick,
  href,
  peligro,
}: {
  icono: React.ReactNode;
  texto: string;
  onClick?: () => void;
  href?: string;
  peligro?: boolean;
}) {
  const clase = `flex items-center gap-3 min-h-[52px] px-4 rounded-[var(--radius-btn)] border text-left text-sm font-medium ${
    peligro ? "border-destructive/25 text-destructive" : "border-border text-foreground"
  } bg-card`;
  const contenido = (
    <>
      <span className={peligro ? "text-destructive" : "text-primary"}>{icono}</span>
      <span className="flex-1">{texto}</span>
      {!peligro && <IconChev className="w-4 h-4 text-muted-foreground" />}
    </>
  );

  if (href) {
    const externo = href.startsWith("mailto:");
    return externo ? (
      <a href={href} className={clase}>
        {contenido}
      </a>
    ) : (
      <Link href={href} className={clase}>
        {contenido}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={clase}>
      {contenido}
    </button>
  );
}

function IconBell({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
function IconCard({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="5" width="20" height="14" rx="3" />
      <path d="M2 10h20" />
    </svg>
  );
}
function IconShield({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5Z" />
    </svg>
  );
}
function IconHelp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7" />
      <path d="M12 17h.01" />
    </svg>
  );
}
function IconLogout({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}
function IconChev({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
