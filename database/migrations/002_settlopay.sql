alter table public.subscriptions
  add column if not exists settlo_payment_id text;

alter table public.orders
  add column if not exists settlo_payment_id text;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'subscriptions' and column_name = 'noripesa_reference'
  ) then
    execute 'update public.subscriptions set settlo_payment_id = noripesa_reference where settlo_payment_id is null and noripesa_reference is not null';
    execute 'alter table public.subscriptions drop column noripesa_reference';
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'orders' and column_name = 'noripesa_reference'
  ) then
    execute 'update public.orders set settlo_payment_id = noripesa_reference where settlo_payment_id is null and noripesa_reference is not null';
    execute 'alter table public.orders drop column noripesa_reference';
  end if;
end $$;

drop index if exists public.orders_noripesa_reference_idx;
drop index if exists public.subscriptions_noripesa_reference_idx;

create unique index if not exists orders_settlo_payment_id_idx on public.orders (settlo_payment_id);
create index if not exists subscriptions_settlo_payment_id_idx on public.subscriptions (settlo_payment_id);
