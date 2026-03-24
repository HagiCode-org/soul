import type { TFunction } from "i18next"

export type SiteLinkId = "docs" | "website" | "github" | "discord" | "qq-group" | "email" | "icp" | "public-security"

export type SiteLink = {
  id: SiteLinkId
  label: string
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
    buildSiteLink(t, soulSiteLinkDefinitions.discord),
  ] as const
}

export function getFooterLinkSections(t: TFunction): readonly SiteLinkSection[] {
  return [
    {
      id: "related",
      title: t("site.footer.sections.related"),
      links: [buildSiteLink(t, soulSiteLinkDefinitions.docs), buildSiteLink(t, soulSiteLinkDefinitions.website)],
    },
    {
      id: "community",
      title: t("site.footer.sections.community"),
      links: [
        buildSiteLink(t, soulSiteLinkDefinitions.github),
        buildSiteLink(t, soulSiteLinkDefinitions.discord),
        buildSiteLink(t, soulSiteLinkDefinitions.qqGroup),
        buildSiteLink(t, soulSiteLinkDefinitions.email),
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
