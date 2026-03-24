import type { LucideIcon } from "lucide-react"

import type { HomeEditorDrawerSide, HomeEditorSlotId } from "@/hooks/use-home-editor-state"
import { cn } from "@/lib/utils"

export type HomeSlotDefinition = {
  id: HomeEditorSlotId
  side: HomeEditorDrawerSide
  label: string
  title: string
  description: string
  emptyState: string
  icon: LucideIcon
  badge?: string
  disabled?: boolean
}

type HomeSlotRailProps = {
  side: HomeEditorDrawerSide
  slots: HomeSlotDefinition[]
  activeSlot: HomeEditorSlotId | null
  recommendedSlot: HomeEditorSlotId | null
  onToggleSlot: (slotId: HomeEditorSlotId) => void
}

export function HomeSlotRail({ side, slots, activeSlot, recommendedSlot, onToggleSlot }: HomeSlotRailProps) {
  return (
    <section
      id={side === "left" ? "home-slots" : "home-status"}
      aria-label={side === "left" ? "左侧首页槽位" : "右侧首页槽位"}
      className="w-full rounded-[30px] border border-border/70 bg-card/68 p-3 shadow-[0_22px_70px_-48px_rgba(15,23,42,0.72)] backdrop-blur-xl"
    >
      <div className="mb-3 flex items-center justify-between px-1 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
        <span>{side === "left" ? "builder inputs" : "builder context"}</span>
        <span>{slots.length}</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
        {slots.map((slot) => {
          const Icon = slot.icon
          const isActive = activeSlot === slot.id
          const isRecommended = recommendedSlot === slot.id

          return (
            <button
              key={slot.id}
              type="button"
              aria-pressed={isActive}
              aria-label={slot.label}
              disabled={slot.disabled}
              onClick={() => onToggleSlot(slot.id)}
              className={cn(
                "group grid min-h-[98px] w-full gap-3 rounded-[24px] border px-4 py-4 text-left transition-all focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 disabled:cursor-not-allowed disabled:opacity-45 xl:min-h-[148px] xl:px-4 xl:py-5",
                "bg-background/70 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-primary/6",
                isActive && "border-primary/45 bg-primary/9 shadow-[0_24px_55px_-38px_rgba(15,76,92,0.88)]",
                slot.disabled && "hover:translate-y-0 hover:border-border/70 hover:bg-background/70"
              )}
            >
              <div className="flex items-start justify-between gap-3 xl:flex-col xl:items-center xl:gap-4 xl:text-center">
                <div
                  className={cn(
                    "flex size-12 items-center justify-center rounded-[18px] border border-border/70 bg-card/85 text-foreground transition-colors",
                    isActive && "border-primary/25 bg-primary/12 text-primary",
                    !slot.disabled && !isActive && "group-hover:border-primary/20 group-hover:text-primary"
                  )}
                >
                  <Icon size={18} />
                </div>
                <div className="flex flex-wrap items-center gap-2 xl:justify-center">
                  <span className="text-sm font-semibold tracking-[0.01em] xl:text-base">{slot.label}</span>
                  {slot.badge ? (
                    <span className="rounded-full border border-border/70 bg-background/80 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {slot.badge}
                    </span>
                  ) : null}
                </div>
              </div>
              <p className="text-sm leading-6 text-muted-foreground xl:text-center">{slot.description}</p>
              {isRecommended ? <span className="text-[11px] uppercase tracking-[0.28em] text-primary">recommended</span> : null}
            </button>
          )
        })}
      </div>
    </section>
  )
}
