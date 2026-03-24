import { Filter, RefreshCw, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { MaterialLoadState, SoulFragment } from "@/lib/builder/types"
import { cn } from "@/lib/utils"

type MaterialLibraryPanelProps = {
  query: string
  onQueryChange: (value: string) => void
  categories: string[]
  selectedCategory: string
  onCategoryChange: (value: string) => void
  mainFragments: SoulFragment[]
  ruleFragments: SoulFragment[]
  inspirationFragments: SoulFragment[]
  selectedMainFragmentId: string | null
  selectedRuleFragmentId: string | null
  selectedInspirationId: string | null
  onSelectMainFragment: (fragmentId: string) => void
  onSelectRuleFragment: (fragmentId: string) => void
  onSelectInspirationFragment: (fragmentId: string) => void
  remoteState: MaterialLoadState
  remoteMessage: string | null
  onReload: () => void
}

function OptionCard({
  fragment,
  selected,
  actionLabel,
  onSelect,
}: {
  fragment: SoulFragment
  selected: boolean
  actionLabel: string
  onSelect: () => void
}) {
  return (
    <article
      className={cn(
        "rounded-[28px] border p-4 transition-all",
        selected
          ? "border-primary/45 bg-primary/8 shadow-[0_24px_50px_-35px_rgba(44,107,109,0.45)]"
          : "border-border/70 bg-background/75 hover:-translate-y-0.5 hover:border-primary/25"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-semibold">{fragment.title}</h4>
            {selected ? <Badge>Selected</Badge> : null}
          </div>
          <p className="text-muted-foreground text-sm leading-6">{fragment.summary}</p>
        </div>
        <Button type="button" variant={selected ? "secondary" : "outline"} size="sm" onClick={onSelect}>
          {selected ? "已选" : actionLabel}
        </Button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {fragment.keywords.slice(0, 4).map((keyword) => (
          <span key={keyword} className="rounded-full border border-border/70 bg-card/75 px-2.5 py-1 text-[11px] text-muted-foreground">
            {keyword}
          </span>
        ))}
      </div>
    </article>
  )
}

function SectionBlock({
  title,
  eyebrow,
  items,
  selectedId,
  actionLabel,
  onSelect,
}: {
  title: string
  eyebrow: string
  items: SoulFragment[]
  selectedId: string | null
  actionLabel: string
  onSelect: (fragmentId: string) => void
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-[0.28em]">{eyebrow}</p>
          <h3 className="mt-2 text-xl font-semibold">{title}</h3>
        </div>
        <Badge variant="outline">{items.length}</Badge>
      </div>
      <div className="grid gap-3">
        {items.length > 0 ? (
          items.map((fragment) => (
            <OptionCard
              key={fragment.fragmentId}
              fragment={fragment}
              selected={selectedId === fragment.fragmentId}
              actionLabel={actionLabel}
              onSelect={() => onSelect(fragment.fragmentId)}
            />
          ))
        ) : (
          <div className="rounded-[24px] border border-dashed border-border/80 bg-background/70 px-4 py-5 text-sm text-muted-foreground">
            当前筛选下暂无素材。
          </div>
        )}
      </div>
    </section>
  )
}

export function MaterialLibraryPanel({
  query,
  onQueryChange,
  categories,
  selectedCategory,
  onCategoryChange,
  mainFragments,
  ruleFragments,
  inspirationFragments,
  selectedMainFragmentId,
  selectedRuleFragmentId,
  selectedInspirationId,
  onSelectMainFragment,
  onSelectRuleFragment,
  onSelectInspirationFragment,
  remoteState,
  remoteMessage,
  onReload,
}: MaterialLibraryPanelProps) {
  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="gap-4 border-b border-border/60 pb-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <Badge variant="secondary">素材库</Badge>
            <CardTitle className="font-display text-3xl tracking-[-0.04em]">先挑可复用碎片。</CardTitle>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={onReload}>
            <RefreshCw size={14} />
            刷新灵感
          </Button>
        </div>
        <div className="grid gap-3">
          <Input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="搜索主素材、规则或灵感卡" aria-label="搜索素材" />
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-xs text-muted-foreground">
              <Filter size={14} />
              主素材分类
            </span>
            {categories.map((category) => (
              <Button
                key={category}
                type="button"
                size="sm"
                variant={selectedCategory === category ? "secondary" : "ghost"}
                onClick={() => onCategoryChange(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-[22px] border border-border/70 bg-background/75 px-4 py-3 text-sm">
          <div>
            <p className="font-medium text-foreground">官方灵感源</p>
            <p className="text-muted-foreground mt-1">{remoteMessage ?? "正在同步官方灵感卡。"}</p>
          </div>
          <Badge variant={remoteState === "ready" ? "default" : remoteState === "error" ? "outline" : "secondary"}>
            {remoteState}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="grid gap-8 py-6">
        <SectionBlock
          title="主 Catalog"
          eyebrow="who"
          items={mainFragments}
          selectedId={selectedMainFragmentId}
          actionLabel="加入"
          onSelect={onSelectMainFragment}
        />
        <SectionBlock
          title="表达规则"
          eyebrow="how"
          items={ruleFragments}
          selectedId={selectedRuleFragmentId}
          actionLabel="加入"
          onSelect={onSelectRuleFragment}
        />
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-[0.28em]">inspiration</p>
              <h3 className="mt-2 text-xl font-semibold">官方灵感卡</h3>
            </div>
            <Badge variant="outline">可导入</Badge>
          </div>
          <div className="grid gap-3">
            {inspirationFragments.length > 0 ? (
              inspirationFragments.map((fragment) => (
                <article
                  key={fragment.fragmentId}
                  className={cn(
                    "rounded-[28px] border p-4 transition-all",
                    selectedInspirationId === fragment.fragmentId
                      ? "border-primary/45 bg-primary/8"
                      : "border-border/70 bg-background/75 hover:border-primary/25"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold">{fragment.title}</h4>
                        <Badge variant="outline">{fragment.meta.styleType ?? "样例"}</Badge>
                        {selectedInspirationId === fragment.fragmentId ? <Badge>Imported</Badge> : null}
                      </div>
                      <p className="text-muted-foreground text-sm leading-6">{fragment.summary}</p>
                    </div>
                    <Button type="button" size="sm" variant={selectedInspirationId === fragment.fragmentId ? "secondary" : "outline"} onClick={() => onSelectInspirationFragment(fragment.fragmentId)}>
                      <Sparkles size={14} />
                      {selectedInspirationId === fragment.fragmentId ? "已导入" : "导入灵感"}
                    </Button>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[24px] border border-dashed border-border/80 bg-background/70 px-4 py-5 text-sm text-muted-foreground">
                官方灵感卡暂不可用。可继续使用本地主素材与规则完成组合。
              </div>
            )}
          </div>
        </section>
      </CardContent>
    </Card>
  )
}
