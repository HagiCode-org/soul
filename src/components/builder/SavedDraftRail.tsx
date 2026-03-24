import { Clock3, RotateCcw } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SoulBuilderSnapshot } from "@/lib/builder/types"
import { cn } from "@/lib/utils"

type SavedDraftRailProps = {
  snapshots: SoulBuilderSnapshot[]
  onRestore: (snapshot: SoulBuilderSnapshot) => void
  layout?: "default" | "drawer"
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

export function SavedDraftRail({ snapshots, onRestore, layout = "default" }: SavedDraftRailProps) {
  const compact = layout === "drawer"

  return (
    <Card id="saved-drafts" className={cn(compact && "rounded-[30px] border-primary/15 bg-card/76 p-0")}>
      <CardHeader className={cn("gap-3 border-b border-border/60 pb-5", compact && "px-5 pt-5")}> 
        <Badge variant="secondary">已保存草稿</Badge>
        <CardTitle className={cn("font-display tracking-[-0.04em]", compact ? "text-[2rem]" : "text-3xl")}>
          最近保存。就地恢复。
        </CardTitle>
      </CardHeader>
      <CardContent className={cn(compact ? "grid gap-3 px-5 py-5" : "grid gap-3 py-6 md:grid-cols-2 xl:grid-cols-3")}>
        {snapshots.length > 0 ? (
          snapshots.map((snapshot) => (
            <article key={snapshot.savedAt} className="rounded-[28px] border border-border/70 bg-background/75 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{snapshot.draft.name}</h3>
                  <p className="text-muted-foreground text-sm leading-6">主素材：{snapshot.draft.selectedMainFragmentId ?? "未选"}</p>
                  <p className="text-muted-foreground text-sm leading-6">表达规则：{snapshot.draft.selectedRuleFragmentId ?? "未选"}</p>
                </div>
                <Badge variant="outline">v{snapshot.version}</Badge>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <Clock3 size={14} />
                  {formatTime(snapshot.savedAt)}
                </span>
                <Button type="button" variant="outline" size="sm" onClick={() => onRestore(snapshot)}>
                  <RotateCcw size={14} />
                  恢复
                </Button>
              </div>
            </article>
          ))
        ) : (
          <div className={cn("rounded-[28px] border border-dashed border-border/80 bg-background/70 px-4 py-6 text-sm text-muted-foreground", compact ? "" : "md:col-span-2 xl:col-span-3")}>
            还没有本地草稿。完成一次保存后，这里会保留最近快照。
          </div>
        )}
      </CardContent>
    </Card>
  )
}
