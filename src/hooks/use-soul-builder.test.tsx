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

type Builder = ReturnType<typeof useSoulBuilder>

// Latest hook result, read by the tests between act() calls. Each action runs in its own act so the
// action closure always sees the state produced by the previous one.
const probe: { builder: Builder | null } = { builder: null }

function BuilderProbe() {
  probe.builder = useSoulBuilder()
  return null
}

function builder(): Builder {
  if (!probe.builder) {
    throw new Error("builder is not mounted")
  }
  return probe.builder
}

type FakePostHog = {
  __loaded: boolean
  capture: ReturnType<typeof vi.fn>
  has_opted_out_capturing: () => boolean
}

function siteEvents(capture: FakePostHog["capture"], name: string) {
  return capture.mock.calls.filter(([eventName]) => eventName === name).map(([, properties]) => properties)
}

describe("useSoulBuilder PostHog events", () => {
  let writeText: ReturnType<typeof vi.fn>
  let capture: FakePostHog["capture"]

  beforeEach(async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("remote offline"))
    writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true })
    capture = vi.fn()
    ;(window as unknown as { posthog?: FakePostHog }).posthog = {
      __loaded: true,
      capture,
      has_opted_out_capturing: () => false,
    }
    probe.builder = null
    render(<BuilderProbe />)
    await waitFor(() => {
      expect(builder().materials.mainFragments.length).toBeGreaterThan(0)
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    delete (window as unknown as { posthog?: unknown }).posthog
    delete (navigator as unknown as { clipboard?: unknown }).clipboard
  })

  function mainId() {
    const id = builder().materials.mainFragments[14]?.fragmentId
    if (!id) throw new Error("no main fragment")
    return id
  }

  function ruleId() {
    const id = builder().materials.expressionFragments[5]?.fragmentId
    if (!id) throw new Error("no rule fragment")
    return id
  }

  function inspirationId() {
    const id = builder().materials.inspirationFragments[0]?.fragmentId
    if (!id) throw new Error("no inspiration fragment")
    return id
  }

  async function arrange({ main, rule, inspiration }: { main: "selected" | "typed"; rule: "selected" | "typed"; inspiration: boolean }) {
    act(() => builder().clearSelectedInspiration())
    act(() => builder().clearMainFragment())
    act(() => builder().clearRuleFragment())
    if (inspiration) {
      act(() => builder().selectInspirationFragment(inspirationId()))
      act(() => builder().clearMainFragment())
      act(() => builder().clearRuleFragment())
    }
    if (main === "selected") {
      act(() => builder().selectMainFragment(mainId()))
    } else {
      act(() => builder().updateMainSlotText("typed main text"))
    }
    if (rule === "selected") {
      act(() => builder().selectRuleFragment(ruleId()))
    } else {
      act(() => builder().updateRuleSlotText("typed rule text"))
    }
  }

  async function copy() {
    await act(async () => {
      await builder().copyPreviewText()
    })
  }

  const combinations = [true, false].flatMap((main) =>
    [true, false].flatMap((rule) => [true, false].map((inspiration) => ({ main, rule, inspiration })))
  )

  it.each(combinations)(
    "sends exactly the four booleans for main_selected=$main rule_selected=$rule inspiration_selected=$inspiration",
    async ({ main, rule, inspiration }) => {
      await arrange({ main: main ? "selected" : "typed", rule: rule ? "selected" : "typed", inspiration })
      expect(builder().canCompose).toBe(true)
      capture.mockClear()

      await copy()

      expect(siteEvents(capture, "soul_preview_copied")).toEqual([
        { can_compose: true, main_selected: main, rule_selected: rule, inspiration_selected: inspiration },
      ])
    }
  )

  it("sends nothing when the clipboard write is rejected", async () => {
    await arrange({ main: "selected", rule: "selected", inspiration: false })
    capture.mockClear()
    writeText.mockRejectedValueOnce(new Error("permission denied"))

    await act(async () => {
      await builder().copyPreviewText().catch(() => undefined)
    })

    expect(siteEvents(capture, "soul_preview_copied")).toEqual([])
  })

  it("sends nothing when the preview is incomplete", async () => {
    await arrange({ main: "selected", rule: "typed", inspiration: false })
    act(() => builder().updateRuleSlotText(""))
    capture.mockClear()

    await copy()

    expect(writeText).not.toHaveBeenCalled()
    expect(siteEvents(capture, "soul_preview_copied")).toEqual([])
  })

  it("keeps the payload to the four booleans when custom prompt and slot text are set", async () => {
    await arrange({ main: "selected", rule: "selected", inspiration: false })
    act(() => builder().updateCustomPrompt("private custom prompt"))
    act(() => builder().updateMainSlotText("private main slot text"))
    act(() => builder().updateRuleSlotText("private rule slot text"))
    capture.mockClear()

    await copy()

    const events = capture.mock.calls.filter(([name]) => name === "soul_preview_copied")
    expect(events).toHaveLength(1)
    expect(events[0]?.[1]).toEqual({ can_compose: true, main_selected: true, rule_selected: true, inspiration_selected: false })
    expect(JSON.stringify(events[0])).not.toMatch(/private/)
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("private custom prompt"))
  })

  it("copies normally and sends nothing when PostHog is missing", async () => {
    await arrange({ main: "selected", rule: "selected", inspiration: false })
    delete (window as unknown as { posthog?: unknown }).posthog

    await copy()

    expect(writeText).toHaveBeenCalledTimes(1)
    expect(builder().feedback?.tone).toBe("success")
  })

  it("sends soul_fragment_selected with slot main when a main fragment is selected", async () => {
    act(() => builder().selectMainFragment(mainId()))

    expect(siteEvents(capture, "soul_fragment_selected")).toEqual([{ slot: "main", fragment_id: mainId() }])
  })

  it("sends soul_fragment_selected with slot rule when a rule fragment is selected", async () => {
    act(() => builder().selectRuleFragment(ruleId()))

    expect(siteEvents(capture, "soul_fragment_selected")).toEqual([{ slot: "rule", fragment_id: ruleId() }])
  })

  it("sends soul_fragment_selected with slot inspiration when an inspiration fragment is selected", async () => {
    act(() => builder().selectInspirationFragment(inspirationId()))

    expect(siteEvents(capture, "soul_fragment_selected")).toEqual([{ slot: "inspiration", fragment_id: inspirationId() }])
  })

  it("does not send again when the same fragment is re-selected", async () => {
    act(() => builder().selectMainFragment(mainId()))
    act(() => builder().selectMainFragment(mainId()))
    act(() => builder().selectRuleFragment(ruleId()))
    act(() => builder().selectRuleFragment(ruleId()))
    act(() => builder().selectInspirationFragment(inspirationId()))
    act(() => builder().selectInspirationFragment(inspirationId()))

    expect(siteEvents(capture, "soul_fragment_selected")).toHaveLength(3)
  })

  it("does not send when a slot is cleared or typed into", async () => {
    act(() => builder().selectMainFragment(mainId()))
    capture.mockClear()

    act(() => builder().clearMainFragment())
    act(() => builder().updateMainSlotText("typed main text"))
    act(() => builder().updateRuleSlotText("typed rule text"))
    act(() => builder().clearRuleFragment())

    expect(siteEvents(capture, "soul_fragment_selected")).toEqual([])
  })
})
