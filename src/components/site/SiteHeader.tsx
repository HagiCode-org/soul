import { MoonStar, SunMedium } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getHeaderNavigationLinks, getSiteLinkRel, getSiteLinkTarget } from "@/components/site/site-links"
import { changeLocale } from "@/i18n/config"
import { LOCALE_LABELS, SUPPORTED_LOCALES, normalizeLocale } from "@/i18n/locales"
import type { ThemeMode } from "@/hooks/use-theme-mode"

type SiteHeaderProps = {
  theme: ThemeMode
  onToggleTheme: () => void
}

export function SiteHeader({ theme, onToggleTheme }: SiteHeaderProps) {
  const { i18n, t } = useTranslation()
  const headerNavigationLinks = getHeaderNavigationLinks(t)
  const activeLocale = normalizeLocale(i18n.resolvedLanguage ?? i18n.language)

  return (
    <header className="site-header" role="banner" aria-label={t("site.header.ariaLabel")}>
      <div className="flex min-w-0 items-start gap-4">
        <div className="site-surface-strong flex size-14 shrink-0 items-center justify-center rounded-[18px] p-2.5">
          <img src="/logo.png" alt="Hagicode" width="32" height="32" className="size-8 object-contain" />
        </div>

        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="font-display text-[1.85rem] leading-none tracking-[-0.01em] sm:text-[2.2rem]"
              style={{ fontVariationSettings: '"wght" 500' }}
            >
              HagiSoul
            </span>
            <Badge variant="outline">{t("site.header.brandBadge")}</Badge>
          </div>
          <p className="site-section-kicker">{t("site.header.brandBadge")}</p>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
            {t("site.header.description")}
          </p>
        </div>
      </div>

      <div className="flex min-w-0 flex-col items-start gap-4 lg:items-end">
        <div className="site-command-strip">
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
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div
            data-locale-switcher="true"
            className="site-surface-soft inline-flex items-center rounded-full px-3 py-1.5"
          >
            <select
              aria-label={t("site.header.languageSwitcherAria")}
              data-locale-select="true"
              value={activeLocale}
              className="site-locale-select min-w-[12rem] text-sm text-foreground outline-none"
              onChange={(event) => void changeLocale(event.target.value as (typeof SUPPORTED_LOCALES)[number])}
            >
              {SUPPORTED_LOCALES.map((locale) => (
                <option key={locale} value={locale}>
                  {LOCALE_LABELS[locale]}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={onToggleTheme}
            type="button"
            aria-label={theme === "dark" ? t("site.header.themeToLight") : t("site.header.themeToDark")}
            aria-pressed={theme === "dark"}
            className="shrink-0"
          >
            {theme === "dark" ? <SunMedium size={16} /> : <MoonStar size={16} />}
          </Button>
        </div>
      </div>
    </header>
  )
}
