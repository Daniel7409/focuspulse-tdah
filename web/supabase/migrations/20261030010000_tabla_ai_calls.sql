-- Registro de cada llamada a la IA (para el kill-switch de presupuesto diario/mensual, 30-INTEGRACION-IA.md)
create table public.ai_calls (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  kind        text not null default 'sugerencia_pasos',
  cost_usd    numeric(10,6) not null default 0,
  created_at  timestamptz not null default now()
);

create index ai_calls_user_idx on public.ai_calls (user_id);
create index ai_calls_created_idx on public.ai_calls (created_at);

alter table public.ai_calls enable row level security;

-- El usuario puede ver su propio historial; las escrituras SOLO las hace el servidor
-- (con la clave secreta, que salta RLS) — nunca se inserta desde el cliente.
create policy "select_own_ai_calls" on public.ai_calls for select
  using ( (select auth.uid()) = user_id );
