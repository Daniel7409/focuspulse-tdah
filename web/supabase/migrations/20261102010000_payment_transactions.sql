-- ══════════════════════════════════════════════════════════════
-- Panel de administración: tabla de ventas reales (gráfico semanal).
-- Hoy queda vacía — se llena sola en cuanto el aviso automático de pago
-- de Hotmart quede conectado (18-VENTA-HOTMART.md). El panel ya la lee.
-- ══════════════════════════════════════════════════════════════

create table public.payment_transactions (
  provider                 text not null,
  transaction_id           text not null,
  economic_kind            text not null check (economic_kind in ('sale','refund','chargeback')),
  product_id                text not null,
  offer_id                  text,
  amount_minor              bigint not null,
  currency                  text not null check (currency ~ '^[A-Z]{3}$'),
  settlement_amount_minor   bigint,
  settlement_currency       text,
  provider_fee_minor        bigint,
  affiliate_fee_minor       bigint,
  tax_minor                 bigint,
  occurred_at                timestamptz not null,
  raw_event_id               text not null,
  creado_en                  timestamptz not null default now(),
  primary key (provider, transaction_id, economic_kind)
);

create index payment_transactions_occurred_idx on public.payment_transactions (occurred_at desc);

-- Mismo patrón que error_log/eventos: RLS activo SIN políticas de cliente —
-- solo el servidor (clave secreta, al procesar el webhook) escribe, y solo
-- el panel de admin lee.
alter table public.payment_transactions enable row level security;
