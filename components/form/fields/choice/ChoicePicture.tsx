import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Question } from '@/types/common';
import { useState, useEffect } from "react";
import { CheckCircle2Icon, ImageIcon } from "lucide-react";
import Image from "next/image";
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

const ChoicePicture = ({ question, value, isLastQuestion, singlePage, isFirstQuestion, onChange, onNextQuestionTrigger, onFormSubmit }: Props) => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(value);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [validationError, setValidationError] = useState<string[]>([]);
  const [shouldShake, setShouldShake] = useState<boolean>(false);

  const options = question.options || [];

  useEffect(() => {
    if (value) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleSelect = (optionValue: string) => {
    setSelectedValue(optionValue);
    onChange?.(optionValue);
  };

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
  };

  const validateField = (): boolean => {
    setValidationError([]);

    if (question.required && !selectedValue) {
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

      <div className="grid grid-cols-2 gap-4">
        {options.map((option, index) => {
          const isSelected = selectedValue === option.value;
          const hasImageError = imageErrors.has(index);

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={cn(
                "relative aspect-square rounded-lg border-2 transition-all duration-200 overflow-hidden group",
                isSelected
                  ? "border-primary shadow-lg ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50 hover:shadow-md"
              )}
            >
              {/* Image */}
              <div className="w-full h-full relative bg-muted">
                {!hasImageError && option.value ? (
                  <Image
                    src={option.value}
                    alt={option.label || `Option ${index + 1}`}
                    fill
                    className={cn(
                      "object-cover transition-transform duration-300",
                      isSelected ? "scale-105" : "group-hover:scale-105"
                    )}
                    onError={() => handleImageError(index)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                    <ImageIcon className="w-12 h-12 mb-2" />
                    <span className="text-xs text-center px-2">
                      {option.label || 'No image'}
                    </span>
                  </div>
                )}
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 bg-primary rounded-full p-1 shadow-lg">
                  <CheckCircle2Icon className="w-5 h-5 text-primary-foreground" />
                </div>
              )}

              {/* Label Overlay */}
              {option.label && !hasImageError && (
                <div className={cn(
                  "absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-3 transition-opacity",
                  isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}>
                  <p className="text-white text-sm font-medium truncate">
                    {option.label}
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {options.length === 0 && (
        <p className="text-sm text-muted-foreground italic">
          No image options available
        </p>
      )}

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

export default ChoicePicture