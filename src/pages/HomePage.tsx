import { ArchiveRestore, Compass, FileText, Layers3, LibraryBig, ShieldCheck, Sparkles, WandSparkles } from "lucide-react"

import { CompositionPanel } from "@/components/builder/CompositionPanel"
import { MaterialLibraryPanel } from "@/components/builder/MaterialLibraryPanel"
import { PreviewPanel } from "@/components/builder/PreviewPanel"
import { SavedDraftRail } from "@/components/builder/SavedDraftRail"
import { SourceFootnote } from "@/components/builder/SourceFootnote"
import { HomeEditorShell } from "@/components/home/HomeEditorShell"
import type { HomeSlotDefinition } from "@/components/home/HomeSlotRail"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { HomeEditorSlotId } from "@/hooks/use-home-editor-state"
import { useHomeEditorState } from "@/hooks/use-home-editor-state"
import { getStatusToneClass, useSoulBuilder } from "@/hooks/use-soul-builder"
import type { ThemeMode } from "@/hooks/use-theme-mode"
import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/site/SiteHeader"

type HomePageProps = {
  theme: ThemeMode
  onToggleTheme: () => void
}

function formatUpdatedAt(value: string) {
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

function StatusPanel({
  feedbackMessage,
  previewHint,
  recommendedSlotLabel,
  selectionStatus,
  workbenchStatus,
}: {
  feedbackMessage: string | null
  previewHint: string | null
  recommendedSlotLabel: string
  selectionStatus: ReturnType<typeof useSoulBuilder>["selectionStatus"]
  workbenchStatus: ReturnType<typeof useSoulBuilder>["workbenchStatus"]
}) {
  return (
    <div className="grid gap-4">
      <section className="rounded-[28px] border border-border/70 bg-background/75 p-4">
        <p className="text-muted-foreground text-xs uppercase tracking-[0.28em]">active guidance</p>
        <h3 className="mt-2 text-lg font-semibold">当前建议：先打开「{recommendedSlotLabel}」</h3>
        <p className="text-muted-foreground mt-3 text-sm leading-6">
          {feedbackMessage ?? previewHint ?? "核心组合已就绪。现在可以继续微调，或直接保存、复制、导出。"}
        </p>
      </section>

      <section className="rounded-[28px] border border-border/70 bg-background/75 p-4">
        <p className="text-muted-foreground text-xs uppercase tracking-[0.28em]">selection state</p>
        <div className="mt-4 grid gap-3">
          {selectionStatus.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 rounded-[20px] border border-border/60 bg-card/70 px-3 py-3 text-sm">
              <div>
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="mt-1 text-muted-foreground">{item.value}</p>
              </div>
              <Badge variant={item.complete ? "default" : "outline"}>{item.complete ? "ready" : "pending"}</Badge>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-border/70 bg-background/75 p-4">
        <p className="text-muted-foreground text-xs uppercase tracking-[0.28em]">runtime boundary</p>
        <p className={cn("mt-3 text-sm font-medium", getStatusToneClass(workbenchStatus.remoteState))}>{workbenchStatus.remoteMessage ?? "本地模式可用"}</p>
        <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
          <p>本地快照：{workbenchStatus.snapshotCount} 份</p>
          <p>工作区状态：{workbenchStatus.exportReady ? "可导出" : "未达导出门槛"}</p>
          <p>最近更新：{formatUpdatedAt(workbenchStatus.updatedAt)}</p>
        </div>
      </section>
    </div>
  )
}

export function HomePage({ theme, onToggleTheme }: HomePageProps) {
  const builder = useSoulBuilder()

  const defaultSlot = (() => {
    if (!builder.rawDraft.selectedMainFragmentId || !builder.rawDraft.selectedRuleFragmentId) {
      return "materials"
    }

    if (!builder.rawDraft.customPrompt.trim()) {
      return "compose"
    }

    if (builder.materials.remoteState !== "ready") {
      return "inspire"
    }

    return builder.snapshots.length > 0 ? "drafts" : "sources"
  })() satisfies HomeEditorSlotId

  const slotRegistry: HomeSlotDefinition[] = [
    {
      id: "materials",
      side: "left",
      label: "素材",
      title: "主素材与表达规则",
      description: "筛选主 Catalog 与表达规则，保持输入层收口。",
      emptyState: "当前没有可用素材。",
      icon: LibraryBig,
      badge: `${builder.filteredMainFragments.length + builder.filteredRuleFragments.length}`,
    },
    {
      id: "compose",
      side: "left",
      label: "拼装",
      title: "草稿拼装区",
      description: "维护草稿聚合根、自定义补充与保存动作。",
      emptyState: "当前还没有可编辑的草稿内容。",
      icon: Layers3,
      badge: builder.rawDraft.customPrompt.trim() ? "note" : undefined,
    },
    {
      id: "inspire",
      side: "left",
      label: "灵感",
      title: "官方灵感卡",
      description: "导入官方灵感卡；远端失败时仍可回退到本地示例。",
      emptyState: "当前没有可导入的灵感卡。",
      icon: Sparkles,
      badge: builder.materials.remoteState,
    },
    {
      id: "drafts",
      side: "right",
      label: "草稿",
      title: "本地草稿恢复",
      description: "查看最近保存的本地快照，必要时一键恢复。",
      emptyState: "还没有可恢复的本地草稿。",
      icon: ArchiveRestore,
      badge: builder.snapshots.length > 0 ? String(builder.snapshots.length) : undefined,
    },
    {
      id: "sources",
      side: "right",
      label: "来源",
      title: "来源说明与边界",
      description: "查看输入快照、远端增强来源与副作用边界。",
      emptyState: "当前没有来源说明。",
      icon: FileText,
    },
    {
      id: "status",
      side: "right",
      label: "状态",
      title: "工作区状态",
      description: "检查导出门槛、运行状态与当前建议。",
      emptyState: "当前没有状态摘要。",
      icon: ShieldCheck,
      badge: builder.workbenchStatus.exportReady ? "ready" : "pending",
    },
  ]

  const editor = useHomeEditorState({
    slots: slotRegistry.map(({ id, side, disabled }) => ({ id, side, disabled })),
    defaultSlot,
  })

  const recommendedSlot = editor.defaultFocusSlot
  const recommendedSlotLabel = slotRegistry.find((slot) => slot.id === recommendedSlot)?.label ?? "素材"

  const drawerContent = (() => {
    switch (editor.activeSlot) {
      case "materials":
        return (
          <MaterialLibraryPanel
            query={builder.libraryQuery}
            onQueryChange={builder.setLibraryQuery}
            categories={builder.categories}
            selectedCategory={builder.selectedCategory}
            onCategoryChange={builder.setSelectedCategory}
            mainFragments={builder.filteredMainFragments}
            ruleFragments={builder.filteredRuleFragments}
            inspirationFragments={builder.filteredInspirationFragments}
            selectedMainFragmentId={builder.rawDraft.selectedMainFragmentId}
            selectedRuleFragmentId={builder.rawDraft.selectedRuleFragmentId}
            selectedInspirationId={builder.rawDraft.inspirationSoulId}
            onSelectMainFragment={builder.selectMainFragment}
            onSelectRuleFragment={builder.selectRuleFragment}
            onSelectInspirationFragment={builder.selectInspirationFragment}
            remoteState={builder.materials.remoteState}
            remoteMessage={builder.materials.remoteMessage}
            onReload={builder.reloadMaterials}
            layout="drawer"
            visibleSections={["main", "rules"]}
          />
        )
      case "compose":
        return (
          <CompositionPanel
            mainFragment={builder.resolvedFragments.mainFragment}
            ruleFragment={builder.resolvedFragments.ruleFragment}
            inspirationFragment={builder.resolvedFragments.inspirationFragment}
            customPrompt={builder.rawDraft.customPrompt}
            onCustomPromptChange={builder.updateCustomPrompt}
            onClearMainFragment={builder.clearMainFragment}
            onClearRuleFragment={builder.clearRuleFragment}
            onClearInspiration={builder.clearSelectedInspiration}
            onSaveDraft={builder.saveCurrentDraft}
            layout="drawer"
          />
        )
      case "inspire":
        return (
          <MaterialLibraryPanel
            query={builder.libraryQuery}
            onQueryChange={builder.setLibraryQuery}
            categories={builder.categories}
            selectedCategory={builder.selectedCategory}
            onCategoryChange={builder.setSelectedCategory}
            mainFragments={builder.filteredMainFragments}
            ruleFragments={builder.filteredRuleFragments}
            inspirationFragments={builder.filteredInspirationFragments}
            selectedMainFragmentId={builder.rawDraft.selectedMainFragmentId}
            selectedRuleFragmentId={builder.rawDraft.selectedRuleFragmentId}
            selectedInspirationId={builder.rawDraft.inspirationSoulId}
            onSelectMainFragment={builder.selectMainFragment}
            onSelectRuleFragment={builder.selectRuleFragment}
            onSelectInspirationFragment={builder.selectInspirationFragment}
            remoteState={builder.materials.remoteState}
            remoteMessage={builder.materials.remoteMessage}
            onReload={builder.reloadMaterials}
            layout="drawer"
            visibleSections={["inspiration"]}
          />
        )
      case "drafts":
        return (
          <SavedDraftRail
            snapshots={builder.snapshots}
            onRestore={(snapshot) => {
              builder.restoreSnapshot(snapshot)
              editor.closeDrawer()
            }}
            layout="drawer"
          />
        )
      case "sources":
        return (
          <SourceFootnote
            sourceNotes={builder.materials.sourceNotes}
            generatedAtUtc={builder.materials.generatedAtUtc}
            layout="drawer"
          />
        )
      case "status":
        return (
          <StatusPanel
            feedbackMessage={builder.feedback?.message ?? null}
            previewHint={builder.previewHint}
            recommendedSlotLabel={recommendedSlotLabel}
            selectionStatus={builder.selectionStatus}
            workbenchStatus={builder.workbenchStatus}
          />
        )
      default:
        return null
    }
  })()

  return (
    <main className="relative min-h-screen overflow-x-clip px-4 py-5 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-9rem] top-[-7rem] size-[24rem] rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute right-[-6rem] top-[12%] size-[18rem] rounded-full bg-accent/50 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-[18%] size-[25rem] rounded-full bg-secondary/70 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-[1600px] flex-col rounded-[40px] border border-border/70 bg-background/78 p-4 shadow-[0_30px_120px_-65px_rgba(15,23,42,0.8)] backdrop-blur-2xl sm:p-6 lg:p-8">
        <SiteHeader theme={theme} onToggleTheme={onToggleTheme} onSaveDraft={builder.saveCurrentDraft} />

        <section className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-border/70 bg-card/65 px-4 py-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Compass size={16} className="text-primary" />
            默认入口已切换为 editor-style Soul Builder。中心工作区常驻。两侧槽位按需展开。
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">Single drawer</Badge>
            <Badge variant="outline">Local save</Badge>
            <Badge variant="outline">JSON export</Badge>
          </div>
        </section>

        <div className="mt-8 space-y-6 lg:space-y-8">
          <HomeEditorShell
            slots={slotRegistry}
            activeSlot={editor.activeSlot}
            drawerOpen={editor.drawerOpen}
            drawerSide={editor.drawerSide}
            recommendedSlot={recommendedSlot}
            onSlotToggle={editor.toggleSlot}
            onCloseDrawer={editor.closeDrawer}
            drawerContent={drawerContent}
            hero={
              <section
                id="builder-intro"
                className="overflow-hidden rounded-[34px] border border-border/70 bg-[linear-gradient(135deg,color-mix(in_oklab,var(--card)_86%,white)_0%,color-mix(in_oklab,var(--accent)_34%,transparent)_58%,color-mix(in_oklab,var(--primary)_12%,transparent)_100%)] p-6 shadow-[0_30px_80px_-52px_rgba(28,35,45,0.5)] sm:p-7"
              >
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.42fr)] lg:items-start">
                  <div className="space-y-5">
                    <Badge>Editor shell</Badge>
                    <div className="space-y-4">
                      <p className="text-muted-foreground text-xs uppercase tracking-[0.34em]">soul builder atelier</p>
                      <h1 className="font-display text-5xl leading-[0.9] tracking-[-0.05em] text-balance sm:text-6xl">
                        中央工作台常驻。上下文退回边缘槽位。
                      </h1>
                      <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
                        结论是，预览、保存、复制、导出只留在中央主表面。重点是，素材、拼装、灵感、草稿和来源都通过命名槽位按需打开。
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 rounded-[28px] border border-border/70 bg-background/72 p-4">
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-[0.28em]">default focus</p>
                      <h2 className="mt-2 text-xl font-semibold">推荐先看「{recommendedSlotLabel}」</h2>
                      <p className="text-muted-foreground mt-2 text-sm leading-6">
                        当前草稿：{builder.workbenchStatus.draftName}。已激活 {builder.workbenchStatus.activeSelections} 个关键状态点。
                      </p>
                    </div>
                    <Button type="button" onClick={editor.focusDefaultSlot}>
                      <WandSparkles size={16} />
                      打开推荐槽位
                    </Button>
                    <div className="rounded-[22px] border border-border/70 bg-card/75 px-4 py-3 text-sm text-muted-foreground">
                      <p className={cn("font-medium", getStatusToneClass(builder.workbenchStatus.remoteState))}>{builder.workbenchStatus.remoteMessage ?? "本地模式可用"}</p>
                      <p className="mt-1">最近更新：{formatUpdatedAt(builder.workbenchStatus.updatedAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {builder.selectionStatus.map((item) => (
                    <article key={item.id} className="rounded-[24px] border border-border/70 bg-background/72 px-4 py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-muted-foreground text-xs uppercase tracking-[0.28em]">{item.label}</p>
                          <h3 className="mt-2 text-lg font-semibold">{item.value}</h3>
                        </div>
                        <Badge variant={item.complete ? "default" : "outline"}>{item.complete ? "ready" : "pending"}</Badge>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            }
            workbench={
              <PreviewPanel
                draft={builder.draft}
                preview={builder.preview}
                previewHint={builder.previewHint}
                canExport={builder.canExport}
                mainFragment={builder.resolvedFragments.mainFragment}
                ruleFragment={builder.resolvedFragments.ruleFragment}
                inspirationFragment={builder.resolvedFragments.inspirationFragment}
                feedbackMessage={builder.feedback?.message ?? null}
                feedbackTone={builder.feedback?.tone ?? null}
                onSave={builder.saveCurrentDraft}
                onExport={builder.exportCurrentDraft}
                onCopy={builder.copyPreviewText}
                layout="workbench"
              />
            }
          />
        </div>
      </div>
    </main>
  )
}
