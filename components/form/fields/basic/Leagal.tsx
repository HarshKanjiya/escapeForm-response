import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Question } from '@/types/common';
import { useState, useEffect } from "react";

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: any) => void,
  error?: string[]
}

const Legal = ({ question, value, onChange, error }: Props) => {
  const [selectedValue, setSelectedValue] = useState<boolean | undefined>(
    typeof value === 'boolean' ? value : undefined
  );

  useEffect(() => {
    if (typeof value === 'boolean') {
      setSelectedValue(value);
    }
  }, [value]);

  const handleSelect = (choice: boolean) => {
    setSelectedValue(choice);
    onChange?.(choice);
  };

  const hasError = error && error.length > 0;

  return (
    <div className='w-full space-y-4 p-2 pb-5'>
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
          <p className="text-md text-muted-foreground italic py-1 mt-2">
            {question.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Accept Button */}
        <button
          type="button"
          onClick={() => handleSelect(true)}
          className={cn(
            "p-4 rounded-lg border-2 transition-all duration-200 font-semibold text-lg",
            selectedValue === true
              ? "border-primary bg-primary text-primary-foreground shadow-lg"
              : "border-border bg-background hover:border-primary/50 hover:bg-primary/5 text-foreground"
          )}
        >
          Accept
        </button>

        {/* Reject Button */}
        <button
          type="button"
          onClick={() => handleSelect(false)}
          className={cn(
            "p-4 rounded-lg border-2 transition-all duration-200 font-semibold text-lg",
            selectedValue === false
              ? "border-destructive bg-destructive text-destructive-foreground shadow-lg"
              : "border-border bg-background hover:border-destructive/50 hover:bg-destructive/5 text-foreground"
          )}
        >
          Reject
        </button>
      </div>

      {hasError && (
        <p className="text-sm text-destructive mt-2">
          {error[0]}
        </p>
      )}
    </div>
  )
}

export default Legal