import "@testing-library/jest-dom/vitest"
import { beforeEach } from "vitest"

import { initializeI18n } from "@/i18n/config"
import { DEFAULT_LOCALE } from "@/i18n/locales"

if (!URL.createObjectURL) {
  URL.createObjectURL = () => "blob:test"
}

if (!URL.revokeObjectURL) {
  URL.revokeObjectURL = () => undefined
}

beforeEach(async () => {
  localStorage.clear()
  await initializeI18n({ force: true, locale: DEFAULT_LOCALE })
})
