import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Question } from '@/types/common';
import { useState, useEffect } from "react";
import { MailIcon } from "lucide-react";
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

const InfoEmail = ({ question, value, isLastQuestion, singlePage, isFirstQuestion, onChange, onNextQuestionTrigger, onFormSubmit }: Props) => {
  const [answer, setAnswer] = useState(value || "");
  const [validationError, setValidationError] = useState<string>("");

  useEffect(() => {
    if (value) {
      setAnswer(value);
    }
  }, [value]);

  const validateEmail = (email: string): string => {
    if (!email) {
      setValidationError("");
      return "";
    }

    // Email validation regex
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(email)) {
      return "Please enter a valid email address";
    }

    return "";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onNextQuestionTrigger?.(1);
    }
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setAnswer(newValue);

    const errorMsg = validateEmail(newValue);
    setValidationError(errorMsg);

    // Only call onChange if valid or empty
    if (!errorMsg) {
      onChange?.(newValue);
    }
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

      <div className="space-y-1 relative">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <MailIcon className="w-5 h-5" />
          </div>
          <Input
            id={question.id}
            type="email"
            value={answer}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={question.placeholder || "example@email.com"}
            required={question.required}
            className={cn('border-x-0 border-t-0 rounded-none border-b! bg-transparent! py-6 px-0 pl-12 text-xl! outline-none! active:outline-none! ring-0! border-b-muted-foreground/20 active:border-b-primary transition-[border-color] duration-200 placeholder:text-primary/30')}
          />
        </div>
      </div>

      {validationError && (
        <small className="text-destructive mt-1">
          {validationError}
        </small>
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

export default InfoEmail