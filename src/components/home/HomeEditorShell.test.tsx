import { BookOpenText, FlaskConical } from "lucide-react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { HomeContextDrawer } from "@/components/home/HomeContextDrawer"
import { HomeEditorShell } from "@/components/home/HomeEditorShell"
import type { HomeSlotDefinition } from "@/components/home/HomeSlotRail"
import { useHomeEditorState } from "@/hooks/use-home-editor-state"

const slots: HomeSlotDefinition[] = [
  {
    id: "catalog",
    side: "left",
    label: "基础角色",
    title: "基础角色抽屉",
    description: "选择基础角色。",
    emptyState: "暂无基础角色。",
    icon: BookOpenText,
  },
  {
    id: "expression",
    side: "left",
    label: "表达方式",
    title: "表达方式抽屉",
    description: "选择表达方式。",
    emptyState: "暂无表达方式内容。",
    icon: FlaskConical,
  },
]

function Harness() {
  const editor = useHomeEditorState({
    slots: slots.map(({ id, side }) => ({ id, side })),
    defaultSlot: "catalog",
  })

  return (
    <>
      <HomeEditorShell
        slots={slots}
        activeSlot={editor.activeSlot}
        recommendedSlot={editor.defaultFocusSlot}
        onSlotToggle={editor.toggleSlot}
        workbench={<section><h1>中央工作区</h1><p>预览保持可见</p></section>}
      />
      <HomeContextDrawer
        open={editor.drawerOpen}
        side={editor.drawerSide}
        title={slots.find((slot) => slot.id === editor.activeSlot)?.title ?? "上下文抽屉"}
        description={slots.find((slot) => slot.id === editor.activeSlot)?.description ?? "当前槽位暂无说明。"}
        emptyState={slots.find((slot) => slot.id === editor.activeSlot)?.emptyState ?? "当前槽位暂无内容。"}
        onClose={editor.closeDrawer}
      >
        {editor.activeSlot === "catalog" ? <button type="button">应用基础角色</button> : <button type="button">应用表达方式</button>}
      </HomeContextDrawer>
    </>
  )
}

describe("HomeEditorShell", () => {
  it("keeps workbench visible while global drawer opens and closes", async () => {
    const user = userEvent.setup()
    render(<Harness />)

    expect(screen.getByText("中央工作区")).toBeInTheDocument()

    await user.click(screen.getAllByRole("button", { name: "基础角色" })[0])
    expect(screen.getByRole("dialog", { name: "基础角色抽屉" })).toBeInTheDocument()
    expect(screen.getByText("中央工作区")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "关闭抽屉" }))
    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "基础角色抽屉" })).not.toBeInTheDocument()
    })
    expect(screen.getByText("中央工作区")).toBeInTheDocument()
  })

  it("keeps only one drawer open and supports escape dismissal", async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.click(screen.getAllByRole("button", { name: "基础角色" })[0])
    expect(screen.getByRole("dialog", { name: "基础角色抽屉" })).toBeInTheDocument()

    await user.click(screen.getAllByRole("button", { name: "表达方式" })[0])
    expect(screen.queryByRole("dialog", { name: "基础角色抽屉" })).not.toBeInTheDocument()
    expect(screen.getByRole("dialog", { name: "表达方式抽屉" })).toBeInTheDocument()

    await user.keyboard("{Escape}")
    expect(screen.queryByRole("dialog", { name: "表达方式抽屉" })).not.toBeInTheDocument()
    expect(screen.getAllByText("预览保持可见")[0]).toBeInTheDocument()
  })
})
