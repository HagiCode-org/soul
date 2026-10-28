# Soul

[![last commit](https://img.shields.io/github/last-commit/HagiCode-org/soul)](https://github.com/HagiCode-org/soul/commits/main)
[![website](https://img.shields.io/website?url=https%3A%2F%2Fsoul.hagicode.com%2F&label=website)](https://soul.hagicode.com/)

Soul is the builder-first HagiSoul experience for creating, sharing, and browsing Souls for your agents. Pick a base role and expression rules in a central workbench, preview the result, and copy it.

**Try it now: [soul.hagicode.com](https://soul.hagicode.com/)**

## Current Homepage Capabilities

- Builder-first default homepage: the default route opens the Soul Builder workbench directly
- Multilingual UI shell: the site header, drawers, builder panels, feedback, and accessibility labels now support `zh-CN`, `zh-Hant`, `ja-JP`, `ko-KR`, `de-DE`, `fr-FR`, `es-ES`, `pt-BR`, `ru-RU`, and `en-US`
- Locale bootstrap and persistence: the app restores the last saved `soul.locale`, and on first load without a saved preference it maps `navigator.language` into the closest supported locale
- Editor-style homepage shell: the central workbench stays visible while the left rail exposes separate `Base role` and `Expression` drawers
- Single-drawer lifecycle: only one slot drawer can stay open at a time; clicking the active slot, the overlay, or pressing `Esc` closes it
- Local reference materials: base-role and expression catalogs ship with the site as reference material
- Optional remote enhancement: the Builder tries to load official inspiration cards; when that fails, the UI falls back to local sample cards
- Copyable preview output: the current Soul preview can be copied directly once the required slots are filled
- Theme switch: switch the interface between light and dark appearance from the header

## HagiCode Hero

Soul templates from this site are available to HagiCode Hero.

## Run

```bash
pnpm install
pnpm run dev
```

The app starts with the local Astro development server.
