import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Question } from '@/types/common';
import { useState, useEffect } from "react";
import { CheckCircle2Icon, CircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Props {
  question: Question,
  value?: any,
  error?: string[],
  singlePage?: boolean
  onChange?: (value: any) => void,
  onError?: (errors: string[]) => void,
  onNextQuestionTrigger?: () => void
}

const ChoiceBool = ({ question, value, onChange, error, singlePage }: Props) => {
  const [selectedValue, setSelectedValue] = useState<boolean | undefined>(
    typeof value === 'boolean' ? value : undefined
  );

  useEffect(() => {
    if (typeof value === 'boolean') {
      setSelectedValue(value);
    }
  }, [value]);

  const handleSelect = (choice: boolean) => {
    setSelectedValue(choice);
    onChange?.(choice);
  };

  const hasError = error && error.length > 0;

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

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => handleSelect(true)}
          className={cn(
            "w-full text-left px-4 py-3 rounded-lg border transition-all duration-200",
            selectedValue === true
              ? "border-primary/50 bg-primary/5"
              : "border-border/40 hover:border-border/60 hover:bg-accent/5 cursor-pointer"
          )}
        >Yes</button>
        <button
          type="button"
          onClick={() => handleSelect(false)}
          className={cn(
            "w-full text-left px-4 py-3 rounded-lg border transition-all duration-200",
            selectedValue === false
              ? "border-primary/50 bg-primary/5"
              : "border-border/40 hover:border-border/60 hover:bg-accent/5 cursor-pointer"
          )}
        >No</button>
      </div>

      {hasError && (
        <p className="text-sm text-destructive mt-2">
          {error[0]}
        </p>
      )}
    </div>
  )
}

export default ChoiceBool