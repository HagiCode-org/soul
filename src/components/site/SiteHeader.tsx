import { MoonStar, SunMedium } from "lucide-react"

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
          H
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl tracking-[0.03em]">HagiSoul</span>
            <Badge variant="outline" className="tracking-[0.3em]">
              Agent Soul 编辑器
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">围绕基础角色、表达方式和自定义插槽组织编辑流，中央工作区常驻预览与复制操作。</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
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
      </div>
    </header>
  )
}
