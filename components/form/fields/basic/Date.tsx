import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datePicker";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Question } from '@/types/common';
import { useEffect, useState } from "react";

interface Props {
  question: Question,
  value?: any,
  singlePage?: boolean
  isFirstQuestion?: boolean,
  isLastQuestion?: boolean,
  onChange?: (value: any) => void,
  onNextQuestionTrigger?: (dir: 1 | -1) => void,
  onFormSubmit?: () => void
}

const DateField = ({ question, value, isLastQuestion, singlePage, isFirstQuestion, onChange, onNextQuestionTrigger, onFormSubmit }: Props) => {
  const [selectedDate, setSelectedDate] = useState<globalThis.Date | undefined>(
    value ? new globalThis.Date(value) : undefined
  );
  const [validationError, setValidationError] = useState<string>("");

  const metadata = question.metadata || {};
  const minDate = metadata.min ? new globalThis.Date(metadata.min as string | number) : undefined;
  const maxDate = metadata.max ? new globalThis.Date(metadata.max as string | number) : undefined;

  useEffect(() => {
    if (value) {
      setSelectedDate(new globalThis.Date(value));
    }
  }, [value]);

  const validateDate = (date: globalThis.Date | undefined): string => {
    if (!date) {
      setValidationError("");
      return "";
    }

    if (minDate && maxDate) {
      if (date < minDate || date > maxDate) {
        return `Date must be between ${minDate.toLocaleDateString()} and ${maxDate.toLocaleDateString()}`;
      }
    } else if (minDate) {
      if (date < minDate) {
        return `Date must be on or after ${minDate.toLocaleDateString()}`;
      }
    } else if (maxDate) {
      if (date > maxDate) {
        return `Date must be on or before ${maxDate.toLocaleDateString()}`;
      }
    }

    return "";
  };

  const handleDateChange = (date: globalThis.Date | undefined) => {
    setSelectedDate(date);

    const errorMsg = validateDate(date);
    setValidationError(errorMsg);

    // Only call onChange if valid or undefined
    if (!errorMsg) {
      onChange?.(date?.toISOString());
    }
  };

  return (
    <div className='w-full space-y-2'>
      <div className="py-2">
        <Label
          htmlFor={question.id}
          className={cn(
            "font-medium text-foreground",
            question.required && "after:content-['*'] after:text-destructive",
            singlePage ? "text-lg" : "text-xl"
          )}
        >
          {question.title}
        </Label>

        {question.description && (
          <p
            className={cn(
              "text-muted-foreground italic py-1",
              singlePage ? "text-lg" : "text-xl"
            )}
          >
            {question.description}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <DatePicker
          value={selectedDate}
          onChange={handleDateChange}
          placeholder={question.placeholder || "Select a date"}
          minDate={minDate}
          maxDate={maxDate}
          className={cn(
            validationError && 'border-destructive',
            singlePage ? "text-lg!" : "text-xl"
          )}
          triggerClass={cn(
            'border-x-0 border-t-0 rounded-none border-b! bg-transparent! py-6 px-2 text-xl! outline-none! active:outline-none! ring-0! border-b-muted-foreground/20 active:border-b-primary transition-[border-color] duration-200 placeholder:text-primary/30 active:scale-none',
            metadata.max ? "pr-10" : "", "w-full",
            singlePage ? "text-lg!" : "text-xl"
          )}
        />

        {validationError && (
          <p className="text-sm text-destructive mt-1">
            {validationError}
          </p>
        )}

      </div>

      {(minDate || maxDate) && (
        <div className="text-xs text-muted-foreground space-y-1 pt-2">
          {minDate && maxDate && (
            <p>Date must be between {minDate.toLocaleDateString()} and {maxDate.toLocaleDateString()}</p>
          )}
          {minDate && !maxDate && (
            <p>Minimum date: {minDate.toLocaleDateString()}</p>
          )}
          {maxDate && !minDate && (
            <p>Maximum date: {maxDate.toLocaleDateString()}</p>
          )}
        </div>
      )}

      <div className="flex w-full items-center justify-end pt-12 gap-4">
        {
          !isFirstQuestion && (
            <Button size="xl" variant="secondary" className="border border-border/40" onClick={() => onNextQuestionTrigger?.(-1)}>
              Back
            </Button>
          )
        }
        {
          isLastQuestion ?
            <Button size="xl" onClick={() => onFormSubmit?.()}>
              Submit
            </Button> :
            <Button size="xl" onClick={() => onNextQuestionTrigger?.(1)}>
              Next
            </Button>
        }
      </div>
    </div>
  )
}

export default DateField