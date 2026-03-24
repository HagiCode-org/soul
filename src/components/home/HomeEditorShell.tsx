import type { ReactNode } from "react"

import { HomeContextDrawer } from "@/components/home/HomeContextDrawer"
import { HomeSlotRail, type HomeSlotDefinition } from "@/components/home/HomeSlotRail"
import type { HomeEditorDrawerSide, HomeEditorSlotId } from "@/hooks/use-home-editor-state"

type HomeEditorShellProps = {
  hero?: ReactNode
  workbench: ReactNode
  slots: HomeSlotDefinition[]
  activeSlot: HomeEditorSlotId | null
  drawerOpen: boolean
  drawerSide: HomeEditorDrawerSide
  recommendedSlot: HomeEditorSlotId | null
  onSlotToggle: (slotId: HomeEditorSlotId) => void
  onCloseDrawer: () => void
  drawerContent?: ReactNode
}

export function HomeEditorShell({
  hero,
  workbench,
  slots,
  activeSlot,
  drawerOpen,
  drawerSide,
  recommendedSlot,
  onSlotToggle,
  onCloseDrawer,
  drawerContent,
}: HomeEditorShellProps) {
  const leftSlots = slots.filter((slot) => slot.side === "left")
  const rightSlots = slots.filter((slot) => slot.side === "right")
  const activeSlotDefinition = slots.find((slot) => slot.id === activeSlot) ?? null

  return (
    <section className="relative grid gap-5 xl:grid-cols-[88px_minmax(0,1fr)_88px] xl:items-start xl:gap-6">
      <div className="order-2 xl:order-1">
        <HomeSlotRail
          side="left"
          slots={leftSlots}
          activeSlot={activeSlot}
          recommendedSlot={recommendedSlot}
          onToggleSlot={onSlotToggle}
        />
      </div>

      <div id="home-workbench" className="order-1 min-w-0 space-y-5 xl:order-2">
        {hero}
        {workbench}
      </div>

      <div className="order-3 xl:order-3">
        <HomeSlotRail
          side="right"
          slots={rightSlots}
          activeSlot={activeSlot}
          recommendedSlot={recommendedSlot}
          onToggleSlot={onSlotToggle}
        />
      </div>

      <HomeContextDrawer
        open={drawerOpen}
        side={drawerSide}
        title={activeSlotDefinition?.title ?? "上下文抽屉"}
        description={activeSlotDefinition?.description ?? "当前槽位暂无说明。"}
        emptyState={activeSlotDefinition?.emptyState ?? "当前槽位暂无内容。"}
        onClose={onCloseDrawer}
      >
        {drawerContent}
      </HomeContextDrawer>
    </section>
  )
}
