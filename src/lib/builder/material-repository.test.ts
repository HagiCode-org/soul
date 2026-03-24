import { describe, expect, it, vi } from "vitest"

import { buildFallbackInspirationFragments, loadBuilderMaterials, normalizeReferenceSnapshot } from "@/lib/builder/material-repository"

describe("material repository", () => {
  it("normalizes reference snapshot into grouped fragments", () => {
    const result = normalizeReferenceSnapshot()

    expect(result.mainFragments).toHaveLength(50)
    expect(result.expressionFragments).toHaveLength(10)
    expect(result.mainFragments[11]).toMatchObject({
      group: "main-catalog",
      title: "高冷禁欲学霸系",
      sourceRef: { kind: "reference-doc" },
    })
    expect(result.expressionFragments[0]).toMatchObject({
      group: "expression-rule",
      title: "短句碎碎念模式",
      sourceRef: { kind: "reference-doc" },
    })
  })

  it("returns fallback inspirations when remote source fails", async () => {
    const fetcher = vi.fn<typeof fetch>().mockRejectedValue(new Error("boom"))
    const materials = await loadBuilderMaterials({ fetcher })

    expect(materials.remoteState).toBe("error")
    expect(materials.inspirationFragments).toHaveLength(buildFallbackInspirationFragments().length)
    expect(materials.inspirationFragments[0].sourceRef.kind).toBe("marketplace-fallback")
    expect(materials.remoteMessage).toContain("boom")
  })

  it("maps remote marketplace items when remote source succeeds", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue({
      ok: true,
      json: async () => ({
        items: [
          {
            soulCatalogId: "soul-12-01",
            displayName: "白噪旅人",
            styleType: "个性人设向",
            summary: "智性冷感；表达规则：短句碎碎念。",
            mainCatalogName: "高冷禁欲学霸系",
            orthogonalCatalogName: "短句碎碎念模式",
            keywords: ["高冷", "学霸"],
          },
        ],
      }),
    } as Response)

    const materials = await loadBuilderMaterials({ fetcher })

    expect(materials.remoteState).toBe("ready")
    expect(materials.inspirationFragments[0]).toMatchObject({
      group: "published-soul",
      title: "白噪旅人",
      meta: {
        mainCatalogName: "高冷禁欲学霸系",
        orthogonalCatalogName: "短句碎碎念模式",
      },
    })
  })
})
