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
      "pointer-events-none fixed inset-0 z-50 bg-background/55 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out",
      className
    )}
    {...props}
  />
))
SheetOverlay.displayName = Dialog.Overlay.displayName

const sheetVariants = cva(
  "fixed z-50 flex flex-col border border-border/70 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--card)_88%,white)_0%,color-mix(in_oklab,var(--background)_92%,black)_100%)] shadow-[0_32px_110px_-50px_rgba(15,23,42,0.82)] backdrop-blur-2xl transition ease-in-out data-[state=closed]:duration-200 data-[state=open]:duration-300",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 rounded-b-[30px] data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 rounded-t-[30px] data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left:
          "inset-y-2 left-2 h-[calc(100%-1rem)] w-[min(34rem,calc(100vw-1rem))] rounded-[30px] data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left lg:inset-y-4 lg:left-4 lg:w-[min(32rem,calc(100vw-3rem))]",
        right:
          "inset-y-2 right-2 h-[calc(100%-1rem)] w-[min(34rem,calc(100vw-1rem))] rounded-[30px] data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right lg:inset-y-4 lg:right-4 lg:w-[min(32rem,calc(100vw-3rem))]",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof Dialog.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ComponentRef<typeof Dialog.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <Dialog.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
      {children}
      <Dialog.Close
        className="absolute top-4 right-4 inline-flex size-10 items-center justify-center rounded-full border border-border/70 bg-background/78 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
        aria-label="关闭抽屉"
      >
        <X size={18} />
      </Dialog.Close>
    </Dialog.Content>
  </SheetPortal>
))
SheetContent.displayName = Dialog.Content.displayName

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("grid gap-2 text-left", className)} {...props} />
)

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-auto flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />
)

const SheetTitle = React.forwardRef<
  React.ComponentRef<typeof Dialog.Title>,
  React.ComponentPropsWithoutRef<typeof Dialog.Title>
>(({ className, ...props }, ref) => (
  <Dialog.Title ref={ref} className={cn("font-display text-3xl tracking-[-0.04em]", className)} {...props} />
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
