import Link from "next/link";
import { Reveal, Contador, AnilloAnimado, FaqItem, DemoRollover, NavSeccionActiva, StickyCtaMobile } from "./landing-interactions";

const check = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.4" strokeLinecap="round" className="shrink-0 mt-0.5">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const shieldMini = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
  </svg>
);

const chipIcon = (path: React.ReactNode) => (
  <span
    className="inline-flex items-center justify-center w-11 h-11 rounded-[var(--radius-btn)] shrink-0"
    style={{
      background: "color-mix(in oklab, var(--primary) 10%, transparent)",
      border: "1px solid color-mix(in oklab, var(--primary) 22%, transparent)",
    }}
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {path}
    </svg>
  </span>
);

const surfaceGrad = { backgroundImage: "linear-gradient(165deg, var(--card) 0%, color-mix(in oklab, var(--card) 92%, white) 55%, color-mix(in oklab, var(--card) 88%, var(--background)) 100%)" };
const heroGrad = { backgroundImage: "linear-gradient(160deg, var(--card), var(--background))" };
const shadowTinta = "0 1rem 2.25rem -1.125rem color-mix(in oklab, var(--primary) 22%, transparent)";
const darkPanel = {
  backgroundImage:
    "radial-gradient(56.25rem 26.25rem at 85% -10%, color-mix(in oklab, var(--primary) 30%, transparent), transparent 60%), linear-gradient(165deg, color-mix(in oklab, var(--foreground) 94%, black) 0%, color-mix(in oklab, var(--foreground) 86%, black) 60%, color-mix(in oklab, var(--foreground) 78%, black) 100%)",
};

function Plan({
  recomendado,
  nombre,
  precio,
  sufijoPrecio,
  nota,
  items,
  ctaTexto,
}: {
  recomendado?: boolean;
  nombre: string;
  precio: string;
  sufijoPrecio: string;
  nota: string;
  items: string[];
  ctaTexto: string;
}) {
  return (
    <div
      className="relative rounded-[var(--radius-card)] p-7"
      style={
        recomendado
          ? {
              border: "1.5px solid transparent",
              backgroundImage: `${surfaceGrad.backgroundImage} padding-box, linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 35%, transparent)) border-box`,
              boxShadow: "0 1.125rem 2.75rem -1.125rem color-mix(in oklab, var(--primary) 35%, transparent)",
            }
          : {
              ...surfaceGrad,
              border: "1.5px solid color-mix(in oklab, var(--muted-foreground) 32%, transparent)",
              boxShadow: "0 0.625rem 1.625rem -1.125rem color-mix(in oklab, var(--primary) 25%, transparent)",
            }
      }
    >
      {recomendado && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-extrabold uppercase tracking-wide px-3.5 py-1 rounded-full">
          Ahorra 42%
        </span>
      )}
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{nombre}</p>
      <p className="text-4xl font-extrabold mt-2">
        {precio}
        <small className="text-sm font-semibold text-muted-foreground">{sufijoPrecio}</small>
      </p>
      <p className="text-xs text-muted-foreground mt-1">{nota}</p>
      <ul className="mt-4.5 flex flex-col gap-2.5">
        {items.map((it) => (
          <li key={it} className="flex gap-2 items-start text-sm text-foreground">
            {check}
            {it}
          </li>
        ))}
      </ul>
      <Link
        href={`/onboarding?plan=${recomendado ? "anual" : "mensual"}`}
        className={`w-full mt-5 flex items-center justify-center h-13 rounded-[var(--radius-btn)] font-bold text-base transition active:scale-[.97] ${
          recomendado ? "text-primary-foreground" : "bg-card text-primary"
        }`}
        style={
          recomendado
            ? {
                backgroundImage: "linear-gradient(180deg, color-mix(in oklab, var(--primary) 88%, white), var(--primary))",
                boxShadow: "inset 0 1px 0 rgb(255 255 255 / .35), 0 0.875rem 1.875rem -0.625rem color-mix(in oklab, var(--primary) 50%, transparent)",
              }
            : { border: "1.5px solid color-mix(in oklab, var(--primary) 45%, transparent)" }
        }
      >
        {ctaTexto}
      </Link>
      <p className="flex items-center justify-center gap-1.5 mt-3 text-sm font-bold text-foreground">
        {shieldMini} 7 días, sin preguntas
      </p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2.5 focus:rounded-[var(--radius-btn)] focus:text-sm focus:font-bold"
      >
        Saltar al contenido
      </a>
      <nav
        className="sticky top-0 z-10 backdrop-blur-md"
        style={{ background: "color-mix(in oklab, var(--background) 82%, transparent)", borderBottom: "1px solid color-mix(in oklab, var(--muted-foreground) 14%, transparent)" }}
      >
        <div className="max-w-[70rem] mx-auto px-5 flex items-center justify-between py-3.5">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-base">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            FocusPulse
            <span className="font-semibold text-muted-foreground text-xs ml-0.5">TDAH</span>
          </Link>
          <div className="flex items-center gap-5">
            <div className="hidden md:flex items-center gap-5">
              <NavSeccionActiva
                ids={[
                  { id: "como-funciona", href: "#como-funciona", label: "Cómo funciona" },
                  { id: "oferta", href: "#oferta", label: "Precio" },
                  { id: "faq", href: "#faq", label: "Preguntas" },
                ]}
              />
            </div>
            <a
              href="#oferta"
              className="inline-flex items-center justify-center h-13 px-5 rounded-[var(--radius-btn)] font-bold text-sm text-primary-foreground active:scale-[.97] transition"
              style={{
                backgroundImage: "linear-gradient(180deg, color-mix(in oklab, var(--primary) 88%, white), var(--primary))",
                boxShadow: "inset 0 1px 0 rgb(255 255 255 / .35), 0 0.875rem 1.875rem -0.625rem color-mix(in oklab, var(--primary) 50%, transparent)",
              }}
            >
              Empezar gratis
            </a>
          </div>
        </div>
      </nav>

      {/* 1. HERO */}
      <header id="main" className="max-w-[70rem] mx-auto px-5 pt-14 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-7 md:gap-12 items-center">
        <div>
          <Reveal>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
              Una sola tarea. <span className="text-primary">Cero culpa.</span>
            </h1>
          </Reveal>
          <Reveal delayMs={140}>
            <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-[46ch] leading-relaxed">
              Un planificador en español que <b className="text-foreground">perdona automáticamente</b> lo que no hiciste hoy — en vez de marcarlo en rojo.
            </p>
          </Reveal>
          <Reveal delayMs={210}>
            <div className="mt-6">
              <a
                id="hero-cta"
                href="#oferta"
                className="inline-flex items-center justify-center h-13 px-6 rounded-[var(--radius-btn)] font-bold text-base text-primary-foreground active:scale-[.97] transition"
                style={{
                  backgroundImage: "linear-gradient(180deg, color-mix(in oklab, var(--primary) 88%, white), var(--primary))",
                  boxShadow: "inset 0 1px 0 rgb(255 255 255 / .35), 0 0.875rem 1.875rem -0.625rem color-mix(in oklab, var(--primary) 50%, transparent)",
                }}
              >
                Empezar gratis
              </a>
              <p className="text-xs text-muted-foreground mt-2.5">Prueba gratis 5 días · sin tarjeta · cancela cuando quieras</p>
              <a href="#oferta" className="inline-block text-xs font-bold text-primary mt-2.5 underline-offset-2 hover:underline">
                Ver el precio →
              </a>
            </div>
          </Reveal>
        </div>
        <Reveal delayMs={280} className="mx-auto">
          <div
            className="rounded-[var(--radius-xl)] p-7"
            style={{
              ...heroGrad,
              border: "1px solid color-mix(in oklab, var(--primary) 16%, transparent)",
              boxShadow: "0 1.875rem 4.375rem -1.875rem color-mix(in oklab, var(--primary) 30%, transparent)",
            }}
          >
            <div
              className="w-[12.5rem] md:w-[14.375rem] mx-auto aspect-[9/18] bg-background rounded-[2rem] overflow-hidden p-5 flex flex-col"
              style={{ border: "0.4375rem solid var(--foreground)" }}
            >
              <div className="w-[5.75rem] h-[5.75rem] mx-auto mt-2.5 relative">
                <AnilloAnimado radio={38} grosor={7} offsetFinal={70} tamano={92} />
                <div className="absolute inset-0 flex items-center justify-center font-extrabold text-lg">18:32</div>
              </div>
              <div className="mt-3.5 bg-card rounded-[var(--radius-btn)] p-3 text-center" style={{ border: "1px solid color-mix(in oklab, var(--primary) 20%, transparent)" }}>
                <p className="text-[0.5625rem] font-bold text-primary uppercase tracking-wide">Tu única tarea</p>
                <p className="text-xs font-bold mt-1">Enviar el diseño al cliente</p>
              </div>
              <div className="mt-auto h-9 rounded-[0.625rem] bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                Empezar enfoque
              </div>
            </div>
          </div>
        </Reveal>
      </header>

      {/* 2. PROBLEMA + AGITACIÓN — fusionadas en una sola sección (menos scroll para un cerebro
          que se abruma con listas largas; antes eran 2 secciones separadas) */}
      <section className="pt-9 pb-9 md:pt-18 md:pb-14" style={{ background: "color-mix(in oklab, var(--primary) 4%, var(--background))" }}>
        <div className="max-w-[70rem] mx-auto px-5">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center max-w-[36ch] mx-auto leading-tight">¿Te suena familiar?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-9">
          {[
            {
              icon: (
                <>
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                  <circle cx="12" cy="12" r="9" />
                </>
              ),
              texto: (
                <>
                  ¿Abres tu lista y sientes un <span className="text-primary">golpe de ansiedad</span> al ver todo en rojo?
                </>
              ),
            },
            {
              icon: (
                <>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </>
              ),
              texto: "¿Te saltaste un día y ahora evitas abrir la app por miedo a lo acumulado?",
            },
            {
              icon: <path d="m12 2 2.6 6.9L22 9.3l-5.4 4.6 1.8 7.1L12 17l-6.4 4 1.8-7.1L2 9.3l7.4-.4Z" />,
              texto: "¿Empiezas cinco cosas a la vez y no terminas ninguna?",
            },
            {
              icon: (
                <>
                  <path d="M3 3v18h18" />
                  <path d="M7 14l4-4 3 3 5-6" />
                </>
              ),
              texto: "¿Ya probaste Notion, Todoist o Trello... y los abandonaste a los pocos días?",
            },
          ].map((p, i) => (
            <Reveal key={i} delayMs={i * 60}>
              <div className="flex gap-3.5 items-start rounded-[var(--radius-card)] p-5" style={{ ...surfaceGrad, border: "1px solid color-mix(in oklab, var(--muted-foreground) 14%, transparent)" }}>
                {chipIcon(p.icon)}
                <p className="text-sm font-semibold leading-relaxed">{p.texto}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="rounded-[var(--radius-xl)] text-background mt-8" style={darkPanel}>
          <div className="px-6 md:px-10 py-8 md:py-12">
            <h3 className="text-xl md:text-2xl font-extrabold max-w-[24ch] leading-tight">
              No es falta de voluntad. Es <span style={{ color: "color-mix(in oklab, var(--background) 85%, var(--primary))" }}>el diseño</span> de las otras apps.
            </h3>
            <p className="mt-3 text-sm md:text-base max-w-[56ch] leading-relaxed" style={{ color: "color-mix(in oklab, var(--background) 80%, transparent)" }}>
              Si cada lista infinita te deja <b className="text-background">paralizado decidiendo qué hacer</b>, no es falta de voluntad — y menos vergüenza, cuando te esfuerzas el triple que los demás.
            </p>
            <div className="flex gap-3.5 mt-6 flex-wrap">
              <div className="rounded-[var(--radius-btn)] px-4.5 py-3.5" style={{ background: "rgb(255 255 255 / .06)", border: "1px solid rgb(255 255 255 / .12)", boxShadow: "inset 0 2px 6px rgb(0 0 0 / .22)" }}>
                <b className="block text-2xl">
                  <Contador objetivo={1} sufijo=" tarea" />
                </b>
                <span className="text-xs" style={{ color: "color-mix(in oklab, var(--background) 72%, transparent)" }}>a la vez, nunca más</span>
              </div>
              <div className="rounded-[var(--radius-btn)] px-4.5 py-3.5" style={{ background: "rgb(255 255 255 / .06)", border: "1px solid rgb(255 255 255 / .12)", boxShadow: "inset 0 2px 6px rgb(0 0 0 / .22)" }}>
                <b className="block text-2xl">
                  <Contador objetivo={0} />
                </b>
                <span className="text-xs" style={{ color: "color-mix(in oklab, var(--background) 72%, transparent)" }}>números rojos de atraso</span>
              </div>
              <div className="rounded-[var(--radius-btn)] px-4.5 py-3.5" style={{ background: "rgb(255 255 255 / .06)", border: "1px solid rgb(255 255 255 / .12)", boxShadow: "inset 0 2px 6px rgb(0 0 0 / .22)" }}>
                <b className="block text-2xl">
                  <Contador objetivo={5} sufijo=" días" />
                </b>
                <span className="text-xs" style={{ color: "color-mix(in oklab, var(--background) 72%, transparent)" }}>de prueba gratis</span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* 3. SOLUCION */}
      <section id="como-funciona" className="max-w-[70rem] mx-auto px-5 py-9 md:py-18">
        <div className="text-center max-w-[54ch] mx-auto">
          <div
            className="inline-block rounded-full p-[1.5px] mb-3.5"
            style={{ backgroundImage: "linear-gradient(90deg, var(--primary), color-mix(in oklab, var(--primary) 30%, var(--background)))" }}
          >
            <span className="block rounded-full bg-background px-3.5 py-1 text-xs font-bold text-primary uppercase tracking-wide">El dispositivo central</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
            Conoce el <span className="text-primary">Pase Cero Culpa</span>
          </h2>
          <p className="mt-3.5 text-muted-foreground text-sm">
            Ves una sola tarea. Cuando cambia el día, lo que no hiciste <b className="text-foreground">se mueve solo</b> a mañana — tachado con cariño, nunca en rojo.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-9">
          {[
            { num: "01", titulo: "Escribe tu única tarea", texto: "Un campo, sin categorías ni proyectos que configurar." },
            { num: "02", titulo: "Enfócate con el temporizador", texto: "Pantalla completa, apaga el ruido del teléfono." },
            { num: "03", titulo: "Lo demás se reacomoda solo", texto: "Nada se pierde. Nada te regaña. Mañana empiezas en limpio." },
          ].map((p, i) => (
            <Reveal key={p.num} delayMs={i * 80}>
              <div
                className="rounded-[var(--radius-card)] p-6"
                style={{
                  ...surfaceGrad,
                  // Antes llevaba borde en acento + sombra tintada, con el MISMO peso visual que
                  // las tarjetas de compra de más abajo (hallazgo del revisor-visual) — estas son
                  // solo informativas, así que bajan a un borde neutro sin sombra de color.
                  border: "1px solid color-mix(in oklab, var(--muted-foreground) 16%, transparent)",
                }}
              >
                <p className="text-xs font-extrabold text-primary">{p.num}</p>
                <h3 className="text-lg font-bold mt-2.5">{p.titulo}</h3>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{p.texto}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delayMs={240}>
          <div
            className="rounded-[var(--radius-card)] p-6 mt-5 max-w-[32rem] mx-auto"
            style={{
              // 3er nivel de profundidad (hallazgo del revisor-visual: "solo 2 niveles reales").
              // base = fondo de la sección · elevado = tarjetas (surfaceGrad) · hundido = este panel,
              // como una pantalla encajada dentro de la tarjeta — sombra interior en vez de exterior.
              background: "color-mix(in oklab, var(--background) 92%, black)",
              border: "1px solid color-mix(in oklab, var(--muted-foreground) 14%, transparent)",
              boxShadow: "inset 0 0.125rem 0.5rem color-mix(in oklab, var(--foreground) 8%, transparent)",
            }}
          >
            <p className="text-xs font-bold text-muted-foreground text-center mb-4">Así se ve en tu app</p>
            <DemoRollover />
          </div>
        </Reveal>
      </section>

      {/* 4. OFERTA + GARANTÍA (antes eran 2 secciones; la "Tu app, por dentro" de 5 mockups
          se quitó — mismo mensaje ya lo dan "Solución" y el tour real dentro del onboarding,
          y recortaba el recorrido de scroll sin agregar nada nuevo a la decisión de compra) */}
      <section id="oferta" className="py-9 md:py-18" style={{ background: "color-mix(in oklab, var(--primary) 8%, var(--background))" }}>
      <div className="max-w-[70rem] mx-auto px-5">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center leading-tight">Empieza gratis. Sigue por <span className="text-primary">menos de un café al mes</span>.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 max-w-[47.5rem] mx-auto">
          <Plan
            recomendado
            nombre="Anual"
            precio="$2.91"
            sufijoPrecio="/mes"
            nota="Se cobra $34.99/año"
            items={["5 días de prueba gratis", "El Pase Cero Culpa completo", "El precio más bajo del año"]}
            ctaTexto="Elegir anual"
          />
          <Plan
            nombre="Mensual"
            precio="$4.99"
            sufijoPrecio="/mes"
            nota="Se cobra mes a mes"
            items={["5 días de prueba gratis", "El Pase Cero Culpa completo", "Cancela cuando quieras"]}
            ctaTexto="Elegir mensual"
          />
        </div>
        <div
          className="flex flex-col md:flex-row gap-4 items-center rounded-[var(--radius-xl)] p-6 mt-6 max-w-[47.5rem] mx-auto text-center md:text-left"
          style={{ ...surfaceGrad, border: "1.5px solid color-mix(in oklab, var(--primary) 38%, transparent)" }}
        >
          <div
            className="w-[3.5rem] h-[3.5rem] rounded-full flex items-center justify-center shrink-0 mx-auto md:mx-0"
            style={{ background: "color-mix(in oklab, var(--primary) 16%, transparent)", border: "2px solid var(--primary)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-extrabold">
              Garantía de <span className="text-primary">7 días</span>
            </h3>
            <p className="mt-1 text-muted-foreground text-sm">Si no sientes la calma, te devolvemos tu dinero. Sin preguntas, sin vueltas.</p>
          </div>
        </div>
        </div>
      </section>

      {/* 5. FAQ */}
      <section id="faq" className="py-9 md:py-18" style={{ borderTop: "1px solid color-mix(in oklab, var(--muted-foreground) 16%, transparent)" }}>
        <div className="max-w-[70rem] mx-auto px-5">
        <h2 className="text-2xl md:text-2xl font-extrabold text-center">Preguntas frecuentes</h2>
        <div className="max-w-[45rem] mx-auto mt-8 flex flex-col gap-2.5">
          {[
            { q: "¿Y si la abandono como las demás?", a: 'Esta no te pide configurar nada: abres y ya tienes tu tarea. Lo que no hagas se mueve solo — no hay nada que "mantener".' },
            { q: "¿Es cara por algo tan simple?", a: "Menos de $0.17 al día — menos de lo que ya gastaste en apps que abandonaste." },
            { q: "¿Es seguro pagar con mi tarjeta?", a: "Se procesa por Hotmart, con PSE disponible en Colombia." },
            { q: "¿Puedo cancelar cuando quiera?", a: "Sí, en 1 toque, cuando quieras." },
          ].map((item, i) => (
            <FaqItem key={item.q} pregunta={item.q} respuesta={item.a} abiertoInicial={i === 0} />
          ))}
        </div>
        </div>
      </section>

      {/* 6. CTA FINAL */}
      <section className="max-w-[70rem] mx-auto px-5 py-9 md:py-18">
        <div
          className="text-center rounded-[var(--radius-xl)] px-6 py-14"
          style={{ ...heroGrad, border: "1px solid color-mix(in oklab, var(--primary) 18%, transparent)" }}
        >
          <h2 className="text-2xl md:text-3xl font-extrabold max-w-[26ch] mx-auto leading-tight">
            Imagina cerrar hoy con <span className="text-primary">una sola cosa hecha</span> — y dormir en paz.
          </h2>
          <div className="mt-6">
            <a
              href="#oferta"
              className="inline-flex items-center justify-center h-13 px-6 rounded-[var(--radius-btn)] font-bold text-base text-primary-foreground active:scale-[.97] transition"
              style={{
                backgroundImage: "linear-gradient(180deg, color-mix(in oklab, var(--primary) 88%, white), var(--primary))",
                boxShadow: "inset 0 1px 0 rgb(255 255 255 / .35), 0 0.875rem 1.875rem -0.625rem color-mix(in oklab, var(--primary) 50%, transparent)",
              }}
            >
              Quiero mi primer día sin culpa
            </a>
          </div>
        </div>
      </section>

      {/* 10. FOOTER LEGAL */}
      <footer className="pt-8 pb-12" style={{ borderTop: "1px solid color-mix(in oklab, var(--muted-foreground) 16%, transparent)" }}>
        <div className="max-w-[70rem] mx-auto px-5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex flex-col md:flex-row gap-2.5 md:gap-4">
            <a href="/terminos" className="text-muted-foreground text-xs">Términos de uso</a>
            <a href="/privacidad" className="text-muted-foreground text-xs">Política de privacidad</a>
            <a href="/reembolsos" className="text-muted-foreground text-xs">Política de reembolsos</a>
            <a href="mailto:hola@focuspulse.app" className="text-muted-foreground text-xs">Contacto</a>
          </div>
          <div className="flex items-center gap-2 font-extrabold text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            FocusPulse
            <span className="font-semibold text-muted-foreground text-xs">TDAH</span>
          </div>
        </div>
        <div className="max-w-[70rem] mx-auto px-5">
          <p className="text-xs text-muted-foreground mt-3.5 max-w-[70ch] leading-relaxed">
            FocusPulse es una herramienta de organización personal y no reemplaza tratamiento médico ni diagnóstico profesional de TDAH.
          </p>
        </div>
      </footer>
      <StickyCtaMobile heroCtaId="hero-cta" href="#oferta" texto="Empezar gratis" />
    </div>
  );
}
