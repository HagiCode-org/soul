import { fireEvent, render } from "@testing-library/react"
import { beforeAll, beforeEach, describe, expect, it } from "vitest"

import { BuilderHeroIntro } from "./BuilderHeroIntro"
import { installGaEventTracking } from "@hagicode/hagilight-core/analytics-events"
import { currentGtag, installGtagStub, readGtagWindow } from "@/test/gtag"

beforeAll(() => {
  installGaEventTracking(document, readGtagWindow())
})

beforeEach(() => {
  installGtagStub()
})

describe("BuilderHeroIntro click tracking", () => {
  it("sends one soul_hero navigation event for the documentation call to action", () => {
    const { container } = render(
      <BuilderHeroIntro mainCount={3} ruleCount={2} ready remoteMessage={null} />,
    )
    const docsLink = container.querySelector<HTMLAnchorElement>('a[href="https://docs.hagicode.com/"]')
    expect(docsLink).not.toBeNull()

    fireEvent.click(docsLink as HTMLAnchorElement)

    expect(currentGtag()).toHaveBeenCalledTimes(1)
    expect(currentGtag()).toHaveBeenCalledWith(
      "event",
      "link_click",
      expect.objectContaining({
        event_category: "navigation",
        event_label: "docs",
        link_location: "soul_hero",
        link_url: "https://docs.hagicode.com/",
      }),
    )
  })

  it("sends nothing for the in-page workbench anchor", () => {
    const { container } = render(
      <BuilderHeroIntro mainCount={3} ruleCount={2} ready remoteMessage={null} />,
    )
    const workbenchLink = container.querySelector<HTMLAnchorElement>('a[href="#home-workbench"]')
    expect(workbenchLink).not.toBeNull()

    fireEvent.click(workbenchLink as HTMLAnchorElement)

    expect(currentGtag()).not.toHaveBeenCalled()
  })
})
