import { MoonStar, Save, SunMedium } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ThemeMode } from "@/hooks/use-theme-mode"

type SiteHeaderProps = {
  theme: ThemeMode
  onToggleTheme: () => void
  onSaveDraft: () => void
}

export function SiteHeader({ theme, onToggleTheme, onSaveDraft }: SiteHeaderProps) {
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
              builder
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Fragment-first homepage for building, saving, and exporting soul drafts.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <a href="#builder-intro">Builder</a>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <a href="#saved-drafts">Drafts</a>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <a href="#sources">Sources</a>
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
        <Button variant="default" size="sm" onClick={onSaveDraft} type="button">
          <Save size={16} />
          Save draft
        </Button>
      </div>
    </header>
  )
}
