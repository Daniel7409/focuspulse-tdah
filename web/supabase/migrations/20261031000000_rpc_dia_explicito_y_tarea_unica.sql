-- Corrige el descalce de zona horaria: antes complete_task/undo_complete_task usaban
-- current_date (UTC del servidor de Postgres), mientras que task_date se guarda con
-- la fecha local real del usuario. Ahora ambos reciben el mismo día explícito desde la
-- app (ya calculado con la zona horaria real del usuario, ver lib/fecha.ts).

drop function if exists public.complete_task(uuid);

create or replace function public.complete_task(p_task_id uuid, p_day date)
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
  values (v_uid, p_day)
  on conflict (user_id, day) do nothing;

  return v_row;
end;
$$;

revoke execute on function public.complete_task(uuid, date) from public, anon;
grant execute on function public.complete_task(uuid, date) to authenticated;

drop function if exists public.undo_complete_task(uuid);

create or replace function public.undo_complete_task(p_task_id uuid, p_day date)
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
     set status = 'pending', completed_at = null
   where id = p_task_id and user_id = v_uid and status = 'completed'
  returning * into v_row;

  if v_row.id is null then
    raise exception 'TASK_NOT_FOUND_OR_NOT_COMPLETED' using errcode = 'P0001';
  end if;

  delete from public.streak_days where user_id = v_uid and day = p_day;

  return v_row;
end;
$$;

revoke execute on function public.undo_complete_task(uuid, date) from public, anon;
grant execute on function public.undo_complete_task(uuid, date) to authenticated;

-- Evita una tarea duplicada el mismo día (carrera por doble clic/doble envío).
alter table public.tasks add constraint tasks_user_date_unique unique (user_id, task_date);
