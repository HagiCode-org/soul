export type SiteLink = {
  id: string
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

const NEW_TAB_TARGET = "_blank" as const
const EXTERNAL_REL = "noopener noreferrer" as const

// Keep these public values aligned with the already published entries in repos/site and repos/docs.
export const soulSiteLinks = {
  docs: {
    id: "docs",
    label: "文档",
    href: "https://docs.hagicode.com/",
    ariaLabel: "打开 HagiCode 官方文档",
    external: true,
    openInNewTab: true,
  },
  website: {
    id: "website",
    label: "官网",
    href: "https://hagicode.com",
    ariaLabel: "打开 HagiCode 官网",
    external: true,
    openInNewTab: true,
  },
  github: {
    id: "github",
    label: "GitHub",
    href: "https://github.com/HagiCode-org/site",
    ariaLabel: "打开 HagiCode GitHub 仓库",
    external: true,
    openInNewTab: true,
  },
  discord: {
    id: "discord",
    label: "Discord",
    href: "https://discord.gg/qY662sJK",
    ariaLabel: "打开 HagiCode Discord 社群",
    external: true,
    openInNewTab: true,
  },
  qqGroup: {
    id: "qq-group",
    label: "QQ 群 610394020",
    href: "https://qm.qq.com/q/Fwb0o094kw",
    ariaLabel: "打开 HagiCode QQ 群 610394020",
    external: true,
    openInNewTab: true,
  },
  email: {
    id: "email",
    label: "support@hagicode.com",
    href: "mailto:support@hagicode.com",
    ariaLabel: "通过邮箱联系 HagiCode 支持团队",
    external: true,
    openInNewTab: false,
  },
} as const satisfies Record<string, SiteLink>

export const filingLinks = {
  icp: {
    id: "icp",
    label: "闽ICP备2026004153号-1",
    href: "https://beian.miit.gov.cn/",
    ariaLabel: "查看 ICP 备案信息",
    external: true,
    openInNewTab: true,
  },
  publicSecurity: {
    id: "public-security",
    label: "闽公网安备35011102351148号",
    href: "http://www.beian.gov.cn/portal/registerSystemInfo",
    ariaLabel: "查看公安备案信息",
    external: true,
    openInNewTab: true,
  },
} as const satisfies Record<string, SiteLink>

export const headerNavigationLinks = [soulSiteLinks.docs, soulSiteLinks.website, soulSiteLinks.discord] as const

export const footerLinkSections: readonly SiteLinkSection[] = [
  {
    id: "related",
    title: "相关链接",
    links: [soulSiteLinks.docs, soulSiteLinks.website],
  },
  {
    id: "community",
    title: "社群与支持",
    links: [soulSiteLinks.github, soulSiteLinks.discord, soulSiteLinks.qqGroup, soulSiteLinks.email],
  },
] as const

export function getSiteLinkTarget(link: Pick<SiteLink, "openInNewTab">) {
  return link.openInNewTab ? NEW_TAB_TARGET : undefined
}

export function getSiteLinkRel(link: Pick<SiteLink, "openInNewTab">) {
  return link.openInNewTab ? EXTERNAL_REL : undefined
}
