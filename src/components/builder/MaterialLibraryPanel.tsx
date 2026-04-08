import { Filter, RefreshCw, Sparkles } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { normalizeLocale } from "@/i18n/locales"
import { translateCategory, translateMessage } from "@/i18n/message"
import { resolveLocalizedFragment } from "@/lib/builder/material-repository"
import type { MessageDescriptor, MaterialLoadState, SoulFragment } from "@/lib/builder/types"
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
  remoteMessage: MessageDescriptor | null
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
  const { t, i18n } = useTranslation()
  const localized = resolveLocalizedFragment(fragment, normalizeLocale(i18n.resolvedLanguage ?? i18n.language))

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "w-full rounded-[18px] border text-left transition",
        compact ? "p-3.5" : "p-4",
        selected
          ? "border-white/12 bg-white/88 text-[#18191a] shadow-[0_0_0_1px_rgba(255,255,255,0.12)_inset,0_18px_34px_-24px_rgba(0,0,0,0.38)]"
          : "border-border bg-[color:var(--surface-inset)] text-foreground shadow-[var(--ring-shadow)] hover:-translate-y-px hover:opacity-80"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="tracking-[-0.02em]" style={{ fontVariationSettings: '"wght" 540' }}>
              {localized.title}
            </h4>
            {selected ? <Badge className="border-black/10 bg-black/5 text-[#18191a]">{t("builder.materialLibrary.selectedBadge")}</Badge> : null}
          </div>
          <p className={cn("text-sm leading-6", selected ? "text-[#18191a]/72" : "text-muted-foreground")}>{localized.summary}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {(localized.keywords ?? fragment.keywords).slice(0, compact ? 3 : 4).map((keyword) => (
          <span
            key={keyword}
            className={cn(
              "font-mono-ui rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.2em]",
              selected ? "border-black/10 text-[#18191a]/64" : "border-border text-muted-foreground"
            )}
          >
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
  const { t } = useTranslation()

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="site-section-kicker">{eyebrow}</p>
          <h3 className={cn("mt-3 tracking-[0.01em]", compact ? "text-lg" : "text-xl")} style={{ fontVariationSettings: '"wght" 540' }}>
            {title}
          </h3>
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
          <div className="rounded-[18px] border border-dashed bg-[color:var(--surface-void)] px-4 py-5 text-sm text-muted-foreground shadow-[var(--ring-shadow)]">
            {t("builder.materialLibrary.emptyFiltered")}
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
  const { t } = useTranslation()
  const compact = layout === "drawer"
  const showMain = visibleSections.includes("main")
  const showRules = visibleSections.includes("rules")
  const showInspiration = visibleSections.includes("inspiration")
  const showCategoryFilter = showMain
  const showRemoteControls = showInspiration

  const panelMeta = (() => {
    if (showMain && !showRules && !showInspiration) {
      return {
        badge: t("builder.materialLibrary.panels.main.badge"),
        title: t("builder.materialLibrary.panels.main.title"),
        placeholder: t("builder.materialLibrary.panels.main.placeholder"),
      }
    }

    if (!showMain && showRules && !showInspiration) {
      return {
        badge: t("builder.materialLibrary.panels.rules.badge"),
        title: t("builder.materialLibrary.panels.rules.title"),
        placeholder: t("builder.materialLibrary.panels.rules.placeholder"),
      }
    }

    if (!showMain && !showRules && showInspiration) {
      return {
        badge: t("builder.materialLibrary.panels.inspiration.badge"),
        title: t("builder.materialLibrary.panels.inspiration.title"),
        placeholder: t("builder.materialLibrary.panels.inspiration.placeholder"),
      }
    }

    return {
      badge: t("builder.materialLibrary.panels.all.badge"),
      title: t("builder.materialLibrary.panels.all.title"),
      placeholder: t("builder.materialLibrary.panels.all.placeholder"),
    }
  })()

  return (
    <Card className={cn("h-full min-h-0 overflow-hidden rounded-[24px] p-0", compact && "shadow-none")}>
      <CardHeader className="gap-5 border-b px-5 pb-5 pt-5" style={{ borderColor: "var(--line-soft)" }}>
        <div className="site-window-dots" aria-hidden="true">
          <span className="site-window-dot" data-tone="red" />
          <span className="site-window-dot" data-tone="yellow" />
          <span className="site-window-dot" data-tone="green" />
        </div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <Badge variant="secondary">{panelMeta.badge}</Badge>
            <CardTitle className={cn("font-display tracking-[-0.01em]", compact ? "text-[2rem]" : "text-[2.4rem]")} style={{ fontVariationSettings: '"wght" 500' }}>
              {panelMeta.title}
            </CardTitle>
          </div>
          {showRemoteControls ? (
            <Button type="button" variant="outline" size="sm" onClick={onReload}>
              <RefreshCw size={14} />
              {t("builder.materialLibrary.refreshInspiration")}
            </Button>
          ) : null}
        </div>
        <div className="grid gap-3">
          <Input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={panelMeta.placeholder}
            aria-label={t("builder.materialLibrary.searchAriaLabel")}
          />
          {showCategoryFilter ? (
            <div className="flex flex-wrap gap-2">
              <span className="site-status-pill text-xs text-muted-foreground">
                <Filter size={14} />
                {t("builder.materialLibrary.mainCategoryLabel")}
              </span>
              {categories.map((category) => (
                <Button
                  key={category}
                  type="button"
                  size="sm"
                  variant={selectedCategory === category ? "default" : "ghost"}
                  onClick={() => onCategoryChange(category)}
                >
                  {translateCategory(t, category)}
                </Button>
              ))}
            </div>
          ) : null}
        </div>
        {showRemoteControls ? (
          <div className="flex items-center justify-between gap-3 rounded-[18px] border bg-[color:var(--surface-void)] px-4 py-4 text-sm shadow-[var(--ring-shadow)]">
            <div>
              <p className="tracking-[0.01em] text-foreground" style={{ fontVariationSettings: '"wght" 540' }}>
                {t("builder.materialLibrary.sections.remoteSourceTitle")}
              </p>
              <p className="mt-1 text-muted-foreground">
                {translateMessage(t, remoteMessage) ?? t("builder.materialLibrary.remote.loadingInitial")}
              </p>
            </div>
            <Badge variant={remoteState === "ready" ? "default" : "outline"}>
              {t(`builder.materialLibrary.remote.state.${remoteState}`)}
            </Badge>
          </div>
        ) : null}
      </CardHeader>

      <CardContent className={cn("min-h-0 flex-1 overflow-y-auto px-5 py-5", compact ? "grid gap-6" : "grid gap-8")}>
        {showMain ? (
          <SectionBlock
            title={t("builder.materialLibrary.sections.mainTitle")}
            eyebrow={t("builder.materialLibrary.sections.mainEyebrow")}
            items={mainFragments}
            selectedId={selectedMainFragmentId}
            onSelect={onSelectMainFragment}
            compact={compact}
          />
        ) : null}

        {showRules ? (
          <SectionBlock
            title={t("builder.materialLibrary.sections.rulesTitle")}
            eyebrow={t("builder.materialLibrary.sections.rulesEyebrow")}
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
                <p className="site-section-kicker">{t("builder.materialLibrary.sections.inspirationEyebrow")}</p>
                <h3 className={cn("mt-3 tracking-[0.01em]", compact ? "text-lg" : "text-xl")} style={{ fontVariationSettings: '"wght" 540' }}>
                  {t("builder.materialLibrary.sections.inspirationTitle")}
                </h3>
              </div>
              <Badge variant="outline">{t("builder.materialLibrary.importableBadge")}</Badge>
            </div>
            <div className="grid gap-3">
              {inspirationFragments.length > 0 ? (
                inspirationFragments.map((fragment) => {
                  const selected = selectedInspirationId === fragment.fragmentId

                  return (
                    <button
                      key={fragment.fragmentId}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => onSelectInspirationFragment(fragment.fragmentId)}
                      className={cn(
                        "w-full rounded-[18px] border p-4 text-left transition",
                        selected
                          ? "border-white/12 bg-white/88 text-[#18191a] shadow-[0_0_0_1px_rgba(255,255,255,0.12)_inset,0_18px_34px_-24px_rgba(0,0,0,0.38)]"
                          : "border-border bg-[color:var(--surface-inset)] text-foreground shadow-[var(--ring-shadow)] hover:-translate-y-px hover:opacity-80"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="tracking-[-0.02em]" style={{ fontVariationSettings: '"wght" 540' }}>
                              {fragment.title}
                            </h4>
                            <Badge className={selected ? "border-black/10 bg-black/5 text-[#18191a]" : ""} variant={selected ? "secondary" : "outline"}>
                              {fragment.meta.styleType ? translateCategory(t, fragment.meta.styleType) : t("builder.materialLibrary.styleFallback")}
                            </Badge>
                            {selected ? <Badge className="border-black/10 bg-black/5 text-[#18191a]">{t("builder.materialLibrary.importedBadge")}</Badge> : null}
                          </div>
                          <p className={cn("text-sm leading-6", selected ? "text-[#18191a]/72" : "text-muted-foreground")}>
                            {fragment.summary}
                          </p>
                        </div>
                        <div className={cn("inline-flex items-center gap-2 text-sm", selected ? "text-[#18191a]/62" : "text-muted-foreground")}>
                          <Sparkles size={14} />
                          <span>{selected ? t("builder.materialLibrary.importedBadge") : t("builder.materialLibrary.clickToImport")}</span>
                        </div>
                      </div>
                    </button>
                  )
                })
              ) : (
                <div className="rounded-[18px] border border-dashed bg-[color:var(--surface-void)] px-4 py-5 text-sm text-muted-foreground shadow-[var(--ring-shadow)]">
                  {t("builder.materialLibrary.emptyInspiration")}
                </div>
              )}
            </div>
          </section>
        ) : null}
      </CardContent>
    </Card>
  )
}
