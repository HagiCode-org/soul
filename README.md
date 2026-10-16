# Soul

Soul is the frontend repository for `soul.hagicode.com`.
The current default homepage is the builder-first HagiSoul experience for creating, sharing, and browsing Souls.

## Current Homepage Capabilities

- Builder-first default homepage: the default route opens the Soul Builder workbench directly
- Multilingual UI shell: the site header, drawers, builder panels, feedback, and accessibility labels now support `zh-CN`, `zh-Hant`, `ja-JP`, `ko-KR`, `de-DE`, `fr-FR`, `es-ES`, `pt-BR`, `ru-RU`, and `en-US`; the public footer and promotion surface are owned by the shared Hagilight components
- Locale bootstrap and persistence: the app restores the last saved `soul.locale`, and on first load without a saved preference it maps `navigator.language` into the closest supported locale
- Editor-style homepage shell: the central workbench stays visible while the left rail exposes separate `Base role` and `Expression` drawers
- Single-drawer lifecycle: only one slot drawer can stay open at a time; clicking the active slot, the overlay, or pressing `Esc` closes it
- Local reference materials: build-time snapshots are generated from `repos/web/docs` base-role and expression catalogs
- Soul-local extensions: additional expression rules may be appended inside this repo when product needs move faster than the upstream docs
- Optional remote enhancement: the runtime tries to read official inspiration cards from `/api/soul-marketplace/items`; when it fails, the UI falls back to local sample cards
- Copyable preview output: the current Soul preview can be copied directly once the required slots are filled

## Localization Notes

- Runtime locale switching is exposed from `src/components/site/SiteHeader.tsx` through a visible multi-locale switcher near the theme toggle
- The selected locale is persisted under the `soul.locale` browser storage key
- YAML files in `src/i18n/locales-source/` are the source of truth for system-owned UI copy
- Generated TypeScript modules in `src/i18n/resources/` are runtime artifacts and must not be hand-edited
- `npm run dev`, `npm run build`, and `npm run test` prepare generated i18n resources before Astro, TypeScript, or Vitest consumes them
- Use `npm run i18n:generate` after editing YAML and `npm run i18n:check` before committing translation changes
- Detailed maintainer workflow is documented in `docs/i18n-hagi18n.md`
- Local reference materials now ship with bilingual fragment overlays, so base-role cards, expression-rule cards, and local fallback inspiration cards follow the active locale
- Official remote inspiration cards keep their upstream display names, but the Builder adds best-effort English summaries and slot content when the related local catalogs have translations
- User-authored draft text is never rewritten during runtime locale switches; only future material selections use the current locale

## Site Shell and Filing Display

- The homepage keeps the `SiteHeader -> HomeEditorShell` shell while the shared Hagilight `Footer` and `PromotoBanner` are mounted from the Astro host (`src/pages/index.astro`) around the hydrated React island
- The footer is `@hagicode/hagilight/Footer`, which adds the `Powered By hagilight@<version>` attribution, the `Branch`/`Commit`/`Built` line, and the sitemap and RSS links
- The Astro host renders the shared footer once for the default locale and a `<template>` per secondary locale, then coordinates the live footer and banner locale through a `document.documentElement` `lang` observer so runtime language switches stay in sync
- `src/components/site/site-links.ts` maintains docs, website, GitHub, Discord, QQ group, email, and filing constants so link destinations stay centralized; the community and filing destinations are passed to the shared footer's `links` option
- Link destinations and filing records are assumed to match the already-published entries in `repos/site` and `repos/docs`; this repo copies the structure and constants without depending on cross-repo runtime modules
- The shared footer displays `闽ICP备2026004153号-1` and `闽公网安备35011102351148号`, and both filing links keep safe external-link attributes through the Hagilight footer's filing section
- The header is responsible for brand copy, site navigation, locale switching, and theme switching, but not Builder-internal actions such as preview copy or drawer lifecycle

## Hagilight Integration

- `@hagicode/hagilight` and `@hagicode/hagilight-core` are pinned to the same exact version (`0.9.5`) in `devDependencies`; the Soul tests read that pin from `package.json`
- `astro.config.mjs` registers `hagilightFavicon()` and `hagilight()` with their default options. A build generates `dist/robots.txt` (which points to `sitemap-index.xml`), `dist/sitemap-index.xml` with its child sitemap, and the feeds `dist/rss.xml` and `dist/rss.en.xml`. The feeds are valid and currently contain no items
- The shared HagiCode favicon is emitted by Astro from the package asset and linked in `src/pages/index.astro`, because `hagilightFavicon()` writes to the Astro config head and this page does not render it
- `public/llms.txt` is the hand-written file and is kept. The pinned `@hagicode/hagilight` 0.9.5 does not generate `llms.txt`, so there is no generated file to replace it; revisit it when the pin moves to a version that generates one
- Removed from `public/`: `robots.txt`, `sitemap.xml`, `favicon.ico` and `favicon.svg`. `/sitemap.xml` no longer exists; crawlers reach the sitemap through `robots.txt` at `/sitemap-index.xml`
- The static head comes from `SEOHead`: canonical, description, Open Graph and Twitter title/description, and the `WebApplication` JSON-LD. Keywords, `theme-color`, `author`, `robots`, `og:type`/`og:url`/`og:site_name`/`og:locale`, and `twitter:card` are passed through its `head` prop
- 51LA is loaded by `Analytics51LA` in `src/pages/index.astro`, in production builds only. `VITE_51LA_ID` overrides the default site ID, and that ID is used for both `id` and `ck`. The local 51LA bootstrap (`src/lib/analytics`) and the legacy promotion loader (`src/lib/promote-loader.ts`) are removed
- Click tracking uses `gaEventAttributes()` from `@hagicode/hagilight-core/analytics-events`:
  - header navigation links report at location `soul_header`, with the link's stable id as the label (`discord` is reported as `community`)
  - the hero documentation call to action reports at location `soul_hero` with the label `docs`
  - in-page anchors such as `#home-workbench` are not tagged; the shared footer and banner report their own links
- `scripts/verify-ga-build.mjs` runs after `astro build`. It fails when the built homepage has more than one Google Analytics loader, `gtag('config')`, click-listener script, 51LA loader or initialization, promotion banner, or visible footer; when the footer lacks the attribution or build labels; or when a footer RSS link does not resolve to a published file

## Homepage Structure and State Boundaries

### Layout Structure

- `src/pages/HomePage.tsx`: homepage composition root that maintains the localized slot registry and drawer content mapping
- `src/components/home/HomeEditorShell.tsx`: editor-style homepage shell that arranges the central workbench, slot rails, and drawer container
- `src/components/home/HomeSlotRail.tsx`: slot entry renderer for naming, active state, hover state, recommended state, and disabled state
- `src/components/home/HomeContextDrawer.tsx`: shared drawer lifecycle wrapper for overlay, close button, and `Esc` dismissal
- `src/components/builder/PreviewPanel.tsx`: central workbench surface that always shows the preview and copy action
- `src/components/builder/MaterialLibraryPanel.tsx`: drawer-ready material picker for the `Base role` and `Expression` selection flows

### State Boundaries

- `src/hooks/use-soul-builder.ts`: domain state and side effects, including material loading, slot aggregation, preview compilation, copy behavior, and locale-safe feedback descriptors
- `src/hooks/use-home-editor-state.ts`: presentation state, including `activeSlot`, `drawerSide`, `drawerOpen`, and default focus behavior
- Drawer state is not persisted and does not write directly into `SoulBuilderDraft`
- Closing a drawer does not mutate current content; only explicit Builder actions such as selecting materials, editing slots, or copying preview text trigger state changes or side effects
- Remote inspiration failures do not block homepage rendering; the core Builder flow continues on top of local snapshots

## Data Sources and Boundaries

### Reference Inputs

- Base roles: `repos/web/docs/50组SOUL.md核心Catalog（风格差异化+高辨识度+强适配性）.md`
- Expression rules: `repos/web/docs/10组正交维度Catalog2（可与50组主Catalog交叉生成500个独家人设）.md`
- Soul-local expression overrides: `scripts/reference-material-overrides.mjs`
- Official inspiration contract reference: `repos/web/src/services/soulMarketplaceApi.ts`
- Official combination rule reference: `repos/hagicode-core/src/PCode.Application/SoulMarketplace/catalog-sources.json`

### Generation Flow

- Generation script: `scripts/generate-reference-materials.mjs`
- Generated output: `src/data/reference-materials.generated.ts`
- Sync command:

```bash
npm run materials:sync
```

## Hero Agent Template Export

- Hero SOUL 模板的 canonical 输出位于 `src/data/generated/agent-templates/`。
- 生成命令是 `npm run sync:agent-templates`，脚本入口是 `scripts/generate-agent-templates.mjs`。
- 输出内容固定包含 `index.json` 与 `templates/*.json`，并带有 `styleType`、`soul`、`tags` 与 `tagGroups`。
- `repos/index` 会镜像这些 JSON 到 `/agent-templates/soul/**`，因此 SOUL 模板正文应继续在本仓库维护，而不是在 Index 发布镜像里手工修改。

## Directory Guide

- `src/pages/HomePage.tsx`: Builder homepage composition root
- `src/components/home/`: homepage editor shell, slot rail, and drawer primitives
- `src/components/builder/`: material library and preview surface
- `src/components/site/SiteHeader.tsx`: site navigation, locale switcher, and theme toggle
- `src/components/site/site-links.ts`: site link and filing registry
- `src/components/SoulApp.tsx`: Astro React island that hydrates the existing SPA
- `src/pages/index.astro`: Astro host that mounts the shared Hagilight footer and banner
- `src/i18n/`: locale bootstrap, persistence helpers, translation resources, and translation helpers
- `src/lib/builder/`: domain types, material repository, preview compilation, and copy-related logic
- `src/data/reference-materials.generated.ts`: reference material snapshot
- `src/test/`: Vitest setup

## Run

```bash
npm install
npm run dev
```

The app starts with the local Astro development server.

## Build and Checks

```bash
npm run lint
npm run test
npm run build
npm run preview
```

`npm run build` runs `scripts/verify-ga-build.mjs` after the Astro build, so a duplicated analytics loader, banner or footer fails the build.

## Production Deployment

- Authoritative workflow: `.github/workflows/soul-deploy-gh-pages.yml`
- Production source of truth: the `gh-pages` branch, published only after the build job validates the Astro build
- Published payload contract: branch root `esa.jsonc` plus `dist/`
- Required GitHub permissions: the deploy job needs `contents: write`
- Required hosting setting: the production host must read `gh-pages/esa.jsonc` and serve `gh-pages/dist/`
- First deploy checks: confirm the workflow uploaded `esa.jsonc` and `dist/`, then verify `https://soul.hagicode.com`
- Rollback path: revert the source change or rerun deployment from an older commit so CI republishes the earlier snapshot

## Runtime Assumptions

- The homepage must load without a backend; the core workflow can run entirely on local snapshots
- Official inspiration cards are an enhancement; failures cannot block homepage rendering
- Copy requires both the base-role slot and expression slot to contain content
- Theme switching currently changes visual state only and is still not persisted
- Locale preference is stored locally in the browser and is currently Soul-specific rather than shared across other HagiCode properties
- If public site links or filing information change, the static configuration in this repo should be updated to match