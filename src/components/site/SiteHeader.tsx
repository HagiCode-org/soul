import { MoonStar, SunMedium } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getSiteLinkRel, getSiteLinkTarget, headerNavigationLinks } from "@/components/site/site-links"
import { cn } from "@/lib/utils"
import type { ThemeMode } from "@/hooks/use-theme-mode"

type SiteHeaderProps = {
  theme: ThemeMode
  onToggleTheme: () => void
}

export function SiteHeader({ theme, onToggleTheme }: SiteHeaderProps) {
  return (
    <header className="site-header" role="banner" aria-label="Soul 站点头部">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/12 text-lg font-semibold text-primary shadow-[0_10px_40px_-20px_rgba(15,76,92,0.8)]">
          H
        </div>
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display text-2xl tracking-[0.03em]">HagiSoul</span>
            <Badge variant="outline" className="tracking-[0.3em]">
              Agent Soul 编辑器
            </Badge>
          </div>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            HagiSoul 为开发者提供更加方便快捷的 Soul 编辑平台，支持 Soul 的创建、分享与浏览。
          </p>
        </div>
      </div>

      <div className="flex min-w-0 flex-col items-start gap-3 lg:items-end">
        <nav className="site-header-nav" aria-label="Soul 站点导航">
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

        <Button
          variant="outline"
          size="sm"
          className={cn("gap-2", theme === "dark" && "border-primary/30")}
          onClick={onToggleTheme}
          type="button"
          aria-label={theme === "dark" ? "切换到浅色主题" : "切换到深色主题"}
          aria-pressed={theme === "dark"}
        >
          {theme === "dark" ? <SunMedium size={16} /> : <MoonStar size={16} />}
          Theme
        </Button>
      </div>
    </header>
  )
}
