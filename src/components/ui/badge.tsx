import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary-500 text-white",
        secondary:
          "border-transparent bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-gray-100",
        destructive:
          "border-transparent bg-red-500 text-white",
        outline:
          "border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100",
        gold:
          "border-transparent bg-gradient-to-r from-[#D4AF37] to-[#AA8C2C] text-gray-900",
        glass:
          "border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/5 backdrop-blur-sm text-gray-900 dark:text-white",
        success:
          "border-transparent bg-emerald-500 text-white",
        warning:
          "border-transparent bg-amber-500 text-white",
        info:
          "border-transparent bg-blue-500 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
