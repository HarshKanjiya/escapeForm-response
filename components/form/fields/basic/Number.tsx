import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Question } from '@/types/common';
import { useState, useEffect } from "react";

interface Props {
  question: Question,
  value?: any,
  error?: string[],
  singlePage?: boolean
  onChange?: (value: any) => void,
  onError?: (errors: string[]) => void,
  onNextQuestionTrigger?: () => void
}

const Number = ({ question, value, onChange, error }: Props) => {
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

  const hasError = validationError || (error && error.length > 0);

  return (
    <div className='w-full space-y-2 p-2 pb-5'>
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

      <div className="space-y-1">
        <Input
          id={question.id}
          type="text"
          inputMode="decimal"
          value={answer}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder={question.placeholder || "Type your answer here..."}
          required={question.required}
          className={cn(
            'border border-muted bg-white! py-6 px-4 text-xl w-full',
            hasError && 'border-destructive focus-visible:ring-destructive'
          )}
          aria-invalid={!!hasError}
        />

        {validationError && (
          <p className="text-sm text-destructive mt-1">
            {validationError}
          </p>
        )}

        {error && error.length > 0 && !validationError && (
          <p className="text-sm text-destructive mt-1">
            {error[0]}
          </p>
        )}
      </div>

      {(min !== undefined || max !== undefined) && (
        <div className="text-xs text-muted-foreground space-y-1 pt-2">
          {min !== undefined && max !== undefined && (
            <p>Value must be between {min} and {max}</p>
          )}
          {min !== undefined && max === undefined && (
            <p>Minimum value: {min}</p>
          )}
          {max !== undefined && min === undefined && (
            <p>Maximum value: {max}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Number