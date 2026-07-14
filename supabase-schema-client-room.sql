-- ============================================================
-- CLIENT ROOM — Full portal schema
-- Run this once in Supabase → SQL Editor
-- Powers client-room.html
--
-- One "Client Card" (unique code, e.g. CR-2026-KKB01) can be linked
-- to MULTIPLE projects. Client enters the code and sees everything:
-- project status, feature requests, and shared files.
-- ============================================================

-- 1) CLIENTS — one row per client, one unique code per client (the "card")
create table if not exists room_clients (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  client_code text unique not null,   -- e.g. CR-2026-KKB01 — printed on the invite card
  client_name text not null,
  client_phone text,
  notes text                          -- private notes about the client (only you see this via Table Editor)
);

-- 2) PROJECTS — a client can have many
create table if not exists room_projects (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  client_id bigint not null references room_clients(id) on delete cascade,
  project_name text not null,               -- e.g. "Kakabau Marketplace App"
  status text default 'In Progress',        -- Enquiry / Advance Paid / In Progress / Testing / Delivered / On Hold
  progress_percent int default 0,
  current_stage text,
  notes text,                               -- update note shown to the client
  expected_delivery date
);

-- 3) FEATURE REQUESTS — client can ask for new features / changes
create table if not exists room_feature_requests (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  client_id bigint not null references room_clients(id) on delete cascade,
  project_id bigint references room_projects(id) on delete cascade,
  request_text text not null,
  status text default 'New'                 -- New / Reviewing / Approved / In Progress / Done / Rejected
);

-- 4) FILES — shared documents (both you and the client can upload)
create table if not exists room_files (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  project_id bigint not null references room_projects(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  storage_path text not null,
  uploaded_by text default 'admin'          -- 'admin' or 'client'
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table room_clients enable row level security;
alter table room_projects enable row level security;
alter table room_feature_requests enable row level security;
alter table room_files enable row level security;

-- room_clients: public can look up their own record by code (app filters with .eq)
create policy "Public can view room clients" on room_clients for select to anon using (true);
create policy "Authenticated manage room clients" on room_clients for all to authenticated using (true) with check (true);

-- room_projects: public can view; only you (logged in) can add/edit
create policy "Public can view room projects" on room_projects for select to anon using (true);
create policy "Authenticated manage room projects" on room_projects for all to authenticated using (true) with check (true);

-- room_feature_requests: public can view + submit new requests; only you update status
create policy "Public can view feature requests" on room_feature_requests for select to anon using (true);
create policy "Public can submit feature requests" on room_feature_requests for insert to anon with check (true);
create policy "Authenticated manage feature requests" on room_feature_requests for all to authenticated using (true) with check (true);

-- room_files: public can view + upload; only you delete
create policy "Public can view room files" on room_files for select to anon using (true);
create policy "Public can upload room files" on room_files for insert to anon with check (true);
create policy "Authenticated manage room files" on room_files for all to authenticated using (true) with check (true);

-- Keep updated_at fresh on room_projects
create or replace function set_room_project_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_room_projects_updated_at on room_projects;
create trigger trg_room_projects_updated_at
before update on room_projects
for each row execute function set_room_project_updated_at();

-- ============================================================
-- STORAGE — bucket for shared files
-- Do this part from Supabase Dashboard → Storage → "New bucket":
--   Name: client-room-files
--   Public bucket: ON  (so download links work directly)
-- Then run the policies below in SQL Editor:
-- ============================================================
insert into storage.buckets (id, name, public)
values ('client-room-files', 'client-room-files', true)
on conflict (id) do nothing;

create policy "Public can upload to client-room-files"
on storage.objects for insert to anon
with check (bucket_id = 'client-room-files');

create policy "Public can view client-room-files"
on storage.objects for select to anon
using (bucket_id = 'client-room-files');

create policy "Authenticated can delete client-room-files"
on storage.objects for delete to authenticated
using (bucket_id = 'client-room-files');

-- ============================================================
-- EXAMPLE DATA (delete/edit after testing)
-- ============================================================
-- insert into room_clients (client_code, client_name, client_phone)
-- values ('CR-2026-KKB01', 'Test Client', '9876543210');
--
-- insert into room_projects (client_id, project_name, status, progress_percent, current_stage, notes, expected_delivery)
-- values (1, 'Kakabau Marketplace App', 'In Progress', 45, 'Vendor App UI Design', 'User App login screen completed.', '2026-09-30');
