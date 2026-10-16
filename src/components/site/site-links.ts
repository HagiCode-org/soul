import type { TFunction } from "i18next"
import { gaEventAttributes, type GaCategory } from "@hagicode/hagilight-core/analytics-events"
import type { AppLocale } from "@/i18n/locales"

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
const FIRST_PARTY_REL = "noopener" as const
const THIRD_PARTY_REL = "noopener noreferrer" as const
// Stand-in origin for relative hrefs: parsing against it makes "/path" same-origin and "//host" a real host.
const SAME_ORIGIN_BASE = "https://same-origin.invalid"

/**
 * First-party link policy, mirrored from @hagicode/hagilight-core links. Relative and same-origin
 * destinations count as first-party; hosts are compared after parsing, never by substring.
 */
export function isFirstPartyHref(href: string): boolean {
  let url: URL
  try {
    url = new URL(href, SAME_ORIGIN_BASE)
  } catch {
    return false
  }
  if (url.origin === SAME_ORIGIN_BASE) return true
  if (url.protocol !== "https:" && url.protocol !== "http:") return false

  const host = url.hostname.toLowerCase()
  if (host === "hagicode.com" || host.endsWith(".hagicode.com")) return true
  return host === "github.com" && url.pathname.split("/")[1]?.toLowerCase() === "hagicode-org"
}

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

export function getHeaderNavigationLinks(t: TFunction) {
  return [
    buildSiteLink(t, soulSiteLinkDefinitions.docs),
    buildSiteLink(t, soulSiteLinkDefinitions.website),
    buildSiteLink(t, soulSiteLinkDefinitions.trait),
    buildSiteLink(t, soulSiteLinkDefinitions.discord),
  ] as const
}

// Community destinations are reported as `community`; every other header link is `navigation`.
const COMMUNITY_LINK_IDS: ReadonlySet<SiteLinkId> = new Set(["github", "discord", "qq-group"])

/**
 * Click-tracking attributes for a header link. The label is the link's stable id, never its
 * localized text, so the same link reports the same label under every interface language.
 */
export function getSiteLinkAnalyticsAttributes(link: Pick<SiteLink, "id">, location: string) {
  const category: GaCategory = COMMUNITY_LINK_IDS.has(link.id) ? "community" : "navigation"
  return gaEventAttributes({ category, label: link.id, location })
}

export function getSiteLinkTarget(link: Pick<SiteLink, "openInNewTab">) {
  return link.openInNewTab ? NEW_TAB_TARGET : undefined
}

export function getSiteLinkRel(link: Pick<SiteLink, "href" | "openInNewTab">) {
  if (!link.openInNewTab) return undefined
  return isFirstPartyHref(link.href) ? FIRST_PARTY_REL : THIRD_PARTY_REL
}
