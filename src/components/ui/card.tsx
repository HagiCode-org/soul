import * as React from "react"

import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col gap-4 rounded-[28px] border border-border/70 bg-card/85 p-5 text-card-foreground shadow-[0_24px_70px_-45px_rgba(15,23,42,0.6)] backdrop-blur-xl",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-header" className={cn("grid gap-2", className)} {...props} />
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("text-lg leading-none font-semibold tracking-tight", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-description" className={cn("text-muted-foreground text-sm", className)} {...props} />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("grid gap-4", className)} {...props} />
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-footer" className={cn("flex items-center gap-3", className)} {...props} />
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
