import { describe, expect, it } from "vitest"

import { createEmptyDraft } from "@/lib/builder/draft"
import { buildDraftName } from "@/lib/builder/draft"
import { createLocalMaterials } from "@/lib/builder/material-repository"
import { compilePreview, getIncompletePreviewHint } from "@/lib/builder/preview-compiler"
import { readSnapshots, saveDraftSnapshot } from "@/lib/builder/storage-gateway"

class MemoryStorage implements Pick<Storage, "getItem" | "setItem"> {
  private readonly store = new Map<string, string>()

  getItem(key: string) {
    return this.store.get(key) ?? null
  }

  setItem(key: string, value: string) {
    this.store.set(key, value)
  }
}

describe("preview and storage", () => {
  it("compiles preview from selected fragments and custom prompt", () => {
    const materials = createLocalMaterials()
    const mainFragment = materials.mainFragments[11]
    const ruleFragment = materials.expressionFragments[0]

    const preview = compilePreview(
      { customPrompt: "全部输出使用简体中文。" },
      { mainFragment, ruleFragment, inspirationFragment: null }
    )

    expect(preview.isComplete).toBe(true)
    expect(preview.text).toContain("高冷禁欲学霸系")
    expect(preview.text).toContain("短句碎碎念模式")
    expect(preview.text).toContain("自定义补充")
  })

  it("reports incomplete preview when core selections are missing", () => {
    const preview = compilePreview(
      { customPrompt: "" },
      { mainFragment: null, ruleFragment: null, inspirationFragment: null }
    )

    expect(preview.isComplete).toBe(false)
    expect(preview.missing).toEqual(["main", "rule"])
    expect(getIncompletePreviewHint(preview.missing)).toContain("导出")
  })

  it("saves snapshots and normalizes legacy versions on read", () => {
    const storage = new MemoryStorage()
    const materials = createLocalMaterials()
    const draft = createEmptyDraft()
    const mainFragment = materials.mainFragments[0]
    const ruleFragment = materials.expressionFragments[0]

    const snapshot = saveDraftSnapshot(
      {
        ...draft,
        selectedMainFragmentId: mainFragment.fragmentId,
        selectedRuleFragmentId: ruleFragment.fragmentId,
        name: buildDraftName(mainFragment, ruleFragment),
        previewText: "preview",
      },
      { mainFragment, ruleFragment },
      storage
    )

    expect(snapshot?.draft.name).toBe(buildDraftName(mainFragment, ruleFragment))

    storage.setItem(
      "soul-builder:snapshots",
      JSON.stringify([
        {
          savedAt: "2026-03-24T00:00:00.000Z",
          draft: {
            draftId: "legacy",
            name: "旧草稿",
            selectedMainFragmentId: null,
            selectedRuleFragmentId: null,
            inspirationSoulId: null,
            customPrompt: "",
            previewText: "",
            updatedAt: "2026-03-24T00:00:00.000Z",
          },
        },
      ])
    )

    const normalized = readSnapshots(storage)
    expect(normalized[0].version).toBe("1")
    expect(normalized[0].draft.name).toBe("旧草稿")
  })
})
