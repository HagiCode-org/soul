import type { LucideIcon } from "lucide-react"
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation()

  return (
    <section
      id={side === "left" ? "home-slots" : "home-status"}
      aria-label={side === "left" ? t("home.slotRail.leftAriaLabel") : t("home.slotRail.rightAriaLabel")}
      className="site-surface-strong w-full rounded-[20px] p-4"
    >
      <div className="mb-4 flex items-center justify-between gap-3 px-1">
        <span className="site-section-kicker">
          {side === "left" ? t("home.slotRail.inputsEyebrow") : t("home.slotRail.contextEyebrow")}
        </span>
        <span className="site-keycap">{slots.length}</span>
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
                "group grid min-h-[112px] w-full gap-4 rounded-[18px] border px-4 py-4 text-left transition disabled:cursor-not-allowed disabled:opacity-45 xl:min-h-[148px]",
                isActive
                  ? "border-white/12 bg-white/88 text-[#18191a] shadow-[0_0_0_1px_rgba(255,255,255,0.12)_inset,0_18px_34px_-24px_rgba(0,0,0,0.38)]"
                  : "border-border bg-[color:var(--surface-inset)] text-foreground shadow-[var(--ring-shadow)] hover:-translate-y-px hover:opacity-80",
                isRecommended && !isActive && "border-dashed"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className={cn(
                    "flex size-11 items-center justify-center rounded-[14px] border transition",
                    isActive
                      ? "border-black/10 bg-black/5 text-[#18191a]"
                      : "border-border bg-secondary text-foreground group-hover:opacity-80"
                  )}
                >
                  <Icon size={18} />
                </div>

                {slot.badge ? (
                  <span
                    className={cn(
                      "font-mono-ui rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.2em]",
                      isActive ? "border-black/10 text-[#18191a]/66" : "border-border text-muted-foreground"
                    )}
                  >
                    {slot.badge}
                  </span>
                ) : null}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span style={{ fontVariationSettings: '"wght" 540' }}>{slot.label}</span>
                  {isRecommended ? (
                    <span
                      className={cn(
                        "font-mono-ui text-[10px] uppercase tracking-[0.2em]",
                        isActive ? "text-[#18191a]/60" : "text-muted-foreground"
                      )}
                    >
                      {t("home.slotRail.recommended")}
                    </span>
                  ) : null}
                </div>
                <p className={cn("text-sm leading-6", isActive ? "text-[#18191a]/72" : "text-muted-foreground")}>
                  {slot.description}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
