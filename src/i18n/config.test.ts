import { afterEach, describe, expect, it } from "vitest"

import { i18n, initializeI18n } from "@/i18n/config"
import { LOCALE_STORAGE_KEY } from "@/i18n/locales"

const originalNavigatorLanguage = navigator.language

afterEach(async () => {
  Object.defineProperty(window.navigator, "language", {
    configurable: true,
    value: originalNavigatorLanguage,
  })
  localStorage.clear()
  await initializeI18n({ force: true, locale: "en-US" })
})

describe("i18n config", () => {
  it("prefers the stored locale during bootstrap", async () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, "zh-CN")

    await initializeI18n({ force: true })

    expect(i18n.resolvedLanguage).toBe("zh-CN")
  })

  it("detects zh-family browser languages on first load", async () => {
    localStorage.clear()
    Object.defineProperty(window.navigator, "language", {
      configurable: true,
      value: "zh-TW",
    })

    await initializeI18n({ force: true })

    expect(i18n.resolvedLanguage).toBe("zh-CN")
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe("zh-CN")
  })

  it("falls back to en-US when the stored locale is unsupported", async () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, "fr-FR")
    Object.defineProperty(window.navigator, "language", {
      configurable: true,
      value: "fr-FR",
    })

    await initializeI18n({ force: true })

    expect(i18n.resolvedLanguage).toBe("en-US")
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe("en-US")
  })
})
