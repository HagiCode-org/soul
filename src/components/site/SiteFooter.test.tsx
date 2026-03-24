import { cleanup, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it } from "vitest"

import { SiteFooter } from "@/components/site/SiteFooter"

afterEach(() => {
  cleanup()
})

describe("SiteFooter", () => {
  it("renders grouped footer links and filing links with safe attributes", () => {
    render(<SiteFooter />)

    const relatedLinks = screen.getByRole("navigation", { name: "相关链接" })
    const communityLinks = screen.getByRole("navigation", { name: "社群与支持" })

    expect(within(relatedLinks).getByRole("link", { name: "打开 HagiCode 官方文档" })).toHaveAttribute("target", "_blank")
    expect(within(relatedLinks).getByRole("link", { name: "打开 HagiCode 官方文档" })).toHaveAttribute("rel", "noopener noreferrer")
    expect(within(communityLinks).getByRole("link", { name: "打开 HagiCode GitHub 仓库" })).toHaveAttribute("target", "_blank")
    expect(within(communityLinks).getByRole("link", { name: "打开 HagiCode Discord 社群" })).toHaveAttribute("rel", "noopener noreferrer")

    const icpLink = screen.getByRole("link", { name: "查看 ICP 备案信息" })
    const publicSecurityLink = screen.getByRole("link", { name: "查看公安备案信息" })

    expect(icpLink).toHaveTextContent("闽ICP备2026004153号-1")
    expect(icpLink).toHaveAttribute("href", "https://beian.miit.gov.cn/")
    expect(icpLink).toHaveAttribute("target", "_blank")
    expect(icpLink).toHaveAttribute("rel", "noopener noreferrer")
    expect(publicSecurityLink).toHaveTextContent("闽公网安备35011102351148号")
    expect(publicSecurityLink).toHaveAttribute("href", "http://www.beian.gov.cn/portal/registerSystemInfo")
    expect(publicSecurityLink).toHaveAttribute("target", "_blank")
    expect(publicSecurityLink).toHaveAttribute("rel", "noopener noreferrer")
  })

  it("keeps footer links keyboard-focusable with responsive filing container hooks", async () => {
    const user = userEvent.setup()
    render(<SiteFooter />)

    const footer = screen.getByRole("contentinfo", { name: "HagiSoul 页脚" })
    const allLinks = within(footer).getAllByRole("link")
    const icpLink = screen.getByRole("link", { name: "查看 ICP 备案信息" })
    const publicSecurityLink = screen.getByRole("link", { name: "查看公安备案信息" })

    expect(footer).toHaveClass("site-footer")
    expect(icpLink.parentElement).toHaveClass("site-footer-filings")

    for (let index = 0; index < allLinks.length - 1; index += 1) {
      await user.tab()
    }

    expect(icpLink).toHaveFocus()
    await user.tab()
    expect(publicSecurityLink).toHaveFocus()
  })
})
