import { useState } from "react"
import { cleanup, render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"

import { HomePage } from "@/pages/HomePage"
import { ALL_CATEGORY_ID } from "@/i18n/locales"
import { createEmptyDraft } from "@/lib/builder/draft"
import { createLocalMaterials } from "@/lib/builder/material-repository"
import type { ThemeMode } from "@/hooks/use-theme-mode"

const materials = createLocalMaterials()
const mainFragment = materials.mainFragments[0]
const ruleFragment = materials.expressionFragments[0]
const rawDraft = {
  ...createEmptyDraft(),
  selectedMainFragmentId: mainFragment.fragmentId,
  selectedRuleFragmentId: ruleFragment.fragmentId,
  mainSlotText: mainFragment.content,
  ruleSlotText: ruleFragment.content,
}
const currentDraft = {
  ...rawDraft,
  name: `${mainFragment.title} × ${ruleFragment.title}`,
  previewText: `${mainFragment.content}\n${ruleFragment.content}`,
}

const mockBuilder = {
  materials,
  draft: currentDraft,
  rawDraft,
  preview: {
    title: currentDraft.name,
    text: currentDraft.previewText,
    missing: [],
  },
  previewHint: null,
  canCompose: true,
  libraryQuery: "",
  selectedCategory: ALL_CATEGORY_ID,
  categories: [ALL_CATEGORY_ID, mainFragment.meta.category],
  feedback: null,
  filteredMainFragments: materials.mainFragments.slice(0, 3),
  filteredRuleFragments: materials.expressionFragments.slice(0, 3),
  filteredInspirationFragments: materials.inspirationFragments.slice(0, 3),
  resolvedFragments: {
    mainFragment,
    ruleFragment,
    inspirationFragment: null,
  },
  reloadMaterials: vi.fn(),
  setLibraryQuery: vi.fn(),
  setSelectedCategory: vi.fn(),
  selectMainFragment: vi.fn(),
  clearMainFragment: vi.fn(),
  selectRuleFragment: vi.fn(),
  clearRuleFragment: vi.fn(),
  selectInspirationFragment: vi.fn(),
  clearSelectedInspiration: vi.fn(),
  updateMainSlotText: vi.fn(),
  updateRuleSlotText: vi.fn(),
  updateCustomPrompt: vi.fn(),
  copyPreviewText: vi.fn(),
}

vi.mock("@/hooks/use-soul-builder", () => ({
  useSoulBuilder: () => mockBuilder,
}))

function Harness() {
  const [theme, setTheme] = useState<ThemeMode>("light")

  return <HomePage theme={theme} onToggleTheme={() => setTheme((current) => (current === "dark" ? "light" : "dark"))} />
}

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe("HomePage", () => {
  it("renders header and footer around the builder workbench without breaking drawer flow", async () => {
    const user = userEvent.setup()
    render(<Harness />)

    expect(screen.getByRole("banner", { name: "Soul site header" })).toBeInTheDocument()
    expect(screen.getByRole("navigation", { name: "Soul site navigation" })).toBeInTheDocument()
    expect(screen.getByRole("region", { name: "Soul Builder workbench" })).toBeInTheDocument()
    expect(screen.getByRole("contentinfo", { name: "HagiSoul footer" })).toBeInTheDocument()
    expect(screen.getAllByText("Agent Soul Editor")).toHaveLength(2)

    const themeButton = screen.getByRole("button", { name: "Switch to dark theme" })
    expect(themeButton).toHaveAttribute("aria-pressed", "false")
    await user.click(themeButton)
    expect(screen.getByRole("button", { name: "Switch to light theme" })).toHaveAttribute("aria-pressed", "true")

    await user.click(screen.getAllByRole("button", { name: "Base role" })[0])
    expect(screen.getByRole("dialog", { name: "Choose a base role" })).toBeInTheDocument()
    expect(screen.getByRole("contentinfo", { name: "HagiSoul footer" })).toBeInTheDocument()
    expect(screen.getAllByText("Agent Soul Editor")).toHaveLength(2)
  })

  it("keeps responsive shell hooks and keyboard focus entrypoints for site chrome", async () => {
    const user = userEvent.setup()
    render(<Harness />)

    const main = screen.getByRole("main")
    const headerNav = screen.getByRole("navigation", { name: "Soul site navigation" })
    const footer = screen.getByRole("contentinfo", { name: "HagiSoul footer" })
    const filingBlock = screen.getByRole("link", { name: "View the ICP filing record" }).parentElement

    expect(main).toHaveClass("site-shell")
    expect(main).toHaveClass("overflow-x-clip")
    expect(headerNav).toHaveClass("site-header-nav")
    expect(footer).toHaveClass("site-footer")
    expect(filingBlock).toHaveClass("site-footer-filings")

    await user.tab()
    expect(within(headerNav).getByRole("link", { name: "Open the HagiCode docs site" })).toHaveFocus()
  })

  it("switches locale at runtime while preserving the open drawer and authored draft text", async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.click(screen.getAllByRole("button", { name: "Base role" })[0])
    expect(screen.getByRole("dialog", { name: "Choose a base role" })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Base role slot" })).toHaveValue(mainFragment.content)

    await user.click(screen.getByRole("button", { name: "中文" }))

    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: "基础角色选择" })).toBeInTheDocument()
    })
    expect(screen.getByRole("textbox", { name: "基础角色插槽" })).toHaveValue(mainFragment.content)
    expect(screen.getByRole("button", { name: "基础角色" })).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByRole("contentinfo", { name: "HagiSoul 页脚" })).toBeInTheDocument()
  })
})
