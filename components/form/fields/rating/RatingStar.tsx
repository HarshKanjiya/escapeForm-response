import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Question } from '@/types/common';
import { useState, useEffect } from "react";
import { StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: any) => void,
  error?: string[]
}

const RatingStar = ({ question, value, onChange, error }: Props) => {
  const [selectedValue, setSelectedValue] = useState<number | undefined>(
    typeof value === 'number' ? value : undefined
  );
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const metadata = question.metadata || {};
  const starCount = typeof metadata.starCount === 'number' ? metadata.starCount : 5;

  // Generate array of star indices
  const stars = Array.from({ length: starCount }, (_, i) => i + 1);

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
        <div
          className="flex gap-2 items-center"
          onMouseLeave={() => setHoverValue(null)}
        >
          {stars.map((star) => {
            const isFilled = hoverValue !== null ? star <= hoverValue : selectedValue !== undefined && star <= selectedValue;

            return (
              <Button
                variant={'ghost'}
                key={star}
                type="button"
                onClick={() => handleSelect(star)}
                onMouseEnter={() => setHoverValue(star)}
                className="rounded-full aspect-square! h-12"
              >
                <StarIcon
                  className={cn(
                    "h-6! w-6! transition-all duration-200",
                    isFilled
                      ? "fill-primary text-primary"
                      : "fill-none text-muted-foreground hover:text-primary"
                  )}
                />
              </Button>
            );
          })}
        </div>

        {selectedValue !== undefined && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              {selectedValue} out of {starCount} star{starCount !== 1 ? 's' : ''}
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedValue(undefined);
                onChange?.(undefined);
              }}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {hasError && (
        <p className="text-sm text-destructive mt-2">
          {error[0]}
        </p>
      )}
    </div>
  )
}

export default RatingStar