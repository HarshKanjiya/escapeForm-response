import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

const RatingRank = ({ question, value, onChange, error, singlePage }: Props) => {
  const [selectedValue, setSelectedValue] = useState<string>("");

  // Generate options from 1 to 10
  const options = Array.from({ length: 10 }, (_, i) => (i + 1).toString());

  useEffect(() => {
    if (value) {
      setSelectedValue(value.toString());
    }
  }, [value]);

  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue);
    onChange?.(parseInt(newValue));
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

      <div className="space-y-3">
        <Select value={selectedValue} onValueChange={handleValueChange}>
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder="Select a rating..." />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasError && (
        <p className="text-sm text-destructive mt-2">
          {error[0]}
        </p>
      )}
    </div>
  )
}

export default RatingRank