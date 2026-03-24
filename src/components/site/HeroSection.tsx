import { ArrowRight, Layers3, Sparkles, Waves } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function HeroSection() {
  return (
    <section id="structure" className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-stretch">
      <div className="flex flex-col justify-between gap-6 rounded-[32px] border border-border/70 bg-background/72 p-6 shadow-[0_30px_100px_-60px_rgba(15,23,42,0.65)] backdrop-blur-xl sm:p-8">
        <div className="space-y-5">
          <Badge>Vite 8 / React 19</Badge>
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm uppercase tracking-[0.32em]">
              soulful AI frontends
            </p>
            <h1 className="font-display text-5xl leading-[0.92] tracking-[-0.04em] text-balance sm:text-6xl lg:text-7xl">
              Build a deliberate shell before the product grows noisy.
            </h1>
            <p className="text-muted-foreground max-w-xl text-base leading-7 sm:text-lg">
              Soul starts with stable entrypoints, shared primitives, and an editorial landing surface that can absorb future content without rebuilding the frame.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <a href="#foundation">
                Explore foundation
                <ArrowRight size={18} />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#assumptions">See assumptions</a>
            </Button>
          </div>
          <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-primary" />
              Distinct tokens
            </div>
            <div className="flex items-center gap-2">
              <Layers3 size={16} className="text-primary" />
              Shared sections
            </div>
            <div className="flex items-center gap-2">
              <Waves size={16} className="text-primary" />
              Responsive flow
            </div>
          </div>
        </div>
      </div>

      <Card className="relative overflow-hidden border-primary/12 bg-card/90">
        <div className="absolute inset-x-8 top-0 h-24 rounded-full bg-primary/10 blur-3xl" />
        <CardHeader className="relative space-y-3">
          <Badge variant="secondary">Preview lane</Badge>
          <CardTitle className="font-display text-3xl leading-tight">
            Hold the first visitor journey. Keep the backend outside the door.
          </CardTitle>
          <CardDescription className="max-w-md leading-6">
            The first iteration stays static on purpose. It proves the alias chain, token system, and component registry before real APIs arrive.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative gap-5">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
            <Input placeholder="Reserve a preview note" aria-label="Reserve a preview note" />
            <Button type="button" variant="outline" className="h-11 px-5">
              Hold slot
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[24px] border border-border/70 bg-background/75 p-4">
              <p className="text-muted-foreground text-xs uppercase tracking-[0.24em]">State</p>
              <p className="mt-3 text-2xl font-semibold">Static</p>
              <p className="text-muted-foreground mt-2 text-sm">No CMS. No API. Just a dependable shell.</p>
            </div>
            <div className="rounded-[24px] border border-border/70 bg-background/75 p-4">
              <p className="text-muted-foreground text-xs uppercase tracking-[0.24em]">Scope</p>
              <p className="mt-3 text-2xl font-semibold">Focused</p>
              <p className="text-muted-foreground mt-2 text-sm">Builder-aligned structure. Soul-specific tone.</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="relative flex-col items-start gap-2 rounded-[24px] border border-border/60 bg-background/65 p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>Primary action stays reachable on phones and desktops.</span>
          <span className="font-medium text-foreground">Theme aware. Alias safe.</span>
        </CardFooter>
      </Card>
    </section>
  )
}
