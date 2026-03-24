import { useEffect } from "react"
import { X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { HomeEditorDrawerSide } from "@/hooks/use-home-editor-state"
import { cn } from "@/lib/utils"

type HomeContextDrawerProps = {
  open: boolean
  side: HomeEditorDrawerSide
  title: string
  description: string
  emptyState: string
  onClose: () => void
  children?: React.ReactNode
}

export function HomeContextDrawer({
  open,
  side,
  title,
  description,
  emptyState,
  onClose,
  children,
}: HomeContextDrawerProps) {
  useEffect(() => {
    if (!open) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose, open])

  if (!open) {
    return null
  }

  return (
    <div className="pointer-events-auto">
      <button
        type="button"
        aria-label="关闭上下文抽屉"
        onClick={onClose}
        className="fixed inset-0 z-20 bg-background/50 backdrop-blur-[2px] lg:absolute"
      />
      <aside
        role="dialog"
        aria-modal="false"
        aria-label={title}
        className={cn(
          "fixed top-2 bottom-2 z-30 flex w-[min(34rem,calc(100vw-1rem))] flex-col rounded-[30px] border border-border/70 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--card)_88%,white)_0%,color-mix(in_oklab,var(--background)_92%,black)_100%)] p-4 shadow-[0_32px_110px_-50px_rgba(15,23,42,0.82)] backdrop-blur-2xl lg:absolute lg:top-4 lg:bottom-4 lg:w-[28rem]",
          side === "left" ? "left-2 lg:left-4" : "right-2 lg:right-4"
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-border/60 pb-4">
          <div className="space-y-2">
            <Badge variant="secondary">{side === "left" ? "输入抽屉" : "上下文抽屉"}</Badge>
            <div>
              <h2 className="font-display text-3xl tracking-[-0.04em]">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label={`关闭${title}`}>
            <X size={18} />
          </Button>
        </header>

        <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
          {children ?? (
            <div className="rounded-[24px] border border-dashed border-border/70 bg-background/60 px-4 py-6 text-sm leading-6 text-muted-foreground">
              {emptyState}
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}
