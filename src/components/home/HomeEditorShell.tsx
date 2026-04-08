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
  const shellColumnsClass =
    rightSlots.length > 0
      ? "xl:grid-cols-[minmax(230px,0.24fr)_minmax(0,1fr)_minmax(230px,0.24fr)]"
      : "xl:grid-cols-[minmax(230px,0.24fr)_minmax(0,1fr)]"

  return (
    <section className="relative space-y-6 lg:space-y-8">
      {hero}

      <div className={`grid gap-5 xl:items-start xl:gap-7 ${shellColumnsClass}`}>
        <div className="order-2 min-w-0 xl:order-1 xl:sticky xl:top-6">
          <HomeSlotRail
            side="left"
            slots={leftSlots}
            activeSlot={activeSlot}
            recommendedSlot={recommendedSlot}
            onToggleSlot={onSlotToggle}
          />
        </div>

        <div id="home-workbench" className="order-1 min-w-0 xl:order-2">
          {workbench}
        </div>

        {rightSlots.length > 0 ? (
          <div className="order-3 min-w-0 xl:order-3 xl:sticky xl:top-6">
            <HomeSlotRail
              side="right"
              slots={rightSlots}
              activeSlot={activeSlot}
              recommendedSlot={recommendedSlot}
              onToggleSlot={onSlotToggle}
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}
