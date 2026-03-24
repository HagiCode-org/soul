import { Copy, Download, FileWarning, Save, ShieldCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PreviewCompilation, SoulBuilderDraft, SoulFragment } from "@/lib/builder/types"
import { cn } from "@/lib/utils"

type PreviewPanelProps = {
  draft: SoulBuilderDraft
  preview: PreviewCompilation
  previewHint: string | null
  canExport: boolean
  mainFragment: SoulFragment | null
  ruleFragment: SoulFragment | null
  inspirationFragment: SoulFragment | null
  feedbackMessage: string | null
  feedbackTone: "info" | "success" | "error" | null
  onSave: () => void
  onExport: () => void
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

function formatTime(value: string) {
  try {
    return new Intl.DateTimeFormat("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value))
  } catch {
    return value
  }
}

export function PreviewPanel({
  draft,
  preview,
  previewHint,
  canExport,
  mainFragment,
  ruleFragment,
  inspirationFragment,
  feedbackMessage,
  feedbackTone,
  onSave,
  onExport,
  onCopy,
  layout = "default",
}: PreviewPanelProps) {
  const isWorkbench = layout === "workbench"

  return (
    <Card
      className={cn(
        "h-full overflow-hidden",
        isWorkbench &&
          "rounded-[34px] border-primary/15 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--card)_86%,white)_0%,color-mix(in_oklab,var(--background)_94%,black)_100%)] p-0"
      )}
    >
      <CardHeader className={cn("gap-4 border-b border-border/60 pb-5", isWorkbench && "px-6 pt-6 sm:px-7")}> 
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <Badge variant="secondary">中央工作区</Badge>
            <CardTitle className={cn("font-display tracking-[-0.04em]", isWorkbench ? "text-4xl" : "text-3xl")}>实时编译。稳定导出。</CardTitle>
            <p className="text-sm leading-6 text-muted-foreground">预览常驻。保存、复制、导出都留在主表面，不跟着抽屉移动。</p>
          </div>
          <div className="rounded-[22px] border border-border/70 bg-background/70 px-4 py-3 text-right text-sm text-muted-foreground">
            <p className="text-xs uppercase tracking-[0.28em]">draft</p>
            <p className="mt-2 font-semibold text-foreground">{draft.name}</p>
            <p className="mt-1">更新于 {formatTime(draft.updatedAt)}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={preview.isComplete ? "default" : "outline"}>{preview.isComplete ? "ready" : "drafting"}</Badge>
          {mainFragment ? <Badge variant="outline">{mainFragment.title}</Badge> : null}
          {ruleFragment ? <Badge variant="outline">{ruleFragment.title}</Badge> : null}
          {inspirationFragment ? <Badge variant="outline">{inspirationFragment.title}</Badge> : null}
        </div>
      </CardHeader>

      <CardContent className={cn("grid gap-5 py-6", isWorkbench && "px-6 pb-6 sm:px-7")}> 
        <div className={cn("rounded-[24px] border px-4 py-3 text-sm", toneClass(feedbackTone))}>
          {feedbackMessage ?? previewHint ?? "选择完成后即可导出 JSON，并复制 SOUL 文本文案。"}
        </div>

        <section className="rounded-[30px] border border-border/70 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--card)_85%,white)_0%,color-mix(in_oklab,var(--background)_88%,black)_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-[0.28em]">preview</p>
              <h3 className="mt-2 text-xl font-semibold">{draft.name}</h3>
            </div>
            {preview.isComplete ? (
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-200">
                <ShieldCheck size={16} />
                可导出
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-200">
                <FileWarning size={16} />
                需补全
              </div>
            )}
          </div>
          <pre className={cn("mt-5 overflow-auto rounded-[24px] border border-border/70 bg-background/80 p-4 text-sm leading-7 whitespace-pre-wrap", isWorkbench ? "min-h-[22rem]" : "min-h-[16rem]")}>{preview.text || "先完成主 Catalog 与表达规则选择，预览才会稳定成形。"}</pre>
          {inspirationFragment ? (
            <p className="text-muted-foreground mt-4 text-sm leading-6">灵感来源：{inspirationFragment.title} · {inspirationFragment.meta.provenance ?? "官方灵感卡"}</p>
          ) : null}
        </section>

        <div className={cn("grid gap-3", isWorkbench ? "md:grid-cols-3" : "sm:grid-cols-3")}>
          <Button type="button" variant="secondary" onClick={onSave} aria-label="保存草稿">
            <Save size={16} />
            保存草稿
          </Button>
          <Button type="button" onClick={onExport} disabled={!canExport} aria-label="导出 JSON">
            <Download size={16} />
            导出 JSON
          </Button>
          <Button type="button" variant="outline" onClick={onCopy} disabled={!canExport} aria-label="复制文案">
            <Copy size={16} />
            复制文案
          </Button>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(240px,0.72fr)]">
          <div className="rounded-[24px] border border-border/70 bg-background/75 px-4 py-4 text-sm text-muted-foreground">
            <p>导出条件：必须同时选中主 Catalog 与表达规则。</p>
            <p className="mt-2">当前状态：{previewHint ?? "核心组合完整，可执行导出。"}</p>
          </div>
          <div className="rounded-[24px] border border-border/70 bg-background/75 px-4 py-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">工作区不变量</p>
            <p className="mt-2">抽屉只承载上下文输入。关闭抽屉本身不会改写当前草稿。</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
