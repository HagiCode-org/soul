import { useCallback, useEffect, useMemo, useState } from "react"

import { buildDraftName, createEmptyDraft, touchDraft } from "@/lib/builder/draft"
import { applyInspirationFragment, clearInspirationFragment, resolveDraftFragments } from "@/lib/builder/draft-helpers"
import { createLocalMaterials, loadBuilderMaterials } from "@/lib/builder/material-repository"
import { compilePreview, getIncompletePreviewHint } from "@/lib/builder/preview-compiler"
import type { BuilderMaterials, SoulBuilderDraft } from "@/lib/builder/types"

type FeedbackState = {
  tone: "info" | "success" | "error"
  message: string
} | null

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
  const [draft, setDraft] = useState<SoulBuilderDraft>(() => createEmptyDraft())
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
  const effectiveMainSlotText = draft.mainSlotText || resolvedFragments.mainFragment?.content || ""
  const effectiveRuleSlotText = draft.ruleSlotText || resolvedFragments.ruleFragment?.content || ""

  const preview = useMemo(
    () =>
      compilePreview(
        {
          mainSlotText: effectiveMainSlotText,
          ruleSlotText: effectiveRuleSlotText,
          customPrompt: draft.customPrompt,
        },
        resolvedFragments
      ),
    [draft.customPrompt, effectiveMainSlotText, effectiveRuleSlotText, resolvedFragments]
  )

  const currentDraft = useMemo(
    () => ({
      ...draft,
      mainSlotText: effectiveMainSlotText,
      ruleSlotText: effectiveRuleSlotText,
      name: buildDraftName(resolvedFragments.mainFragment, resolvedFragments.ruleFragment),
      previewText: preview.text,
    }),
    [draft, effectiveMainSlotText, effectiveRuleSlotText, preview.text, resolvedFragments.mainFragment, resolvedFragments.ruleFragment]
  )
  const canCompose = Boolean(effectiveMainSlotText.trim() && effectiveRuleSlotText.trim())
  const previewHint = getIncompletePreviewHint(preview.missing)

  const selectMainFragment = useCallback((fragmentId: string) => {
    setDraft((current) => {
      const fragment = materials.mainFragments.find((item) => item.fragmentId === fragmentId)
      return touchDraft({
        ...current,
        selectedMainFragmentId: fragmentId,
        mainSlotText: fragment?.content ?? current.mainSlotText,
      })
    })
  }, [materials.mainFragments])

  const clearMainFragment = useCallback(() => {
    setDraft((current) => touchDraft({ ...current, selectedMainFragmentId: null, mainSlotText: "" }))
  }, [])

  const selectRuleFragment = useCallback((fragmentId: string) => {
    setDraft((current) => {
      const fragment = materials.expressionFragments.find((item) => item.fragmentId === fragmentId)
      return touchDraft({
        ...current,
        selectedRuleFragmentId: fragmentId,
        ruleSlotText: fragment?.content ?? current.ruleSlotText,
      })
    })
  }, [materials.expressionFragments])

  const clearRuleFragment = useCallback(() => {
    setDraft((current) => touchDraft({ ...current, selectedRuleFragmentId: null, ruleSlotText: "" }))
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

  const updateMainSlotText = useCallback((value: string) => {
    setDraft((current) => touchDraft({ ...current, mainSlotText: value }))
  }, [])

  const updateRuleSlotText = useCallback((value: string) => {
    setDraft((current) => touchDraft({ ...current, ruleSlotText: value }))
  }, [])

  const copyPreviewText = useCallback(async () => {
    if (!canCompose) {
      setFeedback({ tone: "error", message: previewHint ?? "核心组合尚未完成。" })
      return
    }

    await copyText(currentDraft.previewText)
    setFeedback({ tone: "success", message: "预览文案已复制。" })
  }, [canCompose, currentDraft.previewText, previewHint])

  return {
    materials,
    draft: currentDraft,
    rawDraft: draft,
    preview,
    previewHint,
    canCompose,
    libraryQuery,
    selectedCategory,
    categories,
    feedback,
    filteredMainFragments,
    filteredRuleFragments,
    filteredInspirationFragments,
    resolvedFragments,
    reloadMaterials,
    setLibraryQuery,
    setSelectedCategory,
    selectMainFragment,
    clearMainFragment,
    selectRuleFragment,
    clearRuleFragment,
    selectInspirationFragment,
    clearSelectedInspiration,
    updateMainSlotText,
    updateRuleSlotText,
    updateCustomPrompt,
    copyPreviewText,
  }
}
