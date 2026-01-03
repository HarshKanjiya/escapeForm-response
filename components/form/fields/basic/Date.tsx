import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datePicker";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Question } from '@/types/common';
import { CircleXIcon } from "lucide-react";
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
  const [validationError, setValidationError] = useState<string[]>([]);
  const [shouldShake, setShouldShake] = useState<boolean>(false);

  const metadata = question.metadata || {};
  const minDate = metadata.min ? new globalThis.Date(metadata.min as string | number) : undefined;
  const maxDate = metadata.max ? new globalThis.Date(metadata.max as string | number) : undefined;

  useEffect(() => {
    if (value) {
      setSelectedDate(new globalThis.Date(value));
      validateDate();
    }
  }, [value]);

  const validateDate = (date?: globalThis.Date | undefined): boolean => {
    setValidationError([]);
    const temp = date || selectedDate;
    if (question?.required && !temp) {
      setValidationError(["This question is required"]);
      return true;
    }

    if (!temp) return false;
    const err = []
    if (minDate && maxDate) {
      if (temp < minDate || temp > maxDate) {
        err.push(`Date must be between ${minDate.toLocaleDateString()} and ${maxDate.toLocaleDateString()}`);
      }
    } else if (minDate) {
      if (temp < minDate) {
        err.push(`Date must be on or after ${minDate.toLocaleDateString()}`);
      }
    } else if (maxDate) {
      if (temp > maxDate) {
        err.push(`Date must be on or before ${maxDate.toLocaleDateString()}`);
      }
    }
    setValidationError(err);
    return err.length > 0;
  };

  const handleDateChange = (date: globalThis.Date | undefined) => {
    if (validateDate(date)) return;
    setSelectedDate(date);
    onChange?.(date || null);
  };

  const onNextClick = () => {
    if (validateDate()) {
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 500);
      return;
    }
    onNextQuestionTrigger?.(1);
  }

  const onSubmitClick = () => {
    if (validateDate()) {
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 500);
      return;
    }
    onFormSubmit?.();
  }

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
        <div className="w-full relative">
          {
            selectedDate && <Button size="icon" className="absolute -right-1.5 bottom-2 rounded-full bg-accent-bg" variant="ghost" onClick={() => handleDateChange(undefined)}>
              <CircleXIcon className="text-muted-foreground" />
            </Button>
          }
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
              'border-x-0 border-t-0 rounded-none border-b! bg-transparent! py-6 px-1! text-xl! outline-none! active:outline-none! ring-0! border-b-muted-foreground/20 active:border-b-primary transition-[border-color] duration-200 placeholder:text-primary/30 active:scale-none',
              metadata.max ? "pr-10" : "", "w-full",
              singlePage ? "text-lg!" : "text-xl"
            )}
          />
        </div>
      </div>

      {(minDate || maxDate) && (
        <div className="text-xs text-muted-foreground space-y-1">
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

      {validationError?.map((error, index) => (
        <small key={index} className="text-destructive mt-1">
          {error}
        </small>
      ))}

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
            <Button size="xl" onClick={onSubmitClick} className={cn(shouldShake && "animate-shake")}>
              Submit
            </Button> :
            <Button size="xl" onClick={onNextClick} className={cn(shouldShake && "animate-shake")}>
              Next
            </Button>
        }
      </div>
    </div>
  )
}

export default DateField