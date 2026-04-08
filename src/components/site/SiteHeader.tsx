import { MoonStar, SunMedium } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getHeaderNavigationLinks, getSiteLinkRel, getSiteLinkTarget } from "@/components/site/site-links"
import { changeLocale } from "@/i18n/config"
import { SUPPORTED_LOCALES } from "@/i18n/locales"
import type { ThemeMode } from "@/hooks/use-theme-mode"
import { cn } from "@/lib/utils"

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
            role="group"
            aria-label={t("site.header.languageSwitcherAria")}
            data-locale-switcher="true"
            className="site-surface-soft inline-flex items-center gap-1 rounded-full p-1"
          >
            {SUPPORTED_LOCALES.map((locale) => {
              const active = activeLocale === locale

              return (
                <Button
                  key={locale}
                  type="button"
                  size="sm"
                  variant="ghost"
                  className={cn(
                    "min-w-14 border transition-[background-color,color,border-color,box-shadow]",
                    active
                      ? "border-foreground bg-foreground text-background shadow-[0_10px_24px_-18px_rgba(15,23,42,0.45)] dark:border-white/12 dark:bg-white/88 dark:text-[#18191a]"
                      : "border-transparent bg-transparent text-muted-foreground shadow-none hover:border-border hover:bg-background hover:text-foreground dark:hover:bg-white/6"
                  )}
                  aria-pressed={active}
                  onClick={() => void changeLocale(locale)}
                >
                  {locale === "zh-CN" ? t("common.languages.zhCN") : t("common.languages.enUS")}
                </Button>
              )
            })}
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
