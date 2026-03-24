import type { ReactNode } from "react"

import { HomeSlotRail, type HomeSlotDefinition } from "@/components/home/HomeSlotRail"
import type { HomeEditorSlotId } from "@/hooks/use-home-editor-state"

type HomeEditorShellProps = {
  hero?: ReactNode
  workbench: ReactNode
  slots: HomeSlotDefinition[]
  activeSlot: HomeEditorSlotId | null
  recommendedSlot: HomeEditorSlotId | null
  onSlotToggle: (slotId: HomeEditorSlotId) => void
}

export function HomeEditorShell({
  hero,
  workbench,
  slots,
  activeSlot,
  recommendedSlot,
  onSlotToggle,
}: HomeEditorShellProps) {
  const leftSlots = slots.filter((slot) => slot.side === "left")
  const rightSlots = slots.filter((slot) => slot.side === "right")

  return (
    <section className="relative grid gap-5 xl:grid-cols-[minmax(168px,0.18fr)_minmax(0,1fr)_minmax(168px,0.18fr)] xl:items-start xl:gap-6 2xl:grid-cols-[minmax(188px,0.19fr)_minmax(0,1fr)_minmax(188px,0.19fr)]">
      <div className="order-2 min-w-0 xl:order-1">
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

      <div className="order-3 min-w-0 xl:order-3">
        <HomeSlotRail
          side="right"
          slots={rightSlots}
          activeSlot={activeSlot}
          recommendedSlot={recommendedSlot}
          onToggleSlot={onSlotToggle}
        />
      </div>
    </section>
  )
}
