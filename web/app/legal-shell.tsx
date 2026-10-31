import Link from "next/link";

export default function LegalShell({
  titulo,
  actualizado,
  children,
}: {
  titulo: string;
  actualizado: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh flex flex-col max-w-[43.75rem] mx-auto w-full px-5 pt-5 pb-16">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground min-h-11">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Volver
      </Link>

      <h1 className="text-2xl font-extrabold mt-4">{titulo}</h1>
      <p className="text-xs text-muted-foreground mt-1">Última actualización: {actualizado}</p>

      <article className="mt-6 flex flex-col gap-5 text-[0.9375rem] leading-relaxed text-foreground [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-2 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul]:pl-5 [&_ul]:list-disc [&_li]:text-muted-foreground [&_p]:text-muted-foreground [&_strong]:text-foreground">
        {children}
      </article>
    </div>
  );
}
