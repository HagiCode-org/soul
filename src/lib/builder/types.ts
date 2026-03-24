export type SoulFragmentGroup = "main-catalog" | "expression-rule" | "published-soul"
export type MaterialLoadState = "idle" | "loading" | "ready" | "fallback" | "error"
export type MissingCoreSelection = "main" | "rule"

export type ReferenceProvenance = {
  mainPath: string
  orthPath: string
  combinationFormula: string
}

export type ReferenceMainCatalog = {
  index: number
  category: string
  name: string
  core: string
  signature: string
}

export type ReferenceOrthogonalCatalog = {
  index: number
  name: string
  core: string
  signature: string
  compatibility: string
}

export type ReferenceCatalogSnapshot = {
  generatedAtUtc: string
  provenance: ReferenceProvenance
  mainCatalogs: readonly ReferenceMainCatalog[]
  orthogonalCatalogs: readonly ReferenceOrthogonalCatalog[]
}

export type SoulFragmentSourceRef = {
  kind: "reference-doc" | "marketplace-api" | "marketplace-fallback"
  label: string
  path?: string
  note?: string
}

export type SoulFragmentMeta = {
  index?: number
  category?: string
  signature?: string
  compatibility?: string
  soulCatalogId?: string
  mainCatalogName?: string
  orthogonalCatalogName?: string
  styleType?: string | null
  provenance?: string | null
  example?: string | null
}

export type SoulFragment = {
  fragmentId: string
  group: SoulFragmentGroup
  title: string
  summary: string
  content: string
  keywords: string[]
  sourceRef: SoulFragmentSourceRef
  meta: SoulFragmentMeta
}

export type MaterialSourceNote = {
  id: string
  title: string
  detail: string
  state: Exclude<MaterialLoadState, "idle" | "loading">
}

export type BuilderMaterials = {
  mainFragments: SoulFragment[]
  expressionFragments: SoulFragment[]
  inspirationFragments: SoulFragment[]
  remoteState: MaterialLoadState
  remoteMessage: string | null
  sourceNotes: MaterialSourceNote[]
  generatedAtUtc: string
}

export type SoulBuilderDraft = {
  draftId: string
  name: string
  selectedMainFragmentId: string | null
  selectedRuleFragmentId: string | null
  inspirationSoulId: string | null
  mainSlotText: string
  ruleSlotText: string
  customPrompt: string
  previewText: string
  updatedAt: string
}

export type SoulBuilderSnapshot = {
  version: string
  savedAt: string
  draft: SoulBuilderDraft
}

export type SoulBuilderExportPayload = {
  version: string
  exportedAt: string
  draft: SoulBuilderDraft
  selectedMainFragment: SoulFragment | null
  selectedRuleFragment: SoulFragment | null
  inspirationFragment: SoulFragment | null
  previewText: string
}

export type SoulBuilderExportResult = {
  fileName: string
  jsonText: string
  soulText: string
  payload: SoulBuilderExportPayload
}

export type PreviewCompilation = {
  text: string
  isComplete: boolean
  missing: MissingCoreSelection[]
  title: string
  sections: string[]
}

export type MarketplaceItemDto = {
  soulCatalogId: string
  displayName: string
  styleType: string | null
  summary: string | null
  mainCatalogName: string | null
  orthogonalCatalogName: string | null
  keywords: string[]
}
