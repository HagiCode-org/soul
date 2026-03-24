import type { SoulBuilderDraft, SoulFragment } from "@/lib/builder/types"

function createDraftId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }

  return `draft-${Date.now()}`
}

export function createEmptyDraft(): SoulBuilderDraft {
  return {
    draftId: createDraftId(),
    name: "未命名草稿",
    selectedMainFragmentId: null,
    selectedRuleFragmentId: null,
    inspirationSoulId: null,
    customPrompt: "",
    previewText: "",
    updatedAt: new Date().toISOString(),
  }
}

export function touchDraft(draft: SoulBuilderDraft): SoulBuilderDraft {
  return {
    ...draft,
    updatedAt: new Date().toISOString(),
  }
}

export function buildDraftName(mainFragment: SoulFragment | null, ruleFragment: SoulFragment | null) {
  if (mainFragment && ruleFragment) {
    return `${mainFragment.title} · ${ruleFragment.title}`
  }

  if (mainFragment) {
    return `${mainFragment.title} 草稿`
  }

  if (ruleFragment) {
    return `${ruleFragment.title} 草稿`
  }

  return "未命名草稿"
}
