-- ══════════════════════════════════════════════════════════════
-- Conexión real de pagos con Hotmart. Doctrina completa:
-- docs/sistema/18-VENTA-HOTMART.md ("SEGURIDAD DEL WEBHOOK DE HOTMART").
-- ══════════════════════════════════════════════════════════════

-- Dedupe técnico: Hotmart reenvía el mismo evento si el endpoint tarda o falla.
-- El event_id como primary key es la defensa: el segundo insert del mismo id falla.
create table public.processed_events (
  event_id     text primary key,
  event_type   text not null,
  payload_hash text,
  processed_at timestamptz not null default now()
);

alter table public.processed_events enable row level security;
-- Sin políticas de cliente: solo el servidor (clave secreta) lo toca.

-- Registro de CADA intento (éxito y fallo) — el backoffice vigila picos de "unauthorized"
-- y una alerta de "sin webhooks hace N horas" (endpoint caído sin que nadie se entere).
create table public.webhook_log (
  id          bigserial primary key,
  event_id    text,
  type        text,
  result      text not null check (result in ('applied', 'duplicate', 'illegal', 'unauthorized', 'ignored', 'error')),
  received_at timestamptz not null default now()
);

create index webhook_log_received_idx on public.webhook_log (received_at desc);
alter table public.webhook_log enable row level security;

-- Datos de Hotmart en el perfil. OJO: plan/trial_ends_at ya están protegidos por el trigger
-- "proteger_columnas_sensibles" (Sesión 13) — solo el servidor (service_role) puede tocarlos.
alter table public.profiles
  add column hotmart_subscriber_code text,
  add column hotmart_status text,
  add column first_paid_at timestamptz,
  add column pago_fallido_desde timestamptz;

create unique index profiles_hotmart_subscriber_idx on public.profiles (hotmart_subscriber_code)
  where hotmart_subscriber_code is not null;

-- Busca el perfil dueño de una compra: primero por el código de suscriptor de Hotmart
-- (estable entre eventos de la misma suscripción), si no por el correo de quien compró.
create or replace function public.resolver_perfil_hotmart(p_email text, p_subscriber_code text)
returns uuid
language sql stable security definer set search_path = '' as $$
  select coalesce(
    (select id from public.profiles where hotmart_subscriber_code = p_subscriber_code),
    (select p.id from public.profiles p join auth.users u on u.id = p.id where u.email = p_email)
  );
$$;

revoke execute on function public.resolver_perfil_hotmart from anon, authenticated;

-- Aplica UN evento de Hotmart de forma atómica: idempotencia + transición legal + cambio de
-- estado + ledger económico. El perfil (p_user_id) ya debe existir — si es un comprador nuevo,
-- el handler crea su cuenta ANTES de llamar aquí (ver app/api/webhooks/hotmart/route.ts).
create or replace function public.aplicar_evento_hotmart(
  p_event_id text, p_event_type text, p_payload_hash text,
  p_user_id uuid, p_subscriber_code text, p_new_status text, p_trial_ends_at timestamptz,
  p_provider text, p_transaction_id text, p_economic_kind text,
  p_product_id text, p_offer_id text, p_amount_minor bigint, p_currency text, p_occurred_at timestamptz
) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_estado_actual text;
begin
  -- (a) idempotencia técnica: si el evento ya se procesó, salir sin tocar nada más.
  begin
    insert into public.processed_events (event_id, event_type, payload_hash)
    values (p_event_id, p_event_type, p_payload_hash);
  exception when unique_violation then
    return jsonb_build_object('status', 'duplicate');
  end;

  select hotmart_status into v_estado_actual from public.profiles where id = p_user_id;

  -- (b) transición legal: no resucitar un reembolso/contracargo con un evento de acceso reentregado.
  if v_estado_actual in ('refunded', 'chargeback') and p_new_status in ('active', 'trialing') then
    return jsonb_build_object('status', 'illegal_transition', 'from', v_estado_actual);
  end if;

  -- (c) aplicar el cambio. 'trialing'/'active' dan acceso completo; 'past_due'/'cancelled' NO
  -- cortan de golpe (conservan el plan que ya tenían); 'expired'/'refunded'/'chargeback' cortan.
  update public.profiles set
    hotmart_subscriber_code = coalesce(p_subscriber_code, hotmart_subscriber_code),
    hotmart_status = p_new_status,
    plan = case
      when p_new_status = 'trialing' then 'trial'
      when p_new_status = 'active' then 'active'
      when p_new_status in ('expired', 'refunded', 'chargeback') then 'expired'
      else plan
    end,
    trial_ends_at = case
      when p_new_status = 'trialing' and p_trial_ends_at is not null then p_trial_ends_at
      else trial_ends_at
    end,
    first_paid_at = case when p_new_status = 'active' then coalesce(first_paid_at, now()) else first_paid_at end,
    pago_fallido_desde = case
      when p_new_status = 'past_due' then coalesce(pago_fallido_desde, now())
      when p_new_status = 'active' then null
      else pago_fallido_desde
    end
  where id = p_user_id;

  -- (d) ledger económico — clave propia (provider+transaction_id+economic_kind) para que
  -- PURCHASE_APPROVED y PURCHASE_COMPLETE de la misma compra no cuenten doble ingreso.
  if p_transaction_id is not null then
    insert into public.payment_transactions
      (provider, transaction_id, economic_kind, product_id, offer_id, amount_minor, currency, occurred_at, raw_event_id)
    values
      (p_provider, p_transaction_id, p_economic_kind, p_product_id, p_offer_id, p_amount_minor, p_currency, p_occurred_at, p_event_id)
    on conflict (provider, transaction_id, economic_kind) do nothing;
  end if;

  return jsonb_build_object('status', 'applied');
end;
$$;

revoke execute on function public.aplicar_evento_hotmart from anon, authenticated;
