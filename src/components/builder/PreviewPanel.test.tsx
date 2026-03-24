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

    expect(screen.getByRole("button", { name: "Copy preview" })).toBeDisabled()
    expect(screen.getByText("Agent Soul Editor")).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Base role slot" })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Expression slot" })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Custom text slot" })).toBeInTheDocument()
    expect(screen.getAllByText("Fill the expression slot first.").length).toBeGreaterThan(0)
    expect(screen.queryByRole("button", { name: "Save draft" })).not.toBeInTheDocument()
  })
})
