import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { ALL_CATEGORY_ID, normalizeLocale } from "@/i18n/locales"
import { buildDraftName, createEmptyDraft, touchDraft } from "@/lib/builder/draft"
import { applyInspirationFragment, clearInspirationFragment, resolveDraftFragments } from "@/lib/builder/draft-helpers"
import { createLocalMaterials, loadBuilderMaterials, resolveLocalizedFragment, resolveLocalizedSoulFragment } from "@/lib/builder/material-repository"
import { compilePreview, getIncompletePreviewHint } from "@/lib/builder/preview-compiler"
import type { BuilderMaterials, MessageDescriptor, SoulBuilderDraft } from "@/lib/builder/types"

type FeedbackState = {
  tone: "info" | "success" | "error"
  message: MessageDescriptor
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
  const { i18n } = useTranslation()
  const locale = normalizeLocale(i18n.resolvedLanguage ?? i18n.language)
  const [materials, setMaterials] = useState<BuilderMaterials>(() => {
    const localMaterials = createLocalMaterials()
    return {
      ...localMaterials,
      remoteState: "loading",
      remoteMessage: { key: "builder.materialLibrary.remote.loadingInitial" },
    }
  })
  const [draft, setDraft] = useState<SoulBuilderDraft>(() => createEmptyDraft())
  const [libraryQuery, setLibraryQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY_ID)
  const [feedback, setFeedback] = useState<FeedbackState>(null)

  const reloadMaterials = useCallback(async () => {
    setMaterials((current) => ({
      ...current,
      remoteState: "loading",
      remoteMessage: { key: "builder.materialLibrary.remote.loadingRefresh" },
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
    () => [ALL_CATEGORY_ID, ...new Set(materials.mainFragments.map((fragment) => fragment.meta.category).filter(Boolean) as string[])],
    [materials.mainFragments]
  )

  const filteredMainFragments = useMemo(() => {
    const query = libraryQuery.trim().toLowerCase()
    return materials.mainFragments.filter((fragment) => {
      const localized = resolveLocalizedFragment(fragment, locale)
      const matchesCategory = selectedCategory === ALL_CATEGORY_ID || fragment.meta.category === selectedCategory
      if (!matchesCategory) {
        return false
      }

      if (!query) {
        return true
      }

      return [localized.title, localized.summary, ...(localized.keywords ?? fragment.keywords)].some((value) => value.toLowerCase().includes(query))
    })
  }, [libraryQuery, locale, materials.mainFragments, selectedCategory])

  const filteredRuleFragments = useMemo(() => {
    const query = libraryQuery.trim().toLowerCase()
    return materials.expressionFragments.filter((fragment) => {
      const localized = resolveLocalizedFragment(fragment, locale)
      if (!query) {
        return true
      }

      return [localized.title, localized.summary, ...(localized.keywords ?? fragment.keywords)].some((value) => value.toLowerCase().includes(query))
    })
  }, [libraryQuery, locale, materials.expressionFragments])

  const filteredInspirationFragments = useMemo(() => {
    const query = libraryQuery.trim().toLowerCase()
    return materials.inspirationFragments.filter((fragment) => {
      const localized = resolveLocalizedFragment(fragment, locale)
      if (!query) {
        return true
      }

      return [localized.title, localized.summary, ...(localized.keywords ?? fragment.keywords)].some((value) => value.toLowerCase().includes(query))
    })
  }, [libraryQuery, locale, materials.inspirationFragments])

  const resolvedFragments = useMemo(() => resolveDraftFragments(materials, draft), [draft, materials])
  const localizedResolvedFragments = useMemo(
    () => ({
      mainFragment: resolvedFragments.mainFragment ? resolveLocalizedSoulFragment(resolvedFragments.mainFragment, locale) : null,
      ruleFragment: resolvedFragments.ruleFragment ? resolveLocalizedSoulFragment(resolvedFragments.ruleFragment, locale) : null,
      inspirationFragment: resolvedFragments.inspirationFragment ? resolveLocalizedSoulFragment(resolvedFragments.inspirationFragment, locale) : null,
    }),
    [locale, resolvedFragments.inspirationFragment, resolvedFragments.mainFragment, resolvedFragments.ruleFragment]
  )
  const effectiveMainSlotText = draft.mainSlotText || localizedResolvedFragments.mainFragment?.content || ""
  const effectiveRuleSlotText = draft.ruleSlotText || localizedResolvedFragments.ruleFragment?.content || ""

  const preview = useMemo(
    () =>
      compilePreview(
        {
          mainSlotText: effectiveMainSlotText,
          ruleSlotText: effectiveRuleSlotText,
          customPrompt: draft.customPrompt,
        },
        localizedResolvedFragments
      ),
    [draft.customPrompt, effectiveMainSlotText, effectiveRuleSlotText, localizedResolvedFragments]
  )

  const currentDraft = useMemo(
    () => ({
      ...draft,
      mainSlotText: effectiveMainSlotText,
      ruleSlotText: effectiveRuleSlotText,
      name: buildDraftName(localizedResolvedFragments.mainFragment, localizedResolvedFragments.ruleFragment),
      previewText: preview.text,
    }),
    [draft, effectiveMainSlotText, effectiveRuleSlotText, localizedResolvedFragments.mainFragment, localizedResolvedFragments.ruleFragment, preview.text]
  )
  const canCompose = Boolean(effectiveMainSlotText.trim() && effectiveRuleSlotText.trim())
  const previewHint = getIncompletePreviewHint(preview.missing)

  const selectMainFragment = useCallback((fragmentId: string) => {
    setDraft((current) => {
      const fragment = materials.mainFragments.find((item) => item.fragmentId === fragmentId)
      const localized = fragment ? resolveLocalizedFragment(fragment, locale) : null
      return touchDraft({
        ...current,
        selectedMainFragmentId: fragmentId,
        mainSlotText: localized?.content ?? current.mainSlotText,
      })
    })
  }, [locale, materials.mainFragments])

  const clearMainFragment = useCallback(() => {
    setDraft((current) => touchDraft({ ...current, selectedMainFragmentId: null, mainSlotText: "" }))
  }, [])

  const selectRuleFragment = useCallback((fragmentId: string) => {
    setDraft((current) => {
      const fragment = materials.expressionFragments.find((item) => item.fragmentId === fragmentId)
      const localized = fragment ? resolveLocalizedFragment(fragment, locale) : null
      return touchDraft({
        ...current,
        selectedRuleFragmentId: fragmentId,
        ruleSlotText: localized?.content ?? current.ruleSlotText,
      })
    })
  }, [locale, materials.expressionFragments])

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
      setFeedback({
        tone: "success",
        message: {
          key: "builder.preview.hints.inspirationImported",
          values: { title: resolveLocalizedFragment(inspiration, locale).title },
        },
      })
    },
    [locale, materials]
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
      setFeedback({
        tone: "error",
        message: previewHint ?? { key: "builder.preview.hints.copyIncompleteFallback" },
      })
      return
    }

    await copyText(currentDraft.previewText)
    setFeedback({ tone: "success", message: { key: "builder.preview.hints.copySuccess" } })
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
    resolvedFragments: localizedResolvedFragments,
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
