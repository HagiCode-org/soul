export const SUPPORTED_LOCALES = ["zh-CN", "en-US"] as const
export type AppLocale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: AppLocale = "en-US"
export const LOCALE_STORAGE_KEY = "soul.locale"
export const ALL_CATEGORY_ID = "__all__"

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
  return isSupportedLocale(value) ? value : DEFAULT_LOCALE
}

export function resolveLocaleFromLanguage(language: string | null | undefined): AppLocale {
  const normalized = language?.trim().toLowerCase() ?? ""
  return normalized.startsWith("zh") ? "zh-CN" : "en-US"
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
