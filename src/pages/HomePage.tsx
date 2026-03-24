import { Compass, Sparkles } from "lucide-react"

import { FoundationGrid } from "@/components/site/FoundationGrid"
import { HeroSection } from "@/components/site/HeroSection"
import { SiteHeader } from "@/components/site/SiteHeader"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { ThemeMode } from "@/hooks/use-theme-mode"

type HomePageProps = {
  theme: ThemeMode
  onToggleTheme: () => void
}

export function HomePage({ theme, onToggleTheme }: HomePageProps) {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-5 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10rem] top-[-6rem] size-[22rem] rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute right-[-4rem] top-[18%] size-[18rem] rounded-full bg-accent/45 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-[24%] size-[24rem] rounded-full bg-secondary/70 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-7xl flex-col rounded-[40px] border border-border/70 bg-background/72 p-4 shadow-[0_30px_120px_-65px_rgba(15,23,42,0.8)] backdrop-blur-2xl sm:p-6 lg:p-8">
        <SiteHeader theme={theme} onToggleTheme={onToggleTheme} />

        <section className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-border/70 bg-card/65 px-4 py-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Compass size={16} className="text-primary" />
            Default route renders without remote data.
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">Responsive</Badge>
            <Badge variant="outline">Pure frontend</Badge>
            <Badge variant="outline">Builder aligned</Badge>
          </div>
        </section>

        <div className="mt-8 space-y-8 lg:space-y-10">
          <HeroSection />
          <Separator />
          <FoundationGrid />
          <Separator />
          <section id="assumptions" className="grid gap-4 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/12 text-primary">
              <Sparkles size={18} />
            </div>
            <div className="space-y-3">
              <Badge variant="secondary">Assumptions</Badge>
              <h2 className="font-display text-3xl tracking-[-0.04em] sm:text-4xl">Static by design for the first pass.</h2>
              <p className="text-muted-foreground max-w-3xl leading-7">
                Placeholder copy stays in English, i18n and SEO are intentionally deferred, and no backend contract is required to run the shell. The goal is a dependable composition root first.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
