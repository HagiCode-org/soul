import { useCallback, useEffect, useMemo, useState } from "react"

import { buildDraftName, touchDraft } from "@/lib/builder/draft"
import { applyInspirationFragment, clearInspirationFragment, resolveDraftFragments } from "@/lib/builder/draft-helpers"
import { canExportDraft, createDraftExport } from "@/lib/builder/export-serializer"
import { createLocalMaterials, loadBuilderMaterials } from "@/lib/builder/material-repository"
import { compilePreview, getIncompletePreviewHint } from "@/lib/builder/preview-compiler"
import { readSnapshots, restoreLatestDraft, saveDraftSnapshot } from "@/lib/builder/storage-gateway"
import type { BuilderMaterials, MaterialLoadState, SoulBuilderDraft, SoulBuilderSnapshot } from "@/lib/builder/types"

type FeedbackState = {
  tone: "info" | "success" | "error"
  message: string
} | null

type BuilderSelectionStatus = {
  id: "main" | "rule" | "inspiration" | "custom"
  label: string
  value: string
  complete: boolean
}

function downloadTextFile(fileName: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(url)
}

async function copyText(content: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(content)
    return
  }

  const textarea = document.createElement("textarea")
  textarea.value = content
  textarea.style.position = "fixed"
  textarea.style.opacity = "0"
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand("copy")
  document.body.removeChild(textarea)
}

export function useSoulBuilder() {
  const [materials, setMaterials] = useState<BuilderMaterials>(() => {
    const localMaterials = createLocalMaterials()
    return {
      ...localMaterials,
      remoteState: "loading",
      remoteMessage: "正在获取官方灵感卡。",
    }
  })
  const [draft, setDraft] = useState<SoulBuilderDraft>(() => restoreLatestDraft())
  const [snapshots, setSnapshots] = useState<SoulBuilderSnapshot[]>(() => readSnapshots())
  const [libraryQuery, setLibraryQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("全部")
  const [feedback, setFeedback] = useState<FeedbackState>(null)

  const reloadMaterials = useCallback(async () => {
    setMaterials((current) => ({
      ...current,
      remoteState: "loading",
      remoteMessage: "正在刷新官方灵感卡。",
    }))

    const nextMaterials = await loadBuilderMaterials()
    setMaterials(nextMaterials)
  }, [])

  useEffect(() => {
    let cancelled = false

    void loadBuilderMaterials().then((nextMaterials) => {
      if (!cancelled) {
        setMaterials(nextMaterials)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  const categories = useMemo(
    () => ["全部", ...new Set(materials.mainFragments.map((fragment) => fragment.meta.category).filter(Boolean) as string[])],
    [materials.mainFragments]
  )

  const filteredMainFragments = useMemo(() => {
    const query = libraryQuery.trim().toLowerCase()
    return materials.mainFragments.filter((fragment) => {
      const matchesCategory = selectedCategory === "全部" || fragment.meta.category === selectedCategory
      if (!matchesCategory) {
        return false
      }

      if (!query) {
        return true
      }

      return [fragment.title, fragment.summary, ...fragment.keywords].some((value) => value.toLowerCase().includes(query))
    })
  }, [libraryQuery, materials.mainFragments, selectedCategory])

  const filteredRuleFragments = useMemo(() => {
    const query = libraryQuery.trim().toLowerCase()
    return materials.expressionFragments.filter((fragment) => {
      if (!query) {
        return true
      }

      return [fragment.title, fragment.summary, ...fragment.keywords].some((value) => value.toLowerCase().includes(query))
    })
  }, [libraryQuery, materials.expressionFragments])

  const filteredInspirationFragments = useMemo(() => {
    const query = libraryQuery.trim().toLowerCase()
    return materials.inspirationFragments.filter((fragment) => {
      if (!query) {
        return true
      }

      return [fragment.title, fragment.summary, ...fragment.keywords].some((value) => value.toLowerCase().includes(query))
    })
  }, [libraryQuery, materials.inspirationFragments])

  const resolvedFragments = useMemo(() => resolveDraftFragments(materials, draft), [draft, materials])
  const preview = useMemo(
    () => compilePreview({ customPrompt: draft.customPrompt }, resolvedFragments),
    [draft.customPrompt, resolvedFragments]
  )

  const currentDraft = useMemo(
    () => ({
      ...draft,
      name: buildDraftName(resolvedFragments.mainFragment, resolvedFragments.ruleFragment),
      previewText: preview.text,
    }),
    [draft, preview.text, resolvedFragments.mainFragment, resolvedFragments.ruleFragment]
  )
  const canExport = canExportDraft(resolvedFragments.mainFragment, resolvedFragments.ruleFragment)
  const previewHint = getIncompletePreviewHint(preview.missing)

  const selectionStatus = useMemo<BuilderSelectionStatus[]>(
    () => [
      {
        id: "main",
        label: "主 Catalog",
        value: resolvedFragments.mainFragment?.title ?? "未选",
        complete: Boolean(resolvedFragments.mainFragment),
      },
      {
        id: "rule",
        label: "表达规则",
        value: resolvedFragments.ruleFragment?.title ?? "未选",
        complete: Boolean(resolvedFragments.ruleFragment),
      },
      {
        id: "inspiration",
        label: "官方灵感",
        value: resolvedFragments.inspirationFragment?.title ?? "未导入",
        complete: Boolean(resolvedFragments.inspirationFragment),
      },
      {
        id: "custom",
        label: "自定义补充",
        value: draft.customPrompt.trim() ? "已填写" : "留空",
        complete: Boolean(draft.customPrompt.trim()),
      },
    ],
    [draft.customPrompt, resolvedFragments.inspirationFragment, resolvedFragments.mainFragment, resolvedFragments.ruleFragment]
  )

  const workbenchStatus = useMemo(
    () => ({
      draftName: currentDraft.name,
      snapshotCount: snapshots.length,
      exportReady: canExport,
      remoteState: materials.remoteState,
      remoteMessage: materials.remoteMessage,
      activeSelections: selectionStatus.filter((entry) => entry.complete).length,
      updatedAt: currentDraft.updatedAt,
    }),
    [canExport, currentDraft.name, currentDraft.updatedAt, materials.remoteMessage, materials.remoteState, selectionStatus, snapshots.length]
  )

  const selectMainFragment = useCallback((fragmentId: string) => {
    setDraft((current) => touchDraft({ ...current, selectedMainFragmentId: fragmentId }))
  }, [])

  const clearMainFragment = useCallback(() => {
    setDraft((current) => touchDraft({ ...current, selectedMainFragmentId: null }))
  }, [])

  const selectRuleFragment = useCallback((fragmentId: string) => {
    setDraft((current) => touchDraft({ ...current, selectedRuleFragmentId: fragmentId }))
  }, [])

  const clearRuleFragment = useCallback(() => {
    setDraft((current) => touchDraft({ ...current, selectedRuleFragmentId: null }))
  }, [])

  const selectInspirationFragment = useCallback(
    (fragmentId: string) => {
      const inspiration = materials.inspirationFragments.find((fragment) => fragment.fragmentId === fragmentId)
      if (!inspiration) {
        return
      }

      setDraft((current) => applyInspirationFragment(current, inspiration, materials))
      setFeedback({ tone: "success", message: `已导入灵感卡「${inspiration.title}」。` })
    },
    [materials]
  )

  const clearSelectedInspiration = useCallback(() => {
    setDraft((current) => clearInspirationFragment(current))
  }, [])

  const updateCustomPrompt = useCallback((value: string) => {
    setDraft((current) => touchDraft({ ...current, customPrompt: value }))
  }, [])

  const saveCurrentDraft = useCallback(() => {
    const snapshot = saveDraftSnapshot(currentDraft, resolvedFragments)
    if (!snapshot) {
      setFeedback({ tone: "error", message: "当前环境不支持本地保存。" })
      return
    }

    setSnapshots(readSnapshots())
    setFeedback({ tone: "success", message: `草稿已保存：${snapshot.draft.name}` })
  }, [currentDraft, resolvedFragments])

  const restoreSnapshot = useCallback((snapshot: SoulBuilderSnapshot) => {
    setDraft(snapshot.draft)
    setFeedback({ tone: "info", message: `已恢复草稿：${snapshot.draft.name}` })
  }, [])

  const exportCurrentDraft = useCallback(() => {
    if (!canExport) {
      setFeedback({ tone: "error", message: previewHint ?? "核心组合尚未完成。" })
      return
    }

    const result = createDraftExport(currentDraft, resolvedFragments)
    downloadTextFile(result.fileName, result.jsonText, "application/json")
    setFeedback({ tone: "success", message: `已导出 ${result.fileName}` })
  }, [canExport, currentDraft, previewHint, resolvedFragments])

  const copyPreviewText = useCallback(async () => {
    if (!canExport) {
      setFeedback({ tone: "error", message: previewHint ?? "核心组合尚未完成。" })
      return
    }

    await copyText(currentDraft.previewText)
    setFeedback({ tone: "success", message: "预览文案已复制。" })
  }, [canExport, currentDraft.previewText, previewHint])

  return {
    materials,
    draft: currentDraft,
    rawDraft: draft,
    preview,
    previewHint,
    canExport,
    libraryQuery,
    selectedCategory,
    categories,
    feedback,
    filteredMainFragments,
    filteredRuleFragments,
    filteredInspirationFragments,
    resolvedFragments,
    selectionStatus,
    workbenchStatus,
    snapshots,
    reloadMaterials,
    setLibraryQuery,
    setSelectedCategory,
    selectMainFragment,
    clearMainFragment,
    selectRuleFragment,
    clearRuleFragment,
    selectInspirationFragment,
    clearSelectedInspiration,
    updateCustomPrompt,
    saveCurrentDraft,
    restoreSnapshot,
    exportCurrentDraft,
    copyPreviewText,
  }
}

export function getStatusToneClass(state: MaterialLoadState) {
  switch (state) {
    case "ready":
      return "text-emerald-600 dark:text-emerald-300"
    case "error":
      return "text-rose-600 dark:text-rose-300"
    case "loading":
      return "text-amber-700 dark:text-amber-300"
    default:
      return "text-muted-foreground"
  }
}
