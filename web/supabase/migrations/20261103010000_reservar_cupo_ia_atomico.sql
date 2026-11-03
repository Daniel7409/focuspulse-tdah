-- Hallazgo IMPORTANTE de la auditoría de seguridad (Sesión 13): el tope de 20
-- sugerencias de IA por usuario/hora se revisaba con un SELECT count() y LUEGO se
-- insertaba la llamada — dos pasos separados, sin nada que los una. Una ráfaga de
-- pedidos simultáneos podía pasar la revisión muchas veces antes de que el primero
-- quedara guardado. Esta función hace "revisar y reservar" en un solo paso atómico,
-- usando un lock por usuario para que pedidos simultáneos del MISMO usuario se
-- pongan en fila en vez de pisarse.
create or replace function public.reservar_cupo_ia(p_user_id uuid, p_max_por_hora int default 20)
returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_count int;
  v_id uuid;
begin
  perform pg_advisory_xact_lock(hashtext(p_user_id::text));

  select count(*) into v_count from public.ai_calls
    where user_id = p_user_id and created_at >= now() - interval '1 hour';

  if v_count >= p_max_por_hora then
    return null;
  end if;

  insert into public.ai_calls (user_id, kind, cost_usd)
  values (p_user_id, 'reservado', 0)
  returning id into v_id;

  return v_id;
end;
$$;

-- Solo el cliente admin (service_role) la llama — nunca el navegador del usuario.
revoke execute on function public.reservar_cupo_ia(uuid, int) from public, anon, authenticated;
grant execute on function public.reservar_cupo_ia(uuid, int) to service_role;
