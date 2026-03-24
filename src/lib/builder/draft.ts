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
    name: "未命名角色",
    selectedMainFragmentId: null,
    selectedRuleFragmentId: null,
    inspirationSoulId: null,
    mainSlotText: "",
    ruleSlotText: "",
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
    return mainFragment.title
  }

  if (ruleFragment) {
    return ruleFragment.title
  }

  return "未命名角色"
}
