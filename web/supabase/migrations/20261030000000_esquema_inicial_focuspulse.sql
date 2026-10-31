-- ══════════════════════════════════════════════════════════════
-- FocusPulse TDAH — esquema inicial (perfiles, tareas, rachas)
-- Aplicada en Supabase (proyecto dbmxnlkucrgvyxxtzswj) vía MCP — este archivo
-- es la copia versionada en el repo para que el esquema se pueda reconstruir
-- desde cero (clean-room, ver 25-BASE-DE-DATOS.md).
-- ══════════════════════════════════════════════════════════════

create schema if not exists private;

create or replace function private.set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── profiles ─────────────────────────────────────────────────────
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text,
  plan          text not null default 'trial' check (plan in ('trial','active','canceled','expired')),
  trial_ends_at timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "select_own_profile" on public.profiles for select
  using ( (select auth.uid()) = id );
create policy "update_own_profile" on public.profiles for update
  using ( (select auth.uid()) = id ) with check ( (select auth.uid()) = id );

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function private.set_updated_at();

create or replace function private.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name, trial_ends_at)
  values (new.id, new.raw_user_meta_data ->> 'display_name', now() + interval '5 days');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

-- ── tasks ────────────────────────────────────────────────────────
create table public.tasks (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  content         text not null check (length(content) between 1 and 500),
  task_date       date not null default current_date,
  duration_minutes int check (duration_minutes in (15,25,45)),
  status          text not null default 'pending' check (status in ('pending','completed','rolled_over')),
  completed_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index tasks_user_date_idx on public.tasks (user_id, task_date desc);

alter table public.tasks enable row level security;

create policy "select_own_tasks" on public.tasks for select
  using ( (select auth.uid()) = user_id );
create policy "insert_own_tasks" on public.tasks for insert
  with check ( (select auth.uid()) = user_id );
create policy "update_own_tasks" on public.tasks for update
  using ( (select auth.uid()) = user_id ) with check ( (select auth.uid()) = user_id );
create policy "delete_own_tasks" on public.tasks for delete
  using ( (select auth.uid()) = user_id );

create trigger tasks_set_updated_at before update on public.tasks
  for each row execute function private.set_updated_at();

-- ── streak_days (estado derivado de racha — solo SELECT directo; se escribe por RPC) ──
create table public.streak_days (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  day         date not null,
  created_at  timestamptz not null default now(),
  unique (user_id, day)
);

create index streak_days_user_idx on public.streak_days (user_id);

alter table public.streak_days enable row level security;

create policy "select_own_streak_days" on public.streak_days for select
  using ( (select auth.uid()) = user_id );

-- ── RPC: completar la tarea del día (atómica: marca tarea + registra racha) ──
create or replace function public.complete_task(p_task_id uuid)
returns public.tasks
language plpgsql security definer set search_path = public, pg_temp
as $$
declare
  v_uid uuid := (select auth.uid());
  v_row public.tasks;
begin
  if v_uid is null then
    raise exception 'NOT_AUTHENTICATED' using errcode = 'P0001';
  end if;

  update public.tasks
     set status = 'completed', completed_at = now()
   where id = p_task_id and user_id = v_uid and status = 'pending'
  returning * into v_row;

  if v_row.id is null then
    raise exception 'TASK_NOT_FOUND_OR_NOT_PENDING' using errcode = 'P0001';
  end if;

  insert into public.streak_days (user_id, day)
  values (v_uid, current_date)
  on conflict (user_id, day) do nothing;

  return v_row;
end;
$$;

revoke execute on function public.complete_task(uuid) from public, anon;
grant execute on function public.complete_task(uuid) to authenticated;
