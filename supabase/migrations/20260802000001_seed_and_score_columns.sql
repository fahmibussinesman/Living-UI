-- Seed worlds/models/genesis + score columns for Living UI

alter table public.versions
  add column if not exists votes_up int not null default 0,
  add column if not exists votes_down int not null default 0,
  add column if not exists favorites_count int not null default 0,
  add column if not exists score double precision not null default 0;

-- Allow string ids for local/demo genesis (text ids)
-- If versions.id is uuid, we keep uuid and use fixed genesis uuid below.
-- For flexible demo ids, convert id columns to text when needed:

do $$
begin
  -- no-op if already text; skip hard alter on production uuid setups
  null;
end $$;

insert into public.visual_worlds (id, slug, name, config, is_active)
values
  ('obsidian', 'obsidian', 'Obsidian Luxury', '{"motion":"cinematic"}'::jsonb, true),
  ('minimal', 'minimal', 'Japanese Minimal', '{"motion":"subtle"}'::jsonb, true),
  ('brutal', 'brutal', 'Neo Brutalism', '{"motion":"weighted"}'::jsonb, true)
on conflict (id) do update set name = excluded.name, is_active = true;

insert into public.interface_models (id, slug, name, slot_schema, is_active)
values
  ('portfolio', 'portfolio', 'Creative Portfolio', '{"slots":["hero","proof","gallery","cta"]}'::jsonb, true),
  ('landing', 'landing', 'Product Landing', '{"slots":["hero","proof","gallery","cta"]}'::jsonb, true),
  ('museum', 'museum', 'Digital Museum', '{"slots":["hero","proof","gallery","cta"]}'::jsonb, true)
on conflict (id) do update set name = excluded.name, is_active = true;

insert into public.lineages (id, head_locked)
values ('main', false)
on conflict (id) do nothing;

-- Visitors use text id for cookie-based anon visitors
alter table public.visitors alter column id type text using id::text;

-- Votes/favorites visitor_id to text if needed
do $$
begin
  alter table public.votes alter column visitor_id type text using visitor_id::text;
exception when others then null;
end $$;

do $$
begin
  alter table public.favorites alter column visitor_id type text using visitor_id::text;
exception when others then null;
end $$;

-- Prefer text version ids for spell branches (v-...)
do $$
begin
  alter table public.versions alter column id type text using id::text;
  alter table public.versions alter column parent_id type text using parent_id::text;
  alter table public.lineages alter column head_version_id type text using head_version_id::text;
  alter table public.lineages alter column genesis_version_id type text using genesis_version_id::text;
  alter table public.votes alter column version_id type text using version_id::text;
  alter table public.favorites alter column version_id type text using version_id::text;
  alter table public.mutations alter column version_id type text using version_id::text;
  alter table public.mutations alter column parent_version_id type text using parent_version_id::text;
exception when others then
  raise notice 'id type alter skipped: %', sqlerrm;
end $$;

insert into public.versions (
  id, parent_id, lineage_id, world_id, model_id, generation,
  token_snapshot, spell_id, spell_label, status, branch_kind,
  created_at, label, votes_up, votes_down, favorites_count, score
) values (
  'v-genesis',
  null,
  'main',
  'obsidian',
  'portfolio',
  0,
  '{
    "world":"obsidian",
    "model":"portfolio",
    "palette":"obsidian-iris",
    "typography":"dramatic",
    "heroLayout":"monument",
    "navigation":"dock",
    "material":"flat",
    "motion":"cinematic"
  }'::jsonb,
  null,
  null,
  'genesis',
  'main',
  '2026-08-02T00:00:00.000Z',
  'Genesis · Obsidian Portfolio',
  0, 0, 0, 0.5
)
on conflict (id) do update set
  token_snapshot = excluded.token_snapshot,
  label = excluded.label,
  status = 'genesis';

update public.lineages
set
  head_version_id = 'v-genesis',
  genesis_version_id = 'v-genesis',
  updated_at = now()
where id = 'main';

-- Public write policies for service role only; anon reads already set.
-- Service role bypasses RLS.
