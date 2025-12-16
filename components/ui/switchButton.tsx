"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SwitchButtonOption {
  id: string
  icon: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}

export interface SwitchButtonProps {
  options: SwitchButtonOption[]
  defaultSelected?: string
  onSelectionChange?: (selectedId: string) => void
  className?: string
  allowMultiple?: boolean
  size?: "sm" | "default" | "lg"
}

const SwitchButton = React.forwardRef<HTMLDivElement, SwitchButtonProps>(
  ({
    options,
    defaultSelected,
    onSelectionChange,
    className,
    allowMultiple = false,
    size = "default",
    ...props
  }, ref) => {
    const [selectedIds, setSelectedIds] = React.useState<Set<string>>(() => {
      if (defaultSelected) {
        return new Set([defaultSelected])
      }
      return new Set()
    })

    const handleButtonClick = (option: SwitchButtonOption) => {
      if (option.disabled) return

      let newSelectedIds: Set<string>

      if (allowMultiple) {
        newSelectedIds = new Set(selectedIds)
        if (newSelectedIds.has(option.id)) {
          newSelectedIds.delete(option.id)
        } else {
          newSelectedIds.add(option.id)
        }
      } else {
        // Single selection mode
        newSelectedIds = new Set([option.id])
      }

      setSelectedIds(newSelectedIds)

      // Call the option's onClick if provided
      option.onClick?.()

      // Call the selection change callback
      if (!allowMultiple && newSelectedIds.size > 0) {
        onSelectionChange?.(Array.from(newSelectedIds)[0])
      }
    }

    const getSizeClasses = () => {
      switch (size) {
        case "sm":
          return "h-8 px-2"
        case "lg":
          return "h-10 px-4"
        default:
          return "h-9 px-3"
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-md bg-muted dark:bg-background p-1 gap-1",
          className
        )}
        {...props}
      >
        {options.map((option) => {
          const isSelected = selectedIds.has(option.id)

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleButtonClick(option)}
              disabled={option.disabled}
              className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:pointer-events-none disabled:opacity-50",
                getSizeClasses(),
                isSelected
                  ? "bg-background dark:bg-muted text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted-foreground/10 hover:text-foreground"
              )}
            >
              {option.icon}
            </button>
          )
        })}
      </div>
    )
  }
)

SwitchButton.displayName = "SwitchButton"

export { SwitchButton }
