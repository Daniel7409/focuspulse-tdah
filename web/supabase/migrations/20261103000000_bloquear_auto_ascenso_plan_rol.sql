-- ══════════════════════════════════════════════════════════════
-- Hallazgo crítico de la auditoría de seguridad (Sesión 13): la política
-- "update_own_profile" dejaba cambiar CUALQUIER columna de su propia fila,
-- incluidas `plan`, `role` y `trial_ends_at` — un usuario podía ascenderse
-- a sí mismo a admin y a plan pagado desde el navegador, sin pasar por el
-- servidor. Este trigger bloquea esas 3 columnas: solo el servidor (con la
-- clave secreta, que salta RLS) puede cambiarlas de ahora en adelante.
-- ══════════════════════════════════════════════════════════════

create or replace function private.proteger_columnas_sensibles_de_profiles()
returns trigger
language plpgsql
security definer set search_path = '' as $$
begin
  -- Deja pasar: (a) el cliente con la clave secreta (PostgREST como service_role), y
  -- (b) una conexión directa a la base (SQL editor, migraciones) que nunca trae un JWT
  -- de usuario — ahí no hay "reclamo" (claims) de rol en absoluto.
  -- Bloquea: cualquier pedido que SÍ venga con un JWT de usuario común (authenticated/anon).
  if auth.role() = 'service_role' or current_setting('request.jwt.claims', true) is null then
    return new;
  end if;

  new.plan := old.plan;
  new.role := old.role;
  new.trial_ends_at := old.trial_ends_at;
  return new;
end;
$$;

create trigger proteger_columnas_sensibles
  before update on public.profiles
  for each row execute function private.proteger_columnas_sensibles_de_profiles();
