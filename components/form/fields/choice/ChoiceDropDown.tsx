import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Question } from '@/types/common';
import { useState, useEffect } from "react";

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

const ChoiceDropDown = ({ question, value, isLastQuestion, singlePage, isFirstQuestion, onChange, onNextQuestionTrigger, onFormSubmit }: Props) => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(value);
  const [validationError, setValidationError] = useState<string[]>([]);
  const [shouldShake, setShouldShake] = useState<boolean>(false);

  const options = question.options?.filter((i) => i.label?.trim().length) || [];

  useEffect(() => {
    if (value) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue);
    onChange?.(newValue);
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

      <Select value={selectedValue} onValueChange={handleValueChange}>
        <SelectTrigger
          className={cn(
            "border-x-0 border-t-0 rounded-none border-b! bg-transparent! py-6 text-xl! outline-none! active:outline-none! ring-0! border-b-muted-foreground/20 active:border-b-primary transition-[border-color] duration-200 placeholder:text-primary/30 w-full shadow-none px-0 pr-2",
          )}
        >
          <SelectValue placeholder={question.placeholder || "Select an option..."} />
        </SelectTrigger>
        <SelectContent>
          {options.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No options available
            </div>
          ) : (
            options.map((option, index) => (
              <SelectItem
                key={index}
                value={option.value}
                className={cn('cursor-pointer py-3 px-3!', selectedValue === option.value && 'bg-primary/10!')}
              >
                {option.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

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

export default ChoiceDropDown