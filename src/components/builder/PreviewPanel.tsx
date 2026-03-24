import { Copy, FileWarning, ShieldCheck } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { translateMessage } from "@/i18n/message"
import type { MessageDescriptor, PreviewCompilation, SoulBuilderDraft } from "@/lib/builder/types"
import { cn } from "@/lib/utils"

type PreviewPanelProps = {
  draft: SoulBuilderDraft
  preview: PreviewCompilation
  previewHint: MessageDescriptor | null
  canCompose: boolean
  feedbackMessage: MessageDescriptor | null
  feedbackTone: "info" | "success" | "error" | null
  onMainSlotTextChange: (value: string) => void
  onRuleSlotTextChange: (value: string) => void
  onCustomPromptChange: (value: string) => void
  onCopy: () => void
  layout?: "default" | "workbench"
}

function toneClass(tone: PreviewPanelProps["feedbackTone"]) {
  if (tone === "success") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200"
  }

  if (tone === "error") {
    return "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-200"
  }

  return "border-border/70 bg-background/75 text-muted-foreground"
}

function summarizeSlotText(value: string, emptyLabel: string) {
  const normalized = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean)

  if (!normalized) {
    return emptyLabel
  }

  return normalized.length > 34 ? `${normalized.slice(0, 34)}...` : normalized
}

export function PreviewPanel({
  draft,
  preview,
  previewHint,
  canCompose,
  feedbackMessage,
  feedbackTone,
  onMainSlotTextChange,
  onRuleSlotTextChange,
  onCustomPromptChange,
  onCopy,
  layout = "default",
}: PreviewPanelProps) {
  const { t } = useTranslation()
  const isWorkbench = layout === "workbench"
  const hasMainSlot = Boolean(draft.mainSlotText.trim())
  const hasRuleSlot = Boolean(draft.ruleSlotText.trim())
  const hasCustomSlot = Boolean(draft.customPrompt.trim())
  const filledSlotCount = [hasMainSlot, hasRuleSlot, hasCustomSlot].filter(Boolean).length
  const translatedPreviewHint = translateMessage(t, previewHint)
  const translatedFeedback = translateMessage(t, feedbackMessage)
  const mainSummary = summarizeSlotText(draft.mainSlotText, t("builder.preview.slots.main.emptySummary"))
  const ruleSummary = summarizeSlotText(draft.ruleSlotText, t("builder.preview.slots.rule.emptySummary"))
  const customSummary = hasCustomSlot
    ? t("builder.preview.slots.custom.filledSummary", { count: draft.customPrompt.trim().length })
    : t("builder.preview.slots.custom.emptySummary")
  const feedbackText =
    translatedFeedback ??
    translatedPreviewHint ??
    t("builder.preview.feedbackSummary", { filled: filledSlotCount })
  const previewFallbackText = hasMainSlot || hasRuleSlot || hasCustomSlot
    ? t("builder.preview.fallbackPartial")
    : t("builder.preview.fallbackInitial")
  const nextActionText = canCompose
    ? t("builder.preview.nextReady")
    : translatedPreviewHint ?? t("builder.preview.nextIncomplete")
  const hasResolvedPreviewTitle = Boolean(preview.title.trim())
  const previewTitle = hasResolvedPreviewTitle
    ? preview.title
    : draft.name === "未命名角色"
      ? t("builder.preview.untitledSoul")
      : draft.name

  return (
    <Card
      className={cn(
        "h-full overflow-hidden",
        isWorkbench &&
          "rounded-[34px] border-primary/15 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--card)_86%,white)_0%,color-mix(in_oklab,var(--background)_94%,black)_100%)] p-0"
      )}
    >
      <CardHeader className={cn("gap-4 border-b border-border/60 pb-5", isWorkbench && "px-6 pt-6 sm:px-7")}>
        <CardTitle className={cn("font-display tracking-[-0.04em]", isWorkbench ? "text-4xl" : "text-3xl")}>{t("builder.preview.panelTitle")}</CardTitle>
      </CardHeader>

      <CardContent className={cn("grid gap-5 py-6", isWorkbench && "px-6 pb-6 sm:px-7")}>
        <div className={cn("rounded-[24px] border px-4 py-3 text-sm", toneClass(feedbackTone))}>
          {feedbackText}
        </div>

        <section className={cn("grid gap-4", isWorkbench ? "xl:grid-cols-3" : "lg:grid-cols-3")}>
          <div className="rounded-[24px] border border-border/70 bg-background/78 p-4">
            <p className="text-muted-foreground text-xs uppercase tracking-[0.28em]">{t("builder.preview.slots.main.eyebrow")}</p>
            <h3 className="mt-2 text-base font-semibold">{t("builder.preview.slots.main.title")}</h3>
            <Textarea
              className="mt-3 min-h-[12rem]"
              value={draft.mainSlotText}
              onChange={(event) => onMainSlotTextChange(event.target.value)}
              placeholder={t("builder.preview.slots.main.placeholder")}
              aria-label={t("builder.preview.slots.main.ariaLabel")}
            />
          </div>

          <div className="rounded-[24px] border border-border/70 bg-background/78 p-4">
            <p className="text-muted-foreground text-xs uppercase tracking-[0.28em]">{t("builder.preview.slots.rule.eyebrow")}</p>
            <h3 className="mt-2 text-base font-semibold">{t("builder.preview.slots.rule.title")}</h3>
            <Textarea
              className="mt-3 min-h-[12rem]"
              value={draft.ruleSlotText}
              onChange={(event) => onRuleSlotTextChange(event.target.value)}
              placeholder={t("builder.preview.slots.rule.placeholder")}
              aria-label={t("builder.preview.slots.rule.ariaLabel")}
            />
          </div>

          <div className="rounded-[24px] border border-border/70 bg-background/78 p-4">
            <p className="text-muted-foreground text-xs uppercase tracking-[0.28em]">{t("builder.preview.slots.custom.eyebrow")}</p>
            <h3 className="mt-2 text-base font-semibold">{t("builder.preview.slots.custom.title")}</h3>
            <Textarea
              className="mt-3 min-h-[12rem]"
              value={draft.customPrompt}
              onChange={(event) => onCustomPromptChange(event.target.value)}
              placeholder={t("builder.preview.slots.custom.placeholder")}
              aria-label={t("builder.preview.slots.custom.ariaLabel")}
            />
          </div>
        </section>

        <section className="rounded-[30px] border border-border/70 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--card)_85%,white)_0%,color-mix(in_oklab,var(--background)_88%,black)_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-[0.28em]">{t("builder.preview.previewEyebrow")}</p>
              <h3 className="mt-2 text-xl font-semibold">{previewTitle || t("builder.preview.defaultTitle")}</h3>
            </div>
            {canCompose ? (
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <ShieldCheck size={16} />
                {t("builder.preview.previewReady")}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-200">
                <FileWarning size={16} />
                {t("builder.preview.previewIncomplete")}
              </div>
            )}
          </div>
          <pre className={cn("mt-5 overflow-auto rounded-[24px] border border-border/70 bg-background/80 p-4 text-sm leading-7 whitespace-pre-wrap", isWorkbench ? "min-h-[22rem]" : "min-h-[16rem]")}>{preview.text || previewFallbackText}</pre>
        </section>

        <div className="grid gap-3">
          <Button type="button" variant="outline" onClick={onCopy} disabled={!canCompose} aria-label={t("builder.preview.copyButton")}>
            <Copy size={16} />
            {t("builder.preview.copyButton")}
          </Button>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(240px,0.72fr)]">
          <div className="rounded-[24px] border border-border/70 bg-background/75 px-4 py-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{t("builder.preview.currentCompositionTitle")}</p>
            <p className="mt-2">{t("builder.preview.currentCompositionMain", { value: mainSummary })}</p>
            <p className="mt-1">{t("builder.preview.currentCompositionRule", { value: ruleSummary })}</p>
            <p className="mt-1">{t("builder.preview.currentCompositionCustom", { value: customSummary })}</p>
          </div>
          <div className="rounded-[24px] border border-border/70 bg-background/75 px-4 py-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{t("builder.preview.nextStepTitle")}</p>
            <p className="mt-2">{nextActionText}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
