import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "font-mono-ui inline-flex w-fit items-center justify-center rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.2em] transition-colors",
  {
    variants: {
      variant: {
        default: "border-white/12 bg-white/82 text-[#18191a] shadow-[0_0_0_1px_rgba(255,255,255,0.1)_inset]",
        secondary: "border-border bg-secondary text-foreground shadow-[var(--ring-shadow)]",
        outline: "border-border bg-transparent text-muted-foreground shadow-[var(--ring-shadow)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "span"

  return <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge }
