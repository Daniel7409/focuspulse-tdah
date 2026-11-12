import "server-only";
import { Resend } from "resend";

// Fail-open a propósito: un correo de retención que no se manda nunca debe tumbar el webhook
// de pagos (eso sí es crítico). Si falta la clave, se registra y se sigue de largo.
const client = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_MKT = process.env.EMAIL_FROM_MKT ?? "FocusPulse TDAH <hola@mkt.focuspulsetdah.com>";

export async function sendMktEmail(opts: {
  to: string;
  subject: string;
  preheader: string;
  bodyHtml: string;
}): Promise<{ sent: boolean }> {
  if (!client) {
    console.warn("RESEND_API_KEY no configurada — correo de retención omitido", { subject: opts.subject });
    return { sent: false };
  }

  // El preheader va oculto, antes del contenido visible (lo que se ve junto al asunto en la bandeja).
  // Sin tarjeta/fondo de color ni caja de marca: una prueba real en esta sesión confirmó que un
  // correo con botón grande + tarjeta cae en "Promociones" de Gmail, incluso siendo un aviso de
  // cuenta urgente. Texto plano con un poco de tipografía — se lee como correo personal.
  const html = `
    <div style="display:none;max-height:0;overflow:hidden;opacity:0">${opts.preheader}</div>
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px 16px;color:#2C2638;font-size:15px;line-height:1.5">
      ${opts.bodyHtml}
      <p style="margin:24px 0 0;font-size:13px;color:#6b6478">— El equipo de FocusPulse TDAH</p>
    </div>
  `;

  const { error } = await client.emails.send({
    from: FROM_MKT,
    to: opts.to,
    subject: opts.subject,
    html,
  });

  if (error) {
    console.error("resend send error", { subject: opts.subject, error: error.message });
    return { sent: false };
  }
  return { sent: true };
}
