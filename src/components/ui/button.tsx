import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border px-4 text-sm font-medium tracking-[0.03em] outline-none transition-[opacity,background-color,color,border-color,transform,box-shadow] duration-200 disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-white/10 bg-white/88 text-[#18191a] shadow-[0_0_0_1px_rgba(255,255,255,0.14)_inset,0_-1px_0_rgba(0,0,0,0.08)_inset,0_16px_32px_-22px_rgba(0,0,0,0.45)] hover:-translate-y-px hover:opacity-80 dark:border-white/12 dark:bg-white/82 dark:text-[#18191a]",
        outline:
          "border-border bg-transparent text-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset,0_-1px_0_rgba(0,0,0,0.18)_inset] hover:-translate-y-px hover:opacity-75",
        secondary:
          "border-border bg-secondary text-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset,0_14px_30px_-24px_rgba(0,0,0,0.5)] hover:-translate-y-px hover:opacity-80",
        ghost: "border-transparent bg-transparent text-muted-foreground hover:text-foreground hover:opacity-80",
        link: "h-auto rounded-none border-transparent px-0 text-foreground underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "size-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button }
