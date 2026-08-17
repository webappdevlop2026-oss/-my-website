-- Run once in Supabase SQL Editor

alter table room_projects add column if not exists project_type text default 'Website';
alter table room_projects add column if not exists preview_url text;
alter table room_projects add column if not exists video_url text;
alter table room_projects add column if not exists project_cost text;
alter table room_projects add column if not exists expected_delivery date;
alter table room_projects add column if not exists updated_at timestamptz default now();

create or replace function set_room_projects_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_room_projects_updated_at on room_projects;
create trigger trg_room_projects_updated_at
before update on room_projects
for each row execute function set_room_projects_updated_at();

alter table room_feature_requests add column if not exists status text default 'New';
