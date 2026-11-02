"use client";

import { useEffect } from "react";
import { registrarError } from "@/lib/error-actions";

export default function ErrorPanel({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    void registrarError(error.message, error.stack, "/panel");
  }, [error]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center text-center gap-3.5 px-5">
      <h1 className="text-lg font-bold">Algo salió mal en el panel</h1>
      <p className="text-sm text-muted-foreground max-w-[280px] leading-relaxed">
        Tus datos están a salvo. Intenta de nuevo.
      </p>
      <button
        onClick={reset}
        className="min-h-11 px-6 rounded-[var(--radius-btn)] bg-primary text-primary-foreground font-semibold text-sm"
      >
        Intentar otra vez
      </button>
    </div>
  );
}
