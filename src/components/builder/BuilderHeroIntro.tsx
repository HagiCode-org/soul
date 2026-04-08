import { ArrowUpRight, BookOpenText, FlaskConical, Sparkles, WandSparkles } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { translateMessage } from "@/i18n/message"
import type { MessageDescriptor } from "@/lib/builder/types"

type BuilderHeroIntroProps = {
  mainCount: number
  ruleCount: number
  ready: boolean
  remoteMessage: MessageDescriptor | null
}

export function BuilderHeroIntro({ mainCount, ruleCount, ready, remoteMessage }: BuilderHeroIntroProps) {
  const { t } = useTranslation()
  const remoteStatus = translateMessage(t, remoteMessage) ?? t("builder.materialLibrary.remote.loadingInitial")

  return (
    <section id="builder-intro" className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.82fr)] lg:items-stretch">
      <div
        className="relative overflow-hidden rounded-[28px] border px-5 py-6 text-white sm:px-7 sm:py-8"
        style={{
          background:
            "linear-gradient(180deg, rgba(16,17,17,0.98) 0%, rgba(7,8,10,1) 100%), repeating-linear-gradient(126deg, rgba(255,99,99,0.14) 0 14px, transparent 14px 34px)",
          borderColor: "rgba(255,255,255,0.1)",
          boxShadow: "var(--floating-shadow)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at top left, rgba(255,255,255,0.12) 0%, transparent 28%), radial-gradient(circle at 78% 18%, rgba(255,99,99,0.16) 0%, transparent 26%), linear-gradient(135deg, transparent 0%, transparent 46%, rgba(255,99,99,0.18) 46%, rgba(255,99,99,0.18) 49%, transparent 49%, transparent 100%)",
          }}
        />
        <div className="relative grid gap-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="site-window-dots" aria-hidden="true">
              <span className="site-window-dot" data-tone="red" />
              <span className="site-window-dot" data-tone="yellow" />
              <span className="site-window-dot" data-tone="green" />
            </div>
            <div className="flex items-center gap-2">
              <span className="site-keycap">⌘</span>
              <span className="site-keycap">K</span>
            </div>
          </div>

          <div className="space-y-5">
            <Badge className="border-white/12 bg-white/88 text-[#18191a]">{t("home.hero.eyebrow")}</Badge>
            <div className="space-y-4">
              <h1
                className="font-display max-w-4xl text-[3rem] leading-[0.92] tracking-[-0.015em] text-balance sm:text-[4rem] lg:text-[5.25rem]"
                style={{ fontVariationSettings: '"wght" 600, "liga" 0' }}
              >
                {t("home.hero.title")}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-white/78 sm:text-lg sm:leading-8">{t("home.hero.description")}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="default">
              <a href="#home-workbench">
                {t("home.hero.primaryAction")}
                <ArrowUpRight size={16} />
              </a>
            </Button>
            <Button asChild variant="outline" className="border-white/12 text-white">
              <a href="https://docs.hagicode.com/" target="_blank" rel="noreferrer noopener">
                {t("home.hero.secondaryAction")}
              </a>
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[18px] border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-white/56">{t("home.hero.stats.catalog")}</p>
              <p className="mt-3 text-3xl leading-none tracking-[-0.03em]" style={{ fontVariationSettings: '"wght" 540' }}>
                {mainCount}
              </p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-white/56">{t("home.hero.stats.expression")}</p>
              <p className="mt-3 text-3xl leading-none tracking-[-0.03em]" style={{ fontVariationSettings: '"wght" 540' }}>
                {ruleCount}
              </p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-white/56">{t("home.hero.stats.state")}</p>
              <p className="mt-3 text-lg leading-none tracking-[0.02em]" style={{ fontVariationSettings: '"wght" 540' }}>
                {ready ? t("home.hero.state.ready") : t("home.hero.state.draft")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="site-surface-strong grid overflow-hidden rounded-[28px]">
        <div className="grid gap-0 divide-y" style={{ borderColor: "var(--line-soft)" }}>
          <div className="grid gap-3 px-5 py-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start">
            <div className="site-surface-soft flex size-12 items-center justify-center rounded-[16px] text-foreground">
              <BookOpenText size={18} />
            </div>
            <div className="space-y-2">
              <p className="site-section-kicker">{t("home.hero.stats.catalog")}</p>
              <h2 className="text-lg tracking-[0.01em]" style={{ fontVariationSettings: '"wght" 540' }}>
                {t("home.slots.catalog.title")}
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">{t("home.slots.catalog.description")}</p>
            </div>
          </div>

          <div className="grid gap-3 px-5 py-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start">
            <div className="site-surface-soft flex size-12 items-center justify-center rounded-[16px] text-foreground">
              <FlaskConical size={18} />
            </div>
            <div className="space-y-2">
              <p className="site-section-kicker">{t("home.hero.stats.expression")}</p>
              <h2 className="text-lg tracking-[0.01em]" style={{ fontVariationSettings: '"wght" 540' }}>
                {t("home.slots.expression.title")}
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">{t("home.slots.expression.description")}</p>
            </div>
          </div>

          <div className="grid gap-4 px-5 py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="site-section-kicker">{t("home.hero.stats.state")}</p>
                <h2 className="text-lg tracking-[0.01em]" style={{ fontVariationSettings: '"wght" 540' }}>
                  {t("builder.preview.panelTitle")}
                </h2>
              </div>
              <Badge variant={ready ? "default" : "secondary"}>
                {ready ? <Sparkles size={12} /> : <WandSparkles size={12} />}
                {ready ? t("home.hero.state.ready") : t("home.hero.state.draft")}
              </Badge>
            </div>
            <div className="rounded-[18px] border border-border bg-[color:var(--surface-void)] px-4 py-4 text-sm leading-6 text-muted-foreground shadow-[var(--ring-shadow)]">
              {remoteStatus}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
