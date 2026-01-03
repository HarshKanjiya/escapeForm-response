import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Question } from '@/types/common';
import { useState } from 'react';

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

const TextLong = ({ question, value, isLastQuestion, singlePage, isFirstQuestion, onChange, onNextQuestionTrigger, onFormSubmit }: Props) => {
  const [validationError, setValidationError] = useState<string[]>([]);
  const [shouldShake, setShouldShake] = useState<boolean>(false);

  const validateField = (): boolean => {
    setValidationError([]);

    if (question.required && !value) {
      setValidationError(["This question is required"]);
      return true;
    }

    if (value) {
      const errors: string[] = [];

      if (question.metadata?.min && typeof question.metadata.min === 'number' && value.length < question.metadata.min) {
        errors.push(`Minimum ${question.metadata.min} characters required`);
      }

      if (question.metadata?.max && typeof question.metadata.max === 'number' && value.length > question.metadata.max) {
        errors.push(`Maximum ${question.metadata.max} characters allowed`);
      }

      setValidationError(errors);
      return errors.length > 0;
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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange?.(newValue);

    // Validate on change
    if (newValue) {
      const errors: string[] = [];

      if (question.metadata?.min && typeof question.metadata.min === 'number' && newValue.length < question.metadata.min) {
        errors.push(`Minimum ${question.metadata.min} characters required`);
      }

      if (question.metadata?.max && typeof question.metadata.max === 'number' && newValue.length > question.metadata.max) {
        errors.push(`Maximum ${question.metadata.max} characters allowed`);
      }

      setValidationError(errors);
    } else {
      setValidationError([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onNextQuestionTrigger?.(1);
    }
  };

  return (
    <div className='w-full space-y-2'>
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
          <p className="text-md text-muted-foreground italic py-1">
            {question.description}
          </p>
        )}
      </div>

      <div className="space-y-1 relative">
        <Textarea
          id={question.id}
          value={value || ""}
          onChange={handleInputChange}
          placeholder={question.placeholder || "Type your answer here..."}
          required={question.required}
          minLength={question.metadata?.min as number || undefined}
          maxLength={question.metadata?.max as number || undefined}
          className={cn('border resize-none border-muted bg-transparent! shadow-none! py-2 min-h-12 px-0! text-xl! border-x-0 border-t-0 rounded-none border-b! outline-none! active:outline-none! ring-0! border-b-muted-foreground/20 active:border-b-primary transition-[border-color] duration-200 placeholder:text-primary/30', question.metadata?.max ? "md:pr-10" : "", "w-full")}
        ></Textarea>
        <div className='text-xs text-accent-foreground/50'>
          <i><span className='text-accent-foreground'>Shift + Enter</span> to add a new line</i>
        </div>
        {question.metadata?.max && typeof question.metadata.max === 'number' && (
          <div className="flex justify-end absolute max-sm:-bottom-10 sm:top-1/2 -translate-y-1/2">
            <span className={cn(
              "text-sm text-muted-foreground",
              (value || "").length > question.metadata.max * 0.9 && "text-orange-500",
              (value || "").length >= question.metadata.max && "text-destructive"
            )}>
              {(value || "").length} / {question.metadata.max}
            </span>
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

      {question.metadata && (
        <div className="text-xs text-muted-foreground space-y-1 pt-2">
          {question.metadata.min && typeof question.metadata.min === 'number' && (
            <p>Minimum {question.metadata.min} characters required</p>
          )}
          {question.metadata.pattern && (
            <p>Please enter a valid format</p>
          )}
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
  );
}

export default TextLong