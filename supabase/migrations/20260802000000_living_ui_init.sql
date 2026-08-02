-- Living UI — Collective Evolution schema (Supabase Free)
-- Wire app to these tables after creating a project; local MVP uses in-memory store.

create extension if not exists "pgcrypto";

create table if not exists public.visitors (
  id uuid primary key default gen_random_uuid(),
  auth_uid uuid unique,
  created_at timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  mutation_window_start timestamptz,
  mutation_window_count int not null default 0
);

create table if not exists public.visual_worlds (
  id text primary key,
  slug text not null unique,
  name text not null,
  config jsonb not null default '{}'::jsonb,
  is_active boolean not null default true
);

create table if not exists public.interface_models (
  id text primary key,
  slug text not null unique,
  name text not null,
  slot_schema jsonb not null default '{}'::jsonb,
  is_active boolean not null default true
);

create table if not exists public.lineages (
  id text primary key default 'main',
  head_version_id uuid,
  genesis_version_id uuid,
  head_locked boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.versions (
  id uuid primary key default gen_random_uuid(),
  version_number bigserial,
  parent_id uuid references public.versions(id),
  lineage_id text not null default 'main' references public.lineages(id),
  world_id text not null references public.visual_worlds(id),
  model_id text not null references public.interface_models(id),
  generation int not null default 0,
  token_snapshot jsonb not null,
  spell_id text,
  spell_label text,
  status text not null check (status in ('genesis','active','proposed','personal','hidden','featured')),
  branch_kind text not null check (branch_kind in ('main','personal')),
  created_by uuid references public.visitors(id),
  created_at timestamptz not null default now(),
  label text not null
);

alter table public.lineages
  drop constraint if exists lineages_head_version_id_fkey;
alter table public.lineages
  add constraint lineages_head_version_id_fkey
  foreign key (head_version_id) references public.versions(id);

alter table public.lineages
  drop constraint if exists lineages_genesis_version_id_fkey;
alter table public.lineages
  add constraint lineages_genesis_version_id_fkey
  foreign key (genesis_version_id) references public.versions(id);

create table if not exists public.mutations (
  id uuid primary key default gen_random_uuid(),
  version_id uuid not null unique references public.versions(id) on delete cascade,
  parent_version_id uuid not null references public.versions(id),
  category text not null,
  spell_id text not null,
  prev_value jsonb,
  next_value jsonb,
  visitor_id uuid references public.visitors(id),
  created_at timestamptz not null default now()
);

create table if not exists public.mutation_rules (
  id uuid primary key default gen_random_uuid(),
  world_id text references public.visual_worlds(id),
  rule_type text not null,
  payload jsonb not null default '{}'::jsonb,
  enabled boolean not null default true
);

create table if not exists public.votes (
  visitor_id uuid not null references public.visitors(id) on delete cascade,
  version_id uuid not null references public.versions(id) on delete cascade,
  value smallint not null check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  primary key (visitor_id, version_id)
);

create table if not exists public.favorites (
  visitor_id uuid not null references public.visitors(id) on delete cascade,
  version_id uuid not null references public.versions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (visitor_id, version_id)
);

create table if not exists public.admin_actions (
  id uuid primary key default gen_random_uuid(),
  admin_uid uuid not null,
  action text not null,
  target_type text not null,
  target_id text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.rate_limits (
  key text not null,
  window_start timestamptz not null,
  count int not null default 0,
  primary key (key, window_start)
);

create index if not exists versions_parent_idx on public.versions(parent_id);
create index if not exists versions_created_idx on public.versions(created_at desc);
create index if not exists versions_status_idx on public.versions(status);
create index if not exists votes_version_idx on public.votes(version_id);

alter table public.visitors enable row level security;
alter table public.versions enable row level security;
alter table public.mutations enable row level security;
alter table public.votes enable row level security;
alter table public.favorites enable row level security;
alter table public.visual_worlds enable row level security;
alter table public.interface_models enable row level security;
alter table public.lineages enable row level security;
alter table public.admin_actions enable row level security;

create policy "worlds_public_read" on public.visual_worlds
  for select using (is_active = true);

create policy "models_public_read" on public.interface_models
  for select using (is_active = true);

create policy "versions_public_read" on public.versions
  for select using (status in ('genesis','active','proposed','featured','personal'));

create policy "lineages_public_read" on public.lineages
  for select using (true);

-- Writes go through security definer RPCs only (commit_spell, cast_vote, etc.)
