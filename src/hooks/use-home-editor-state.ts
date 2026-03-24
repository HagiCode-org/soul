import { useCallback, useMemo, useState } from "react"

export type HomeEditorDrawerSide = "left" | "right"
export type HomeEditorSlotId = "catalog" | "expression"

export type HomeEditorSlotRegistration = {
  id: HomeEditorSlotId
  side: HomeEditorDrawerSide
  disabled?: boolean
}

type UseHomeEditorStateOptions = {
  slots: HomeEditorSlotRegistration[]
  defaultSlot?: HomeEditorSlotId | null
}

function resolveDefaultSlot(slots: HomeEditorSlotRegistration[], preferredSlot?: HomeEditorSlotId | null) {
  const enabledSlots = slots.filter((slot) => !slot.disabled)
  if (enabledSlots.length === 0) {
    return null
  }

  if (preferredSlot) {
    const preferred = enabledSlots.find((slot) => slot.id === preferredSlot)
    if (preferred) {
      return preferred.id
    }
  }

  return enabledSlots.find((slot) => slot.side === "left")?.id ?? enabledSlots[0]?.id ?? null
}

export function useHomeEditorState({ slots, defaultSlot = null }: UseHomeEditorStateOptions) {
  const slotMap = useMemo(() => new Map(slots.map((slot) => [slot.id, slot])), [slots])
  const defaultFocusSlot = useMemo(() => resolveDefaultSlot(slots, defaultSlot), [defaultSlot, slots])
  const [activeSlot, setActiveSlot] = useState<HomeEditorSlotId | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerSide, setDrawerSide] = useState<HomeEditorDrawerSide>(() => {
    const initialSlot = defaultFocusSlot ? slotMap.get(defaultFocusSlot) : null
    return initialSlot?.side ?? "left"
  })

  const openSlot = useCallback(
    (slotId: HomeEditorSlotId) => {
      const slot = slotMap.get(slotId)
      if (!slot || slot.disabled) {
        return
      }

      setActiveSlot(slot.id)
      setDrawerSide(slot.side)
      setDrawerOpen(true)
    },
    [slotMap]
  )

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false)
    setActiveSlot(null)
  }, [])

  const toggleSlot = useCallback(
    (slotId: HomeEditorSlotId) => {
      if (drawerOpen && activeSlot === slotId) {
        closeDrawer()
        return
      }

      openSlot(slotId)
    },
    [activeSlot, closeDrawer, drawerOpen, openSlot]
  )

  const focusDefaultSlot = useCallback(() => {
    if (!defaultFocusSlot) {
      return
    }

    openSlot(defaultFocusSlot)
  }, [defaultFocusSlot, openSlot])

  return {
    activeSlot,
    drawerOpen,
    drawerSide,
    defaultFocusSlot,
    openSlot,
    closeDrawer,
    toggleSlot,
    focusDefaultSlot,
  }
}
