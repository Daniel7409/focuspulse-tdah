-- Analítica mínima del funnel (hallazgo #9 de la auditoría de Sesión 8): sin esto no hay forma
-- de medir dónde se pierde la gente entre onboarding, paywall, prueba y primer uso real.
-- Solo el servidor escribe (vía service role, ver lib/eventos-actions.ts) — ningún cliente
-- tiene permiso de insertar directo, para que el dato del funnel no se pueda manipular.
create table public.eventos (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete set null,
  anon_id       text,
  nombre        text not null,
  propiedades   jsonb not null default '{}'::jsonb,
  creado_en     timestamptz not null default now()
);

create index eventos_nombre_fecha_idx on public.eventos (nombre, creado_en desc);
create index eventos_user_idx on public.eventos (user_id) where user_id is not null;

alter table public.eventos enable row level security;
-- Sin políticas de insert/select para anon/authenticated a propósito: solo el service role
-- (que salta RLS) escribe y lee, desde el backoffice o desde lib/eventos-actions.ts.
