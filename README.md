# Soul

Soul is the frontend repository for `soul.hagicode.com`.
The current default homepage is the builder-first HagiSoul experience for creating, sharing, and browsing Souls.

## Current Homepage Capabilities

- Builder-first default homepage: the default route opens the Soul Builder workbench directly
- Bilingual UI shell: the site header, footer, drawers, builder panels, feedback, and accessibility labels now support `zh-CN` and `en-US`
- Locale bootstrap and persistence: the app restores the last saved `soul.locale`, and on first load without a saved preference it maps `navigator.language` to `zh-CN` or `en-US`
- Editor-style homepage shell: the central workbench stays visible while the left rail exposes separate `Base role` and `Expression` drawers
- Single-drawer lifecycle: only one slot drawer can stay open at a time; clicking the active slot, the overlay, or pressing `Esc` closes it
- Local reference materials: build-time snapshots are generated from `repos/web/docs` base-role and expression catalogs
- Soul-local extensions: additional expression rules may be appended inside this repo when product needs move faster than the upstream docs
- Optional remote enhancement: the runtime tries to read official inspiration cards from `/api/soul-marketplace/items`; when it fails, the UI falls back to local sample cards
- Copyable preview output: the current Soul preview can be copied directly once the required slots are filled

## Localization Notes

- Runtime locale switching is exposed from `src/components/site/SiteHeader.tsx` through a visible `中文 / EN` switcher near the theme toggle
- The selected locale is persisted under the `soul.locale` browser storage key
- Translation resources live in `src/i18n/resources/zh-CN.ts` and `src/i18n/resources/en-US.ts`
- Maintain translation resources by keeping system-owned UI copy in both locale files at the same time
- Local reference materials now ship with bilingual fragment overlays, so base-role cards, expression-rule cards, and local fallback inspiration cards follow the active locale
- Official remote inspiration cards keep their upstream display names, but the Builder adds best-effort English summaries and slot content when the related local catalogs have translations
- User-authored draft text is never rewritten during runtime locale switches; only future material selections use the current locale

## Site Shell and Filing Display

- The homepage uses the complete `SiteHeader -> HomeEditorShell -> SiteFooter` shell while keeping the Builder workbench as the main experience
- `src/components/site/site-links.ts` maintains docs, website, GitHub, Discord, QQ group, email, and filing constants so link destinations stay centralized
- Link destinations and filing records are assumed to match the already-published entries in `repos/site` and `repos/docs`; this repo copies the structure and constants without depending on cross-repo runtime modules
- The footer displays `闽ICP备2026004153号-1` and `闽公网安备35011102351148号`, and both filing links keep locale-aware `aria-label`s plus safe external-link attributes
- The header is responsible for brand copy, site navigation, locale switching, and theme switching, but not Builder-internal actions such as preview copy or drawer lifecycle

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

## Directory Guide

- `src/pages/HomePage.tsx`: Builder homepage composition root
- `src/components/home/`: homepage editor shell, slot rail, and drawer primitives
- `src/components/builder/`: material library and preview surface
- `src/components/site/SiteHeader.tsx`: site navigation, locale switcher, and theme toggle
- `src/components/site/SiteFooter.tsx`: footer, community entries, and filing display
- `src/components/site/site-links.ts`: site link and filing registry
- `src/i18n/`: locale bootstrap, persistence helpers, translation resources, and translation helpers
- `src/lib/builder/`: domain types, material repository, preview compilation, and copy-related logic
- `src/data/reference-materials.generated.ts`: reference material snapshot
- `src/test/`: Vitest setup

## Run

```bash
npm install
npm run dev
```

The app starts with the local Vite development server.

## Build and Checks

```bash
npm run lint
npm run test
npm run build
npm run preview
```

## Runtime Assumptions

- The homepage must load without a backend; the core workflow can run entirely on local snapshots
- Official inspiration cards are an enhancement; failures cannot block homepage rendering
- Copy requires both the base-role slot and expression slot to contain content
- Theme switching currently changes visual state only and is still not persisted
- Locale preference is stored locally in the browser and is currently Soul-specific rather than shared across other HagiCode properties
- If public site links or filing information change, the static configuration in this repo should be updated to match
