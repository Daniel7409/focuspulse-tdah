-- Deshacer "Cerrar el día": vuelve la tarea a pendiente y retira el día de racha de hoy.
-- Mismo patrón que complete_task: atómico, valida dueño, sin acceso directo del cliente a streak_days.
create or replace function public.undo_complete_task(p_task_id uuid)
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

  delete from public.streak_days where user_id = v_uid and day = current_date;

  return v_row;
end;
$$;

revoke execute on function public.undo_complete_task(uuid) from public, anon;
grant execute on function public.undo_complete_task(uuid) to authenticated;
