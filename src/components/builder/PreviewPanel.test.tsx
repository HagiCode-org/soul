import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { PreviewPanel } from "@/components/builder/PreviewPanel"
import { createEmptyDraft } from "@/lib/builder/draft"
import { createLocalMaterials } from "@/lib/builder/material-repository"
import { compilePreview, getIncompletePreviewHint } from "@/lib/builder/preview-compiler"

describe("PreviewPanel", () => {
  it("disables copy action for incomplete content without rendering save controls", () => {
    const materials = createLocalMaterials()
    const preview = compilePreview(
      {
        mainSlotText: materials.mainFragments[0].content,
        ruleSlotText: "",
        customPrompt: "",
      },
      { mainFragment: materials.mainFragments[0], ruleFragment: null, inspirationFragment: null }
    )

    render(
      <PreviewPanel
        draft={createEmptyDraft()}
        preview={preview}
        previewHint={getIncompletePreviewHint(preview.missing)}
        canCompose={false}
        feedbackMessage={null}
        feedbackTone={null}
        onMainSlotTextChange={vi.fn()}
        onRuleSlotTextChange={vi.fn()}
        onCustomPromptChange={vi.fn()}
        onCopy={vi.fn()}
      />
    )

    expect(screen.getByRole("button", { name: "复制文案" })).toBeDisabled()
    expect(screen.getByText("Agent Soul 编辑器")).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "基础角色插槽" })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "表达方式插槽" })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "自定义文本插槽" })).toBeInTheDocument()
    expect(screen.getAllByText("先补表达方式插槽。").length).toBeGreaterThan(0)
    expect(screen.queryByRole("button", { name: "保存草稿" })).not.toBeInTheDocument()
  })
})
