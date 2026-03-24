import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { CompositionPanel } from "@/components/builder/CompositionPanel"
import { MaterialLibraryPanel } from "@/components/builder/MaterialLibraryPanel"
import { SavedDraftRail } from "@/components/builder/SavedDraftRail"
import { createEmptyDraft } from "@/lib/builder/draft"
import { createLocalMaterials } from "@/lib/builder/material-repository"

describe("builder drawer panels", () => {
  it("supports inspiration-only drawer selection", async () => {
    const user = userEvent.setup()
    const materials = createLocalMaterials()
    const onSelectInspiration = vi.fn()

    render(
      <MaterialLibraryPanel
        query=""
        onQueryChange={vi.fn()}
        categories={["全部"]}
        selectedCategory="全部"
        onCategoryChange={vi.fn()}
        mainFragments={materials.mainFragments}
        ruleFragments={materials.expressionFragments}
        inspirationFragments={materials.inspirationFragments}
        selectedMainFragmentId={null}
        selectedRuleFragmentId={null}
        selectedInspirationId={null}
        onSelectMainFragment={vi.fn()}
        onSelectRuleFragment={vi.fn()}
        onSelectInspirationFragment={onSelectInspiration}
        remoteState={materials.remoteState}
        remoteMessage={materials.remoteMessage}
        onReload={vi.fn()}
        layout="drawer"
        visibleSections={["inspiration"]}
      />
    )

    expect(screen.queryByText("主 Catalog")).not.toBeInTheDocument()
    expect(screen.getByText("官方灵感卡")).toBeInTheDocument()

    await user.click(screen.getAllByRole("button", { name: /导入灵感|已导入/ })[0])
    expect(onSelectInspiration).toHaveBeenCalledTimes(1)
  })

  it("keeps save action inside drawer composition panel", async () => {
    const user = userEvent.setup()
    const materials = createLocalMaterials()
    const onSaveDraft = vi.fn()

    render(
      <CompositionPanel
        mainFragment={materials.mainFragments[0]}
        ruleFragment={materials.expressionFragments[0]}
        inspirationFragment={null}
        customPrompt="补充说明"
        onCustomPromptChange={vi.fn()}
        onClearMainFragment={vi.fn()}
        onClearRuleFragment={vi.fn()}
        onClearInspiration={vi.fn()}
        onSaveDraft={onSaveDraft}
        layout="drawer"
      />
    )

    await user.click(screen.getByRole("button", { name: "保存草稿" }))
    expect(onSaveDraft).toHaveBeenCalledTimes(1)
  })

  it("restores saved draft from drawer rail", async () => {
    const user = userEvent.setup()
    const draft = createEmptyDraft()
    const snapshot = {
      version: "1",
      savedAt: "2026-03-24T00:00:00.000Z",
      draft: {
        ...draft,
        name: "测试草稿",
      },
    }
    const onRestore = vi.fn()

    render(<SavedDraftRail snapshots={[snapshot]} onRestore={onRestore} layout="drawer" />)

    await user.click(screen.getByRole("button", { name: "恢复" }))
    expect(onRestore).toHaveBeenCalledWith(snapshot)
  })
})
