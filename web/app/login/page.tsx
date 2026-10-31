"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

type Estado = "inicial" | "enviando" | "enviado" | "error";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<Estado>("inicial");
  const [segundosParaReenviar, setSegundosParaReenviar] = useState(0);

  async function enviarEnlace(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setEstado("enviando");
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setEstado("error");
      return;
    }

    setEstado("enviado");
    setSegundosParaReenviar(60);
    const intervalo = setInterval(() => {
      setSegundosParaReenviar((s) => {
        if (s <= 1) {
          clearInterval(intervalo);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  async function continuarConGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <main className="min-h-dvh flex flex-col justify-start px-5 pt-16 pb-10 max-w-sm mx-auto w-full">
      {estado !== "enviado" ? (
        <>
          <div className="mb-7 text-left">
            <h1 className="text-[25px] font-bold tracking-tight text-foreground mb-2">
              Entra a tu plan
            </h1>
            <p className="text-[14.5px] text-muted-foreground leading-relaxed">
              Para guardarlo y verlo en cualquier dispositivo
            </p>
          </div>

          <form onSubmit={enviarEnlace} className="flex flex-col gap-3.5">
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full min-h-[52px] rounded-[var(--radius-btn)] border-[1.5px] border-border bg-card px-4 text-[15.5px] text-foreground outline-none focus:border-primary"
            />

            <button
              type="submit"
              disabled={estado === "enviando"}
              className="min-h-[52px] rounded-[var(--radius-btn)] bg-primary text-primary-foreground font-semibold text-[15.5px] disabled:opacity-60"
            >
              {estado === "enviando" ? "Enviando…" : "Enviarme mi enlace de acceso"}
            </button>

            {estado === "error" && (
              <p role="alert" className="text-sm text-destructive">
                No pudimos enviar el enlace. Revisa el correo e intenta otra vez.
              </p>
            )}

            <div className="flex items-center gap-2.5 text-muted-foreground text-xs my-1">
              <span className="flex-1 h-px bg-border" />
              o
              <span className="flex-1 h-px bg-border" />
            </div>

            <button
              type="button"
              onClick={continuarConGoogle}
              className="min-h-[52px] rounded-[var(--radius-btn)] border-[1.5px] border-border bg-transparent font-semibold text-[15.5px] flex items-center justify-center gap-2.5"
            >
              <GoogleIcon />
              Continuar con Google
            </button>

            <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
              <LockIcon /> Sin contraseñas: te llegará un enlace de un solo uso
            </p>
          </form>
        </>
      ) : (
        <div className="text-center flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-primary">
            <MailIcon />
          </div>
          <h2 className="text-xl font-bold text-foreground">Revisa tu correo</h2>
          <p className="text-[14.5px] text-muted-foreground">
            Te enviamos el enlace a {email}
          </p>
          <button
            disabled={segundosParaReenviar > 0}
            onClick={enviarEnlace}
            className="text-sm text-muted-foreground disabled:opacity-60 mt-2"
          >
            {segundosParaReenviar > 0 ? `Reenviar en ${segundosParaReenviar}s` : "Reenviar"}
          </button>
          <button
            onClick={() => setEstado("inicial")}
            className="text-sm text-primary mt-1"
          >
            Empezar de nuevo
          </button>
        </div>
      )}
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.2s2.7-6.2 6-6.2c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.9 3.2 14.7 2.2 12 2.2 6.9 2.2 2.8 6.3 2.8 11.4s4.1 9.2 9.2 9.2c5.3 0 8.8-3.7 8.8-9 0-.6-.07-1.1-.16-1.5H12Z"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 1 1 8 0v4" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
