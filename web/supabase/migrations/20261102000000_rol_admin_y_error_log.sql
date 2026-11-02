-- ══════════════════════════════════════════════════════════════
-- Panel de administración: rol de admin + registro de errores.
-- ══════════════════════════════════════════════════════════════

-- ── profiles.role ────────────────────────────────────────────────
-- El panel se protege verificando este valor en el servidor en cada carga
-- y en cada acción (nunca por una ruta oculta ni por una lista de correos,
-- ver 26-AUTH-MODERNO.md "Rutas de prueba y acceso administrativo").
alter table public.profiles
  add column role text not null default 'user' check (role in ('user','admin'));

create index profiles_role_admin_idx on public.profiles (role) where role = 'admin';

-- ── error_log ────────────────────────────────────────────────────
-- Mismo patrón que `eventos`: RLS activo SIN políticas de cliente — solo el
-- servidor (con la clave secreta) escribe y solo el panel de admin lee.
create table public.error_log (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete set null,
  mensaje     text not null,
  contexto    text,
  pantalla    text,
  creado_en   timestamptz not null default now()
);

create index error_log_creado_idx on public.error_log (creado_en desc);

alter table public.error_log enable row level security;
