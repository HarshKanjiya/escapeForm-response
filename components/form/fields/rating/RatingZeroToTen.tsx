import { Button } from "@/components/ui/button";
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

const RatingZeroToTen = ({ question, value, isLastQuestion, singlePage, isFirstQuestion, onChange, onNextQuestionTrigger, onFormSubmit }: Props) => {
  const [selectedValue, setSelectedValue] = useState<number | undefined>(
    typeof value === 'number' ? value : undefined
  );
  const [validationError, setValidationError] = useState<string[]>([]);
  const [shouldShake, setShouldShake] = useState<boolean>(false);

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

  const validateField = (): boolean => {
    setValidationError([]);

    if (question.required && selectedValue === undefined) {
      setValidationError(["This question is required"]);
      return true;
    }

    return false;
  };

  const onNextClick = () => {
    if (validateField()) {
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 500);
      return;
    }
    onNextQuestionTrigger?.(1);
  };

  const onSubmitClick = () => {
    if (validateField()) {
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 500);
      return;
    }
    onFormSubmit?.();
  };

  return (
    <div className='w-full space-y-2'>
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
        <div className="flex flex-wrap gap-2 justify-between">
          {ratings.map((rating) => {
            const isSelected = selectedValue === rating;
            return (
              <button
                key={rating}
                type="button"
                onClick={() => handleSelect(rating)}
                className={cn(
                  "text-left px-4 py-3 flex-1 flex items-center justify-center rounded-md border transition-all duration-200 aspect-square",
                  isSelected
                    ? "text-white border-primary/30 bg-primary"
                    : "text-primary border-primary/30 bg-primary/10 hover:border-primary/60 hover:bg-primary/20 cursor-pointer"
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

      {validationError.length > 0 && (
        <div className="space-y-1">
          {validationError.map((error, index) => (
            <p key={index} className="text-sm text-destructive mt-1">
              {error}
            </p>
          ))}
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

export default RatingZeroToTen