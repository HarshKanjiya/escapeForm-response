"use client"

import { format } from "date-fns"
import { CalendarIcon, ChevronDownIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface DatePickerProps {
    value?: Date
    onChange?: (date: Date | undefined) => void
    placeholder?: string
    dateFormat?: string
    disabled?: boolean
    className?: string
    minDate?: Date
    maxDate?: Date
}

export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
    (
        {
            value,
            onChange,
            placeholder = "Select Date",
            dateFormat = "MM/dd/yyyy",
            disabled = false,
            className,
            minDate,
            maxDate,
            ...props
        },
        ref
    ) => {
        const [open, setOpen] = React.useState(false)
        const [internalDate, setInternalDate] = React.useState<Date | undefined>(value)

        // Sync internal state with external value
        React.useEffect(() => {
            setInternalDate(value)
        }, [value])

        const handleDateSelect = (selectedDate: Date | undefined) => {
            setInternalDate(selectedDate)
            onChange?.(selectedDate)
            setOpen(false)
        }

        const formatDisplayDate = (date: Date | undefined) => {
            if (!date) return placeholder
            try {
                return format(date, dateFormat)
            } catch {
                return date.toLocaleDateString()
            }
        }

        return (
            <div className={cn("flex flex-col gap-2", className)}>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            ref={ref}
                            variant="outline"
                            disabled={disabled}
                            className="justify-between font-normal"
                            {...props}
                        >
                            <span className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4" />
                                {formatDisplayDate(internalDate)}
                            </span>
                            <ChevronDownIcon className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                    >
                        <Calendar
                            mode="single"
                            selected={internalDate}
                            onSelect={handleDateSelect}
                            disabled={(date) => {
                                if (disabled) return true
                                if (minDate && date < minDate) return true
                                if (maxDate && date > maxDate) return true
                                return false
                            }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
        )
    }
)

DatePicker.displayName = "DatePicker"

// Convenience component for controlled usage
export const ControlledDatePicker: React.FC<Omit<DatePickerProps, 'value' | 'onChange'> & { defaultValue?: Date }> = ({
    defaultValue,
    ...props
}) => {
    const [date, setDate] = React.useState<Date | undefined>(defaultValue)

    return (
        <DatePicker
            value={date}
            onChange={setDate}
            {...props}
        />
    )
}
