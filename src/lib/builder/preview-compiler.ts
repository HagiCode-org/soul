import type { MessageDescriptor, MissingCoreSelection, PreviewCompilation, SoulBuilderDraft, SoulFragment } from "@/lib/builder/types"

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
  const title = [fragments.mainFragment?.title, fragments.ruleFragment?.title].filter(Boolean).join(" · ")

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
    return { key: "builder.preview.hints.missingBoth" } satisfies MessageDescriptor
  }

  return {
    key: missing[0] === "main" ? "builder.preview.hints.missingMain" : "builder.preview.hints.missingRule",
  } satisfies MessageDescriptor
}
