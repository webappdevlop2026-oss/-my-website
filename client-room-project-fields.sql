-- Run once in Supabase SQL Editor
alter table room_projects add column if not exists project_type text default 'Website';
alter table room_projects add column if not exists preview_url text;
alter table room_projects add column if not exists video_url text;
alter table room_projects add column if not exists project_cost text;

-- Admin must use a Supabase Auth email/password account.
-- Create it from Supabase Dashboard → Authentication → Users → Add User.
