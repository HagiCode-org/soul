import type { SoulBuilderDraft, SoulBuilderExportResult, SoulFragment } from "@/lib/builder/types"

export const soulBuilderExportVersion = "1"

function sanitizeFileSegment(value: string) {
  return value
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5-]/g, "")
    .toLowerCase()
}

export function canExportDraft(mainFragment: SoulFragment | null, ruleFragment: SoulFragment | null) {
  return Boolean(mainFragment && ruleFragment)
}

export function createDraftExport(
  draft: SoulBuilderDraft,
  fragments: {
    mainFragment: SoulFragment | null
    ruleFragment: SoulFragment | null
    inspirationFragment: SoulFragment | null
  }
): SoulBuilderExportResult {
  const exportedAt = new Date().toISOString()
  const nameSeed = sanitizeFileSegment(draft.name) || "soul-builder"
  const payload = {
    version: soulBuilderExportVersion,
    exportedAt,
    draft,
    selectedMainFragment: fragments.mainFragment,
    selectedRuleFragment: fragments.ruleFragment,
    inspirationFragment: fragments.inspirationFragment,
    previewText: draft.previewText,
  }

  return {
    fileName: `${nameSeed}.json`,
    jsonText: JSON.stringify(payload, null, 2),
    soulText: draft.previewText,
    payload,
  }
}
