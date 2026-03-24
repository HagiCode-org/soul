import { ArrowUpRight, MoonStar, SunMedium } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ThemeMode } from "@/hooks/use-theme-mode"

type SiteHeaderProps = {
  theme: ThemeMode
  onToggleTheme: () => void
}

export function SiteHeader({ theme, onToggleTheme }: SiteHeaderProps) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-full border border-primary/25 bg-primary/12 text-lg font-semibold text-primary shadow-[0_10px_40px_-20px_rgba(15,76,92,0.8)]">
          S
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl tracking-[0.08em] uppercase">Soul</span>
            <Badge variant="outline" className="tracking-[0.3em]">
              shell
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            A calm, expandable frontend base for soulful AI experiences.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <a href="#structure">Structure</a>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <a href="#foundation">Foundation</a>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={cn("gap-2", theme === "dark" && "border-primary/30")}
          onClick={onToggleTheme}
          type="button"
        >
          {theme === "dark" ? <SunMedium size={16} /> : <MoonStar size={16} />}
          Theme
        </Button>
        <Button variant="default" size="sm" asChild>
          <a href="https://hagicode.com" target="_blank" rel="noreferrer">
            HagiCode
            <ArrowUpRight size={16} />
          </a>
        </Button>
      </div>
    </header>
  )
}
