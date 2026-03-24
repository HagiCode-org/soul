import { Copy, Download, FileWarning, ShieldCheck } from "lucide-react"

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
  onExport: () => void
  onCopy: () => void
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
  onExport,
  onCopy,
}: PreviewPanelProps) {
  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="gap-4 border-b border-border/60 pb-5">
        <div className="space-y-2">
          <Badge variant="secondary">预览 / 导出</Badge>
          <CardTitle className="font-display text-3xl tracking-[-0.04em]">实时编译。稳定导出。</CardTitle>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={preview.isComplete ? "default" : "outline"}>{preview.isComplete ? "ready" : "drafting"}</Badge>
          {mainFragment ? <Badge variant="outline">{mainFragment.title}</Badge> : null}
          {ruleFragment ? <Badge variant="outline">{ruleFragment.title}</Badge> : null}
        </div>
      </CardHeader>

      <CardContent className="grid gap-5 py-6">
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
          <pre className="mt-5 overflow-auto rounded-[24px] border border-border/70 bg-background/80 p-4 text-sm leading-7 whitespace-pre-wrap">{preview.text || "先完成主 Catalog 与表达规则选择，预览才会稳定成形。"}</pre>
          {inspirationFragment ? (
            <p className="text-muted-foreground mt-4 text-sm leading-6">灵感来源：{inspirationFragment.title} · {inspirationFragment.meta.provenance ?? "官方灵感卡"}</p>
          ) : null}
        </section>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button type="button" onClick={onExport} disabled={!canExport} aria-label="导出 JSON">
            <Download size={16} />
            导出 JSON
          </Button>
          <Button type="button" variant="outline" onClick={onCopy} disabled={!canExport} aria-label="复制文案">
            <Copy size={16} />
            复制文案
          </Button>
        </div>

        <div className="rounded-[24px] border border-border/70 bg-background/75 px-4 py-4 text-sm text-muted-foreground">
          <p>导出条件：必须同时选中主 Catalog 与表达规则。</p>
          <p className="mt-2">当前状态：{previewHint ?? "核心组合完整，可执行导出。"}</p>
        </div>
      </CardContent>
    </Card>
  )
}
