import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"

import { MaterialLibraryPanel } from "@/components/builder/MaterialLibraryPanel"
import { createLocalMaterials } from "@/lib/builder/material-repository"

afterEach(() => {
  cleanup()
})

function getSelectableCards() {
  return screen.getAllByRole("button").filter((element) => element.getAttribute("aria-pressed") !== null)
}

describe("builder drawer panels", () => {
  it("supports catalog-only drawer selection", async () => {
    const user = userEvent.setup()
    const materials = createLocalMaterials()
    const onSelectMain = vi.fn()

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
        onSelectMainFragment={onSelectMain}
        onSelectRuleFragment={vi.fn()}
        onSelectInspirationFragment={vi.fn()}
        remoteState={materials.remoteState}
        remoteMessage={materials.remoteMessage}
        onReload={vi.fn()}
        layout="drawer"
        visibleSections={["main"]}
      />
    )

    expect(screen.getByPlaceholderText("搜索基础角色")).toBeInTheDocument()
    expect(screen.queryByText("表达规则")).not.toBeInTheDocument()
    expect(screen.queryByText("官方灵感卡")).not.toBeInTheDocument()

    await user.click(getSelectableCards()[0])
    expect(onSelectMain).toHaveBeenCalledTimes(1)
  })

  it("supports expression-only drawer selection", async () => {
    const user = userEvent.setup()
    const materials = createLocalMaterials()
    const onSelectRule = vi.fn()

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
        onSelectRuleFragment={onSelectRule}
        onSelectInspirationFragment={vi.fn()}
        remoteState={materials.remoteState}
        remoteMessage={materials.remoteMessage}
        onReload={vi.fn()}
        layout="drawer"
        visibleSections={["rules"]}
      />
    )

    expect(screen.getByPlaceholderText("搜索表达规则")).toBeInTheDocument()
    expect(screen.getByText("表达规则")).toBeInTheDocument()
    expect(screen.queryByText("官方灵感卡")).not.toBeInTheDocument()

    await user.click(getSelectableCards()[0])
    expect(onSelectRule).toHaveBeenCalledTimes(1)
  })
})
