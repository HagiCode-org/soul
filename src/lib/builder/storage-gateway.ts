import { buildDraftName, createEmptyDraft } from "@/lib/builder/draft"
import type { SoulBuilderDraft, SoulBuilderSnapshot, SoulFragment } from "@/lib/builder/types"

export const soulBuilderSnapshotVersion = "1"
export const soulBuilderStorageKey = "soul-builder:snapshots"
const maxSnapshots = 8

type StorageLike = Pick<Storage, "getItem" | "setItem">

function canUseStorage(storage?: StorageLike | null): storage is StorageLike {
  return Boolean(storage)
}

function normalizeDraft(candidate: unknown): SoulBuilderDraft {
  const fallback = createEmptyDraft()
  if (!candidate || typeof candidate !== "object") {
    return fallback
  }

  const source = candidate as Partial<SoulBuilderDraft>
  return {
    draftId: typeof source.draftId === "string" && source.draftId.trim() ? source.draftId : fallback.draftId,
    name: typeof source.name === "string" && source.name.trim() ? source.name : fallback.name,
    selectedMainFragmentId: typeof source.selectedMainFragmentId === "string" ? source.selectedMainFragmentId : null,
    selectedRuleFragmentId: typeof source.selectedRuleFragmentId === "string" ? source.selectedRuleFragmentId : null,
    inspirationSoulId: typeof source.inspirationSoulId === "string" ? source.inspirationSoulId : null,
    mainSlotText: typeof source.mainSlotText === "string" ? source.mainSlotText : "",
    ruleSlotText: typeof source.ruleSlotText === "string" ? source.ruleSlotText : "",
    customPrompt: typeof source.customPrompt === "string" ? source.customPrompt : "",
    previewText: typeof source.previewText === "string" ? source.previewText : "",
    updatedAt: typeof source.updatedAt === "string" && source.updatedAt ? source.updatedAt : fallback.updatedAt,
  }
}

function normalizeSnapshot(candidate: unknown): SoulBuilderSnapshot | null {
  if (!candidate || typeof candidate !== "object") {
    return null
  }

  const source = candidate as Partial<SoulBuilderSnapshot> & { draft?: unknown }
  const draft = normalizeDraft(source.draft)
  const version = typeof source.version === "string" && source.version ? source.version : soulBuilderSnapshotVersion
  const savedAt = typeof source.savedAt === "string" && source.savedAt ? source.savedAt : draft.updatedAt

  return {
    version,
    savedAt,
    draft,
  }
}

export function readSnapshots(storage: StorageLike | null | undefined = typeof window !== "undefined" ? window.localStorage : null) {
  if (!canUseStorage(storage)) {
    return []
  }

  const raw = storage.getItem(soulBuilderStorageKey)
  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
      .map((entry) => normalizeSnapshot(entry))
      .filter((entry): entry is SoulBuilderSnapshot => entry !== null)
      .sort((left, right) => right.savedAt.localeCompare(left.savedAt))
  } catch {
    return []
  }
}

export function saveDraftSnapshot(
  draft: SoulBuilderDraft,
  fragments: {
    mainFragment: SoulFragment | null
    ruleFragment: SoulFragment | null
  },
  storage: StorageLike | null | undefined = typeof window !== "undefined" ? window.localStorage : null
) {
  if (!canUseStorage(storage)) {
    return null
  }

  const snapshot: SoulBuilderSnapshot = {
    version: soulBuilderSnapshotVersion,
    savedAt: new Date().toISOString(),
    draft: {
      ...draft,
      name: buildDraftName(fragments.mainFragment, fragments.ruleFragment),
      updatedAt: new Date().toISOString(),
    },
  }

  const merged = [snapshot, ...readSnapshots(storage).filter((entry) => entry.draft.draftId !== draft.draftId)].slice(0, maxSnapshots)
  storage.setItem(soulBuilderStorageKey, JSON.stringify(merged))
  return snapshot
}

export function getLatestSnapshot(storage?: StorageLike | null) {
  return readSnapshots(storage)[0] ?? null
}

export function restoreLatestDraft(storage?: StorageLike | null) {
  return getLatestSnapshot(storage)?.draft ?? createEmptyDraft()
}
