import { Layers3, LibraryBig } from "lucide-react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { HomeEditorShell } from "@/components/home/HomeEditorShell"
import type { HomeSlotDefinition } from "@/components/home/HomeSlotRail"
import { useHomeEditorState } from "@/hooks/use-home-editor-state"

const slots: HomeSlotDefinition[] = [
  {
    id: "materials",
    side: "left",
    label: "素材",
    title: "素材抽屉",
    description: "选择素材。",
    emptyState: "暂无素材。",
    icon: LibraryBig,
  },
  {
    id: "compose",
    side: "left",
    label: "拼装",
    title: "拼装抽屉",
    description: "调整草稿。",
    emptyState: "暂无拼装内容。",
    icon: Layers3,
  },
]

function Harness() {
  const editor = useHomeEditorState({
    slots: slots.map(({ id, side }) => ({ id, side })),
    defaultSlot: "materials",
  })

  return (
    <HomeEditorShell
      slots={slots}
      activeSlot={editor.activeSlot}
      drawerOpen={editor.drawerOpen}
      drawerSide={editor.drawerSide}
      recommendedSlot={editor.defaultFocusSlot}
      onSlotToggle={editor.toggleSlot}
      onCloseDrawer={editor.closeDrawer}
      workbench={<section><h1>中央工作区</h1><p>预览保持可见</p></section>}
      drawerContent={
        editor.activeSlot === "materials" ? <button type="button">应用素材</button> : <button type="button">调整草稿</button>
      }
    />
  )
}

describe("HomeEditorShell", () => {
  it("keeps workbench visible while drawer toggles and closes active slot on repeat click", async () => {
    const user = userEvent.setup()
    render(<Harness />)

    expect(screen.getByText("中央工作区")).toBeInTheDocument()

    await user.click(screen.getAllByRole("button", { name: "素材" })[0])
    expect(screen.getByRole("dialog", { name: "素材抽屉" })).toBeInTheDocument()
    expect(screen.getByText("中央工作区")).toBeInTheDocument()

    await user.click(screen.getAllByRole("button", { name: "素材" })[0])
    expect(screen.queryByRole("dialog", { name: "素材抽屉" })).not.toBeInTheDocument()
    expect(screen.getByText("中央工作区")).toBeInTheDocument()
  })

  it("keeps only one drawer open and supports escape dismissal", async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.click(screen.getAllByRole("button", { name: "素材" })[0])
    expect(screen.getByRole("dialog", { name: "素材抽屉" })).toBeInTheDocument()

    await user.click(screen.getAllByRole("button", { name: "拼装" })[0])
    expect(screen.queryByRole("dialog", { name: "素材抽屉" })).not.toBeInTheDocument()
    expect(screen.getByRole("dialog", { name: "拼装抽屉" })).toBeInTheDocument()

    await user.keyboard("{Escape}")
    expect(screen.queryByRole("dialog", { name: "拼装抽屉" })).not.toBeInTheDocument()
    expect(screen.getAllByText("预览保持可见")[0]).toBeInTheDocument()
  })
})
