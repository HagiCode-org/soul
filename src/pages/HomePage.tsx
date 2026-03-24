import { Compass, Sparkles } from "lucide-react"

import { BuilderHeroIntro } from "@/components/builder/BuilderHeroIntro"
import { CompositionPanel } from "@/components/builder/CompositionPanel"
import { MaterialLibraryPanel } from "@/components/builder/MaterialLibraryPanel"
import { PreviewPanel } from "@/components/builder/PreviewPanel"
import { SavedDraftRail } from "@/components/builder/SavedDraftRail"
import { SourceFootnote } from "@/components/builder/SourceFootnote"
import { SiteHeader } from "@/components/site/SiteHeader"
import { Badge } from "@/components/ui/badge"
import type { ThemeMode } from "@/hooks/use-theme-mode"
import { useSoulBuilder } from "@/hooks/use-soul-builder"

type HomePageProps = {
  theme: ThemeMode
  onToggleTheme: () => void
}

export function HomePage({ theme, onToggleTheme }: HomePageProps) {
  const builder = useSoulBuilder()

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-5 sm:px-6 lg:px-8">
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
            默认入口已切换为 Soul Builder 工作台。本地即可运行。远端仅增强体验。
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">Snapshot</Badge>
            <Badge variant="outline">Local save</Badge>
            <Badge variant="outline">JSON export</Badge>
          </div>
        </section>

        <div className="mt-8 space-y-8 lg:space-y-10">
          <BuilderHeroIntro remoteMessage={builder.materials.remoteMessage} />

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.95fr)_minmax(360px,0.88fr)] xl:items-start">
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
            />

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
            />

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
              onExport={builder.exportCurrentDraft}
              onCopy={builder.copyPreviewText}
            />
          </section>

          <SavedDraftRail snapshots={builder.snapshots} onRestore={builder.restoreSnapshot} />
          <SourceFootnote sourceNotes={builder.materials.sourceNotes} generatedAtUtc={builder.materials.generatedAtUtc} />

          <section className="rounded-[30px] border border-border/70 bg-card/70 px-5 py-5 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 text-foreground">
              <Sparkles size={16} className="text-primary" />
              <span className="font-medium">领域约束</span>
            </div>
            <p className="mt-3 leading-7">
              重点是。素材只读。草稿可变。副作用只有本地存储、复制与文件导出。远端失败时，核心拼装路径不阻塞。
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
