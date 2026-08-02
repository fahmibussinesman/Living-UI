# Design

<!-- impeccable:design-schema 1 -->

## Mode

Experience (artifact-first). Shell recedes; Head is the product.

## Tagline

One Visit. One Mutation. · Many Visits. One Head.

## Worlds (MVP)

### Obsidian Luxury — Genesis default

- Canvas: `#0a0a0b` void; surfaces via value steps, not shadows
- Type: display serif whisper/monument (DM Serif Display) + Geist UI + mono labels
- Chromatic: single voltage (Iris `#847dff` or Crimson `#fc1c46`) — rare
- Material: matte, flat, no glass blur
- Motion: cinematic ease-out, slow rare entrances; hover = opacity/2px lift
- Nav: floating dock monochrome
- Banned: multi-accent, heavy grain always-on, soft clay, rainbow mesh

### Japanese Minimal

- Canvas: `#f7f7f5`; cards `#ffffff`; text `#1a1a1a`
- Type: geometric sans only; modest scale; generous `ma`
- Accent: one bookmark coral/ink
- Material: soft 12px radius; elevation via surface step
- Motion: ≤200ms opacity; no bounce
- Banned: glitch, neon, glass blur, monument condensed type

### Neo Brutalism

- Canvas: paper/onyx dual; Graphite text; Ember `#ff6436` punctuation only
- Type: condensed monument (Bebas Neue/Oswald) + mid grotesque 500 + mono meta
- Material: radius 0 cards, hairline borders, flat
- Motion: weighted `(0.32, 0.72, 0, 1)`; hard cuts ok
- Banned: frosted glass, multi-hue, luxury whisper serif as body

## Interface Models (MVP)

Shared slots: Hero, Proof, Gallery, Detail, CTA.  
Layouts vary by tokens (`hero.layout`: split | stacked | editorial | monument).

1. Creative Portfolio  
2. Product Landing  
3. Digital Museum  

## Spells (named mutations)

Categories: palette, typography, layout, navigation, material, motion.  
Each spell maps to enum token paths only. See `src/lib/mutation/spells.ts`.

## Compatibility (enforced)

- Minimal ⊕ glass/glitch/mesh-heavy → reject  
- Brutal ⊕ soft glass → reject  
- Obsidian ⊕ multi-accent → reject  
- `prefers-reduced-motion` → clamp motion to still|subtle  
- MVP: propose only same world as Head  

## Motion budget

- UI chrome < 250ms ease-out  
- First-paint ritual 300–800ms (skip if reduced-motion)  
- Animate transform/opacity only on hot paths  
- No scale(0); no ease-in on UI; no keyboard animation  

## Shell

Living Dock + version/generation chip + command palette (⌘K) + mutation meter.

## Performance

LCP-critical: tokens + type + one motif. Lazy world ornaments. No WebGL MVP.
