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
  singlePage?: boolean
  isFirstQuestion?: boolean,
  isLastQuestion?: boolean,
  onChange?: (value: any) => void,
  onNextQuestionTrigger?: (dir: 1 | -1) => void,
  onFormSubmit?: () => void
}

const ChoiceBool = ({ question, value, isLastQuestion, singlePage, isFirstQuestion, onChange, onNextQuestionTrigger, onFormSubmit }: Props) => {
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

export default ChoiceBool