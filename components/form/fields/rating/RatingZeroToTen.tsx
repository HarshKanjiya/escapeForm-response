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

const RatingZeroToTen = ({ question, value, onChange, error }: Props) => {
  const [selectedValue, setSelectedValue] = useState<number | undefined>(
    typeof value === 'number' ? value : undefined
  );

  const metadata = question.metadata || {};
  const min = typeof metadata.min === 'number' ? metadata.min : 0;
  const max = typeof metadata.max === 'number' ? metadata.max : 10;

  // Generate array of numbers from min to max
  const ratings = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  useEffect(() => {
    if (typeof value === 'number') {
      setSelectedValue(value);
    }
  }, [value]);

  const handleSelect = (rating: number) => {
    setSelectedValue(rating);
    onChange?.(rating);
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

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {ratings.map((rating) => {
            const isSelected = selectedValue === rating;

            return (
              <button
                key={rating}
                type="button"
                onClick={() => handleSelect(rating)}
                className={cn(
                  "min-w-[3rem] h-12 px-4 rounded-lg border-2 transition-all duration-200 font-semibold text-lg",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-md scale-105"
                    : "border-border bg-background hover:border-primary/50 hover:bg-primary/5 hover:scale-105"
                )}
              >
                {rating}
              </button>
            );
          })}
        </div>

        <div className="flex justify-between text-sm text-muted-foreground pt-2">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>

      {hasError && (
        <p className="text-sm text-destructive mt-2">
          {error[0]}
        </p>
      )}
    </div>
  )
}

export default RatingZeroToTen