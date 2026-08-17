-- ============================================================
-- Ready-Made Website Store — Orders table
-- Run this once in Supabase → SQL Editor
-- (Your existing supabase-schema.sql file got accidentally saved
--  with the same content as supabase-client.js, so this is a
--  fresh, separate script just for the new Store feature.)
-- ============================================================

create table if not exists store_orders (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  product_name text not null,
  product_price numeric,
  customer_name text not null,
  customer_mobile text not null,
  customer_email text,
  notes text,
  status text default 'New'
);

-- Enable Row Level Security
alter table store_orders enable row level security;

-- Anyone visiting the website can INSERT an order (the Buy Now form)
create policy "Public can insert store orders"
on store_orders for insert
to anon
with check (true);

-- Only logged-in admin (agency-control-2026.html) can VIEW orders
create policy "Authenticated can view store orders"
on store_orders for select
to authenticated
using (true);

-- Only logged-in admin can UPDATE status (e.g. New -> Contacted -> Paid)
create policy "Authenticated can update store orders"
on store_orders for update
to authenticated
using (true);

-- Only logged-in admin can DELETE / clear orders
create policy "Authenticated can delete store orders"
on store_orders for delete
to authenticated
using (true);

-- NOTE: If your other tables (enquiries, billing_requests, etc.) use
-- different policy names/roles, open one of them in Supabase →
-- Authentication → Policies and compare, just to keep things consistent.
