import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Question } from '@/types/common';
import { useEffect, useState } from "react";

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

const ChoiceSingle = ({ question, value, isLastQuestion, singlePage, isFirstQuestion, onChange, onNextQuestionTrigger, onFormSubmit }: Props) => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(value);
  const choices = question.options?.map(opt => opt.label) || [];

  const options = question.options?.filter((i) => i.label?.trim().length) || [];

  useEffect(() => {
    if (value) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleSelect = (choice: string) => {
    setSelectedValue(choice);
    onChange?.(choice);
  };

  return (
    <div className='w-full space-y-4 p-2 pb-5'>
      <div className="py-2">
        <Label
          htmlFor={question.id}
          className={cn(
            "font-medium text-foreground sm:text-xl",
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
        {options.length > 0 ? (
          <RadioGroup
            value={selectedValue}
            onValueChange={handleSelect}
            className="gap-4"
          >
            {options.map((option, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center space-x-4 pl-4 rounded-lg border transition-all duration-200",
                  selectedValue === option.value
                    ? "border-primary/50 bg-primary/5"
                    : "border-border/40 hover:border-border/60 hover:bg-accent/5"
                )}
              >
                <RadioGroupItem
                  value={option.value}
                  id={`${question.id}-${index}`}
                  className="shrink-0"
                />
                <Label
                  htmlFor={`${question.id}-${index}`}
                  className="text-sm font-medium py-3 text-foreground cursor-pointer flex-1 leading-relaxed"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <div className="text-sm text-muted-foreground italic p-4 text-center border border-dashed border-border/40 rounded-lg">
            No options available
          </div>
        )}
      </div>

      {/* <div className="space-y-2">
        {choices.map((choice, index) => {
          const isSelected = selectedValue === choice;

          return (
            <Button
              variant={'ghost'}
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
            </Button>
          );
        })}
      </div>

      {choices.length === 0 && (
        <p className="text-sm text-muted-foreground italic">
          No choices available
        </p>
      )} */}

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

export default ChoiceSingle