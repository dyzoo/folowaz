create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  full_name text,
  instagram_username text,
  language text not null default 'sw',
  created_at timestamptz not null default now()
);

create table if not exists public.growth_settings (
  user_id uuid primary key references public.users(id) on delete cascade,
  niche text,
  target_locations text[] not null default '{}',
  age_min int not null default 18,
  age_max int not null default 45,
  genders text[] not null default '{}',
  languages text[] not null default '{}',
  interests text[] not null default '{}',
  hashtags text[] not null default '{}',
  daily_limit int not null default 100,
  status text not null default 'paused',
  updated_at timestamptz not null default now()
);

create table if not exists public.analytics_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  recorded_on date not null default current_date,
  followers int not null default 0,
  following int not null default 0,
  likes int not null default 0,
  comments int not null default 0,
  reach int not null default 0,
  profile_views int not null default 0,
  unique (user_id, recorded_on)
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  plan text not null,
  status text not null default 'inactive',
  noripesa_reference text,
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  merchant_reference text not null unique,
  noripesa_reference text unique,
  payment_method text not null default 'mobile',
  phone text,
  checkout_url text,
  plan text not null,
  amount int not null,
  currency text not null default 'TZS',
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  subject text not null,
  message text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create index if not exists analytics_user_date_idx on public.analytics_snapshots (user_id, recorded_on);
create index if not exists orders_user_idx on public.orders (user_id, created_at desc);
