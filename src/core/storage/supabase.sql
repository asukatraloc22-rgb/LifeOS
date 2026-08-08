-- LifeOS v2 — Supabase schema
-- Run this once in the Supabase SQL editor (Database > SQL Editor > New query).

create table if not exists kv_store (
  user_id uuid not null references auth.users(id) on delete cascade,
  key text not null,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

alter table kv_store enable row level security;

create policy "Users can read their own data"
  on kv_store for select
  using (auth.uid() = user_id);

create policy "Users can write their own data"
  on kv_store for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own data"
  on kv_store for update
  using (auth.uid() = user_id);

create policy "Users can delete their own data"
  on kv_store for delete
  using (auth.uid() = user_id);
