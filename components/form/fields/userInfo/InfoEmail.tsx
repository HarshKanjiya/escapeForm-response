import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Question } from '@/types/common';
import { useState, useEffect } from "react";
import { MailIcon } from "lucide-react";

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: any) => void,
  error?: string[]
}

const InfoEmail = ({ question, value, onChange, error }: Props) => {
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

  const hasError = validationError || (error && error.length > 0);

  return (
    <div className='w-full space-y-2 p-2 pb-5'>
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
            placeholder={question.placeholder || "example@email.com"}
            required={question.required}
            className={cn(
              'border border-muted bg-white! py-6 pl-11 pr-4 text-lg w-full',
              hasError && 'border-destructive'
            )}
          />
        </div>
      </div>

      {validationError && (
        <p className="text-sm text-destructive mt-1">
          {validationError}
        </p>
      )}

      {error && error.length > 0 && !validationError && (
        <p className="text-sm text-destructive mt-1">
          {error[0]}
        </p>
      )}

      {!hasError && (
        <div className="text-xs text-muted-foreground pt-2">
          <p>Enter a valid email address (e.g., user@example.com)</p>
        </div>
      )}
    </div>
  )
}

export default InfoEmail