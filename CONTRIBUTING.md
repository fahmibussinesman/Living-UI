# Contributing to Living UI

## Setup

```bash
fnm use 22
pnpm install
pnpm dev
```

Node `>=20.9` required.

## Principles

1. **Spells, not free CSS** — mutations are whitelist token patches only.
2. **Same-world MVP** — proposals must match Head world.
3. **Art direction over effects** — one motion motif per world.
4. **Reduced-motion is first-class** — never ship motion-only meaning.
5. **Free-tier honest** — no Storage screenshots, no always-on WebGL.

## Scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Local server |
| `pnpm test` | Unit tests (mutation + scoring) |
| `pnpm typecheck` | TypeScript |
| `pnpm lint` | ESLint |
| `pnpm build` | Production build |

## Branch / commit

Conventional commits: `feat:`, `fix:`, `docs:`, `chore:`.

## Supabase (optional)

1. Create Free project
2. Run SQL in `supabase/migrations/` (init then seed)
3. Set env from `.env.example`
4. App auto-switches via `isSupabaseConfigured()`
