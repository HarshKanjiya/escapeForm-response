import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Question } from '@/types/common';
import { CheckCircle2Icon, CircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: any) => void,
  error?: string[]
}

const ChoiceSingle = ({ question, value, onChange, error }: Props) => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(value);

  const choices = question.options?.map(opt => opt.label) || [];

  useEffect(() => {
    if (value) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleSelect = (choice: string) => {
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

      <div className="space-y-2">
        {choices.map((choice, index) => {
          const isSelected = selectedValue === choice;

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(choice)}
              className={cn(
                "w-full p-4 rounded-lg border-2 transition-all duration-200 text-left flex items-center gap-3 group",
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              )}
            >
              <div className="shrink-0">
                {isSelected ? (
                  <CheckCircle2Icon className="w-5 h-5 text-primary" />
                ) : (
                  <CircleIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary/50 transition-colors" />
                )}
              </div>

              <span className={cn(
                "font-medium flex-1",
                isSelected ? "text-primary" : "text-foreground"
              )}>
                {choice}
              </span>
            </button>
          );
        })}
      </div>

      {choices.length === 0 && (
        <p className="text-sm text-muted-foreground italic">
          No choices available
        </p>
      )}

      {hasError && (
        <p className="text-sm text-destructive mt-2">
          {error[0]}
        </p>
      )}
    </div>
  )
}

export default ChoiceSingle