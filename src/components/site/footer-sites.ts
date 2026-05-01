import footerSitesSnapshot from "@/data/generated/footer-sites.snapshot.json"
import type { AppLocale } from "@/i18n/locales"

type FooterCatalogLocale = AppLocale
type LocalizedFooterField = string | Readonly<Record<FooterCatalogLocale, string>>

type FooterSnapshotEntry = {
  id: string
  title: LocalizedFooterField
  description: LocalizedFooterField
  url: string
}

function normalizeUrl(url: string) {
  const normalized = new URL(url)
  normalized.hash = ""
  normalized.search = ""
  const pathname = normalized.pathname.replace(/\/+$/u, "")
  normalized.pathname = pathname || "/"
  return normalized.toString()
}

function getFooterLocaleFallbackChain(locale: FooterCatalogLocale): readonly FooterCatalogLocale[] {
  return locale === "zh-Hant" ? ["zh-CN", "en-US"] : ["en-US"]
}

function resolveLocalizedField(field: LocalizedFooterField, locale: FooterCatalogLocale): string {
  if (typeof field === "string") {
    return field
  }

  for (const candidate of [locale, ...getFooterLocaleFallbackChain(locale)]) {
    const value = field[candidate]
    if (typeof value === "string" && value.trim().length > 0) {
      return value
    }
  }

  for (const value of Object.values(field)) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value
    }
  }

  return ""
}

function buildLocalizedEntry(entry: FooterSnapshotEntry, locale: AppLocale) {
  return {
    id: entry.id,
    title: resolveLocalizedField(entry.title, locale),
    description: resolveLocalizedField(entry.description, locale),
    url: entry.url,
  }
}

export function resolveFooterSiteEntryById(siteId: string, locale: AppLocale) {
  const entry = footerSitesSnapshot.entries.find((item) => item.id === siteId) as FooterSnapshotEntry | undefined
  return entry ? buildLocalizedEntry(entry, locale) : null
}

export function resolveFooterSiteEntryByUrl(url: string, locale: AppLocale) {
  const normalizedUrl = normalizeUrl(url)
  const entry = footerSitesSnapshot.entries.find(
    (item) => normalizeUrl((item as FooterSnapshotEntry).url) === normalizedUrl,
  ) as FooterSnapshotEntry | undefined
  return entry ? buildLocalizedEntry(entry, locale) : null
}
