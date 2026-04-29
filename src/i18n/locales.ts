export const SUPPORTED_LOCALES = ["zh-CN", "zh-Hant", "ja-JP", "ko-KR", "de-DE", "fr-FR", "es-ES", "pt-BR", "ru-RU", "en-US"] as const
export type AppLocale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: AppLocale = "en-US"
export const LOCALE_STORAGE_KEY = "soul.locale"
export const ALL_CATEGORY_ID = "__all__"

export const LOCALE_LABELS: Record<AppLocale, string> = {
  "zh-CN": "简体中文",
  "zh-Hant": "繁體中文",
  "ja-JP": "日本語",
  "ko-KR": "한국어",
  "de-DE": "Deutsch",
  "fr-FR": "Français",
  "es-ES": "Español",
  "pt-BR": "Português (Brasil)",
  "ru-RU": "Русский",
  "en-US": "English",
}

export type CategoryTranslationKey =
  | "builder.categories.healingCompanion"
  | "builder.categories.characterPersona"
  | "builder.categories.professionalIdentity"
  | "builder.categories.communityCulture"
  | "builder.categories.contrastAndScene"

export const CATEGORY_TRANSLATION_KEYS: Record<string, CategoryTranslationKey> = {
  "治愈陪伴向": "builder.categories.healingCompanion",
  "个性人设向": "builder.categories.characterPersona",
  "职业身份向": "builder.categories.professionalIdentity",
  "圈层文化向": "builder.categories.communityCulture",
  "反差&场景专属向": "builder.categories.contrastAndScene",
}

export function isSupportedLocale(value: unknown): value is AppLocale {
  return typeof value === "string" && SUPPORTED_LOCALES.includes(value as AppLocale)
}

export function normalizeLocale(value: string | null | undefined): AppLocale {
  return resolveLocaleFromLanguage(value)
}

export function resolveLocaleFromLanguage(language: string | null | undefined): AppLocale {
  const normalized = language?.trim().toLowerCase() ?? ""
  if (SUPPORTED_LOCALES.includes(normalized as AppLocale)) {
    return normalized as AppLocale
  }

  if (normalized.startsWith("zh-hant") || normalized === "zh-tw" || normalized === "zh-hk" || normalized === "zh-mo") {
    return "zh-Hant"
  }

  if (normalized.startsWith("zh")) {
    return "zh-CN"
  }

  if (normalized.startsWith("ja")) {
    return "ja-JP"
  }

  if (normalized.startsWith("ko")) {
    return "ko-KR"
  }

  if (normalized.startsWith("de")) {
    return "de-DE"
  }

  if (normalized.startsWith("fr")) {
    return "fr-FR"
  }

  if (normalized.startsWith("es")) {
    return "es-ES"
  }

  if (normalized.startsWith("pt")) {
    return "pt-BR"
  }

  if (normalized.startsWith("ru")) {
    return "ru-RU"
  }

  return "en-US"
}

function getStorage() {
  if (typeof window === "undefined") {
    return null
  }

  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function readStoredLocale(): AppLocale | null {
  const storage = getStorage()
  const storedValue = storage?.getItem(LOCALE_STORAGE_KEY)
  return isSupportedLocale(storedValue) ? storedValue : null
}

export function persistLocale(locale: AppLocale) {
  const storage = getStorage()
  storage?.setItem(LOCALE_STORAGE_KEY, locale)
}

export function detectClientLocale(): AppLocale {
  if (typeof navigator === "undefined") {
    return DEFAULT_LOCALE
  }

  return resolveLocaleFromLanguage(navigator.language)
}

export function resolveInitialLocale(): AppLocale {
  return readStoredLocale() ?? detectClientLocale()
}
