# Soul - Agent Configuration

## Root Configuration

Inherits all behavior from `/AGENTS.md` at the monorepo root. Local rules extend or override the root file for this repository.

## Project Context

This repository is the frontend for [soul.hagicode.com](https://soul.hagicode.com), featuring the builder-first HagiSoul experience for creating, sharing, and browsing Souls. Built with Astro 7 (host page `src/pages/index.astro`) hosting a React island, bundled by Vite, on Node 24 / TypeScript 6.

## Working Directory

Run commands from `repos/soul/`.

## Key Commands

```bash
npm install
npm run dev
npm run build
npm test
npm run lint
npm run materials:sync
npm run sync:agent-templates
npm run i18n:generate
npm run i18n:check    # audit + doctor + generated-resource check + i18n tests
```

`npm run dev`, `npm run build` and `npm test` run `prepare:i18n` (`i18n:generate`) first. Individual hagi18n steps are `i18n:audit`, `i18n:report`, `i18n:doctor`, `i18n:sync[:write]` and `i18n:prune[:write]`.

## Key Paths

- `src/components/`: React UI components
- `src/pages/index.astro`: Astro host that mounts the shared Hagilight footer and banner around the React island
- `src/data/`: generated reference materials (`reference-materials.generated.ts`) and `generated/agent-templates/`
- `src/i18n/locales-source/`: YAML source of truth for UI copy (`src/i18n/resources/` is generated)
- `scripts/`: material, agent-template and i18n generation, `verify-ga-build.mjs`
- `hagi18n.yaml`: i18n configuration

## Agent Guidelines

- Keep the builder-first UX: the default route opens the Soul Builder workbench directly.
- Route all user-facing copy through the `hagi18n` i18n flow supporting the 10 locales under `src/i18n/locales-source/`.
- Single-drawer lifecycle: only one slot drawer open at a time.
- Fall back gracefully when remote API calls fail (use local sample cards).
- Run `npm run materials:sync` when upstream docs change to regenerate local reference materials.
- Never hand-edit `src/i18n/resources/` or `src/data/generated/`; edit YAML sources and regenerate (`npm run i18n:generate`, `npm run sync:agent-templates`).
- Keep `@hagicode/hagilight` and `@hagicode/hagilight-core` pinned to the same exact version; footer, promo banner, SEO head and GA come from Hagilight, so do not add local duplicates (`npm run build` runs `scripts/verify-ga-build.mjs` and fails on duplicate loaders).
- Production deploys via `.github/workflows/soul-deploy-gh-pages.yml` (`gh-pages` branch with `esa.jsonc` + `dist/`).

## References

- `README.md`
- `hagi18n.yaml`
- `docs/i18n-hagi18n.md`
