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
    return "border-white/12 bg-white/88 text-[#18191a] shadow-[0_0_0_1px_rgba(255,255,255,0.12)_inset]"
  }

  if (tone === "error") {
    return "border-[color:var(--accent-red)] border-dashed bg-[color:var(--hero-red-soft)] text-foreground"
  }

  return "border-border bg-[color:var(--surface-void)] text-muted-foreground shadow-[var(--ring-shadow)]"
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
  const feedbackText = translatedFeedback ?? translatedPreviewHint ?? t("builder.preview.feedbackSummary", { filled: filledSlotCount })
  const previewFallbackText = hasMainSlot || hasRuleSlot || hasCustomSlot
    ? t("builder.preview.fallbackPartial")
    : t("builder.preview.fallbackInitial")
  const nextActionText = canCompose ? t("builder.preview.nextReady") : translatedPreviewHint ?? t("builder.preview.nextIncomplete")
  const hasResolvedPreviewTitle = Boolean(preview.title.trim())
  const previewTitle = hasResolvedPreviewTitle
    ? preview.title
    : draft.name === "未命名角色"
      ? t("builder.preview.untitledSoul")
      : draft.name

  return (
    <Card className={cn("h-full overflow-hidden rounded-[28px] p-0", isWorkbench && "shadow-[var(--floating-shadow)]")}>
      <CardHeader className="gap-5 border-b px-5 pb-5 pt-5 sm:px-7 sm:pt-6" style={{ borderColor: "var(--line-soft)" }}>
        <div className="site-window-dots" aria-hidden="true">
          <span className="site-window-dot" data-tone="red" />
          <span className="site-window-dot" data-tone="yellow" />
          <span className="site-window-dot" data-tone="green" />
        </div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="site-section-kicker">{t("builder.preview.previewEyebrow")}</p>
            <CardTitle
              className={cn("font-display tracking-[-0.01em]", isWorkbench ? "text-[2.35rem] sm:text-[3.2rem]" : "text-4xl")}
              style={{ fontVariationSettings: '"wght" 500' }}
            >
              {t("builder.preview.panelTitle")}
            </CardTitle>
          </div>
          <div
            className={cn(
              "site-status-pill",
              canCompose ? "border-white/12 bg-white/88 text-[#18191a]" : "border-border bg-[color:var(--surface-void)] text-muted-foreground"
            )}
          >
            {canCompose ? <ShieldCheck size={16} /> : <FileWarning size={16} />}
            {canCompose ? t("builder.preview.previewReady") : t("builder.preview.previewIncomplete")}
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid gap-5 px-5 py-5 sm:px-7 sm:py-6">
        <div className={cn("rounded-[18px] border px-4 py-4 text-sm leading-6", toneClass(feedbackTone))}>{feedbackText}</div>

        <section className={cn("grid gap-4", isWorkbench ? "xl:grid-cols-3" : "lg:grid-cols-3")}>
          <div className="rounded-[20px] border border-border bg-[color:var(--surface-inset)] p-4 shadow-[var(--ring-shadow)]">
            <p className="site-section-kicker">{t("builder.preview.slots.main.eyebrow")}</p>
            <h3 className="mt-3 text-base tracking-[0.01em]" style={{ fontVariationSettings: '"wght" 540' }}>
              {t("builder.preview.slots.main.title")}
            </h3>
            <Textarea
              className="mt-3 min-h-[12rem]"
              value={draft.mainSlotText}
              onChange={(event) => onMainSlotTextChange(event.target.value)}
              placeholder={t("builder.preview.slots.main.placeholder")}
              aria-label={t("builder.preview.slots.main.ariaLabel")}
            />
          </div>

          <div className="rounded-[20px] border border-border bg-[color:var(--surface-inset)] p-4 shadow-[var(--ring-shadow)]">
            <p className="site-section-kicker">{t("builder.preview.slots.rule.eyebrow")}</p>
            <h3 className="mt-3 text-base tracking-[0.01em]" style={{ fontVariationSettings: '"wght" 540' }}>
              {t("builder.preview.slots.rule.title")}
            </h3>
            <Textarea
              className="mt-3 min-h-[12rem]"
              value={draft.ruleSlotText}
              onChange={(event) => onRuleSlotTextChange(event.target.value)}
              placeholder={t("builder.preview.slots.rule.placeholder")}
              aria-label={t("builder.preview.slots.rule.ariaLabel")}
            />
          </div>

          <div className="rounded-[20px] border border-border bg-[color:var(--surface-inset)] p-4 shadow-[var(--ring-shadow)]">
            <p className="site-section-kicker">{t("builder.preview.slots.custom.eyebrow")}</p>
            <h3 className="mt-3 text-base tracking-[0.01em]" style={{ fontVariationSettings: '"wght" 540' }}>
              {t("builder.preview.slots.custom.title")}
            </h3>
            <Textarea
              className="mt-3 min-h-[12rem]"
              value={draft.customPrompt}
              onChange={(event) => onCustomPromptChange(event.target.value)}
              placeholder={t("builder.preview.slots.custom.placeholder")}
              aria-label={t("builder.preview.slots.custom.ariaLabel")}
            />
          </div>
        </section>

        <section
          className="rounded-[24px] border p-5"
          style={{
            background: "var(--preview-shell-bg)",
            borderColor: "var(--preview-shell-border)",
            boxShadow: "var(--panel-shadow)",
            color: "var(--preview-shell-text)",
          }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono-ui text-[11px] uppercase tracking-[0.2em]" style={{ color: "var(--preview-shell-muted)" }}>
                {t("builder.preview.previewEyebrow")}
              </p>
              <h3 className="mt-3 text-[1.55rem] leading-tight tracking-[0.01em]" style={{ fontVariationSettings: '"wght" 540' }}>
                {previewTitle || t("builder.preview.defaultTitle")}
              </h3>
            </div>
            <Button type="button" onClick={onCopy} disabled={!canCompose}>
              <Copy size={16} />
              {t("builder.preview.copyButton")}
            </Button>
          </div>
          <pre
            className={cn(
              "mt-5 overflow-auto rounded-[18px] border p-4 font-mono-ui text-[13px] leading-7 whitespace-pre-wrap shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]",
              isWorkbench ? "min-h-[22rem]" : "min-h-[16rem]"
            )}
            style={{
              background: "var(--preview-code-bg)",
              borderColor: "var(--preview-code-border)",
              color: "var(--preview-code-text)",
            }}
          >
            {preview.text || previewFallbackText}
          </pre>
        </section>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.8fr)]">
          <div className="rounded-[20px] border border-border bg-[color:var(--surface-inset)] px-4 py-4 text-sm text-muted-foreground shadow-[var(--ring-shadow)]">
            <p className="site-section-kicker">{t("builder.preview.currentCompositionTitle")}</p>
            <p className="mt-3 text-foreground" style={{ fontVariationSettings: '"wght" 480' }}>{t("builder.preview.currentCompositionMain", { value: mainSummary })}</p>
            <p className="mt-2">{t("builder.preview.currentCompositionRule", { value: ruleSummary })}</p>
            <p className="mt-2">{t("builder.preview.currentCompositionCustom", { value: customSummary })}</p>
          </div>
          <div className="rounded-[20px] border border-border bg-[color:var(--surface-inset)] px-4 py-4 text-sm text-muted-foreground shadow-[var(--ring-shadow)]">
            <p className="site-section-kicker">{t("builder.preview.nextStepTitle")}</p>
            <p className="mt-3 leading-6 text-foreground">{nextActionText}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
