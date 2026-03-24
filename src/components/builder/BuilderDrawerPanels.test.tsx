import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"

import { MaterialLibraryPanel } from "@/components/builder/MaterialLibraryPanel"
import { ALL_CATEGORY_ID } from "@/i18n/locales"
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
        categories={[ALL_CATEGORY_ID]}
        selectedCategory={ALL_CATEGORY_ID}
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

    expect(screen.getByPlaceholderText("Search base roles")).toBeInTheDocument()
    expect(screen.getByText("Neighborly Sweet Healer")).toBeInTheDocument()
    expect(screen.queryByText("Expression rules")).not.toBeInTheDocument()
    expect(screen.queryByText("Official inspiration cards")).not.toBeInTheDocument()

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
        categories={[ALL_CATEGORY_ID]}
        selectedCategory={ALL_CATEGORY_ID}
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

    expect(screen.getByPlaceholderText("Search expression rules")).toBeInTheDocument()
    expect(screen.getByText("Expression rules")).toBeInTheDocument()
    expect(screen.getByText("Fragmented Short-Sentence Mode")).toBeInTheDocument()
    expect(screen.queryByText("Official inspiration cards")).not.toBeInTheDocument()

    await user.click(getSelectableCards()[0])
    expect(onSelectRule).toHaveBeenCalledTimes(1)
  })
})
