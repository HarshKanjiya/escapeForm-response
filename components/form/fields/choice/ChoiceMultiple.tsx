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

const ChoiceMultiple = ({ question, value, onChange, error }: Props) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(
    Array.isArray(value) ? value : []
  );

  const options = question.options || [];
  const metadata = question.metadata || {};
  const minSelections = typeof metadata.min === 'number' ? metadata.min : undefined;
  const maxSelections = typeof metadata.max === 'number' ? metadata.max : undefined;

  useEffect(() => {
    if (Array.isArray(value)) {
      setSelectedValues(value);
    }
  }, [value]);

  const handleToggle = (optionValue: string) => {
    let newValues: string[];

    if (selectedValues.includes(optionValue)) {
      // Deselect
      newValues = selectedValues.filter(v => v !== optionValue);
    } else {
      // Select
      if (maxSelections && selectedValues.length >= maxSelections) {
        // Already at max selections, don't add more
        return;
      }
      newValues = [...selectedValues, optionValue];
    }

    setSelectedValues(newValues);
    onChange?.(newValues);
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

        {(minSelections || maxSelections) && (
          <p className="text-sm text-muted-foreground mt-2">
            {minSelections && maxSelections
              ? `Select between ${minSelections} and ${maxSelections} options`
              : minSelections
                ? `Select at least ${minSelections} option${minSelections > 1 ? 's' : ''}`
                : maxSelections
                  ? `Select up to ${maxSelections} option${maxSelections > 1 ? 's' : ''}`
                  : null}
          </p>
        )}
      </div>

      <div className="space-y-3">
        {options.map((option, index) => {
          const isSelected = selectedValues.includes(option.value);
          const isMaxReached = maxSelections ? selectedValues.length >= maxSelections : false;
          const isDisabled = !isSelected && isMaxReached;

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleToggle(option.value)}
              disabled={isDisabled}
              className={cn(
                "w-full text-left px-4 py-3 rounded-lg border transition-all duration-200",
                isSelected
                  ? "border-primary/50 bg-primary/5"
                  : isDisabled
                    ? "border-border/40 bg-muted/50 opacity-60 cursor-not-allowed"
                    : "border-border/40 hover:border-border/60 hover:bg-accent/5 cursor-pointer"
              )}
            >
              <span
                className={cn(
                  "text-sm font-medium leading-relaxed",
                  isDisabled ? "text-muted-foreground" : "text-foreground"
                )}
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      {selectedValues.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
          <span className="font-medium text-foreground">{selectedValues.length}</span>
          <span>option{selectedValues.length !== 1 ? 's' : ''} selected</span>
        </div>
      )}

      {options.length === 0 && (
        <div className="text-sm text-muted-foreground italic p-4 text-center border border-dashed border-border/40 rounded-lg">
          No options available
        </div>
      )}

      {hasError && (
        <p className="text-sm text-destructive mt-2">
          {error[0]}
        </p>
      )}
    </div>
  )
}

export default ChoiceMultiple