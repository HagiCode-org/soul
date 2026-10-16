import { fireEvent, render } from "@testing-library/react"
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest"

import { SiteHeader } from "./SiteHeader"
import { i18n } from "@/i18n/config"
import { installGaEventTracking } from "@hagicode/hagilight-core/analytics-events"
import { currentGtag, installGtagStub, readGtagWindow, removeGtag } from "@/test/gtag"

beforeAll(() => {
  // Installs the one document-level listener that Soul's GoogleAnalytics component installs in production.
  installGaEventTracking(document, readGtagWindow())
})

beforeEach(async () => {
  installGtagStub()
  await i18n.changeLanguage("zh-CN")
})

afterEach(() => {
  removeGtag()
})

function headerLink(container: HTMLElement, href: string) {
  const link = container.querySelector<HTMLAnchorElement>(`nav a[href="${href}"]`)
  expect(link).not.toBeNull()
  return link as HTMLAnchorElement
}

describe("SiteHeader click tracking", () => {
  it("sends exactly one navigation event for a header navigation link", () => {
    const { container } = render(<SiteHeader theme="light" onToggleTheme={() => undefined} />)

    fireEvent.click(headerLink(container, "https://docs.hagicode.com/"))

    expect(currentGtag()).toHaveBeenCalledTimes(1)
    expect(currentGtag()).toHaveBeenCalledWith(
      "event",
      "link_click",
      expect.objectContaining({
        event_category: "navigation",
        event_label: "docs",
        link_location: "soul_header",
        link_url: "https://docs.hagicode.com/",
      }),
    )
  })

  it("reports a community destination in the community category", () => {
    const { container } = render(<SiteHeader theme="light" onToggleTheme={() => undefined} />)

    fireEvent.click(headerLink(container, "https://discord.gg/qY662sJK"))

    expect(currentGtag()).toHaveBeenCalledWith(
      "event",
      "link_click",
      expect.objectContaining({
        event_category: "community",
        event_label: "discord",
        link_location: "soul_header",
      }),
    )
  })

  it("keeps the same id-based label under zh-CN and en-US", async () => {
    const first = render(<SiteHeader theme="light" onToggleTheme={() => undefined} />)
    fireEvent.click(headerLink(first.container, "https://docs.hagicode.com/"))
    first.unmount()

    await i18n.changeLanguage("en-US")
    const second = render(<SiteHeader theme="light" onToggleTheme={() => undefined} />)
    fireEvent.click(headerLink(second.container, "https://docs.hagicode.com/"))

    const labels = currentGtag()!.mock.calls.map(([, , params]) => (params as { event_label: string }).event_label)
    expect(labels).toEqual(["docs", "docs"])
  })

  it("does not throw and still navigates when gtag is absent", () => {
    removeGtag()
    const { container } = render(<SiteHeader theme="light" onToggleTheme={() => undefined} />)
    const link = headerLink(container, "https://docs.hagicode.com/")

    expect(() => fireEvent.click(link)).not.toThrow()
    expect(link.getAttribute("href")).toBe("https://docs.hagicode.com/")
  })
})
