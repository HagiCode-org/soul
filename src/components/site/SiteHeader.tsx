import { MoonStar, SunMedium } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getHeaderNavigationLinks, getSiteLinkRel, getSiteLinkTarget } from "@/components/site/site-links"
import { changeLocale } from "@/i18n/config"
import { SUPPORTED_LOCALES } from "@/i18n/locales"
import { cn } from "@/lib/utils"
import type { ThemeMode } from "@/hooks/use-theme-mode"

type SiteHeaderProps = {
  theme: ThemeMode
  onToggleTheme: () => void
}

export function SiteHeader({ theme, onToggleTheme }: SiteHeaderProps) {
  const { i18n, t } = useTranslation()
  const headerNavigationLinks = getHeaderNavigationLinks(t)
  const activeLocale =
    SUPPORTED_LOCALES.find((locale) => locale === i18n.resolvedLanguage || locale === i18n.language) ?? "en-US"

  return (
    <header className="site-header" role="banner" aria-label={t("site.header.ariaLabel")}>
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/12 text-lg font-semibold text-primary shadow-[0_10px_40px_-20px_rgba(15,76,92,0.8)]">
          H
        </div>
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display text-2xl tracking-[0.03em]">HagiSoul</span>
            <Badge variant="outline" className="tracking-[0.3em]">
              {t("site.header.brandBadge")}
            </Badge>
          </div>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{t("site.header.description")}</p>
        </div>
      </div>

      <div className="flex min-w-0 flex-col items-start gap-3 lg:items-end">
        <nav className="site-header-nav" aria-label={t("site.header.navAriaLabel")}>
          {headerNavigationLinks.map((link) => (
            <a
              key={link.id}
              className="site-link-chip"
              href={link.href}
              aria-label={link.ariaLabel}
              target={getSiteLinkTarget(link)}
              rel={getSiteLinkRel(link)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          <div
            role="group"
            aria-label={t("site.header.languageSwitcherAria")}
            data-locale-switcher="true"
            className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/78 p-1"
          >
            {SUPPORTED_LOCALES.map((locale) => (
              <Button
                key={locale}
                type="button"
                size="sm"
                variant={activeLocale === locale ? "secondary" : "ghost"}
                className={cn("min-w-14 rounded-full", activeLocale !== locale && "text-muted-foreground")}
                aria-pressed={activeLocale === locale}
                onClick={() => void changeLocale(locale)}
              >
                {locale === "zh-CN" ? t("common.languages.zhCN") : t("common.languages.enUS")}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            className={cn("gap-2", theme === "dark" && "border-primary/30")}
            onClick={onToggleTheme}
            type="button"
            aria-label={theme === "dark" ? t("site.header.themeToLight") : t("site.header.themeToDark")}
            aria-pressed={theme === "dark"}
          >
            {theme === "dark" ? <SunMedium size={16} /> : <MoonStar size={16} />}
            {t("site.header.themeButton")}
          </Button>
        </div>
      </div>
    </header>
  )
}
