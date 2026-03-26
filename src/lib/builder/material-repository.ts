import type { AppLocale } from "@/i18n/locales"
import { normalizeLocale } from "@/i18n/locales"
import { referenceCatalogSnapshot } from "@/data/reference-materials.generated"
import { mainCatalogEnTranslations, orthogonalCatalogEnTranslations } from "@/data/reference-material-translations"
import type {
  BuilderMaterials,
  LocalizedFragmentContent,
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

function normalizeKeywords(source: string) {
  const keywords = new Set<string>()

  for (const token of source.split(keywordSplitRegex)) {
    const normalized = token.trim().replace(/^[「」（）()"']+|[「」（）()"']+$/g, "")
    if (normalized.length < 2 || normalized.length > 24) {
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

function buildMainContent(name: string, core: string, signature: string, locale: AppLocale) {
  if (locale === "en-US") {
    return `Your persona core comes from "${name}": ${core}\nKeep these signature language traits: ${signature}`
  }

  return `你的人设内核来自「${name}」：${core}\n保持以下标志性语言特征：${signature}`
}

function buildRuleContent(name: string, core: string, signature: string, locale: AppLocale) {
  if (locale === "en-US") {
    return `Your expression rules come from "${name}": ${core}\nYou must follow these output constraints: ${signature}`
  }

  return `你的表达规则来自「${name}」：${core}\n必须遵循这些输出约束：${signature}`
}

function buildLocalizedKeywords(...segments: string[]) {
  return normalizeKeywords(segments.join(" "))
}

function getMainEnglishTranslation(entry: ReferenceMainCatalog) {
  return mainCatalogEnTranslations[entry.index]
}

function getRuleEnglishTranslation(entry: ReferenceOrthogonalCatalog) {
  return orthogonalCatalogEnTranslations[entry.index]
}

function buildMainLocalizedContent(entry: ReferenceMainCatalog): LocalizedFragmentContent | undefined {
  const translation = getMainEnglishTranslation(entry)
  if (!translation) {
    return undefined
  }

  return {
    title: translation.name,
    summary: translation.core,
    content: buildMainContent(translation.name, translation.core, translation.signature, "en-US"),
    keywords: buildLocalizedKeywords(translation.name, translation.core, translation.signature),
  }
}

function buildRuleLocalizedContent(entry: ReferenceOrthogonalCatalog): LocalizedFragmentContent | undefined {
  const translation = getRuleEnglishTranslation(entry)
  if (!translation) {
    return undefined
  }

  return {
    title: translation.name,
    summary: translation.core,
    content: buildRuleContent(translation.name, translation.core, translation.signature, "en-US"),
    keywords: buildLocalizedKeywords(translation.name, translation.core, translation.signature, translation.compatibility),
  }
}

function createLocalizedRecord(content?: LocalizedFragmentContent) {
  return content ? ({ "en-US": content } satisfies SoulFragment["localized"]) : undefined
}

function normalizeMainCatalog(entry: ReferenceMainCatalog, snapshot: ReferenceCatalogSnapshot): SoulFragment {
  const localized = buildMainLocalizedContent(entry)

  return {
    fragmentId: buildFragmentId("main-catalog", entry.index),
    group: "main-catalog",
    title: entry.name,
    summary: entry.core,
    content: buildMainContent(entry.name, entry.core, entry.signature, "zh-CN"),
    keywords: [entry.category, entry.name, ...normalizeKeywords(`${entry.core} ${entry.signature}`)],
    localized: createLocalizedRecord(localized),
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
  const localized = buildRuleLocalizedContent(entry)
  const sourceKind = entry.sourceKind ?? "reference-doc"
  const sourceLabel = entry.sourceLabel ?? "表达规则"
  const sourcePath = entry.sourcePath ?? snapshot.provenance.orthPath
  const sourceNote = entry.sourceNote ?? `构建期快照，生成于 ${snapshot.generatedAtUtc}`

  return {
    fragmentId: buildFragmentId("expression-rule", entry.index),
    group: "expression-rule",
    title: entry.name,
    summary: entry.core,
    content: buildRuleContent(entry.name, entry.core, entry.signature, "zh-CN"),
    keywords: [entry.name, ...normalizeKeywords(`${entry.core} ${entry.signature} ${entry.compatibility}`)],
    localized: createLocalizedRecord(localized),
    sourceRef: {
      kind: sourceKind,
      label: sourceLabel,
      path: sourcePath,
      note: sourceNote,
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

function buildFallbackSoul(main: ReferenceMainCatalog, rule: ReferenceOrthogonalCatalog, locale: AppLocale) {
  if (locale === "en-US") {
    const mainTranslation = getMainEnglishTranslation(main)
    const ruleTranslation = getRuleEnglishTranslation(rule)
    const mainName = mainTranslation?.name ?? main.name
    const mainCore = mainTranslation?.core ?? main.core
    const mainSignature = mainTranslation?.signature ?? main.signature
    const ruleName = ruleTranslation?.name ?? rule.name
    const ruleCore = ruleTranslation?.core ?? rule.core
    const ruleSignature = ruleTranslation?.signature ?? rule.signature

    return [
      `Your persona core comes from "${mainName}": ${mainCore}`,
      `Keep these signature language traits: ${mainSignature}`,
      `Your expression rules come from "${ruleName}": ${ruleCore}`,
      `You must follow these output constraints: ${ruleSignature}`,
    ].join("\n")
  }

  return [
    `你的人设内核来自「${main.name}」：${main.core}`,
    `保持以下标志性语言特征：${main.signature}`,
    `你的表达规则来自「${rule.name}」：${rule.core}`,
    `必须遵循这些输出约束：${rule.signature}`,
  ].join("\n")
}

function buildFallbackLocalizedFragment(main: ReferenceMainCatalog, rule: ReferenceOrthogonalCatalog): LocalizedFragmentContent | undefined {
  const mainTranslation = getMainEnglishTranslation(main)
  const ruleTranslation = getRuleEnglishTranslation(rule)
  if (!mainTranslation || !ruleTranslation) {
    return undefined
  }

  return {
    title: `${mainTranslation.name} x ${ruleTranslation.name}`,
    summary: `${mainTranslation.core}; expression style: ${ruleTranslation.core}`,
    content: buildFallbackSoul(main, rule, "en-US"),
    keywords: buildLocalizedKeywords(mainTranslation.name, mainTranslation.core, ruleTranslation.name, ruleTranslation.core),
  }
}

export function buildFallbackInspirationFragments(snapshot: ReferenceCatalogSnapshot = referenceCatalogSnapshot): SoulFragment[] {
  const fragments: Array<SoulFragment | null> = featuredFallbackPairs.map(([mainIndex, ruleIndex]) => {
    const main = snapshot.mainCatalogs.find((entry) => entry.index === mainIndex)
    const rule = snapshot.orthogonalCatalogs.find((entry) => entry.index === ruleIndex)
    if (!main || !rule) {
      return null
    }

    const localized = buildFallbackLocalizedFragment(main, rule)

    return {
      fragmentId: `published-soul-${main.index.toString().padStart(2, "0")}-${rule.index.toString().padStart(2, "0")}`,
      group: "published-soul",
      title: `${main.name} × ${rule.name}`,
      summary: `${main.core}；表达规则：${rule.core}`,
      content: buildFallbackSoul(main, rule, "zh-CN"),
      keywords: [main.category, main.name, rule.name, ...normalizeKeywords(`${main.core} ${rule.core}`)],
      localized: createLocalizedRecord(localized),
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
    } satisfies SoulFragment
  })

  return fragments.filter((entry): entry is SoulFragment => entry !== null)
}

function resolveMainNameEnglish(mainName: string | null | undefined) {
  if (!mainName) {
    return "Untitled base role"
  }

  const match = referenceCatalogSnapshot.mainCatalogs.find((entry) => entry.name === mainName.trim())
  return match ? (getMainEnglishTranslation(match)?.name ?? match.name) : mainName.trim()
}

function resolveRuleNameEnglish(ruleName: string | null | undefined) {
  if (!ruleName) {
    return "Untitled expression rule"
  }

  const match = referenceCatalogSnapshot.orthogonalCatalogs.find((entry) => entry.name === ruleName.trim())
  return match ? (getRuleEnglishTranslation(match)?.name ?? match.name) : ruleName.trim()
}

export function normalizeMarketplaceItem(item: MarketplaceItemDto): SoulFragment {
  const mainName = item.mainCatalogName?.trim() || "未命名基础角色"
  const ruleName = item.orthogonalCatalogName?.trim() || "未命名表达规则"
  const mainNameEnglish = resolveMainNameEnglish(item.mainCatalogName)
  const ruleNameEnglish = resolveRuleNameEnglish(item.orthogonalCatalogName)

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
    localized: {
      "en-US": {
        title: item.displayName.trim(),
        summary: `${mainNameEnglish} x ${ruleNameEnglish}`,
        content: [
          `Official inspiration card: ${item.displayName.trim()}`,
          `Base role: ${mainNameEnglish}`,
          `Expression: ${ruleNameEnglish}`,
        ].join("\n"),
        keywords: buildLocalizedKeywords(item.displayName.trim(), mainNameEnglish, ruleNameEnglish, ...(item.keywords ?? [])),
      },
    },
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

export function resolveLocalizedFragment(fragment: SoulFragment, locale: string | AppLocale) {
  const normalizedLocale = normalizeLocale(locale)
  return fragment.localized?.[normalizedLocale] ?? {
    title: fragment.title,
    summary: fragment.summary,
    content: fragment.content,
    keywords: fragment.keywords,
  }
}

export function resolveLocalizedSoulFragment(fragment: SoulFragment, locale: string | AppLocale): SoulFragment {
  const localized = resolveLocalizedFragment(fragment, locale)

  return {
    ...fragment,
    title: localized.title,
    summary: localized.summary,
    content: localized.content,
    keywords: localized.keywords ?? fragment.keywords,
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
    remoteMessage: { key: "builder.materialLibrary.remote.fallback" },
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
        remoteMessage: { key: "builder.materialLibrary.remote.empty" },
        sourceNotes: buildSourceNotes("fallback", snapshot, "官方灵感源当前为空，已切回本地示例卡。"),
      }
    }

    return {
      ...localMaterials,
      inspirationFragments,
      remoteState: "ready",
      remoteMessage: { key: "builder.materialLibrary.remote.ready" },
      sourceNotes: buildSourceNotes("ready", snapshot, "已接入远端灵感源。"),
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Remote inspiration request failed."
    return {
      ...localMaterials,
      remoteState: "error",
      remoteMessage: {
        key: "builder.materialLibrary.remote.errorWithFallback",
        values: { detail: message },
      },
      sourceNotes: buildSourceNotes("error", snapshot, `${message} 已切换到本地示例卡。`),
    }
  }
}
