"use client"

import * as SelectPrimitive from "@radix-ui/react-select"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import * as React from "react";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { createPortal } from "react-dom";

export interface MultiSelectOption<T = Record<string, string | number | boolean | null | undefined>> {
  label: string; // display label (used as fallback)
  value: string;
  // optional arbitrary data bag for custom renderers
  meta?: T;
}

interface MultiSelectProps<T = Record<string, string | number | boolean | null | undefined>> {
  options: MultiSelectOption<T>[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
  /** custom renderer for each option inside the dropdown list */
  renderOption?: (option: MultiSelectOption<T>, selected: boolean) => React.ReactNode;
  /** custom renderer for trigger value summary */
  renderTriggerValue?: (selected: MultiSelectOption<T>[]) => React.ReactNode;
  /** button variant passthrough */
  triggerVariant?: React.ComponentProps<typeof Button>["variant"];
  /** button size passthrough */
  triggerSize?: React.ComponentProps<typeof Button>["size"];
}

export const MultiSelect = <T = Record<string, string | number | boolean | null | undefined>>({
  options,
  value,
  onChange,
  placeholder = "Select options",
  className,
  triggerClassName,
  contentClassName,
  disabled = false,
  renderOption,
  renderTriggerValue,
  triggerVariant = "secondary",
  triggerSize,
}: MultiSelectProps<T>) => {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleSelect = (optionValue: string, e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
    // Keep dropdown open after selection
    setOpen(true);
  };

  const selectedOptions = React.useMemo(
    () => options.filter(o => value.includes(o.value)),
    [options, value]
  );

  return (
    <div className={cn("relative w-full", className)}>
      <Button
        type="button"
        variant={triggerVariant}
        size={triggerSize}
        ref={triggerRef}
        className={cn(
          "w-full flex items-center justify-between",
          triggerClassName,
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex text-muted-foreground flex-wrap gap-1 min-h-[1.5rem] items-center line-clamp-1 text-ellipsis overflow-hidden">
          {selectedOptions.length === 0 ? (
            <span>{placeholder}</span>
          ) : renderTriggerValue ? (
            renderTriggerValue(selectedOptions)
          ) : selectedOptions.length > 3 ? (
            `${selectedOptions.length} items selected`
          ) : (
            selectedOptions.map(o => o.label).join(", ")
          )}
        </span>
        <ChevronDownIcon className="size-4 opacity-50 ml-2" />
      </Button>
      {open && typeof window !== 'undefined' && React.createElement(
        React.Fragment,
        null,
        createPortal(
          <div
            className={cn(
              "fixed left-0 z-[9999] mt-2 min-w-[200px] rounded-md border bg-popover text-popover-foreground shadow-md max-h-60 overflow-y-auto animate-in fade-in-0 zoom-in-95",
              contentClassName
            )}
            style={(() => {
              if (!triggerRef.current) return {};
              const rect = triggerRef.current.getBoundingClientRect();
              return {
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
              };
            })()}
            tabIndex={-1}
            role="listbox"
            onMouseDown={e => {
              e.stopPropagation();
            }}
          >
            {options.map((option) => {
              const selected = value.includes(option.value);
              return (
                <div
                  key={option.value}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 cursor-pointer select-none text-sm hover:bg-accent focus:bg-accent",
                    selected && "bg-accent/30 text-accent-foreground"
                  )}
                  role="option"
                  aria-selected={selected}
                  tabIndex={0}
                  onClick={(e) => handleSelect(option.value, e)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleSelect(option.value, e);
                    }
                  }}
                >
                  {renderOption ? (
                    renderOption(option, selected)
                  ) : (
                    <>
                      <span className="flex-1">{option.label}</span>
                      {selected && <CheckIcon className="size-4 text-primary" />}
                    </>
                  )}
                </div>
              );
            })}
          </div>,
          document.body
        )
      )}
    </div>
  );
};


function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
          position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
