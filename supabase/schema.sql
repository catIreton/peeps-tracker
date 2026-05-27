-- Run this in your Supabase SQL editor (Dashboard → SQL Editor)

create table groups (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  tier text check (tier in ('gold', 'green', 'white')) not null default 'green',
  target_days integer not null default 30,
  sort_order integer not null default 0,
  created_at timestamptz default now()
);

create table people (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  group_id uuid references groups(id) on delete cascade not null,
  name text not null,
  last_contact date,
  notes text,
  created_at timestamptz default now()
);

-- Row Level Security: each user only sees their own data
alter table groups enable row level security;
alter table people enable row level security;

create policy "own groups" on groups for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own people" on people for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
