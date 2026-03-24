import { BookOpenText, FlaskConical, WandSparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

type BuilderHeroIntroProps = {
  remoteMessage: string | null
}

const steps = [
  {
    title: "挑核心",
    copy: "先锁定主 Catalog，确定角色边界与不变量。",
    icon: BookOpenText,
  },
  {
    title: "定语气",
    copy: "再补表达规则，把输出节奏、句式与约束钉死。",
    icon: FlaskConical,
  },
  {
    title: "看预览",
    copy: "实时编译预览。满意就保存。本地即可导出。",
    icon: WandSparkles,
  },
] as const

export function BuilderHeroIntro({ remoteMessage }: BuilderHeroIntroProps) {
  return (
    <section id="builder-intro" className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
      <div className="rounded-[34px] border border-border/70 bg-[linear-gradient(135deg,color-mix(in_oklab,var(--card)_86%,white)_0%,color-mix(in_oklab,var(--accent)_42%,transparent)_100%)] p-7 shadow-[0_30px_80px_-50px_rgba(28,35,45,0.45)] sm:p-8">
        <div className="space-y-5">
          <Badge>Builder-first</Badge>
          <div className="space-y-4">
            <p className="text-muted-foreground text-xs uppercase tracking-[0.34em]">soul builder atelier</p>
            <h1 className="font-display text-5xl leading-[0.9] tracking-[-0.05em] text-balance sm:text-6xl">
              先建人格骨架。再定表达脉搏。
            </h1>
            <p className="text-muted-foreground max-w-2xl text-base leading-7 sm:text-lg">
              首页不再是占位壳。现在直接进入拼装台。主素材、表达规则、官方灵感卡与本地草稿，都在同一条状态流里闭环。
            </p>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden border-primary/15 bg-card/90">
        <CardContent className="grid gap-4 p-0">
          {steps.map(({ title, copy, icon: Icon }, index) => (
            <div
              key={title}
              className="grid gap-3 border-b border-border/60 px-5 py-5 last:border-b-0 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start"
            >
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <Icon size={20} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs uppercase tracking-[0.28em]">0{index + 1}</span>
                  <h2 className="text-lg font-semibold">{title}</h2>
                </div>
                <p className="text-muted-foreground text-sm leading-6">{copy}</p>
              </div>
            </div>
          ))}
          <div className="bg-background/75 px-5 py-4 text-sm text-muted-foreground">
            远端状态：<span className="font-medium text-foreground">{remoteMessage ?? "本地快照可用"}</span>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
