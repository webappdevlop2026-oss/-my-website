-- ============================================================
-- Digital Agency by Chandan Das — Supabase Backend Schema
-- Run this entire file once in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Contact form enquiries (from index.html #contactForm)
create table if not exists enquiries (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  name text not null,
  mobile text not null,
  service text,
  message text
);

-- 2. Free consultation popup (from index.html consultPopup)
create table if not exists consultations (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  name text not null,
  mobile text not null,
  service text,
  budget text
);

-- 3. Billing software requests
create table if not exists billing_requests (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  name text not null,
  mobile text not null,
  shop text,
  type text,
  address text,
  status text default 'pending'
);

-- 4. Partner applications
create table if not exists partner_applications (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  name text not null,
  mobile text not null,
  area text,
  upi text,
  job text,
  how text,
  status text default 'pending',
  partner_id text
);

-- 5. Clients submitted by partners
create table if not exists partner_clients (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  partner_app_id bigint references partner_applications(id) on delete set null,
  partner_name text,
  partner_id_code text,
  partner_mobile text,
  client_name text,
  client_mobile text,
  address text,
  service text,
  budget text,
  status text default 'pending'
);

-- 6. Portfolio items
create table if not exists portfolio (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  title text not null,
  tag text,
  link text,
  image text,
  description text
);

-- 7. Coupons
create table if not exists coupons (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  code text not null,
  type text,
  value text,
  active boolean default true,
  note text
);

-- 8. Payments / UTR verification
create table if not exists payments (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  name text not null,
  mobile text,
  amount text,
  utr text,
  status text default 'pending',
  note text
);

-- 9. Website update notifications
create table if not exists updates (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  title text not null,
  message text,
  link text,
  active boolean default true,
  emoji text default '🔔'
);

-- 10. Tool requests (from tools.html)
create table if not exists tool_requests (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  name text not null,
  mobile text,
  tool_name text,
  message text,
  status text default 'pending'
);

-- 11. Site-wide settings (single row, id = 1)
create table if not exists site_settings (
  id int primary key default 1,
  offer text,
  price text,
  whatsapp text,
  call text,
  constraint single_row check (id = 1)
);
insert into site_settings (id) values (1) on conflict (id) do nothing;

-- ============================================================
-- Row Level Security — locked down to a real admin login
-- ============================================================
-- The admin panel now uses Supabase Auth (email + password).
-- Only a signed-in user can read/write admin data. The public
-- website (no login) can only: submit enquiries/consultations,
-- read site_settings (for the WhatsApp/call numbers), and read
-- *active* rows from `updates` (for the notification bar).
-- Everything else is admin-only.
--
-- Create your admin login in Supabase Dashboard →
-- Authentication → Users → Add User (webappdevlop2026@gmail.com
-- + a password only you know). Do this before relying on the
-- admin panel, otherwise no one can log in.
-- ============================================================

alter table enquiries enable row level security;
alter table consultations enable row level security;
alter table billing_requests enable row level security;
alter table partner_applications enable row level security;
alter table partner_clients enable row level security;
alter table portfolio enable row level security;
alter table coupons enable row level security;
alter table payments enable row level security;
alter table updates enable row level security;
alter table tool_requests enable row level security;
alter table site_settings enable row level security;

-- Drop old fully-open policies if they exist (from the first version of this script)
do $$
declare
  t text;
begin
  for t in select unnest(array[
    'enquiries','consultations','billing_requests','partner_applications',
    'partner_clients','portfolio','coupons','payments','updates',
    'tool_requests','site_settings'
  ])
  loop
    execute format('drop policy if exists "allow_all_anon" on %I;', t);
  end loop;
end $$;

-- Admin (any logged-in user) gets full access to every table
do $$
declare
  t text;
begin
  for t in select unnest(array[
    'enquiries','consultations','billing_requests','partner_applications',
    'partner_clients','portfolio','coupons','payments','updates',
    'tool_requests','site_settings'
  ])
  loop
    execute format('drop policy if exists "admin_full_access" on %I;', t);
    execute format(
      'create policy "admin_full_access" on %I for all to authenticated using (true) with check (true);',
      t
    );
  end loop;
end $$;

-- Public: contact form + consultation popup can insert (but not read/edit/delete)
drop policy if exists "public_insert" on enquiries;
create policy "public_insert" on enquiries for insert to anon with check (true);

drop policy if exists "public_insert" on consultations;
create policy "public_insert" on consultations for insert to anon with check (true);

-- Public: site settings (WhatsApp/call numbers) must be readable by the live site
drop policy if exists "public_select" on site_settings;
create policy "public_select" on site_settings for select to anon using (true);

-- Public: only *active* updates are visible for the notification bar
drop policy if exists "public_select_active" on updates;
create policy "public_select_active" on updates for select to anon using (active = true);
