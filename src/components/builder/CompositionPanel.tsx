import { Eraser, Save, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import type { SoulFragment } from "@/lib/builder/types"
import { cn } from "@/lib/utils"

type CompositionPanelProps = {
  mainFragment: SoulFragment | null
  ruleFragment: SoulFragment | null
  inspirationFragment: SoulFragment | null
  customPrompt: string
  onCustomPromptChange: (value: string) => void
  onClearMainFragment: () => void
  onClearRuleFragment: () => void
  onClearInspiration: () => void
  onSaveDraft: () => void
  layout?: "default" | "drawer"
}

function SelectedCard({
  label,
  fragment,
  onClear,
  compact,
}: {
  label: string
  fragment: SoulFragment | null
  onClear: () => void
  compact: boolean
}) {
  return (
    <div className={cn("rounded-[28px] border border-border/70 bg-background/75", compact ? "p-3.5" : "p-4")}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="text-muted-foreground text-xs uppercase tracking-[0.28em]">{label}</p>
          {fragment ? (
            <>
              <h3 className={cn("font-semibold", compact ? "text-base" : "text-lg")}>{fragment.title}</h3>
              <p className="text-muted-foreground text-sm leading-6">{fragment.summary}</p>
            </>
          ) : (
            <>
              <h3 className={cn("font-semibold", compact ? "text-base" : "text-lg")}>尚未选择</h3>
              <p className="text-muted-foreground text-sm leading-6">先去左侧素材库挑选一个片段。</p>
            </>
          )}
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={onClear} disabled={!fragment}>
          <Eraser size={14} />
          清空
        </Button>
      </div>
    </div>
  )
}

export function CompositionPanel({
  mainFragment,
  ruleFragment,
  inspirationFragment,
  customPrompt,
  onCustomPromptChange,
  onClearMainFragment,
  onClearRuleFragment,
  onClearInspiration,
  onSaveDraft,
  layout = "default",
}: CompositionPanelProps) {
  const compact = layout === "drawer"

  return (
    <Card className={cn("h-full min-h-0 overflow-hidden", compact && "rounded-[30px] border-primary/15 bg-card/76 p-0")}>
      <CardHeader className={cn("gap-4 border-b border-border/60 pb-5", compact && "px-5 pt-5")}> 
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <Badge variant="secondary">拼装区</Badge>
            <CardTitle className={cn("font-display tracking-[-0.04em]", compact ? "text-[2rem]" : "text-3xl")}>
              聚合草稿。保持边界。
            </CardTitle>
          </div>
          <Button type="button" onClick={onSaveDraft}>
            <Save size={16} />
            保存草稿
          </Button>
        </div>
        <p className="text-muted-foreground text-sm leading-6">
          草稿是当前聚合根。官方素材只读。自定义补充只落在本地快照和导出结果里。
        </p>
      </CardHeader>

      <CardContent className={cn("min-h-0 flex-1 overflow-y-auto py-6", compact ? "grid gap-4 px-5 pb-5" : "grid gap-5")}> 
        <SelectedCard label="Step 1 · 主 Catalog" fragment={mainFragment} onClear={onClearMainFragment} compact={compact} />
        <SelectedCard label="Step 2 · 表达规则" fragment={ruleFragment} onClear={onClearRuleFragment} compact={compact} />

        <div className={cn("rounded-[28px] border border-border/70 bg-background/75", compact ? "p-3.5" : "p-4")}>
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs uppercase tracking-[0.28em]">Step 3 · 官方灵感</p>
              <h3 className={cn("font-semibold", compact ? "text-base" : "text-lg")}>{inspirationFragment?.title ?? "暂未导入灵感卡"}</h3>
              <p className="text-muted-foreground text-sm leading-6">
                {inspirationFragment?.summary ?? "可选。导入后会尝试同步主 Catalog 与表达规则。"}
              </p>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={onClearInspiration} disabled={!inspirationFragment}>
              <Sparkles size={14} />
              清空灵感
            </Button>
          </div>
        </div>

        <div className={cn("rounded-[28px] border border-border/70 bg-background/75", compact ? "p-3.5" : "p-4")}>
          <div className="space-y-2">
            <p className="text-muted-foreground text-xs uppercase tracking-[0.28em]">Step 4 · 自定义补充</p>
            <h3 className={cn("font-semibold", compact ? "text-base" : "text-lg")}>补充细节。不要污染源素材。</h3>
          </div>
          <Textarea
            className="mt-4"
            placeholder="例如：优先使用简体中文。遇到需求时先澄清输入输出、状态流转与异常路径。"
            value={customPrompt}
            onChange={(event) => onCustomPromptChange(event.target.value)}
            aria-label="自定义补充"
          />
        </div>
      </CardContent>
    </Card>
  )
}
