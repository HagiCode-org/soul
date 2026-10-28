# Soul - Agent Configuration

## Root Configuration

Inherits all behavior from `/AGENTS.md` at the monorepo root. Local rules extend or override the root file for this repository.

## Project Context

This repository is the frontend for [soul.hagicode.com](https://soul.hagicode.com), featuring the builder-first HagiSoul experience for creating, sharing, and browsing Souls. Built with Astro 7 (host page `src/pages/index.astro`) hosting a React island, bundled by Vite, on Node 24 / TypeScript 6.

## Working Directory

Run commands from `repos/soul/`.

## Key Commands

```bash
pnpm install
pnpm run dev
pnpm run build
pnpm test
pnpm run lint
pnpm run materials:sync
pnpm run sync:agent-templates
pnpm run i18n:generate
pnpm run i18n:check    # audit + doctor + generated-resource check + i18n tests
```

`pnpm run dev`, `pnpm run build` and `pnpm test` run `prepare:i18n` (`i18n:generate`) first. Individual hagi18n steps are `i18n:audit`, `i18n:report`, `i18n:doctor`, `i18n:sync[:write]` and `i18n:prune[:write]`.

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
- Run `pnpm run materials:sync` when upstream docs change to regenerate local reference materials.
- Never hand-edit `src/i18n/resources/` or `src/data/generated/`; edit YAML sources and regenerate (`pnpm run i18n:generate`, `pnpm run sync:agent-templates`).
- Keep `@hagicode/hagilight` and `@hagicode/hagilight-core` pinned to the same exact version; footer, promo banner, SEO head, GA and PostHog (injected by the `hagilight()` integration) come from Hagilight, so do not add local duplicates (`pnpm run build` runs `scripts/verify-ga-build.mjs` and fails on duplicate loaders, including a second PostHog init).
- Production deploys via `.github/workflows/soul-deploy-gh-pages.yml` (`gh-pages` branch with `esa.jsonc` + `dist/`).

## PostHog Site Events

Site-level events are sent through `src/lib/posthog-events.ts` (`captureSiteEvent`), which does nothing when `window.posthog` is missing, not loaded, or opted out, never throws, and keeps only the allowlisted keys and primitive values. The table `SITE_POSTHOG_EVENTS` is the single source of truth; a test (`src/lib/posthog-events.test.ts`) pins its exact contents.

| Event | Sent when | Properties |
|-------|-----------|------------|
| `soul_preview_copied` | `copyPreviewText` succeeds (never when the clipboard write is rejected or the preview is incomplete) | `can_compose` (boolean), `main_selected` (boolean), `rule_selected` (boolean), `inspiration_selected` (boolean) |
| `soul_fragment_selected` | A `selectMainFragment`, `selectRuleFragment` or `selectInspirationFragment` call changes that slot's selected fragment ID | `slot` (`main`, `rule` or `inspiration`), `fragment_id` (public fragment-library ID) |

- Deduplication: a selection of the fragment that is already selected, clearing a slot, and typing into a slot send nothing. `soul_preview_copied` fires once per successful copy.
- Never sent: the preview text, `customPrompt`, `mainSlotText`, `ruleSlotText`, URLs, or any other user-entered text.
- `cta_click` deduplication: these events are the canonical record of their actions. Dashboards must not add them to `cta_click` counts.

## References

- `README.md`
- `hagi18n.yaml`
- `docs/i18n-hagi18n.md`
- `DESIGN.md` (design-system reference for UI changes)

## Package management

- The repository uses pnpm, pinned in `package.json` `packageManager`. Run `corepack enable` once, then `pnpm install`. `pnpm-lock.yaml` is the only lockfile; do not commit `package-lock.json`.
- Settings live in `pnpm-workspace.yaml`. `allowBuilds` lists the dependencies whose install scripts may run (reviewed individually, `false` means reviewed and denied); review any new dependency that has an install script and add it there.
- A local registry mirror belongs in `~/.npmrc` only. Never commit a `registry=` line or a mirror URL; `pnpm run check:registry` (also run in CI) fails on any non-`registry.npmjs.org` `tarball` in the lockfile and on mirror hosts in tracked files.
- Undeclared imports fail under pnpm's strict layout: declare the package instead of hoisting it.
