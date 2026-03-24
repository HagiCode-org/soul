import { Link2, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { BuilderMaterials } from "@/lib/builder/types"
import { cn } from "@/lib/utils"

type SourceFootnoteProps = {
  sourceNotes: BuilderMaterials["sourceNotes"]
  generatedAtUtc: string
  layout?: "default" | "drawer"
}

export function SourceFootnote({ sourceNotes, generatedAtUtc, layout = "default" }: SourceFootnoteProps) {
  const compact = layout === "drawer"

  return (
    <Card id="sources" className={cn(compact && "rounded-[30px] border-primary/15 bg-card/76 p-0")}>
      <CardHeader className={cn("gap-3 border-b border-border/60 pb-5", compact && "px-5 pt-5")}> 
        <Badge variant="secondary">来源说明</Badge>
        <CardTitle className={cn("font-display tracking-[-0.04em]", compact ? "text-[2rem]" : "text-3xl")}>
          输入边界。副作用来源。都写清。
        </CardTitle>
      </CardHeader>
      <CardContent className={cn(compact ? "grid gap-3 px-5 py-5" : "grid gap-4 py-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]")}>
        <div className="grid gap-3">
          {sourceNotes.map((note) => (
            <article key={note.id} className="rounded-[28px] border border-border/70 bg-background/75 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold">{note.title}</h3>
                <Badge variant={note.state === "ready" ? "default" : note.state === "error" ? "outline" : "secondary"}>
                  {note.state}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-3 text-sm leading-6">{note.detail}</p>
            </article>
          ))}
        </div>
        <div className="grid gap-3">
          <article className="rounded-[28px] border border-border/70 bg-background/75 p-4">
            <div className="flex items-center gap-2">
              <Link2 size={16} className="text-primary" />
              <h3 className="text-lg font-semibold">运行假设</h3>
            </div>
            <p className="text-muted-foreground mt-3 text-sm leading-6">
              Builder 默认依赖本地快照启动。远端官方灵感卡仅做增强。保存使用浏览器本地存储。导出写稳定 JSON，并允许复制预览文案。
            </p>
          </article>
          <article className="rounded-[28px] border border-border/70 bg-background/75 p-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-primary" />
              <h3 className="text-lg font-semibold">快照时间</h3>
            </div>
            <p className="text-muted-foreground mt-3 text-sm leading-6">本地参考素材生成于 {generatedAtUtc}。</p>
          </article>
        </div>
      </CardContent>
    </Card>
  )
}
