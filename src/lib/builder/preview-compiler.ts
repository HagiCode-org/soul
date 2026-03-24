import type { MissingCoreSelection, PreviewCompilation, SoulBuilderDraft, SoulFragment } from "@/lib/builder/types"

function buildMissing(mainSlotText: string, ruleSlotText: string): MissingCoreSelection[] {
  const missing: MissingCoreSelection[] = []

  if (!mainSlotText.trim()) {
    missing.push("main")
  }

  if (!ruleSlotText.trim()) {
    missing.push("rule")
  }

  return missing
}

export function compilePreview(
  draft: Pick<SoulBuilderDraft, "mainSlotText" | "ruleSlotText" | "customPrompt">,
  fragments: {
    mainFragment: SoulFragment | null
    ruleFragment: SoulFragment | null
    inspirationFragment: SoulFragment | null
  }
): PreviewCompilation {
  const missing = buildMissing(draft.mainSlotText, draft.ruleSlotText)
  const sections = [
    draft.mainSlotText.trim() || null,
    draft.ruleSlotText.trim() || null,
    draft.customPrompt.trim() || null,
  ].filter((section): section is string => Boolean(section))

  const text = sections.join("\n\n")
  const title = [fragments.mainFragment?.title, fragments.ruleFragment?.title].filter(Boolean).join(" · ") || "Soul Builder 预览"

  return {
    text,
    title,
    missing,
    isComplete: missing.length === 0,
    sections,
  }
}

export function getIncompletePreviewHint(missing: MissingCoreSelection[]) {
  if (missing.length === 0) {
    return null
  }

  if (missing.length === 2) {
    return "先补基础角色和表达方式插槽，才能生成完整内容。"
  }

  return missing[0] === "main" ? "先补基础角色插槽。" : "先补表达方式插槽。"
}
