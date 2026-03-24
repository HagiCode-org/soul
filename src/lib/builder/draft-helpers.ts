import { buildDraftName } from "@/lib/builder/draft"
import type { BuilderMaterials, SoulBuilderDraft, SoulFragment } from "@/lib/builder/types"

export type ResolvedDraftFragments = {
  mainFragment: SoulFragment | null
  ruleFragment: SoulFragment | null
  inspirationFragment: SoulFragment | null
}

export function findFragmentById(fragments: SoulFragment[], fragmentId: string | null) {
  if (!fragmentId) {
    return null
  }

  return fragments.find((fragment) => fragment.fragmentId === fragmentId) ?? null
}

export function resolveDraftFragments(materials: BuilderMaterials, draft: SoulBuilderDraft): ResolvedDraftFragments {
  return {
    mainFragment: findFragmentById(materials.mainFragments, draft.selectedMainFragmentId),
    ruleFragment: findFragmentById(materials.expressionFragments, draft.selectedRuleFragmentId),
    inspirationFragment: findFragmentById(materials.inspirationFragments, draft.inspirationSoulId),
  }
}

function findFragmentByTitle(fragments: SoulFragment[], title: string | undefined) {
  if (!title) {
    return null
  }

  return fragments.find((fragment) => fragment.title === title) ?? null
}

export function applyInspirationFragment(
  draft: SoulBuilderDraft,
  inspirationFragment: SoulFragment,
  materials: BuilderMaterials
): SoulBuilderDraft {
  const mainFragment = findFragmentByTitle(materials.mainFragments, inspirationFragment.meta.mainCatalogName)
  const ruleFragment = findFragmentByTitle(materials.expressionFragments, inspirationFragment.meta.orthogonalCatalogName)

  return {
    ...draft,
    inspirationSoulId: inspirationFragment.fragmentId,
    selectedMainFragmentId: mainFragment?.fragmentId ?? draft.selectedMainFragmentId,
    selectedRuleFragmentId: ruleFragment?.fragmentId ?? draft.selectedRuleFragmentId,
    name: buildDraftName(mainFragment ?? null, ruleFragment ?? null),
    updatedAt: new Date().toISOString(),
  }
}

export function clearInspirationFragment(draft: SoulBuilderDraft): SoulBuilderDraft {
  return {
    ...draft,
    inspirationSoulId: null,
    updatedAt: new Date().toISOString(),
  }
}
