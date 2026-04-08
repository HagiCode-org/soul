import { useTranslation } from "react-i18next"

import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { HomeEditorDrawerSide } from "@/hooks/use-home-editor-state"

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
  const { t } = useTranslation()

  return (
    <Sheet open={open} modal={false} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <SheetContent
        side={side}
        aria-label={title}
        closeLabel={t("home.drawer.closeLabel")}
        className="p-5 sm:p-6"
        onInteractOutside={(event) => {
          const target = event.target
          if (target instanceof HTMLElement && target.closest("[data-locale-switcher='true']")) {
            event.preventDefault()
          }
        }}
      >
        <SheetHeader className="border-b pb-5 pr-12" style={{ borderColor: "var(--line-soft)" }}>
          <div className="site-window-dots" aria-hidden="true">
            <span className="site-window-dot" data-tone="red" />
            <span className="site-window-dot" data-tone="yellow" />
            <span className="site-window-dot" data-tone="green" />
          </div>
          <Badge variant="secondary">{side === "left" ? t("home.drawer.inputBadge") : t("home.drawer.contextBadge")}</Badge>
          <div className="space-y-2">
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </div>
        </SheetHeader>

        <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1">
          {children ?? (
            <div className="rounded-[18px] border border-dashed bg-[color:var(--surface-void)] px-4 py-6 text-sm leading-6 text-muted-foreground shadow-[var(--ring-shadow)]">
              {emptyState}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
