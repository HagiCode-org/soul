import { Filter, RefreshCw, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { MaterialLoadState, SoulFragment } from "@/lib/builder/types"
import { cn } from "@/lib/utils"

export type MaterialLibrarySection = "main" | "rules" | "inspiration"

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
  layout?: "default" | "drawer"
  visibleSections?: MaterialLibrarySection[]
}

function OptionCard({
  fragment,
  selected,
  onSelect,
  compact,
}: {
  fragment: SoulFragment
  selected: boolean
  onSelect: () => void
  compact: boolean
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "w-full rounded-[28px] border text-left transition-all focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60",
        compact ? "p-3.5" : "p-4",
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
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {fragment.keywords.slice(0, compact ? 3 : 4).map((keyword) => (
          <span key={keyword} className="rounded-full border border-border/70 bg-card/75 px-2.5 py-1 text-[11px] text-muted-foreground">
            {keyword}
          </span>
        ))}
      </div>
    </button>
  )
}

function SectionBlock({
  title,
  eyebrow,
  items,
  selectedId,
  onSelect,
  compact,
}: {
  title: string
  eyebrow: string
  items: SoulFragment[]
  selectedId: string | null
  onSelect: (fragmentId: string) => void
  compact: boolean
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-[0.28em]">{eyebrow}</p>
          <h3 className={cn("mt-2 font-semibold", compact ? "text-lg" : "text-xl")}>{title}</h3>
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
              onSelect={() => onSelect(fragment.fragmentId)}
              compact={compact}
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
  layout = "default",
  visibleSections = ["main", "rules", "inspiration"],
}: MaterialLibraryPanelProps) {
  const compact = layout === "drawer"
  const showMain = visibleSections.includes("main")
  const showRules = visibleSections.includes("rules")
  const showInspiration = visibleSections.includes("inspiration")
  const showCategoryFilter = showMain
  const showRemoteControls = showInspiration

  const panelMeta = (() => {
    if (showMain && !showRules && !showInspiration) {
      return {
        badge: "基础角色",
        title: "先挑基础角色。",
        placeholder: "搜索基础角色",
      }
    }

    if (!showMain && showRules && !showInspiration) {
      return {
        badge: "表达方式",
        title: "再定表达方式。",
        placeholder: "搜索表达规则",
      }
    }

    if (!showMain && !showRules && showInspiration) {
      return {
        badge: "灵感",
        title: "导入官方灵感卡。",
        placeholder: "搜索灵感卡",
      }
    }

    return {
      badge: "素材库",
      title: "先挑可复用碎片。",
      placeholder: "搜索主素材、规则或灵感卡",
    }
  })()

  return (
    <Card className={cn("h-full min-h-0 overflow-hidden", compact && "rounded-[30px] border-primary/15 bg-card/76 p-0")}>
      <CardHeader className={cn("gap-4 border-b border-border/60 pb-5", compact && "px-5 pt-5")}> 
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <Badge variant="secondary">{panelMeta.badge}</Badge>
            <CardTitle className={cn("font-display tracking-[-0.04em]", compact ? "text-[2rem]" : "text-3xl")}>
              {panelMeta.title}
            </CardTitle>
          </div>
          {showRemoteControls ? (
            <Button type="button" variant="outline" size="sm" onClick={onReload}>
              <RefreshCw size={14} />
              刷新灵感
            </Button>
          ) : null}
        </div>
        <div className="grid gap-3">
          <Input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder={panelMeta.placeholder} aria-label="搜索素材" />
          {showCategoryFilter ? (
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
          ) : null}
        </div>
        {showRemoteControls ? (
          <div className="flex items-center justify-between gap-3 rounded-[22px] border border-border/70 bg-background/75 px-4 py-3 text-sm">
            <div>
              <p className="font-medium text-foreground">官方灵感源</p>
              <p className="text-muted-foreground mt-1">{remoteMessage ?? "正在同步官方灵感卡。"}</p>
            </div>
            <Badge variant={remoteState === "ready" ? "default" : remoteState === "error" ? "outline" : "secondary"}>
              {remoteState}
            </Badge>
          </div>
        ) : null}
      </CardHeader>

      <CardContent className={cn("min-h-0 flex-1 overflow-y-auto py-6", compact ? "grid gap-6 px-5 pb-5" : "grid gap-8")}> 
        {showMain ? (
          <SectionBlock
            title="基础角色"
            eyebrow="who"
            items={mainFragments}
            selectedId={selectedMainFragmentId}
            onSelect={onSelectMainFragment}
            compact={compact}
          />
        ) : null}

        {showRules ? (
          <SectionBlock
            title="表达规则"
            eyebrow="how"
            items={ruleFragments}
            selectedId={selectedRuleFragmentId}
            onSelect={onSelectRuleFragment}
            compact={compact}
          />
        ) : null}

        {showInspiration ? (
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-[0.28em]">inspiration</p>
                <h3 className={cn("mt-2 font-semibold", compact ? "text-lg" : "text-xl")}>官方灵感卡</h3>
              </div>
              <Badge variant="outline">可导入</Badge>
            </div>
            <div className="grid gap-3">
              {inspirationFragments.length > 0 ? (
                inspirationFragments.map((fragment) => (
                  <button
                    key={fragment.fragmentId}
                    type="button"
                    aria-pressed={selectedInspirationId === fragment.fragmentId}
                    onClick={() => onSelectInspirationFragment(fragment.fragmentId)}
                    className={cn(
                      "w-full rounded-[28px] border text-left transition-all focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60",
                      compact ? "p-3.5" : "p-4",
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
                      <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                        <Sparkles size={14} />
                        <span>{selectedInspirationId === fragment.fragmentId ? "已导入" : "单击卡片导入"}</span>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-[24px] border border-dashed border-border/80 bg-background/70 px-4 py-5 text-sm text-muted-foreground">
                  官方灵感卡暂不可用。可继续使用本地主素材与规则完成组合。
                </div>
              )}
            </div>
          </section>
        ) : null}
      </CardContent>
    </Card>
  )
}
