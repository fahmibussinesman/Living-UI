-- Seed worlds/models/genesis + score columns + text visitor/version ids

alter table public.versions
  add column if not exists votes_up int not null default 0,
  add column if not exists votes_down int not null default 0,
  add column if not exists favorites_count int not null default 0,
  add column if not exists score double precision not null default 0;

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

-- Convert visitor/version ids to text for cookie-based visitors and v-* branch ids.
-- Drop FKs first, alter types, recreate FKs.

alter table public.versions drop constraint if exists versions_created_by_fkey;
alter table public.versions drop constraint if exists versions_parent_id_fkey;
alter table public.mutations drop constraint if exists mutations_version_id_fkey;
alter table public.mutations drop constraint if exists mutations_parent_version_id_fkey;
alter table public.mutations drop constraint if exists mutations_visitor_id_fkey;
alter table public.votes drop constraint if exists votes_visitor_id_fkey;
alter table public.votes drop constraint if exists votes_version_id_fkey;
alter table public.favorites drop constraint if exists favorites_visitor_id_fkey;
alter table public.favorites drop constraint if exists favorites_version_id_fkey;
alter table public.lineages drop constraint if exists lineages_head_version_id_fkey;
alter table public.lineages drop constraint if exists lineages_genesis_version_id_fkey;

alter table public.visitors
  alter column id type text using id::text;

alter table public.versions
  alter column id type text using id::text,
  alter column parent_id type text using parent_id::text,
  alter column created_by type text using created_by::text;

alter table public.lineages
  alter column head_version_id type text using head_version_id::text,
  alter column genesis_version_id type text using genesis_version_id::text;

alter table public.mutations
  alter column version_id type text using version_id::text,
  alter column parent_version_id type text using parent_version_id::text,
  alter column visitor_id type text using visitor_id::text;

alter table public.votes
  alter column visitor_id type text using visitor_id::text,
  alter column version_id type text using version_id::text;

alter table public.favorites
  alter column visitor_id type text using visitor_id::text,
  alter column version_id type text using version_id::text;

alter table public.versions
  add constraint versions_parent_id_fkey
  foreign key (parent_id) references public.versions(id);

alter table public.versions
  add constraint versions_created_by_fkey
  foreign key (created_by) references public.visitors(id);

alter table public.lineages
  add constraint lineages_head_version_id_fkey
  foreign key (head_version_id) references public.versions(id);

alter table public.lineages
  add constraint lineages_genesis_version_id_fkey
  foreign key (genesis_version_id) references public.versions(id);

alter table public.mutations
  add constraint mutations_version_id_fkey
  foreign key (version_id) references public.versions(id) on delete cascade;

alter table public.mutations
  add constraint mutations_parent_version_id_fkey
  foreign key (parent_version_id) references public.versions(id);

alter table public.mutations
  add constraint mutations_visitor_id_fkey
  foreign key (visitor_id) references public.visitors(id);

alter table public.votes
  add constraint votes_visitor_id_fkey
  foreign key (visitor_id) references public.visitors(id) on delete cascade;

alter table public.votes
  add constraint votes_version_id_fkey
  foreign key (version_id) references public.versions(id) on delete cascade;

alter table public.favorites
  add constraint favorites_visitor_id_fkey
  foreign key (visitor_id) references public.visitors(id) on delete cascade;

alter table public.favorites
  add constraint favorites_version_id_fkey
  foreign key (version_id) references public.versions(id) on delete cascade;

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
