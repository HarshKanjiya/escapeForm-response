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
            "w-full py-6 text-lg",
            //  && "border-destructive"
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
                className="cursor-pointer py-3"
              >
                {option.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

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

export default ChoiceDropDown