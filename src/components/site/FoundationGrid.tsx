import { Bot, GalleryVerticalEnd, PanelsTopLeft, Sparkle, Waypoints } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const foundationCards = [
  {
    title: "Bootstrap workspace",
    description: "Vite 8 entrypoints, strict TypeScript, and aligned aliases keep the shell deterministic.",
    icon: PanelsTopLeft,
    accent: "Entry",
  },
  {
    title: "Shared UI primitives",
    description: "Buttons, badges, inputs, separators, and cards live in one registry-backed surface.",
    icon: GalleryVerticalEnd,
    accent: "UI",
  },
  {
    title: "Expandable home shell",
    description: "Navigation, hero, and capability slots can grow without rewriting the composition root.",
    icon: Waypoints,
    accent: "Shell",
  },
] as const

const extensionSlots = [
  {
    title: "Narrative block",
    copy: "A future editorial story or manifesto can land here.",
    icon: Sparkle,
  },
  {
    title: "Product signals",
    copy: "Feature callouts or release notes can dock here next.",
    icon: Bot,
  },
] as const

export function FoundationGrid() {
  return (
    <section id="foundation" className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <Badge variant="outline">Foundation grid</Badge>
          <div className="space-y-2">
            <h2 className="font-display text-4xl leading-none tracking-[-0.04em] sm:text-5xl">
              Stable sections. Minimal drift.
            </h2>
            <p className="text-muted-foreground max-w-2xl text-base leading-7">
              The homepage keeps named blocks, clear affordances, and reusable internals so future work extends the site instead of replacing it.
            </p>
          </div>
        </div>
        <div className="rounded-full border border-border/70 bg-background/65 px-4 py-2 text-sm text-muted-foreground">
          shadcn/ui baseline with Soul-specific tokens.
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {foundationCards.map(({ title, description, icon: Icon, accent }) => (
          <Card key={title} className="h-full justify-between">
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                  <Icon size={20} />
                </div>
                <Badge variant="secondary">{accent}</Badge>
              </div>
              <div className="space-y-2">
                <CardTitle>{title}</CardTitle>
                <CardDescription className="leading-6">{description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 text-sm text-muted-foreground">
                <li>Single workspace boundary.</li>
                <li>Pure frontend side effects only.</li>
                <li>Ready for future sections.</li>
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Card className="justify-between">
          <CardHeader>
            <Badge variant="secondary">Preview area</Badge>
            <CardTitle className="font-display text-3xl leading-tight">Capability slots stay visible from day one.</CardTitle>
            <CardDescription className="max-w-xl leading-6">
              The shell already reserves space for content modules, product proof, or future stories. No one needs to redesign the scaffold to add the next section.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[22px] border border-dashed border-border/80 bg-background/70 p-4 text-sm text-muted-foreground">
              Content slot
            </div>
            <div className="rounded-[22px] border border-dashed border-border/80 bg-background/70 p-4 text-sm text-muted-foreground">
              Feature slot
            </div>
            <div className="rounded-[22px] border border-dashed border-border/80 bg-background/70 p-4 text-sm text-muted-foreground">
              Future slot
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {extensionSlots.map(({ title, copy, icon: Icon }) => (
            <Card key={title}>
              <CardHeader className="space-y-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-accent/70 text-foreground">
                  <Icon size={18} />
                </div>
                <div className="space-y-2">
                  <CardTitle>{title}</CardTitle>
                  <CardDescription className="leading-6">{copy}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
