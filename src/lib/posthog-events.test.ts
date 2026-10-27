import { afterEach, describe, expect, it, vi } from "vitest"

import { SITE_EVENT_STRING_MAX_LENGTH, SITE_POSTHOG_EVENTS, captureSiteEvent } from "@/lib/posthog-events"

type FakePostHog = {
  __loaded?: boolean
  capture: ReturnType<typeof vi.fn>
  has_opted_out_capturing: ReturnType<typeof vi.fn>
}

function createFakePostHog(overrides: Partial<FakePostHog> = {}): FakePostHog {
  return {
    __loaded: true,
    capture: vi.fn(),
    has_opted_out_capturing: vi.fn(() => false),
    ...overrides,
  }
}

const FORBIDDEN_KEYS = ["site_id", "site_framework", "hagilight_version", "locale", "page_type"]

// Exact allowlist per event. Changing the table without changing this map fails the test on purpose.
const EXPECTED_ALLOWLIST: Record<string, string[]> = {
  soul_preview_copied: ["can_compose", "main_selected", "rule_selected", "inspiration_selected"],
  soul_fragment_selected: ["slot", "fragment_id"],
}

describe("site PostHog capture wrapper", () => {
  afterEach(() => {
    vi.restoreAllMocks()
    delete (window as unknown as { posthog?: unknown }).posthog
  })

  it("sends an allowlisted event to a loaded SDK with the expected properties", () => {
    const posthog = createFakePostHog()

    captureSiteEvent(
      "soul_preview_copied",
      { can_compose: true, main_selected: true, rule_selected: false, inspiration_selected: false },
      { posthog }
    )

    expect(posthog.has_opted_out_capturing).toHaveBeenCalledTimes(1)
    expect(posthog.capture).toHaveBeenCalledWith("soul_preview_copied", {
      can_compose: true,
      main_selected: true,
      rule_selected: false,
      inspiration_selected: false,
    })
  })

  it("drops an event whose name is not in the site table", () => {
    const posthog = createFakePostHog()

    captureSiteEvent("soul_unknown_thing", { slot: "main" }, { posthog })

    expect(posthog.capture).not.toHaveBeenCalled()
  })

  it("does not treat inherited object keys as event names", () => {
    const posthog = createFakePostHog()

    captureSiteEvent("toString", {}, { posthog })
    captureSiteEvent("constructor", {}, { posthog })

    expect(posthog.capture).not.toHaveBeenCalled()
  })

  it("drops keys that are not in the event allowlist", () => {
    const posthog = createFakePostHog()

    captureSiteEvent("soul_fragment_selected", { slot: "rule", fragment_id: "frag-042", custom_prompt: "secret" }, { posthog })

    expect(posthog.capture).toHaveBeenCalledWith("soul_fragment_selected", { slot: "rule", fragment_id: "frag-042" })
  })

  it("drops non-primitive, wrong-kind and out-of-enum values", () => {
    const posthog = createFakePostHog()

    captureSiteEvent(
      "soul_fragment_selected",
      { slot: "elsewhere", fragment_id: { id: "frag-042" } as unknown as string },
      { posthog }
    )
    captureSiteEvent(
      "soul_preview_copied",
      { can_compose: "yes" as unknown as boolean, main_selected: ["x"] as unknown as boolean, rule_selected: 1 as unknown as boolean, inspiration_selected: null as unknown as boolean },
      { posthog }
    )

    expect(posthog.capture).toHaveBeenNthCalledWith(1, "soul_fragment_selected", {})
    expect(posthog.capture).toHaveBeenNthCalledWith(2, "soul_preview_copied", {})
  })

  it("truncates strings longer than the maximum length", () => {
    const posthog = createFakePostHog()
    const longId = "f".repeat(SITE_EVENT_STRING_MAX_LENGTH + 72)

    captureSiteEvent("soul_fragment_selected", { slot: "main", fragment_id: longId }, { posthog })

    const sent = posthog.capture.mock.calls[0]?.[1] as { fragment_id: string }
    expect(sent.fragment_id).toHaveLength(SITE_EVENT_STRING_MAX_LENGTH)
  })

  it("drops hagilight super properties supplied by the caller", () => {
    const posthog = createFakePostHog()

    captureSiteEvent(
      "soul_fragment_selected",
      { slot: "main", fragment_id: "frag-042", site_id: "soul", locale: "en-US", page_type: "home", site_framework: "astro", hagilight_version: "0.18.0" },
      { posthog }
    )

    const sent = posthog.capture.mock.calls[0]?.[1] as Record<string, unknown>
    for (const key of FORBIDDEN_KEYS) {
      expect(sent).not.toHaveProperty(key)
    }
  })

  it("does nothing when window.posthog is undefined and does not throw", () => {
    expect(() => captureSiteEvent("soul_preview_copied", { can_compose: true })).not.toThrow()
  })

  it("reads window.posthog when no SDK is passed explicitly", () => {
    const posthog = createFakePostHog()
    ;(window as unknown as { posthog?: FakePostHog }).posthog = posthog

    captureSiteEvent("soul_preview_copied", { can_compose: true })

    expect(posthog.capture).toHaveBeenCalledWith("soul_preview_copied", { can_compose: true })
  })

  it("queues on a stub that is not loaded and does not call has_opted_out_capturing", () => {
    const posthog = createFakePostHog({ __loaded: false })

    captureSiteEvent("soul_preview_copied", { can_compose: true }, { posthog })

    expect(posthog.capture).toHaveBeenCalledWith("soul_preview_copied", { can_compose: true })
    expect(posthog.has_opted_out_capturing).not.toHaveBeenCalled()
  })

  it("sends nothing once loaded when the visitor has opted out", () => {
    const posthog = createFakePostHog({ has_opted_out_capturing: vi.fn(() => true) })

    captureSiteEvent("soul_preview_copied", { can_compose: true }, { posthog })

    expect(posthog.has_opted_out_capturing).toHaveBeenCalledTimes(1)
    expect(posthog.capture).not.toHaveBeenCalled()
  })

  it("sends nothing when the caller's consent check says no", () => {
    const posthog = createFakePostHog()

    captureSiteEvent("soul_preview_copied", { can_compose: true }, { posthog, isAllowed: () => false })

    expect(posthog.capture).not.toHaveBeenCalled()
  })

  it("returns normally when capture throws", () => {
    const posthog = createFakePostHog({
      capture: vi.fn(() => {
        throw new Error("network down")
      }),
    })

    expect(() => captureSiteEvent("soul_fragment_selected", { slot: "main", fragment_id: "frag-042" }, { posthog })).not.toThrow()
  })

  it("keeps every event name snake_case with the object first", () => {
    for (const name of Object.keys(SITE_POSTHOG_EVENTS)) {
      expect(name).toMatch(/^[a-z]+(_[a-z]+)+$/)
    }
  })

  it("never lists a hagilight super property as a site property key", () => {
    for (const keys of Object.values(SITE_POSTHOG_EVENTS)) {
      for (const key of Object.keys(keys)) {
        expect(FORBIDDEN_KEYS).not.toContain(key)
      }
    }
  })

  it("matches the reviewed event and key allowlist exactly", () => {
    expect(Object.keys(SITE_POSTHOG_EVENTS).sort()).toEqual(Object.keys(EXPECTED_ALLOWLIST).sort())
    for (const [name, keys] of Object.entries(EXPECTED_ALLOWLIST)) {
      expect(Object.keys(SITE_POSTHOG_EVENTS[name] ?? {}).sort()).toEqual([...keys].sort())
    }
  })

  it("sends exactly the allowlisted set for every table event when the input contains a URL, free text and super properties", () => {
    const posthog = createFakePostHog()
    const noisyInput: Record<string, unknown> = {
      url: "https://soul.hagicode.com/builder?q=secret#frag",
      free_text: "my custom prompt with private words",
      customPrompt: "private prompt",
      mainSlotText: "private main slot",
      ruleSlotText: "private rule slot",
      site_id: "soul",
      site_framework: "astro",
      hagilight_version: "0.18.0",
      locale: "en-US",
      page_type: "home",
      // Values for allowlisted keys, one of each shape, so a valid representative input is also present.
      can_compose: true,
      main_selected: true,
      rule_selected: true,
      inspiration_selected: false,
      slot: "main",
      fragment_id: "frag-042",
    }

    for (const [name, keys] of Object.entries(SITE_POSTHOG_EVENTS)) {
      posthog.capture.mockClear()
      captureSiteEvent(name, noisyInput, { posthog })

      expect(posthog.capture).toHaveBeenCalledTimes(1)
      const [sentName, sentProperties] = posthog.capture.mock.calls[0] as [string, Record<string, unknown>]
      expect(sentName).toBe(name)
      expect(Object.keys(sentProperties).sort()).toEqual(Object.keys(keys).filter((key) => key in noisyInput).sort())
      expect(Object.keys(sentProperties).sort()).toEqual([...EXPECTED_ALLOWLIST[name]].sort())
      expect(JSON.stringify(sentProperties)).not.toMatch(/https?:|private|secret/)
    }
  })
})
