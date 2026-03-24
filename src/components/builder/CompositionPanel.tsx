import { Eraser, Save, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import type { SoulFragment } from "@/lib/builder/types"

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
}

function SelectedCard({
  label,
  fragment,
  onClear,
}: {
  label: string
  fragment: SoulFragment | null
  onClear: () => void
}) {
  return (
    <div className="rounded-[28px] border border-border/70 bg-background/75 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="text-muted-foreground text-xs uppercase tracking-[0.28em]">{label}</p>
          {fragment ? (
            <>
              <h3 className="text-lg font-semibold">{fragment.title}</h3>
              <p className="text-muted-foreground text-sm leading-6">{fragment.summary}</p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold">尚未选择</h3>
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
}: CompositionPanelProps) {
  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="gap-4 border-b border-border/60 pb-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <Badge variant="secondary">拼装区</Badge>
            <CardTitle className="font-display text-3xl tracking-[-0.04em]">聚合草稿。保持边界。</CardTitle>
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

      <CardContent className="grid gap-5 py-6">
        <SelectedCard label="Step 1 · 主 Catalog" fragment={mainFragment} onClear={onClearMainFragment} />
        <SelectedCard label="Step 2 · 表达规则" fragment={ruleFragment} onClear={onClearRuleFragment} />

        <div className="rounded-[28px] border border-border/70 bg-background/75 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs uppercase tracking-[0.28em]">Step 3 · 官方灵感</p>
              <h3 className="text-lg font-semibold">{inspirationFragment?.title ?? "暂未导入灵感卡"}</h3>
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

        <div className="rounded-[28px] border border-border/70 bg-background/75 p-4">
          <div className="space-y-2">
            <p className="text-muted-foreground text-xs uppercase tracking-[0.28em]">Step 4 · 自定义补充</p>
            <h3 className="text-lg font-semibold">补充细节。不要污染源素材。</h3>
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
