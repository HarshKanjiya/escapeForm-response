import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Question } from '@/types/common';
import { useState, useEffect } from "react";
import { StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const RatingStar = ({ question, value, isLastQuestion, singlePage, isFirstQuestion, onChange, onNextQuestionTrigger, onFormSubmit }: Props) => {
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


  return (
    <div className='w-full space-y-4 p-2 pb-5'>
      <div className="py-2">
        <Label
          htmlFor={question.id}
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

export default RatingStar