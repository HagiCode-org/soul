import type { MissingCoreSelection, PreviewCompilation, SoulBuilderDraft, SoulFragment } from "@/lib/builder/types"

function buildMissing(mainFragment: SoulFragment | null, ruleFragment: SoulFragment | null): MissingCoreSelection[] {
  const missing: MissingCoreSelection[] = []

  if (!mainFragment) {
    missing.push("main")
  }

  if (!ruleFragment) {
    missing.push("rule")
  }

  return missing
}

export function compilePreview(
  draft: Pick<SoulBuilderDraft, "customPrompt">,
  fragments: {
    mainFragment: SoulFragment | null
    ruleFragment: SoulFragment | null
    inspirationFragment: SoulFragment | null
  }
): PreviewCompilation {
  const missing = buildMissing(fragments.mainFragment, fragments.ruleFragment)
  const sections = [
    fragments.mainFragment?.content,
    fragments.ruleFragment?.content,
    fragments.inspirationFragment
      ? `灵感参考「${fragments.inspirationFragment.title}」：${fragments.inspirationFragment.summary}`
      : null,
    draft.customPrompt.trim() ? `自定义补充：${draft.customPrompt.trim()}` : null,
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
    return "先选主 Catalog 和表达规则，才能导出完整配置。"
  }

  return missing[0] === "main" ? "先补主 Catalog。" : "先补表达规则。"
}
