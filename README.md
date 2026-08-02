# Living UI

**One Visit. One Mutation. · Many Visits. One Head.**

Collective-evolution frontend showcase. `/` always serves the **Head of Main** — a version lineage shaped by curated **spells**, art-directed **worlds**, and community votes.

[![CI](https://github.com/fahmibussinesman/Living-UI/actions/workflows/ci.yml/badge.svg)](https://github.com/fahmibussinesman/Living-UI/actions/workflows/ci.yml)

## Quick start

```bash
fnm use 22          # Node >= 20.9
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
pnpm test && pnpm typecheck && pnpm lint && pnpm build
```

## Demo loop

1. `/` — cinematic Genesis Head (Obsidian × Portfolio)
2. `/mutate` — cast a whitelist **spell**, preview, commit personal branch
3. `/v/[id]` — **Propose to Main** · vote · favorite
4. `/evolve` — Head race leaderboard (score elects Head unless locked)
5. Return later — “evolved while away” if Head shifted
6. `/admin` — lock / promote / recompute / reset (protect in prod)

⌘/Ctrl+K command palette.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 App Router · React 19 · TS strict |
| Style | Tailwind CSS v4 · CSS variables per world |
| Motion | `motion` + reduced-motion clamps |
| Validation | Zod |
| Data | File store (local) **or** Supabase when env set |
| Deploy | Vercel Hobby |

## Routes

| Route | Role |
| --- | --- |
| `/` | Collective Head |
| `/mutate` | Spell studio |
| `/evolve` | Head race |
| `/v/[id]` | Version + OG |
| `/timeline` | Phylogeny |
| `/compare?a=&b=` | Before / after |
| `/worlds` | Art direction contracts |
| `/about` | Mythos |
| `/admin` | Head controls |
| `/og?v=` | Dynamic OG image |

## Architecture

```
src/
  app/                 routes + server actions + OG
  components/
    experience/        Head ritual, reveal, slot UI
    mutate/            spell studio
    shell/             dock, chip, command palette
    version/           vote bar
  lib/
    data/              repo (Supabase | file store)
    mutation/          spells + engine + tests
    tokens/            palettes + CSS vars
    supabase/          client helpers
supabase/migrations/   schema + seed
```

`lib/data/repo.ts` is the single entry: uses Supabase when `NEXT_PUBLIC_SUPABASE_URL` + key exist, else `.data/lineage.json`.

## Supabase setup (production multi-instance)

1. Create Supabase Free project  
2. SQL Editor → run in order:
   - `supabase/migrations/20260802000000_living_ui_init.sql`
   - `supabase/migrations/20260802000001_seed_and_score_columns.sql`
3. Copy project URL + **service role** key into Vercel env (server writes)
4. Also set `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Without Supabase on Vercel, lineage is **per-instance memory** (fine for visual demo, not collective truth).

## Worlds (MVP)

| World | Signature |
| --- | --- |
| Obsidian Luxury | Void, monument type, one voltage accent |
| Japanese Minimal | Ma, quiet scale, one bookmark |
| Neo Brutalism | Condensed monument, ember punctuation, sharp |

**Same-world Head evolution only** in MVP.

## Docs

- `PRODUCT.md` — product contract  
- `DESIGN.md` — visual / motion rules  
- `CONTRIBUTING.md` — contributor guide  

## License

MIT
