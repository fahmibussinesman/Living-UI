# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: Next.js 16 App Router, TypeScript strict, Tailwind CSS v4, Motion, Zod, Zustand (draft only), Supabase (Auth anon + Postgres + RPC), Vercel Hobby. Single app (no monorepo). shadcn primitives only when needed — not default skin.

## Users

Primary: hiring managers, design engineers, creative directors evaluating frontend craft.
Secondary: open-source frontend community and vibe-coding practitioners.

Job: experience a high-fidelity interface that evolves, then leave a curated mark and share proof of craft.

## Product Purpose

Living UI is a collective-evolution frontend showcase. The public homepage is the **Head of Main** — the community-selected tip of a version lineage. Visitors may cast one curated **spell** (token mutation) onto a personal branch, optionally propose it to Main, and vote. Success = awe on first paint, clear art direction per world, and a shareable evolutionary trail — not SaaS conversion.

## Positioning

**One Visit. One Mutation. Many Visits. One Head.**

Not a theme customizer, not a component gallery, not random skins. A living species of UI with whitelist spells, compatibility rules, and a vote-driven head.

## Core Loop

1. Land on `/` → cinematic Head (collective reality)
2. Understand generation + spell path that built Head
3. Mutate via named spells (preview → validate → commit branch)
4. Optionally propose to Main (scarce)
5. Community votes → Head may shift
6. Return → “evolved while away” + compare

## Constraints

- Free Vercel Hobby + Supabase Free only
- No raw visitor CSS/JS/HTML
- MVP mutations same-world as Head only
- Anonymous auth; admin via email allowlist
- Reduced-motion and keyboard access required
- No WebGL in MVP

## Terminology

- **World** — art direction system (Obsidian Luxury, Japanese Minimal, Neo Brutalism)
- **Model** — interface structure (Creative Portfolio, Product Landing, Digital Museum)
- **Spell** — named, whitelist mutation
- **Head** — version served at `/`
- **Branch** — personal version chain
- **Proposal** — branch version entered into Head race
- **Generation** — depth from Genesis

## Accessibility

Keyboard-complete shell, focus management, `prefers-reduced-motion`, body contrast never pure white on pure black for long text, custom cursor decorative only (off on touch / reduced motion).

## Out of Scope (MVP)

WebGL, multiplayer cursors, AI-generated styles, screenshot storage, cross-world Head speciation, monorepo packages, full force-directed tree explorer.
