-- ============================================================
-- Store Product Demo Links table
-- Run this once in Supabase → SQL Editor
-- Lets you set/edit each store.html product's "Live Demo" link
-- from the Admin Panel (agency-control-2026.html), and store.html
-- reads it so the "👁 Live Demo" button opens the real project.
-- ============================================================

create table if not exists store_demo_links (
  product_id bigint primary key,
  demo_url text,
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table store_demo_links enable row level security;

-- Anyone visiting store.html can READ demo links (needed to open Live Demo)
create policy "Public can view demo links"
on store_demo_links for select
to anon
using (true);

-- Only logged-in admin (agency-control-2026.html) can INSERT a new link
create policy "Authenticated can insert demo links"
on store_demo_links for insert
to authenticated
with check (true);

-- Only logged-in admin can UPDATE an existing link
create policy "Authenticated can update demo links"
on store_demo_links for update
to authenticated
using (true);
