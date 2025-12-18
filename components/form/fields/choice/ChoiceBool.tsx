import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Question } from '@/types/common';
import { useState, useEffect } from "react";
import { CheckCircle2Icon, CircleIcon } from "lucide-react";

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: any) => void,
  error?: string[]
}

const ChoiceBool = ({ question, value, onChange, error }: Props) => {
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

      <div className="grid grid-cols-2 gap-3">
        {/* Yes Option */}
        <button
          type="button"
          onClick={() => handleSelect(true)}
          className={cn(
            "p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 group",
            selectedValue === true
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          )}
        >
          <div className="shrink-0">
            {selectedValue === true ? (
              <CheckCircle2Icon className="w-6 h-6 text-primary" />
            ) : (
              <CircleIcon className="w-6 h-6 text-muted-foreground group-hover:text-primary/50 transition-colors" />
            )}
          </div>

          <span className={cn(
            "font-medium text-lg",
            selectedValue === true ? "text-primary" : "text-foreground"
          )}>
            Yes
          </span>
        </button>

        {/* No Option */}
        <button
          type="button"
          onClick={() => handleSelect(false)}
          className={cn(
            "p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 group",
            selectedValue === false
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          )}
        >
          <div className="shrink-0">
            {selectedValue === false ? (
              <CheckCircle2Icon className="w-6 h-6 text-primary" />
            ) : (
              <CircleIcon className="w-6 h-6 text-muted-foreground group-hover:text-primary/50 transition-colors" />
            )}
          </div>

          <span className={cn(
            "font-medium text-lg",
            selectedValue === false ? "text-primary" : "text-foreground"
          )}>
            No
          </span>
        </button>
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