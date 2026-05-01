import type { TFunction } from "i18next"
import type { AppLocale } from "@/i18n/locales"
import { resolveFooterSiteEntryById, resolveFooterSiteEntryByUrl } from "./footer-sites"

export type SiteLinkId = string

export type SiteLink = {
  id: SiteLinkId
  label: string
  description?: string
  href: string
  ariaLabel: string
  external: boolean
  openInNewTab: boolean
}

export type SiteLinkSection = {
  id: string
  title: string
  links: readonly SiteLink[]
}

type SiteLinkDefinition = Omit<SiteLink, "label" | "ariaLabel"> & {
  labelKey: string
  ariaLabelKey: string
}

type SiteLocale = AppLocale

const NEW_TAB_TARGET = "_blank" as const
const EXTERNAL_REL = "noopener noreferrer" as const

const soulSiteLinkDefinitions = {
  docs: {
    id: "docs",
    labelKey: "site.links.docs.label",
    href: "https://docs.hagicode.com/",
    ariaLabelKey: "site.links.docs.ariaLabel",
    external: true,
    openInNewTab: true,
  },
  website: {
    id: "website",
    labelKey: "site.links.website.label",
    href: "https://hagicode.com",
    ariaLabelKey: "site.links.website.ariaLabel",
    external: true,
    openInNewTab: true,
  },
  trait: {
    id: "trait",
    labelKey: "site.links.trait.label",
    href: "https://trait.hagicode.com",
    ariaLabelKey: "site.links.trait.ariaLabel",
    external: true,
    openInNewTab: true,
  },
  github: {
    id: "github",
    labelKey: "site.links.github.label",
    href: "https://github.com/HagiCode-org/site",
    ariaLabelKey: "site.links.github.ariaLabel",
    external: true,
    openInNewTab: true,
  },
  discord: {
    id: "discord",
    labelKey: "site.links.discord.label",
    href: "https://discord.gg/qY662sJK",
    ariaLabelKey: "site.links.discord.ariaLabel",
    external: true,
    openInNewTab: true,
  },
  qqGroup: {
    id: "qq-group",
    labelKey: "site.links.qqGroup.label",
    href: "https://qm.qq.com/q/Fwb0o094kw",
    ariaLabelKey: "site.links.qqGroup.ariaLabel",
    external: true,
    openInNewTab: true,
  },
  email: {
    id: "email",
    labelKey: "site.links.email.label",
    href: "mailto:support@hagicode.com",
    ariaLabelKey: "site.links.email.ariaLabel",
    external: true,
    openInNewTab: false,
  },
  steam: {
    id: "steam",
    labelKey: "site.links.steam.label",
    href: "https://store.steampowered.com/app/4625540/Hagicode/",
    ariaLabelKey: "site.links.steam.ariaLabel",
    external: true,
    openInNewTab: true,
  },
} as const satisfies Record<string, SiteLinkDefinition>

const filingLinkDefinitions = {
  icp: {
    id: "icp",
    label: "闽ICP备2026004153号-1",
    href: "https://beian.miit.gov.cn/",
    ariaLabelKey: "site.links.filings.icpAriaLabel",
    external: true,
    openInNewTab: true,
  },
  publicSecurity: {
    id: "public-security",
    label: "闽公网安备35011102351148号",
    href: "http://www.beian.gov.cn/portal/registerSystemInfo",
    ariaLabelKey: "site.links.filings.publicSecurityAriaLabel",
    external: true,
    openInNewTab: true,
  },
} as const

const DEFAULT_RELATED_SITE_ORDER = [
  "hagicode-main",
  "hagicode-docs",
  "newbe-blog",
  "index-data",
  "compose-builder",
  "cost-calculator",
  "status-page",
  "awesome-design-gallery",
  "soul-builder",
  "trait-builder",
] as const

const CURRENT_SITE_ID = "soul-builder"

function buildSiteLink(t: TFunction, definition: SiteLinkDefinition): SiteLink {
  return {
    id: definition.id,
    href: definition.href,
    external: definition.external,
    openInNewTab: definition.openInNewTab,
    label: t(definition.labelKey),
    ariaLabel: t(definition.ariaLabelKey),
  }
}

function resolveCatalogMetadata(url: string, locale: SiteLocale) {
  return resolveFooterSiteEntryByUrl(url, locale)
}

function normalizeUrl(url: string) {
  const normalized = new URL(url)
  normalized.hash = ""
  normalized.search = ""
  const pathname = normalized.pathname.replace(/\/+$/, "")
  normalized.pathname = pathname || "/"
  return normalized.toString()
}

function buildSnapshotAriaLabel(locale: SiteLocale, title: string) {
  switch (locale) {
    case "zh-CN":
      return `打开 ${title}`
    case "zh-Hant":
      return `打開 ${title}`
    case "ja-JP":
      return `${title} を開く`
    case "ko-KR":
      return `${title} 열기`
    case "de-DE":
      return `${title} öffnen`
    case "fr-FR":
      return `Ouvrir ${title}`
    case "es-ES":
      return `Abrir ${title}`
    case "pt-BR":
      return `Abrir ${title}`
    case "ru-RU":
      return `Открыть ${title}`
    default:
      return `Open ${title}`
  }
}

function resolveSnapshotRelatedLinks(locale: SiteLocale, localLinks: readonly SiteLink[]): SiteLink[] {
  const localIds = new Set(localLinks.map((link) => link.id))
  const localUrls = new Set(localLinks.map((link) => normalizeUrl(link.href)))

  return DEFAULT_RELATED_SITE_ORDER.flatMap((siteId) => {
    const entry = resolveFooterSiteEntryById(siteId, locale)
    if (!entry || entry.id === CURRENT_SITE_ID) {
      return []
    }

    if (localIds.has(entry.id) || localUrls.has(normalizeUrl(entry.url))) {
      return []
    }

    return [{
      id: entry.id,
      label: entry.title,
      description: entry.description,
      href: entry.url,
      ariaLabel: buildSnapshotAriaLabel(locale, entry.title),
      external: true,
      openInNewTab: true,
    }]
  })
}

export function getHeaderNavigationLinks(t: TFunction) {
  return [
    buildSiteLink(t, soulSiteLinkDefinitions.docs),
    buildSiteLink(t, soulSiteLinkDefinitions.website),
    buildSiteLink(t, soulSiteLinkDefinitions.trait),
    buildSiteLink(t, soulSiteLinkDefinitions.discord),
  ] as const
}

export function getFooterLinkSections(t: TFunction, locale: SiteLocale): readonly SiteLinkSection[] {
  const localRelatedLinks = [
    buildSiteLink(t, soulSiteLinkDefinitions.docs),
    buildSiteLink(t, soulSiteLinkDefinitions.website),
  ].map((link) => {
    const metadata = resolveCatalogMetadata(link.href, locale)
    if (!metadata) {
      return link
    }

    return {
      ...link,
      label: metadata.title,
      description: metadata.description,
      ariaLabel: buildSnapshotAriaLabel(locale, metadata.title),
    }
  }) as readonly SiteLink[]

  return [
    {
      id: "related",
      title: t("site.footer.sections.related"),
      links: [...localRelatedLinks, ...resolveSnapshotRelatedLinks(locale, localRelatedLinks)],
    },
    {
      id: "community",
      title: t("site.footer.sections.community"),
      links: [
        buildSiteLink(t, soulSiteLinkDefinitions.github),
        buildSiteLink(t, soulSiteLinkDefinitions.discord),
        buildSiteLink(t, soulSiteLinkDefinitions.qqGroup),
        buildSiteLink(t, soulSiteLinkDefinitions.email),
        buildSiteLink(t, soulSiteLinkDefinitions.steam),
      ],
    },
  ] as const
}

export function getFilingLinks(t: TFunction): readonly SiteLink[] {
  return [
    {
      id: filingLinkDefinitions.icp.id,
      label: filingLinkDefinitions.icp.label,
      href: filingLinkDefinitions.icp.href,
      external: filingLinkDefinitions.icp.external,
      openInNewTab: filingLinkDefinitions.icp.openInNewTab,
      ariaLabel: t(filingLinkDefinitions.icp.ariaLabelKey),
    },
    {
      id: filingLinkDefinitions.publicSecurity.id,
      label: filingLinkDefinitions.publicSecurity.label,
      href: filingLinkDefinitions.publicSecurity.href,
      external: filingLinkDefinitions.publicSecurity.external,
      openInNewTab: filingLinkDefinitions.publicSecurity.openInNewTab,
      ariaLabel: t(filingLinkDefinitions.publicSecurity.ariaLabelKey),
    },
  ]
}

export function getSiteLinkTarget(link: Pick<SiteLink, "openInNewTab">) {
  return link.openInNewTab ? NEW_TAB_TARGET : undefined
}

export function getSiteLinkRel(link: Pick<SiteLink, "openInNewTab">) {
  return link.openInNewTab ? EXTERNAL_REL : undefined
}
