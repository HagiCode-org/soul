import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { SiteHeader } from "./SiteHeader"
import { i18n } from "@/i18n/config"
import { getSiteLinkRel, isFirstPartyHref } from "./site-links"

const newTab = (href: string) => ({ href, openInNewTab: true })

describe("soul first-party link policy", () => {
  it.each([
    "https://docs.hagicode.com/",
    "https://hagicode.com",
    "https://trait.hagicode.com",
    "https://HAGICODE.COM/",
    "https://github.com/HagiCode-org/site",
    "https://github.com/hagicode-org/site/issues",
    "/desktop/history",
  ])("treats %s as first-party and keeps the referring origin", (href) => {
    expect(isFirstPartyHref(href)).toBe(true)
    expect(getSiteLinkRel(newTab(href))).toBe("noopener")
  })

  it.each([
    "https://discord.gg/qY662sJK",
    "https://qm.qq.com/q/Fwb0o094kw",
    "https://store.steampowered.com/app/4625540/Hagicode/",
    "https://hagicode.com.evil.example/",
    "https://nothagicode.com/",
    "https://example.com/hagicode.com",
    "https://github.com/HagiCode-org-fake/site",
    "//evil.example/hagicode.com",
  ])("treats %s as third-party and strips the referrer", (href) => {
    expect(isFirstPartyHref(href)).toBe(false)
    expect(getSiteLinkRel(newTab(href))).toBe("noopener noreferrer")
  })

  it("leaves same-tab links without a policy rel", () => {
    expect(getSiteLinkRel({ href: "mailto:support@hagicode.com", openInNewTab: false })).toBeUndefined()
  })

  it("renders header anchors with the rel their destination needs", async () => {
    await i18n.changeLanguage("zh-CN")
    const { container } = render(<SiteHeader theme="light" onToggleTheme={() => undefined} />)
    const relOf = (href: string) => container.querySelector(`nav a[href="${href}"]`)?.getAttribute("rel")

    expect(relOf("https://docs.hagicode.com/")).toBe("noopener")
    expect(relOf("https://hagicode.com")).toBe("noopener")
    expect(relOf("https://discord.gg/qY662sJK")).toBe("noopener noreferrer")
  })
})
