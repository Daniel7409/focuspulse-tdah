"use client";

import { useEffect } from "react";

/** Guarda la zona horaria real del dispositivo en una cookie para que el servidor calcule "hoy" igual que el usuario ve su reloj (ver lib/fecha.ts). */
export default function ZonaHoraria() {
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (document.cookie.split("; ").some((c) => c === `tz=${tz}`)) return;
      document.cookie = `tz=${tz}; path=/; max-age=31536000; samesite=lax`;
    } catch {
      // Si el navegador no soporta Intl con zona horaria, se queda con el valor por defecto del servidor.
    }
  }, []);

  return null;
}
