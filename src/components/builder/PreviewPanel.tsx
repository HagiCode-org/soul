import { Copy, FileWarning, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import type { PreviewCompilation, SoulBuilderDraft } from "@/lib/builder/types"
import { cn } from "@/lib/utils"

type PreviewPanelProps = {
  draft: SoulBuilderDraft
  preview: PreviewCompilation
  previewHint: string | null
  canCompose: boolean
  feedbackMessage: string | null
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
  const isWorkbench = layout === "workbench"
  const hasMainSlot = Boolean(draft.mainSlotText.trim())
  const hasRuleSlot = Boolean(draft.ruleSlotText.trim())
  const hasCustomSlot = Boolean(draft.customPrompt.trim())
  const filledSlotCount = [hasMainSlot, hasRuleSlot, hasCustomSlot].filter(Boolean).length
  const mainSummary = summarizeSlotText(draft.mainSlotText, "基础角色未填写")
  const ruleSummary = summarizeSlotText(draft.ruleSlotText, "表达方式未填写")
  const customSummary = hasCustomSlot ? `已补充 ${draft.customPrompt.trim().length} 个字` : "未补充额外要求"
  const feedbackText = feedbackMessage ?? previewHint ?? `当前 3 个插槽已填写 ${filledSlotCount} 个，预览内容会按顺序实时重算。`
  const previewFallbackText = hasMainSlot || hasRuleSlot || hasCustomSlot ? "继续补全剩余插槽后，这里会自动刷新完整预览。" : "先填写基础角色和表达方式插槽，预览区才会形成完整内容。"
  const nextActionText = canCompose
    ? "三个插槽内容已经合并完成。现在可以继续微调文本，或直接复制当前预览。"
    : previewHint ?? "还需要补全缺失插槽，预览内容才会稳定。"
  const previewTitle = preview.title !== "Soul Builder 预览" ? preview.title : draft.name

  return (
    <Card
      className={cn(
        "h-full overflow-hidden",
        isWorkbench &&
          "rounded-[34px] border-primary/15 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--card)_86%,white)_0%,color-mix(in_oklab,var(--background)_94%,black)_100%)] p-0"
      )}
    >
      <CardHeader className={cn("gap-4 border-b border-border/60 pb-5", isWorkbench && "px-6 pt-6 sm:px-7")}> 
        <CardTitle className={cn("font-display tracking-[-0.04em]", isWorkbench ? "text-4xl" : "text-3xl")}>Agent Soul 编辑器</CardTitle>
      </CardHeader>

      <CardContent className={cn("grid gap-5 py-6", isWorkbench && "px-6 pb-6 sm:px-7")}> 
        <div className={cn("rounded-[24px] border px-4 py-3 text-sm", toneClass(feedbackTone))}>
          {feedbackText}
        </div>

        <section className={cn("grid gap-4", isWorkbench ? "xl:grid-cols-3" : "lg:grid-cols-3")}>
          <div className="rounded-[24px] border border-border/70 bg-background/78 p-4">
            <p className="text-muted-foreground text-xs uppercase tracking-[0.28em]">slot 01 · base role</p>
            <h3 className="mt-2 text-base font-semibold">基础角色插槽</h3>
            <Textarea
              className="mt-3 min-h-[12rem]"
              value={draft.mainSlotText}
              onChange={(event) => onMainSlotTextChange(event.target.value)}
              placeholder="先从左侧选择基础角色卡片，然后按需继续编辑。"
              aria-label="基础角色插槽"
            />
          </div>

          <div className="rounded-[24px] border border-border/70 bg-background/78 p-4">
            <p className="text-muted-foreground text-xs uppercase tracking-[0.28em]">slot 02 · expression</p>
            <h3 className="mt-2 text-base font-semibold">表达方式插槽</h3>
            <Textarea
              className="mt-3 min-h-[12rem]"
              value={draft.ruleSlotText}
              onChange={(event) => onRuleSlotTextChange(event.target.value)}
              placeholder="先从左侧选择表达方式卡片，然后按需继续编辑。"
              aria-label="表达方式插槽"
            />
          </div>

          <div className="rounded-[24px] border border-border/70 bg-background/78 p-4">
            <p className="text-muted-foreground text-xs uppercase tracking-[0.28em]">slot 03 · custom</p>
            <h3 className="mt-2 text-base font-semibold">自定义文本插槽</h3>
            <Textarea
              className="mt-3 min-h-[12rem]"
              value={draft.customPrompt}
              onChange={(event) => onCustomPromptChange(event.target.value)}
              placeholder="补充你自己的限制、偏好、口癖或额外要求。"
              aria-label="自定义文本插槽"
            />
          </div>
        </section>

        <section className="rounded-[30px] border border-border/70 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--card)_85%,white)_0%,color-mix(in_oklab,var(--background)_88%,black)_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-[0.28em]">preview</p>
              <h3 className="mt-2 text-xl font-semibold">{previewTitle}</h3>
            </div>
            {canCompose ? (
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <ShieldCheck size={16} />
                内容已合并，可直接复制
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-200">
                <FileWarning size={16} />
                缺少必要插槽
              </div>
            )}
          </div>
          <pre className={cn("mt-5 overflow-auto rounded-[24px] border border-border/70 bg-background/80 p-4 text-sm leading-7 whitespace-pre-wrap", isWorkbench ? "min-h-[22rem]" : "min-h-[16rem]")}>{preview.text || previewFallbackText}</pre>
        </section>

        <div className="grid gap-3">
          <Button type="button" variant="outline" onClick={onCopy} disabled={!canCompose} aria-label="复制文案">
            <Copy size={16} />
            复制文案
          </Button>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(240px,0.72fr)]">
          <div className="rounded-[24px] border border-border/70 bg-background/75 px-4 py-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">当前组合</p>
            <p className="mt-2">基础角色：{mainSummary}</p>
            <p className="mt-1">表达方式：{ruleSummary}</p>
            <p className="mt-1">自定义文本：{customSummary}</p>
          </div>
          <div className="rounded-[24px] border border-border/70 bg-background/75 px-4 py-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">下一步建议</p>
            <p className="mt-2">{nextActionText}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
