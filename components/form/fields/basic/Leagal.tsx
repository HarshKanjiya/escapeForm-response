import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Question } from '@/types/common';
import { useState, useEffect } from "react";

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: any) => void,
  error?: string[],
  singlePage?: boolean
}

const Legal = ({ question, value, onChange, error }: Props) => {
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

      <div className="flex flex-col gap-2">
        <Button type="button" variant="ghost" className={cn(
          "bg-primary-50 justify-start border-primary-50 border-l-4 rounded-sm px-6 h-12 active:scale-100 hover:bg-primary/10 transition-[border,background] duration-300",
          selectedValue === true && "border-primary bg-primary/10"
        )}
          onClick={() => handleSelect(true)}>
          <p>Accept</p>
        </Button>
        <Button type="button" variant="ghost" className={cn(
          "bg-primary-50 justify-start border-primary-50 border-l-4 rounded-sm px-6 h-12 active:scale-100 hover:bg-primary/10 transition-[border,background] duration-300",
          selectedValue === false && "border-primary bg-primary/10"
        )}
          onClick={() => handleSelect(false)}>
          <p>Reject</p>
        </Button>
      </div>


      {hasError && (
        <p className="text-sm text-destructive mt-2">
          {error[0]}
        </p>
      )}
    </div>
  )
}

export default Legal