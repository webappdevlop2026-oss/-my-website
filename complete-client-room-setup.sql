-- =========================================================
-- DIGITAL AGENCY CLIENT ROOM - COMPLETE SUPABASE SETUP
-- Run this entire file once in Supabase SQL Editor
-- =========================================================

create extension if not exists pgcrypto;

-- 1) CLIENTS
create table if not exists public.room_clients (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_phone text,
  client_email text,
  client_code text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) PROJECTS
create table if not exists public.room_projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.room_clients(id) on delete cascade,
  project_name text not null,
  project_type text default 'Website',
  status text default 'In Progress',
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  current_stage text,
  notes text,
  preview_url text,
  video_url text,
  project_cost text,
  expected_delivery date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3) CLIENT CORRECTION / FEATURE REQUESTS
create table if not exists public.room_feature_requests (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.room_clients(id) on delete cascade,
  project_id uuid references public.room_projects(id) on delete set null,
  request_text text not null,
  status text not null default 'New',
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4) CLIENT FILES
create table if not exists public.room_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.room_projects(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  storage_path text,
  uploaded_by text default 'client',
  created_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists idx_room_projects_client_id
  on public.room_projects(client_id);

create index if not exists idx_room_requests_client_id
  on public.room_feature_requests(client_id);

create index if not exists idx_room_requests_project_id
  on public.room_feature_requests(project_id);

create index if not exists idx_room_files_project_id
  on public.room_files(project_id);

-- Auto updated_at function
create or replace function public.set_client_room_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_room_clients_updated_at on public.room_clients;
create trigger trg_room_clients_updated_at
before update on public.room_clients
for each row execute function public.set_client_room_updated_at();

drop trigger if exists trg_room_projects_updated_at on public.room_projects;
create trigger trg_room_projects_updated_at
before update on public.room_projects
for each row execute function public.set_client_room_updated_at();

drop trigger if exists trg_room_requests_updated_at on public.room_feature_requests;
create trigger trg_room_requests_updated_at
before update on public.room_feature_requests
for each row execute function public.set_client_room_updated_at();

-- =========================================================
-- ROW LEVEL SECURITY
-- Admin Panel uses logged-in Supabase Auth user.
-- Client Room needs pass-code based read/write access.
-- These policies match the current HTML implementation.
-- =========================================================

alter table public.room_clients enable row level security;
alter table public.room_projects enable row level security;
alter table public.room_feature_requests enable row level security;
alter table public.room_files enable row level security;

-- ADMIN: authenticated users get full access
drop policy if exists "admin full access clients" on public.room_clients;
create policy "admin full access clients"
on public.room_clients
for all
to authenticated
using (true)
with check (true);

drop policy if exists "admin full access projects" on public.room_projects;
create policy "admin full access projects"
on public.room_projects
for all
to authenticated
using (true)
with check (true);

drop policy if exists "admin full access requests" on public.room_feature_requests;
create policy "admin full access requests"
on public.room_feature_requests
for all
to authenticated
using (true)
with check (true);

drop policy if exists "admin full access files" on public.room_files;
create policy "admin full access files"
on public.room_files
for all
to authenticated
using (true)
with check (true);

-- CLIENT ROOM: allow anonymous access for current pass-code flow
-- The client code is checked by the website before project data is shown.
drop policy if exists "anon read active clients" on public.room_clients;
create policy "anon read active clients"
on public.room_clients
for select
to anon
using (is_active = true);

drop policy if exists "anon read projects" on public.room_projects;
create policy "anon read projects"
on public.room_projects
for select
to anon
using (true);

drop policy if exists "anon read requests" on public.room_feature_requests;
create policy "anon read requests"
on public.room_feature_requests
for select
to anon
using (true);

drop policy if exists "anon create requests" on public.room_feature_requests;
create policy "anon create requests"
on public.room_feature_requests
for insert
to anon
with check (true);

drop policy if exists "anon read files" on public.room_files;
create policy "anon read files"
on public.room_files
for select
to anon
using (true);

drop policy if exists "anon create files" on public.room_files;
create policy "anon create files"
on public.room_files
for insert
to anon
with check (true);

-- =========================================================
-- STORAGE BUCKET FOR CLIENT FILES
-- =========================================================

insert into storage.buckets (id, name, public)
values ('client-room-files', 'client-room-files', true)
on conflict (id) do update set public = true;

drop policy if exists "public read client room files" on storage.objects;
create policy "public read client room files"
on storage.objects
for select
to public
using (bucket_id = 'client-room-files');

drop policy if exists "anon upload client room files" on storage.objects;
create policy "anon upload client room files"
on storage.objects
for insert
to anon
with check (bucket_id = 'client-room-files');

drop policy if exists "authenticated manage client room files" on storage.objects;
create policy "authenticated manage client room files"
on storage.objects
for all
to authenticated
using (bucket_id = 'client-room-files')
with check (bucket_id = 'client-room-files');

-- Force PostgREST schema refresh
notify pgrst, 'reload schema';

-- Optional test client:
-- insert into public.room_clients (client_name, client_phone, client_code)
-- values ('Demo Client', '9999999999', 'CR-2026-DEMO1')
-- on conflict (client_code) do nothing;
