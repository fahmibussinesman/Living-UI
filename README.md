# Living UI

**One Visit. One Mutation. · Many Visits. One Head.**

Collective-evolution frontend showcase. The homepage is the **Head of Main** — a version lineage shaped by curated **spells** (token mutations), art-directed **worlds**, and (when wired) community votes.

Live concept: high-fidelity portfolio of UI engineering — not a SaaS, not a random theme toy.

## Stack

- Next.js 16 (App Router) · TypeScript strict · Tailwind CSS v4
- Motion · Zod · Zustand-ready · Vitest
- Supabase schema ready (Auth / Postgres / RLS) · Vercel Hobby
- Local bootstrap uses **in-memory lineage** until Supabase env is set

## Quick start

```bash
# Node >= 20.9 required (fnm recommended)
fnm use 22
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
pnpm test
pnpm lint
pnpm build
```

## Core routes

| Route | Role |
| --- | --- |
| `/` | Collective Head (cinematic Genesis) |
| `/mutate` | Spell studio — preview → commit branch |
| `/evolve` | Head race · vote / favorite proposals |
| `/v/[id]` | Version deep link · propose to Main |
| `/timeline` | Phylogeny spine |
| `/compare?a=&b=` | Before / after |
| `/worlds` | Art direction contracts |
| `/about` | Mythos |
| `/admin` | Head lock / promote / reset (protect before prod) |
| `/og?v=` | Dynamic OG image |

⌘/Ctrl+K opens the command palette.

## Collective evolution (local)

1. Cast a spell on `/mutate` → personal branch  
2. Open `/v/[id]` → **Propose to Main**  
3. Vote on `/evolve` — highest windowed score becomes Head (unless locked)  
4. Return later → “evolved while away” banner if Head shifted  

Persistence: `.data/lineage.json` on local disk (gitignored). On Vercel Hobby without writable FS, state is per-instance memory until Supabase is wired.

## Product DNA

- **Worlds (MVP):** Obsidian Luxury · Japanese Minimal · Neo Brutalism
- **Models:** Creative Portfolio · Product Landing · Digital Museum
- **Spells:** whitelist token patches with compatibility rules
- **MVP rule:** same-world evolution only (no cross-world Head speciation yet)
- See `PRODUCT.md` and `DESIGN.md`

## Architecture (MVP)

```
src/
  app/                 # routes + server actions
  components/
    experience/        # Head ritual + slot experience
    mutate/            # spell studio
    shell/             # dock, chip, command palette
  lib/
    data/genesis.ts    # in-memory lineage store
    mutation/          # spells + engine + tests
    tokens/            # palettes + CSS vars
supabase/migrations/   # production schema
```

## Supabase / Vercel

1. Create Supabase Free project → run `supabase/migrations/20260802000000_living_ui_init.sql`
2. Copy `.env.example` → `.env.local` and fill keys
3. `vercel` link + env (Hobby)
4. Replace in-memory store with RPC-backed repository (Phase 4)

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | ESLint |
| `pnpm test` | Vitest unit tests |
| `pnpm typecheck` | `tsc --noEmit` |

## License

MIT — portfolio / open showcase.
