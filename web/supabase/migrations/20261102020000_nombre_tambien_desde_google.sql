-- ══════════════════════════════════════════════════════════════
-- El login ahora pide Nombre/Apellido (display_name) a quien entra
-- con correo. Quien entra con Google no pasa por ese formulario, así
-- que esta función toma su nombre real desde lo que Google ya manda
-- (full_name/name) si no viene display_name propio.
-- ══════════════════════════════════════════════════════════════

create or replace function private.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name, trial_ends_at)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    ),
    now() + interval '5 days'
  );
  return new;
end;
$$;
