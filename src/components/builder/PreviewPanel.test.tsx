import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { PreviewPanel } from "@/components/builder/PreviewPanel"
import { createEmptyDraft } from "@/lib/builder/draft"
import { createLocalMaterials } from "@/lib/builder/material-repository"
import { compilePreview, getIncompletePreviewHint } from "@/lib/builder/preview-compiler"

describe("PreviewPanel", () => {
  it("disables export actions and shows hint for incomplete draft", () => {
    const materials = createLocalMaterials()
    const preview = compilePreview(
      { customPrompt: "" },
      { mainFragment: materials.mainFragments[0], ruleFragment: null, inspirationFragment: null }
    )

    render(
      <PreviewPanel
        draft={createEmptyDraft()}
        preview={preview}
        previewHint={getIncompletePreviewHint(preview.missing)}
        canExport={false}
        mainFragment={materials.mainFragments[0]}
        ruleFragment={null}
        inspirationFragment={null}
        feedbackMessage={null}
        feedbackTone={null}
        onExport={vi.fn()}
        onCopy={vi.fn()}
      />
    )

    expect(screen.getByRole("button", { name: "导出 JSON" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "复制文案" })).toBeDisabled()
    expect(screen.getByText("先补表达规则。")).toBeInTheDocument()
  })
})
