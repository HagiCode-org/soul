import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-32 w-full rounded-[16px] border border-input bg-[color:var(--surface-void)] px-4 py-3 text-sm leading-6 text-foreground shadow-[0_1px_0_rgba(255,255,255,0.05)_inset] outline-none transition-[border-color,box-shadow,background-color] placeholder:text-muted-foreground focus:border-[color:var(--accent-blue)] focus:shadow-[0_0_0_4px_var(--accent-blue-soft),0_1px_0_rgba(255,255,255,0.05)_inset] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
