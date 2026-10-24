---
public: true
multilingual: false
style: product
---

# README requirements

## Product focus

- Present Soul (https://soul.hagicode.com) as the builder-first HagiSoul experience: people create a Soul in a central workbench by picking a base role and expression rules, preview the result and copy it, and can browse inspiration cards.
- Main features users get: the Builder workbench with `Base role` and `Expression` drawers, local reference materials plus official inspiration cards (with local sample cards as a fallback), copyable preview output, a ten-language interface with a saved language preference, and a theme switch.
- Address people who create, share and browse Souls for their agents; they are users, not developers of this site.
- Lead with product value (what a Soul is and what the Builder lets users do), then the site link and a short capability list.

## Required content

- Open with a short introduction and a prominent link to https://soul.hagicode.com.
- Describe the current homepage capabilities and the supported interface languages, as the current README does.
- Mention that Soul templates from this site are available to HagiCode Hero, only as far as the current README states it.
- Describe only behavior present in `src/` and `docs/`. If the README shows how to run the site locally, commands must match the `package.json` scripts.

## Exclusions

- Exclude tokens, secret values, internal hosts, machine-specific paths and private links.
- Keep repository maintenance instructions out of the README: repository layout, internal architecture and state boundaries, Hagilight integration and analytics wiring, i18n and build internals, CI, deployment and contribution workflow.
