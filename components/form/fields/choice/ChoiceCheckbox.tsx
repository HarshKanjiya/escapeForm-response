import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Question } from '@/types/common'
import { useEffect, useState } from 'react';

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: any) => void,
  error?: string[],
  singlePage?: boolean
}

const ChoiceCheckbox = ({ question, value, onChange, error, singlePage }: Props) => {

  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    Array.isArray(value) ? value : []
  );

  const options = question.options?.filter((i) => i.label?.trim().length) || [];
  const metadata = question.metadata || {};
  const minSelections = typeof metadata.min === 'number' ? metadata.min : undefined;
  const maxSelections = typeof metadata.max === 'number' ? metadata.max : undefined;

  // Update internal state when external value changes
  useEffect(() => {
    if (Array.isArray(value)) {
      setSelectedOptions(value);
    }
  }, [value]);

  const handleOptionChange = (optionValue: string, checked: boolean) => {
    let newSelectedOptions: string[];

    if (checked) {
      // Check max limit before adding
      if (maxSelections && selectedOptions.length >= maxSelections) {
        return;
      }
      newSelectedOptions = [...selectedOptions, optionValue];
    } else {
      newSelectedOptions = selectedOptions.filter(item => item !== optionValue);
    }

    setSelectedOptions(newSelectedOptions);
    onChange?.(newSelectedOptions);
  };

  const hasError = error && error.length > 0;

  return (
    <div className="w-full space-y-4 p-2 pb-5">
      <div className="py-2">
        <Label
          className={cn(
            "font-medium text-foreground text-xl",
            question.required && "after:content-['*'] after:text-destructive",
            singlePage ? "text-lg" : "text-xl"
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
        {options.length > 0 ? (
          options.map((option, index) => {
            const isChecked = selectedOptions.includes(option.value);
            const isMaxReached = maxSelections ? selectedOptions.length >= maxSelections : false;
            const isDisabled = !isChecked && isMaxReached;

            return (
              <div
                key={index}
                className={cn(
                  "flex items-center space-x-4 pl-4 rounded-lg border transition-all duration-200",
                  isChecked
                    ? "border-primary/50 bg-primary/5"
                    : isDisabled
                      ? "border-border/40 bg-muted/50 opacity-60"
                      : "border-border/40 hover:border-border/60 hover:bg-accent/5"
                )}
              >
                <Checkbox
                  id={`${question.id}-${index}`}
                  checked={isChecked}
                  disabled={isDisabled}
                  onCheckedChange={(checked) =>
                    handleOptionChange(option.value, checked === true)
                  }
                  className="shrink-0"
                />
                <Label
                  htmlFor={`${question.id}-${index}`}
                  className={cn(
                    "text-sm font-medium py-3 cursor-pointer flex-1 leading-relaxed",
                    isDisabled ? "cursor-not-allowed text-muted-foreground" : "text-foreground"
                  )}
                >
                  {option.label}
                </Label>
              </div>
            );
          })
        ) : (
          <div className="text-sm text-muted-foreground italic p-4 text-center border border-dashed border-border/40 rounded-lg">
            No options available
          </div>
        )}
      </div>

      {/* Selected count indicator */}
      {selectedOptions.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
          <span className="font-medium text-foreground">{selectedOptions.length}</span>
          <span>option{selectedOptions.length !== 1 ? 's' : ''} selected</span>
        </div>
      )}

      {/* Error display */}
      {hasError && (
        <p className="text-sm text-destructive mt-2">
          {error[0]}
        </p>
      )}
    </div>
  );
}

export default ChoiceCheckbox