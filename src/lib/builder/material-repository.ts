import { referenceCatalogSnapshot } from "@/data/reference-materials.generated"
import type {
  BuilderMaterials,
  MarketplaceItemDto,
  ReferenceCatalogSnapshot,
  ReferenceMainCatalog,
  ReferenceOrthogonalCatalog,
  SoulFragment,
} from "@/lib/builder/types"

const keywordSplitRegex = /[，、；。,.:\s]+/
const featuredFallbackPairs = [
  [12, 1],
  [1, 3],
  [22, 5],
  [33, 6],
  [44, 9],
  [50, 2],
] as const
const mainHandleRoots = [
  "雾港", "夜航", "零帧", "星渊", "霓虹", "断云", "灰塔", "回声", "赤潮", "雾糖",
  "冷焰", "白噪", "月轨", "空域", "钨芯", "砂暴", "幽蓝", "锈雀", "孤岛", "银弦",
  "跃迁", "霜序", "碎光", "极昼", "暗潮", "风暴", "裂隙", "野火", "悬月", "深潜",
  "潮汐", "镜域", "焰尾", "星幕", "隐栈", "雾刃", "雷迹", "雪栈", "岚核", "夜阈",
  "像素", "荒频", "远界", "蓝焰", "棱镜", "余烬", "尘歌", "虚轴", "鲸落", "曜斑",
] as const
const orthogonalHandleSuffixes = [
  "旅人", "猎手", "术师", "行者", "星使", "守望", "游侠", "司书", "领主", "咏者",
] as const

function normalizeKeywords(source: string) {
  const keywords = new Set<string>()

  for (const token of source.split(keywordSplitRegex)) {
    const normalized = token.trim().replace(/^[「」（）()"']+|[「」（）()"']+$/g, "")
    if (normalized.length < 2 || normalized.length > 16) {
      continue
    }

    keywords.add(normalized)
    if (keywords.size >= 12) {
      break
    }
  }

  return [...keywords]
}

function buildFragmentId(group: SoulFragment["group"], index: number) {
  return `${group}-${index.toString().padStart(2, "0")}`
}

function normalizeMainCatalog(entry: ReferenceMainCatalog, snapshot: ReferenceCatalogSnapshot): SoulFragment {
  return {
    fragmentId: buildFragmentId("main-catalog", entry.index),
    group: "main-catalog",
    title: entry.name,
    summary: entry.core,
    content: `你的人设内核来自「${entry.name}」：${entry.core}\n保持以下标志性语言特征：${entry.signature}`,
    keywords: [entry.category, entry.name, ...normalizeKeywords(`${entry.core} ${entry.signature}`)],
    sourceRef: {
      kind: "reference-doc",
      label: "基础角色",
      path: snapshot.provenance.mainPath,
      note: `构建期快照，生成于 ${snapshot.generatedAtUtc}`,
    },
    meta: {
      index: entry.index,
      category: entry.category,
      signature: entry.signature,
    },
  }
}

function normalizeOrthogonalCatalog(entry: ReferenceOrthogonalCatalog, snapshot: ReferenceCatalogSnapshot): SoulFragment {
  return {
    fragmentId: buildFragmentId("expression-rule", entry.index),
    group: "expression-rule",
    title: entry.name,
    summary: entry.core,
    content: `你的表达规则来自「${entry.name}」：${entry.core}\n必须遵循这些输出约束：${entry.signature}`,
    keywords: [entry.name, ...normalizeKeywords(`${entry.core} ${entry.signature} ${entry.compatibility}`)],
    sourceRef: {
      kind: "reference-doc",
      label: "表达规则",
      path: snapshot.provenance.orthPath,
      note: `构建期快照，生成于 ${snapshot.generatedAtUtc}`,
    },
    meta: {
      index: entry.index,
      signature: entry.signature,
      compatibility: entry.compatibility,
    },
  }
}

export function normalizeReferenceSnapshot(snapshot: ReferenceCatalogSnapshot = referenceCatalogSnapshot): Pick<BuilderMaterials, "mainFragments" | "expressionFragments"> {
  return {
    mainFragments: snapshot.mainCatalogs.map((entry) => normalizeMainCatalog(entry, snapshot)),
    expressionFragments: snapshot.orthogonalCatalogs.map((entry) => normalizeOrthogonalCatalog(entry, snapshot)),
  }
}

function buildMarketplaceNickname(mainIndex: number, orthogonalIndex: number) {
  const root = mainHandleRoots[Math.max(0, Math.min(mainHandleRoots.length - 1, mainIndex - 1))]
  const suffix = orthogonalHandleSuffixes[Math.max(0, Math.min(orthogonalHandleSuffixes.length - 1, orthogonalIndex - 1))]
  return `${root}${suffix}`
}

function buildFallbackSoul(main: ReferenceMainCatalog, rule: ReferenceOrthogonalCatalog) {
  return [
    `你的人设内核来自「${main.name}」：${main.core}`,
    `保持以下标志性语言特征：${main.signature}`,
    `你的表达规则来自「${rule.name}」：${rule.core}`,
    `必须遵循这些输出约束：${rule.signature}`,
  ].join("\n")
}

export function buildFallbackInspirationFragments(snapshot: ReferenceCatalogSnapshot = referenceCatalogSnapshot): SoulFragment[] {
  const fragments: Array<SoulFragment | null> = featuredFallbackPairs.map(([mainIndex, ruleIndex]) => {
      const main = snapshot.mainCatalogs.find((entry) => entry.index === mainIndex)
      const rule = snapshot.orthogonalCatalogs.find((entry) => entry.index === ruleIndex)
      if (!main || !rule) {
        return null
      }

      const fragment: SoulFragment = {
        fragmentId: `published-soul-${main.index.toString().padStart(2, "0")}-${rule.index.toString().padStart(2, "0")}`,
        group: "published-soul",
        title: buildMarketplaceNickname(main.index, rule.index),
        summary: `${main.core}；表达规则：${rule.core}`,
        content: buildFallbackSoul(main, rule),
        keywords: [main.category, main.name, rule.name, ...normalizeKeywords(`${main.core} ${rule.core}`)],
        sourceRef: {
          kind: "marketplace-fallback",
          label: "官方灵感卡（本地回退）",
          note: `按 ${snapshot.provenance.combinationFormula} 组合规则生成的示例卡片`,
        },
        meta: {
          soulCatalogId: `soul-${main.index.toString().padStart(2, "0")}-${rule.index.toString().padStart(2, "0")}`,
          mainCatalogName: main.name,
          orthogonalCatalogName: rule.name,
          styleType: main.category,
          provenance: `${snapshot.provenance.mainPath} × ${snapshot.provenance.orthPath}`,
          example: `示例：先以「${main.name}」承接语气，再按「${rule.name}」组织回复。`,
        },
      }

      return fragment
    })

  return fragments.filter((entry): entry is SoulFragment => entry !== null)
}

export function normalizeMarketplaceItem(item: MarketplaceItemDto): SoulFragment {
  const mainName = item.mainCatalogName?.trim() || "未命名基础角色"
  const ruleName = item.orthogonalCatalogName?.trim() || "未命名表达规则"

  return {
    fragmentId: `published-soul-${item.soulCatalogId}`,
    group: "published-soul",
    title: item.displayName.trim(),
    summary: item.summary?.trim() || `${mainName} × ${ruleName}`,
    content: [
      `官方灵感卡：${item.displayName.trim()}`,
      item.summary?.trim() || `${mainName} × ${ruleName}`,
      `基础角色：${mainName}`,
      `表达规则：${ruleName}`,
    ].join("\n"),
    keywords: item.keywords,
    sourceRef: {
      kind: "marketplace-api",
      label: "官方灵感卡",
      path: "/api/soul-marketplace/items",
      note: "运行期远端增强",
    },
    meta: {
      soulCatalogId: item.soulCatalogId,
      mainCatalogName: mainName,
      orthogonalCatalogName: ruleName,
      styleType: item.styleType,
    },
  }
}

function resolveMarketplaceEndpoint(baseUrl?: string) {
  const normalizedBase = baseUrl?.trim() || import.meta.env.VITE_SOUL_MARKETPLACE_API_BASE_URL?.trim() || ""
  if (normalizedBase) {
    return `${normalizedBase.replace(/\/$/, "")}/api/soul-marketplace/items?pageNumber=1&pageSize=6`
  }

  return "/api/soul-marketplace/items?pageNumber=1&pageSize=6"
}

async function fetchMarketplaceItems(fetcher: typeof fetch, baseUrl?: string) {
  const response = await fetcher(resolveMarketplaceEndpoint(baseUrl), {
    headers: {
      Accept: "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Remote inspiration request failed with ${response.status}.`)
  }

  const payload = (await response.json()) as {
    items?: MarketplaceItemDto[]
  }

  return (payload.items ?? []).map(normalizeMarketplaceItem)
}

function buildSourceNotes(state: BuilderMaterials["remoteState"], snapshot: ReferenceCatalogSnapshot, message: string | null): BuilderMaterials["sourceNotes"] {
  return [
    {
      id: "main-doc",
      title: "基础角色快照",
      detail: snapshot.provenance.mainPath,
      state: "ready",
    },
    {
      id: "orth-doc",
      title: "表达规则快照",
      detail: snapshot.provenance.orthPath,
      state: "ready",
    },
    {
      id: "marketplace",
      title: "官方灵感卡",
      detail: message ?? (state === "ready" ? "已接入远端灵感源。" : "未连接远端时使用本地回退卡片。"),
      state: state === "ready" ? "ready" : state === "error" ? "error" : "fallback",
    },
  ]
}

export function createLocalMaterials(snapshot: ReferenceCatalogSnapshot = referenceCatalogSnapshot): BuilderMaterials {
  const normalized = normalizeReferenceSnapshot(snapshot)

  return {
    ...normalized,
    inspirationFragments: buildFallbackInspirationFragments(snapshot),
    remoteState: "fallback",
    remoteMessage: "未连接官方灵感源，当前展示本地示例卡。",
    sourceNotes: buildSourceNotes("fallback", snapshot, "未连接远端时使用本地回退卡片。"),
    generatedAtUtc: snapshot.generatedAtUtc,
  }
}

export async function loadBuilderMaterials(
  options: {
    fetcher?: typeof fetch
    baseUrl?: string
    snapshot?: ReferenceCatalogSnapshot
  } = {}
): Promise<BuilderMaterials> {
  const snapshot = options.snapshot ?? referenceCatalogSnapshot
  const localMaterials = createLocalMaterials(snapshot)
  const fetcher = options.fetcher ?? fetch

  try {
    const inspirationFragments = await fetchMarketplaceItems(fetcher, options.baseUrl)
    if (inspirationFragments.length === 0) {
      return {
        ...localMaterials,
        remoteState: "fallback",
        remoteMessage: "官方灵感源当前为空，已切回本地示例卡。",
        sourceNotes: buildSourceNotes("fallback", snapshot, "官方灵感源当前为空，已切回本地示例卡。"),
      }
    }

    return {
      ...localMaterials,
      inspirationFragments,
      remoteState: "ready",
      remoteMessage: "已加载官方灵感卡。",
      sourceNotes: buildSourceNotes("ready", snapshot, "已接入远端灵感源。"),
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Remote inspiration request failed."
    return {
      ...localMaterials,
      remoteState: "error",
      remoteMessage: `${message} 已切换到本地示例卡。`,
      sourceNotes: buildSourceNotes("error", snapshot, `${message} 已切换到本地示例卡。`),
    }
  }
}
