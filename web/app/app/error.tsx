"use client";

import { useEffect } from "react";

export default function ErrorAppInterna({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center gap-3.5">
      <div className="w-11 h-11 rounded-[14px] bg-destructive/10 flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--destructive)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
          <path d="M12 9v4" />
          <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          <path d="M12 17h.01" />
        </svg>
      </div>
      <div>
        <h1 className="text-lg font-bold leading-snug max-w-[280px]">Algo salió mal</h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-[280px] leading-relaxed">
          No pudimos cargar esta pantalla. Tu tarea y tu racha están a salvo, intenta de nuevo.
        </p>
      </div>
      <button
        onClick={reset}
        className="min-h-11 px-6 rounded-[var(--radius-btn)] bg-primary text-primary-foreground font-semibold text-sm"
      >
        Intentar otra vez
      </button>
    </div>
  );
}
