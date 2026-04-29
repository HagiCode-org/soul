# Soul hagi18n workflow

Soul UI translations are maintained as YAML source files under `src/i18n/locales-source/` and generated into i18next-compatible TypeScript modules under `src/i18n/resources/`.

## Install and verify hagi18n

Install repository dependencies so the local `hagi18n` binary is available:

```bash
npm install
```

Verify the CLI before using the Soul workflow:

```bash
hagi18n info
```

Soul scripts resolve the repository-local `hagi18n` binary from `devDependencies`. Use the `npm run i18n:*` commands from this repository instead of relying on a global installation.

## Source and runtime contract

- YAML files in `src/i18n/locales-source/<locale>/translation.yml` are the source of truth.
- Generated TypeScript files in `src/i18n/resources/` are runtime artifacts consumed by `src/i18n/config.ts`.
- `en-US` is the hagi18n base locale and the existing Soul runtime default locale.
- The generated files are committed because Soul does not ignore locale runtime artifacts and Vite/Vitest imports them directly.
- Do not hand-edit `src/i18n/resources/*.ts`; regenerate them from YAML.

Soul now exposes the full Desktop-aligned locale set in the user-facing switcher: `en-US`, `zh-CN`, `zh-Hant`, `ja-JP`, `ko-KR`, `de-DE`, `fr-FR`, `es-ES`, `pt-BR`, and `ru-RU`.

## Project-local commands

Run these from `repos/soul`:

```bash
npm run i18n:audit
npm run i18n:report
npm run i18n:doctor
npm run i18n:sync
npm run i18n:sync:write
npm run i18n:prune
npm run i18n:prune:write
npm run i18n:generate
npm run i18n:check
```

`npm run i18n:check` runs hagi18n audit, hagi18n doctor, generation, stale-output verification, and targeted i18n/HomePage tests.

## Dry-run-first sync and prune workflow

`sync` and `prune` are preview-only by default.

1. Review drift with `npm run i18n:audit` and `npm run i18n:doctor`.
2. Preview missing keys with `npm run i18n:sync`.
3. Preview obsolete keys with `npm run i18n:prune`.
4. Apply reviewed additions with `npm run i18n:sync:write`.
5. Apply reviewed removals with `npm run i18n:prune:write`.
6. Regenerate runtime modules with `npm run i18n:generate`.
7. Finish with `npm run i18n:check`.

## Adding or updating a translation key

1. Edit `src/i18n/locales-source/en-US/translation.yml` first.
2. Add the same key path to every target locale file under `src/i18n/locales-source/<locale>/translation.yml`.
3. Preserve interpolation placeholders exactly, including names such as `{{year}}`, `{{filled}}`, `{{value}}`, `{{count}}`, `{{detail}}`, and `{{title}}`.
4. Run `npm run i18n:audit`.
5. Run `npm run i18n:generate`.
6. Run `npm run i18n:check` before committing.

## Runtime compatibility notes

`initializeI18n`, `changeLocale`, and the `soul.locale` browser storage key keep their existing behavior. Runtime locale switching does not rewrite builder state or user-authored draft text; only system-owned UI copy changes language.
