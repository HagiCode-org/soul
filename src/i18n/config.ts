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
import { deDEResources } from "@/i18n/resources/de-DE"
import { enUSResources } from "@/i18n/resources/en-US"
import { esESResources } from "@/i18n/resources/es-ES"
import { frFRResources } from "@/i18n/resources/fr-FR"
import { jaJPResources } from "@/i18n/resources/ja-JP"
import { koKRResources } from "@/i18n/resources/ko-KR"
import { ptBRResources } from "@/i18n/resources/pt-BR"
import { ruRUResources } from "@/i18n/resources/ru-RU"
import { zhHantResources } from "@/i18n/resources/zh-Hant"
import { zhCNResources } from "@/i18n/resources/zh-CN"

const resources = {
  "zh-CN": {
    translation: zhCNResources,
  },
  "zh-Hant": {
    translation: zhHantResources,
  },
  "ja-JP": {
    translation: jaJPResources,
  },
  "ko-KR": {
    translation: koKRResources,
  },
  "de-DE": {
    translation: deDEResources,
  },
  "fr-FR": {
    translation: frFRResources,
  },
  "es-ES": {
    translation: esESResources,
  },
  "pt-BR": {
    translation: ptBRResources,
  },
  "ru-RU": {
    translation: ruRUResources,
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
  "zh-Hant": "HagiSoul：Agent Soul 編輯器",
  "ja-JP": "HagiSoul: Agent Soul エディター",
  "ko-KR": "HagiSoul: Agent Soul 편집기",
  "de-DE": "HagiSoul: Agent-Soul-Editor",
  "fr-FR": "HagiSoul : éditeur Agent Soul",
  "es-ES": "HagiSoul: editor de Agent Soul",
  "pt-BR": "HagiSoul: editor de Agent Soul",
  "ru-RU": "HagiSoul: редактор Agent Soul",
  "en-US": "HagiSoul: Agent Soul Editor",
}

const SITE_DESCRIPTION: Record<AppLocale, string> = {
  "zh-CN": "HagiSoul 为开发者提供更加方便快捷的 Soul 编辑平台，支持 Soul 的创建、分享与浏览。",
  "zh-Hant": "HagiSoul 為開發者提供更流暢的 Soul 編輯空間，支援 Soul 的建立、分享與瀏覽。",
  "ja-JP": "HagiSoul は、Soul の作成・共有・閲覧をすばやく行える開発者向けワークスペースです。",
  "ko-KR": "HagiSoul은 Soul을 더 빠르게 만들고, 공유하고, 둘러볼 수 있는 개발자용 작업 공간입니다.",
  "de-DE": "HagiSoul bietet Entwicklerinnen und Entwicklern einen schnelleren Workspace zum Erstellen, Teilen und Durchsuchen von Souls.",
  "fr-FR": "HagiSoul offre aux développeurs un espace plus rapide pour créer, partager et parcourir des Souls.",
  "es-ES": "HagiSoul ofrece a los desarrolladores un espacio más ágil para crear, compartir y explorar Souls.",
  "pt-BR": "HagiSoul oferece aos desenvolvedores um espaço mais rápido para criar, compartilhar e explorar Souls.",
  "ru-RU": "HagiSoul даёт разработчикам более быстрый интерфейс для создания, публикации и просмотра Souls.",
  "en-US": "HagiSoul gives developers a faster workspace for creating, sharing, and browsing Souls.",
}

const OG_LOCALE_BY_APP_LOCALE: Record<AppLocale, string> = {
  "zh-CN": "zh_CN",
  "zh-Hant": "zh_TW",
  "ja-JP": "ja_JP",
  "ko-KR": "ko_KR",
  "de-DE": "de_DE",
  "fr-FR": "fr_FR",
  "es-ES": "es_ES",
  "pt-BR": "pt_BR",
  "ru-RU": "ru_RU",
  "en-US": "en_US",
}

function updateDocumentHead(locale: AppLocale) {
  const title = SITE_TITLE[locale]
  const description = SITE_DESCRIPTION[locale]
  const ogLocale = OG_LOCALE_BY_APP_LOCALE[locale]
  const ogLocaleAlt = locale === "en-US" ? "zh_CN" : "en_US"

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
