import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Dialog } from "radix-ui"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Sheet = Dialog.Root
const SheetTrigger = Dialog.Trigger
const SheetClose = Dialog.Close
const SheetPortal = Dialog.Portal

const SheetOverlay = React.forwardRef<
  React.ComponentRef<typeof Dialog.Overlay>,
  React.ComponentPropsWithoutRef<typeof Dialog.Overlay>
>(({ className, ...props }, ref) => (
  <Dialog.Overlay
    ref={ref}
    className={cn(
      "pointer-events-none fixed inset-0 z-50 bg-black/24 backdrop-blur-[6px] data-[state=open]:animate-in data-[state=closed]:animate-out dark:bg-black/54",
      className
    )}
    {...props}
  />
))
SheetOverlay.displayName = Dialog.Overlay.displayName

const sheetVariants = cva(
  "fixed z-50 flex flex-col border bg-popover text-popover-foreground shadow-[var(--floating-shadow)] backdrop-blur-xl transition ease-in-out data-[state=closed]:duration-200 data-[state=open]:duration-300",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 rounded-b-[20px] data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 rounded-t-[20px] data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left:
          "inset-y-2 left-2 h-[calc(100%-1rem)] w-[min(34rem,calc(100vw-1rem))] rounded-[20px] data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left lg:inset-y-4 lg:left-4 lg:w-[min(32rem,calc(100vw-3rem))]",
        right:
          "inset-y-2 right-2 h-[calc(100%-1rem)] w-[min(34rem,calc(100vw-1rem))] rounded-[20px] data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right lg:inset-y-4 lg:right-4 lg:w-[min(32rem,calc(100vw-3rem))]",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof Dialog.Content>,
    VariantProps<typeof sheetVariants> {
  closeLabel?: string
}

const SheetContent = React.forwardRef<React.ComponentRef<typeof Dialog.Content>, SheetContentProps>(
  ({ side = "right", className, children, closeLabel = "Close", ...props }, ref) => (
    <SheetPortal>
      <SheetOverlay />
      <Dialog.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
        {children}
        <Dialog.Close
          className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full border border-border bg-[color:var(--surface-void)] text-muted-foreground shadow-[var(--ring-shadow)] transition hover:opacity-75 hover:text-foreground"
          aria-label={closeLabel}
        >
          <X size={18} />
        </Dialog.Close>
      </Dialog.Content>
    </SheetPortal>
  )
)
SheetContent.displayName = Dialog.Content.displayName

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("grid gap-2 text-left", className)} {...props} />
)

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-auto flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />
)

const SheetTitle = React.forwardRef<
  React.ComponentRef<typeof Dialog.Title>,
  React.ComponentPropsWithoutRef<typeof Dialog.Title>
>(({ className, ...props }, ref) => (
  <Dialog.Title
    ref={ref}
    className={cn("font-display text-[2rem] tracking-[-0.01em]", className)}
    style={{ fontVariationSettings: '"wght" 400' }}
    {...props}
  />
))
SheetTitle.displayName = Dialog.Title.displayName

const SheetDescription = React.forwardRef<
  React.ComponentRef<typeof Dialog.Description>,
  React.ComponentPropsWithoutRef<typeof Dialog.Description>
>(({ className, ...props }, ref) => (
  <Dialog.Description ref={ref} className={cn("text-sm leading-6 text-muted-foreground", className)} {...props} />
))
SheetDescription.displayName = Dialog.Description.displayName

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
