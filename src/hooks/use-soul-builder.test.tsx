import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useTranslation } from "react-i18next"

import { changeLocale } from "@/i18n/config"
import { translateMessage } from "@/i18n/message"
import { useSoulBuilder } from "@/hooks/use-soul-builder"

function FeedbackHarness() {
  const builder = useSoulBuilder()
  const { t } = useTranslation()

  return (
    <div>
      <button type="button" onClick={() => void builder.copyPreviewText()}>
        trigger copy
      </button>
      <p>{translateMessage(t, builder.feedback?.message)}</p>
      <p>{translateMessage(t, builder.materials.remoteMessage)}</p>
    </div>
  )
}

function SelectionHarness() {
  const builder = useSoulBuilder()
  const mainId = builder.materials.mainFragments[14]?.fragmentId
  const ruleId = builder.materials.expressionFragments[5]?.fragmentId

  return (
    <div>
      <button type="button" onClick={() => mainId && builder.selectMainFragment(mainId)}>
        select main
      </button>
      <button type="button" onClick={() => builder.clearMainFragment()}>
        clear main
      </button>
      <button type="button" onClick={() => ruleId && builder.selectRuleFragment(ruleId)}>
        select rule
      </button>
      <p data-testid="main-slot">{builder.draft.mainSlotText}</p>
      <p data-testid="rule-slot">{builder.draft.ruleSlotText}</p>
      <p data-testid="preview-title">{builder.preview.title}</p>
    </div>
  )
}

function RuleOrderHarness() {
  const builder = useSoulBuilder()

  return <p data-testid="first-rule-title">{builder.filteredRuleFragments[0]?.title ?? ""}</p>
}

describe("useSoulBuilder", () => {
  beforeEach(() => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("remote offline"))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("keeps feedback and remote status locale-aware across runtime switches", async () => {
    const user = userEvent.setup()
    render(<FeedbackHarness />)

    await waitFor(() => {
      expect(screen.getByText("remote offline Switched back to local sample cards.")).toBeInTheDocument()
    })

    await user.click(screen.getByRole("button", { name: "trigger copy" }))
    expect(screen.getByText("Fill the base role and expression slots first before generating a complete result.")).toBeInTheDocument()

    await act(async () => {
      await changeLocale("zh-CN")
    })

    await waitFor(() => {
      expect(screen.getByText("remote offline 已切换到本地示例卡。")).toBeInTheDocument()
    })
    expect(screen.getByText("先补基础角色和表达方式插槽，才能生成完整内容。")).toBeInTheDocument()
  })

  it("uses the active locale for newly selected materials while preserving existing draft text", async () => {
    const user = userEvent.setup()
    render(<SelectionHarness />)

    await user.click(screen.getByRole("button", { name: "select main" }))
    expect(screen.getByTestId("main-slot").textContent).toContain('Your persona core comes from "Shy Introvert Wallflower"')

    await user.click(screen.getByRole("button", { name: "select rule" }))
    expect(screen.getByTestId("rule-slot").textContent).toContain('Your expression rules come from "Chapter-Style Storytelling Mode"')
    expect(screen.getByTestId("preview-title").textContent).toBe("Shy Introvert Wallflower · Chapter-Style Storytelling Mode")

    await act(async () => {
      await changeLocale("zh-CN")
    })

    expect(screen.getByTestId("main-slot").textContent).toContain('Your persona core comes from "Shy Introvert Wallflower"')
    expect(screen.getByTestId("preview-title").textContent).toBe("社恐内向腼腆系 · 章回体说书叙事模式")

    await user.click(screen.getByRole("button", { name: "clear main" }))
    await user.click(screen.getByRole("button", { name: "select main" }))

    expect(screen.getByTestId("main-slot").textContent).toContain("你的人设内核来自「社恐内向腼腆系」")
  })

  it("pins the classical chinese ultra-minimal rule to the top of the visible rule list", async () => {
    render(<RuleOrderHarness />)

    await waitFor(() => {
      expect(screen.getByTestId("first-rule-title").textContent).toBe("文言文极简输出模式")
    })
  })
})
