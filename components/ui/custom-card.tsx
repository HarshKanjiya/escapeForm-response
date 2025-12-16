import * as React from "react"

import { cn } from "@/lib/utils"

function CustomCard({ className, hoverEffect: hover = false, ...props }: React.ComponentProps<"div"> & { hoverEffect?: boolean }) {
    return (
        <div
            data-slot="card"
            className={cn(
                "bg-accent dark:bg-background text-card-foreground rounded-2xl flex gap-2 flex-col border-muted border p-0 active:outline active:outline-offset-2 active:outline-primary",
                hover ? "hover:border-primary transition-all duration-200 cursor-pointer" : "",
                className
            )}
            {...props}
        />
    )
}

function CustomCardHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-header"
            className={cn(
                "@container/card-header text-accent-foreground/70 text-sm pt-3 items-center gap-1.5 px-4 has-data-[slot=card-action]:grid-cols-[1fr_auto]",
                className
            )}
            {...props}
        />
    )
}

function CustomCardTitle({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-title"
            className={cn("leading-none", className)}
            {...props}
        />
    )
}

function CustomCardDescription({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-description"
            className={cn("text-muted-foreground text-sm", className)}
            {...props}
        />
    )
}

function CustomCardAction({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-action"
            className={cn(
                "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
                className
            )}
            {...props}
        />
    )
}

function CustomCardContent({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div className="p-[3px] flex-1">
            <div
                data-slot="card-content"
                className={cn("p-4 border h-full bg-background dark:bg-accent dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] rounded-xl flex flex-col items-center justify-between", className)}
                {...props}
            />
        </div>
    )
}

function CustomCardFooter({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-footer"
            className={cn("flex items-center pb-2.5 gap-1.5 px-4 [.border-t]:pt-6 text-accent-foreground/70 text-sm justify-between w-full", className)}
            {...props}
        />
    )
}

export {
    CustomCard,
    CustomCardHeader,
    CustomCardFooter,
    CustomCardTitle,
    CustomCardAction,
    CustomCardDescription,
    CustomCardContent,
}
