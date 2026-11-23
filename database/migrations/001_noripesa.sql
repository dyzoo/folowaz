alter table public.subscriptions
  add column if not exists noripesa_reference text;

alter table public.orders
  add column if not exists merchant_reference text,
  add column if not exists noripesa_reference text,
  add column if not exists payment_method text not null default 'mobile',
  add column if not exists phone text,
  add column if not exists checkout_url text,
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'orders' and column_name = 'stripe_session_id'
  ) then
    execute 'update public.orders set merchant_reference = stripe_session_id where merchant_reference is null and stripe_session_id is not null';
    execute 'update public.orders set noripesa_reference = stripe_session_id where noripesa_reference is null and stripe_session_id is not null';
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'subscriptions' and column_name = 'stripe_subscription_id'
  ) then
    execute 'update public.subscriptions set noripesa_reference = stripe_subscription_id where noripesa_reference is null and stripe_subscription_id is not null';
  end if;
end $$;

create unique index if not exists orders_merchant_reference_idx on public.orders (merchant_reference);
create unique index if not exists orders_noripesa_reference_idx on public.orders (noripesa_reference);
create index if not exists subscriptions_noripesa_reference_idx on public.subscriptions (noripesa_reference);
