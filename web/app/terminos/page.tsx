import LegalShell from "../legal-shell";

export const metadata = { title: "Términos de uso — FocusPulse TDAH" };

export default function TerminosPage() {
  return (
    <LegalShell titulo="Términos de uso" actualizado="31 de octubre de 2026">
      <p>
        FocusPulse TDAH es operada por <strong>Néstor Escalona</strong>, persona natural, con
        domicilio en Colombia (<strong>emprendecolombia340@gmail.com</strong>). Al crear una cuenta
        aceptas estos términos.
      </p>

      <h2>Qué es el servicio</h2>
      <p>
        FocusPulse TDAH es un planificador diario pensado para adultos con TDAH: muestra una sola
        tarea a la vez, mueve automáticamente lo no hecho al día siguiente sin marcarlo como
        "atrasado", e incluye un temporizador de enfoque y sugerencias generadas por IA para
        arrancar una tarea.
      </p>
      <p>
        No prometemos resultados médicos, terapéuticos ni de productividad garantizados — es una
        herramienta de organización, no un tratamiento.
      </p>

      <h2>Tu cuenta y tu suscripción</h2>
      <ul>
        <li>El acceso a FocusPulse TDAH se activa con tu prueba gratuita de 5 días y se cobra a través de Hotmart según el plan que elijas (mensual o anual).</li>
        <li>La suscripción se renueva automáticamente al vencer tu periodo, salvo que la canceles antes.</li>
        <li>Puedes cancelar cuando quieras desde el área de compras de tu cuenta en Hotmart, o escribiendo a <strong>emprendecolombia340@gmail.com</strong> si necesitas ayuda para encontrarla. La cancelación detiene el próximo cobro; no genera un reembolso automático de lo ya cobrado (eso lo cubre nuestra Política de reembolsos).</li>
        <li>Nos reservamos el derecho de suspender cuentas que usen la app de forma abusiva (por ejemplo, saturando las sugerencias de IA a propósito o intentando vulnerar su seguridad).</li>
      </ul>

      <h2>Uso aceptable</h2>
      <p>Tu única tarea diaria y el texto que le pides a la IA son para tu uso personal. No está permitido usar la app para generar o almacenar contenido ilegal, ni intentar extraer, saturar o manipular el servicio de IA más allá de su uso previsto.</p>

      <h2>Las sugerencias de la IA no son un consejo profesional</h2>
      <p>
        Las "3 pasos para arrancar" que genera la IA son <strong>orientación automática</strong>,
        no consejo médico, psicológico, legal ni financiero. Pueden ser incorrectas o no aplicar a
        tu situación — la decisión final siempre es tuya.
      </p>

      <h2>Limitación de responsabilidad</h2>
      <p>
        FocusPulse TDAH se ofrece "tal cual". Hacemos lo posible porque funcione sin interrupciones,
        pero no somos responsables por pérdidas indirectas derivadas de una falla técnica, una
        sugerencia de IA incorrecta, o del mal uso de la información que registras en la app.
      </p>

      <h2>Ley aplicable</h2>
      <p>Estos términos se rigen por las leyes de Colombia. Cualquier disputa se resuelve ante la jurisdicción colombiana, sin perjuicio de los derechos que te reconozca la ley de tu país de residencia como consumidor.</p>

      <h2>Cambios a estos términos</h2>
      <p>Si hacemos un cambio importante, te avisamos por correo antes de que entre en vigor.</p>
    </LegalShell>
  );
}
