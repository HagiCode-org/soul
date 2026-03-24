import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import {
  DEFAULT_LOCALE,
  detectClientLocale,
  isSupportedLocale,
  persistLocale,
  resolveInitialLocale,
  type AppLocale,
} from "@/i18n/locales"
import { enUSResources } from "@/i18n/resources/en-US"
import { zhCNResources } from "@/i18n/resources/zh-CN"

const resources = {
  "zh-CN": {
    translation: zhCNResources,
  },
  "en-US": {
    translation: enUSResources,
  },
} as const

type InitializeI18nOptions = {
  force?: boolean
  locale?: AppLocale
}

let initialized = false
let listenerAttached = false
let initPromise: Promise<typeof i18n> | null = null

const SITE_TITLE: Record<AppLocale, string> = {
  "zh-CN": "HagiSoul：Agent Soul 编辑器",
  "en-US": "HagiSoul: Agent Soul Editor",
}

const SITE_DESCRIPTION: Record<AppLocale, string> = {
  "zh-CN": "HagiSoul 为开发者提供更加方便快捷的 Soul 编辑平台，支持 Soul 的创建、分享与浏览。",
  "en-US": "HagiSoul gives developers a faster workspace for creating, sharing, and browsing Souls.",
}

function updateDocumentHead(locale: AppLocale) {
  const title = SITE_TITLE[locale]
  const description = SITE_DESCRIPTION[locale]
  const ogLocale = locale === "zh-CN" ? "zh_CN" : "en_US"
  const ogLocaleAlt = locale === "zh-CN" ? "en_US" : "zh_CN"

  document.documentElement.lang = locale
  document.title = title

  const updates: [string, string, string][] = [
    ["name", "description", description],
    ["property", "og:title", title],
    ["property", "og:description", description],
    ["property", "og:locale", ogLocale],
    ["property", "og:locale:alternate", ogLocaleAlt],
    ["name", "twitter:title", title],
    ["name", "twitter:description", description],
  ]

  for (const [attr, key, content] of updates) {
    const selector = attr === "name"
      ? `meta[name="${key}"]`
      : `meta[property="${key}"]`
    document.querySelector(selector)?.setAttribute("content", content)
  }
}

function attachPersistenceListener() {
  if (listenerAttached) {
    return
  }

  i18n.on("languageChanged", (language) => {
    if (isSupportedLocale(language)) {
      persistLocale(language)
      updateDocumentHead(language)
      return
    }

    persistLocale(detectClientLocale())
  })

  listenerAttached = true
}

async function initInstance(locale: AppLocale) {
  if (!i18n.isInitialized) {
    await i18n.use(initReactI18next).init({
      resources,
      lng: locale,
      fallbackLng: DEFAULT_LOCALE,
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    })
  } else if (i18n.language !== locale) {
    await i18n.changeLanguage(locale)
  }

  attachPersistenceListener()
  persistLocale(locale)
  updateDocumentHead(locale)
  initialized = true
  return i18n
}

export async function initializeI18n(options: InitializeI18nOptions = {}) {
  const locale = options.locale ?? resolveInitialLocale()

  if (options.force) {
    initPromise = initInstance(locale)
    return initPromise
  }

  if (initialized && i18n.isInitialized) {
    return i18n
  }

  if (!initPromise) {
    initPromise = initInstance(locale)
  }

  return initPromise
}

export async function changeLocale(locale: AppLocale) {
  await initializeI18n({ locale })
  if (i18n.language !== locale) {
    await i18n.changeLanguage(locale)
  }
}

export { i18n }
