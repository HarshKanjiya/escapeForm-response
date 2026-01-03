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
  const [validationError, setValidationError] = useState<string[]>([]);
  const [shouldShake, setShouldShake] = useState<boolean>(false);

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

  const handleStarClick = (star: number, isLeftHalf: boolean) => {
    const rating = isLeftHalf ? star - 0.5 : star;
    handleSelect(rating);
  };

  const handleStarHover = (star: number, isLeftHalf: boolean) => {
    const rating = isLeftHalf ? star - 0.5 : star;
    setHoverValue(rating);
  };

  const getStarFillState = (star: number) => {
    const currentValue = hoverValue !== null ? hoverValue : selectedValue;
    if (currentValue === undefined) return 'empty';

    if (star <= Math.floor(currentValue)) return 'full';
    if (star - 0.5 === currentValue) return 'half';
    return 'empty';
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
        <div
          className="flex gap-2 items-center"
          onMouseLeave={() => setHoverValue(null)}
        >
          {stars.map((star) => {
            const fillState = getStarFillState(star);

            return (
              <div
                key={star}
                className="relative"
              >
                <Button
                  variant={'ghost'}
                  type="button"
                  className="rounded-full aspect-square! h-12 p-0 relative flex items-center justify-center"
                >
                  {/* Left half - for 0.5 rating */}
                  <div
                    className="absolute left-0 top-0 w-1/2 h-full z-10"
                    onClick={() => handleStarClick(star, true)}
                    onMouseEnter={() => handleStarHover(star, true)}
                  />

                  {/* Right half - for full rating */}
                  <div
                    className="absolute right-0 top-0 w-1/2 h-full z-10"
                    onClick={() => handleStarClick(star, false)}
                    onMouseEnter={() => handleStarHover(star, false)}
                  />

                  {/* Star icon background */}
                  <StarIcon
                    className={cn(
                      "h-6! w-6! transition-all duration-200 pointer-events-none relative z-0",
                      fillState === 'empty' && "fill-none text-primary/50",
                      fillState === 'full' && "fill-primary text-primary",
                      fillState === 'half' && "fill-none text-primary"
                    )}
                  />

                  {/* Half-star overlay - filled 50% */}
                  {fillState === 'half' && (
                    <div
                      className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center"
                      style={{ clipPath: 'inset(0 50% 0 0)' }}
                    >
                      <StarIcon className="h-6 w-6 scale-125 fill-primary text-primary" />
                    </div>
                  )}
                </Button>
              </div>
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

export default RatingStar