import { BookOpenText, FlaskConical } from "lucide-react"
import { useTranslation } from "react-i18next"

import { MaterialLibraryPanel } from "@/components/builder/MaterialLibraryPanel"
import { PreviewPanel } from "@/components/builder/PreviewPanel"
import { HomeContextDrawer } from "@/components/home/HomeContextDrawer"
import { HomeEditorShell } from "@/components/home/HomeEditorShell"
import type { HomeSlotDefinition } from "@/components/home/HomeSlotRail"
import { SiteFooter } from "@/components/site/SiteFooter"
import { SiteHeader } from "@/components/site/SiteHeader"
import type { HomeEditorSlotId } from "@/hooks/use-home-editor-state"
import { useHomeEditorState } from "@/hooks/use-home-editor-state"
import { useSoulBuilder } from "@/hooks/use-soul-builder"
import type { ThemeMode } from "@/hooks/use-theme-mode"

type HomePageProps = {
  theme: ThemeMode
  onToggleTheme: () => void
}

export function HomePage({ theme, onToggleTheme }: HomePageProps) {
  const { t } = useTranslation()
  const builder = useSoulBuilder()

  const defaultSlot = (!builder.rawDraft.selectedMainFragmentId ? "catalog" : "expression") satisfies HomeEditorSlotId

  const slotRegistry: HomeSlotDefinition[] = [
    {
      id: "catalog",
      side: "left",
      label: t("home.slots.catalog.label"),
      title: t("home.slots.catalog.title"),
      description: t("home.slots.catalog.description"),
      emptyState: t("home.slots.catalog.emptyState"),
      icon: BookOpenText,
      badge: `${builder.filteredMainFragments.length}`,
    },
    {
      id: "expression",
      side: "left",
      label: t("home.slots.expression.label"),
      title: t("home.slots.expression.title"),
      description: t("home.slots.expression.description"),
      emptyState: t("home.slots.expression.emptyState"),
      icon: FlaskConical,
      badge: `${builder.filteredRuleFragments.length}`,
    },
  ]

  const editor = useHomeEditorState({
    slots: slotRegistry.map(({ id, side, disabled }) => ({ id, side, disabled })),
    defaultSlot,
  })

  const recommendedSlot = editor.defaultFocusSlot
  const activeSlotDefinition = slotRegistry.find((slot) => slot.id === editor.activeSlot)

  const drawerContent = (() => {
    switch (editor.activeSlot) {
      case "catalog":
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
            visibleSections={["main"]}
          />
        )
      case "expression":
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
            visibleSections={["rules"]}
          />
        )
      default:
        return null
    }
  })()

  return (
    <main className="site-shell relative min-h-screen overflow-x-clip px-4 py-5 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-9rem] top-[-7rem] size-[24rem] rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute right-[-6rem] top-[12%] size-[18rem] rounded-full bg-accent/50 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-[18%] size-[25rem] rounded-full bg-secondary/70 blur-3xl" />
      </div>

      <div className="site-shell-frame relative mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-[1760px] flex-col gap-5 sm:gap-6">
        <div className="site-panel site-panel-editor">
          <SiteHeader theme={theme} onToggleTheme={onToggleTheme} />

          <section className="site-workbench-section" aria-label={t("home.workbenchAriaLabel")}>
            <HomeEditorShell
              slots={slotRegistry}
              activeSlot={editor.activeSlot}
              recommendedSlot={recommendedSlot}
              onSlotToggle={editor.toggleSlot}
              workbench={
                <PreviewPanel
                  draft={builder.draft}
                  preview={builder.preview}
                  previewHint={builder.previewHint}
                  canCompose={builder.canCompose}
                  feedbackMessage={builder.feedback?.message ?? null}
                  feedbackTone={builder.feedback?.tone ?? null}
                  onMainSlotTextChange={builder.updateMainSlotText}
                  onRuleSlotTextChange={builder.updateRuleSlotText}
                  onCustomPromptChange={builder.updateCustomPrompt}
                  onCopy={builder.copyPreviewText}
                  layout="workbench"
                />
              }
            />
          </section>
        </div>

        <SiteFooter />

        <HomeContextDrawer
          open={editor.drawerOpen}
          side={editor.drawerSide}
          title={activeSlotDefinition?.title ?? t("home.drawer.defaultTitle")}
          description={activeSlotDefinition?.description ?? t("home.drawer.defaultDescription")}
          emptyState={activeSlotDefinition?.emptyState ?? t("home.drawer.defaultEmptyState")}
          onClose={editor.closeDrawer}
        >
          {drawerContent}
        </HomeContextDrawer>
      </div>
    </main>
  )
}
