import { useTranslation } from "react-i18next"

import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
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
        className="p-4"
        onInteractOutside={(event) => {
          const target = event.target
          if (target instanceof HTMLElement && target.closest("[data-locale-switcher='true']")) {
            event.preventDefault()
          }
        }}
      >
        <SheetHeader className="border-b border-border/60 pb-4 pr-12">
          <Badge variant="secondary">{side === "left" ? t("home.drawer.inputBadge") : t("home.drawer.contextBadge")}</Badge>
          <div className="space-y-2">
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </div>
        </SheetHeader>

        <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
          {children ?? (
            <div className="rounded-[24px] border border-dashed border-border/70 bg-background/60 px-4 py-6 text-sm leading-6 text-muted-foreground">
              {emptyState}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
