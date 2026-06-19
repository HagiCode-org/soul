# Soul - Agent Configuration

## Root Configuration

Inherits all behavior from `/AGENTS.md` at the monorepo root. Local rules extend or override the root file for this repository.

## Project Context

This repository is the frontend for [soul.hagicode.com](https://soul.hagicode.com), featuring the builder-first HagiSoul experience for creating, sharing, and browsing Souls. Built with Vite + React.

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
npm run i18n:check
```

## Key Paths

- `src/components/`: React UI components
- `src/data/`: locale files and generated reference materials
- `scripts/`: material generation, site snapshot sync
- `hagi18n.yaml`: i18n configuration

## Agent Guidelines

- Keep the builder-first UX: the default route opens the Soul Builder workbench directly.
- Route all user-facing copy through the `hagi18n` i18n flow supporting 10+ locales.
- Single-drawer lifecycle: only one slot drawer open at a time.
- Fall back gracefully when remote API calls fail (use local sample cards).
- Run `npm run materials:sync` when upstream docs change to regenerate local reference materials.

## References

- `README.md`
- `hagi18n.yaml`
