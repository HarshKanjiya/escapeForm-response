import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const NumberField = ({ question, value, isLastQuestion, singlePage, isFirstQuestion, onChange, onNextQuestionTrigger, onFormSubmit }: Props) => {
  const [answer, setAnswer] = useState<string>(value?.toString() || "");
  const [validationError, setValidationError] = useState<string>("");

  const metadata = question.metadata || {};
  const min = typeof metadata.min === 'number' ? metadata.min : undefined;
  const max = typeof metadata.max === 'number' ? metadata.max : undefined;

  useEffect(() => {
    if (value !== undefined && value !== null) {
      setAnswer(value.toString());
    }
  }, [value]);

  const validateNumber = (val: string): string => {
    if (!val) {
      setValidationError("");
      return "";
    }
    const numValue = parseFloat(val);

    if (isNaN(numValue)) {
      return "Please enter a valid number";
    }

    if (min !== undefined && max !== undefined) {
      if (numValue < min || numValue > max) {
        return `Value must be between ${min} and ${max}`;
      }
    } else if (min !== undefined) {
      if (numValue < min) {
        return `Value must be at least ${min}`;
      }
    } else if (max !== undefined) {
      if (numValue > max) {
        return `Value must be at most ${max}`;
      }
    }

    return "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    // Allow empty, negative sign, decimal point, and numbers
    if (val === '' || val === '-' || /^-?\d*\.?\d*$/.test(val)) {
      setAnswer(val);

      const errorMsg = validateNumber(val);
      setValidationError(errorMsg);

      // Only call onChange with valid complete numbers
      if (val && !errorMsg && val !== '-' && val !== '.' && !val.endsWith('.')) {
        onChange?.(parseFloat(val));
      } else if (!val) {
        onChange?.(undefined);
      }
    }
  };

  const handleBlur = () => {
    // Validate on blur
    if (answer) {
      const errorMsg = validateNumber(answer);
      setValidationError(errorMsg);
    }
  };

  return (
    <div className='w-full space-y-2'>
      <div className="py-2">
        <Label
          htmlFor={question.id}
          className={cn(
            "font-medium text-foreground text-xl",
            question.required && "after:content-['*'] after:text-destructive"
          )}
        >
          {question.title}
        </Label>

        {question.description && (
          <p className="text-md text-muted-foreground italic py-1">
            {question.description}
          </p>
        )}
      </div>

      <div className="space-y-1 relative">
        <div className="relative">
          <Input
            id={question.id}
            type="text"
            inputMode="decimal"
            value={answer}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder={question.placeholder || "Type your answer here..."}
            required={question.required}
            className={cn('border-x-0 border-t-0 rounded-none border-b! bg-transparent! py-6 px-2 text-xl! outline-none! active:outline-none! ring-0! border-b-muted-foreground/20 active:border-b-primary transition-[border-color] duration-200 placeholder:text-primary/30', max || min ? "pr-10" : "", "w-full")}
            aria-invalid={validationError?.length > 0}
          />
          {(max || min) && (
            <div className="flex justify-start absolute right-1 bottom-0 -translate-y-1/2">
              <span className={cn(
                "flex gap-3"
              )}>
                <small className="text-sm text-muted-foreground ">{min !== undefined && `Min: ${min} `}</small> <small className="text-sm text-muted-foreground ">{max !== undefined && `Max: ${max}`}</small>
              </span>
            </div>
          )}
        </div>

        {validationError && (
          <small className="text-sm text-destructive mt-1">
            {validationError}
          </small>
        )}
      </div>

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

export default NumberField