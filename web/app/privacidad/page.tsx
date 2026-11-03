import LegalShell from "../legal-shell";

export const metadata = { title: "Política de privacidad — FocusPulse TDAH" };

export default function PrivacidadPage() {
  return (
    <LegalShell titulo="Política de privacidad" actualizado="31 de octubre de 2026">
      <p>
        FocusPulse TDAH es operada por <strong>Néstor Escalona</strong>, persona natural, con
        domicilio en Colombia. Puedes escribirnos para cualquier tema de privacidad a{" "}
        <strong>emprendecolombia340@gmail.com</strong>.
      </p>

      <h2>Qué datos recopilamos</h2>
      <ul>
        <li>Tu correo electrónico, para iniciar sesión y contactarte.</li>
        <li>La única tarea que escribes cada día y la duración de enfoque que elijas.</li>
        <li>Datos de uso: qué días cierras tu tarea, tu racha y tu plan (prueba o pagado).</li>
        <li>Una cookie propia (no de terceros) para saber, de forma anónima, qué pantallas visitas dentro de la app y mejorarla. No se usa para publicidad ni se comparte con nadie.</li>
      </ul>
      <p>Solo recopilamos lo que la app necesita para funcionar — nada de ubicación, teléfono ni datos financieros (esos los maneja directamente Hotmart, nunca pasan por nuestros servidores).</p>

      <h2>Con quién se comparten</h2>
      <p>No vendemos tus datos. Se comparten, solo con la función de hacer funcionar la app, con:</p>
      <ul>
        <li><strong>Supabase</strong> — guarda tu cuenta, tu tarea y tu racha de forma segura.</li>
        <li><strong>Anthropic (Claude)</strong> — cuando pides "3 pasos para arrancar", el texto de tu tarea se envía a este proveedor de IA (con sede en Estados Unidos) para generar la sugerencia. Es una transferencia internacional de datos: el proveedor procesa ese texto bajo sus propios términos, sin usarlo para entrenar sus modelos con tu información identificable.</li>
        <li><strong>Vercel</strong> — aloja la aplicación en internet.</li>
        <li><strong>Hotmart</strong> — procesa tu pago; nosotros nunca vemos ni guardamos el número de tu tarjeta.</li>
      </ul>

      <h2>Aviso sobre la IA</h2>
      <p>
        El texto de tu tarea se procesa solo cuando tú mismo pides la sugerencia (no se envía nada
        sin que lo pidas). Evita escribir en tu tarea contraseñas, datos financieros o información
        médica sensible — aunque la app es de uso personal, ese texto sale hacia el proveedor de IA.
      </p>

      <h2>Cuánto tiempo guardamos tus datos</h2>
      <p>Mientras tu cuenta exista. Si la eliminas, borramos tu tarea, tu racha y el historial de sugerencias de IA asociado a tu cuenta.</p>

      <h2>Tus derechos (Ley 1581 de 2012, Colombia)</h2>
      <p>Como titular de tus datos puedes, en cualquier momento, pedirnos por correo:</p>
      <ul>
        <li>Conocer, actualizar o corregir tus datos.</li>
        <li>Pedir prueba de la autorización que nos diste.</li>
        <li>Eliminar tu cuenta y todos tus datos (incluido tu historial de sugerencias de IA).</li>
        <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC) si consideras que no respetamos tus derechos.</li>
      </ul>
      <p>Escríbenos a <strong>emprendecolombia340@gmail.com</strong> y resolvemos tu solicitud en un plazo razonable.</p>

      <h2>Edad mínima</h2>
      <p>FocusPulse TDAH está pensada para adultos (18 años o más) que organizan su trabajo o estudio. No está dirigida a menores de edad ni recopilamos a sabiendas datos de menores.</p>

      <h2>Cambios a esta política</h2>
      <p>Si hacemos un cambio importante, te avisamos por correo antes de que entre en vigor. La fecha de arriba siempre indica la última actualización.</p>
    </LegalShell>
  );
}
