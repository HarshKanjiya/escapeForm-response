import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, getChoiceItemAlphaInd } from "@/lib/utils";
import { Question } from '@/types/common';
import { QuestionOption } from "@prisma/client";
import { useEffect, useState } from "react";
import { ChoiceItem } from "./ChoiceItem";

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
  const [options, setOptions] = useState<QuestionOption[]>([]);
  const [validationError, setValidationError] = useState<string[]>([]);
  const [shouldShake, setShouldShake] = useState<boolean>(false);

  useEffect(() => {
    const fetchedOptions = question.options?.filter((i) => i.label?.trim().length) || [];
    fetchedOptions.map((option, index) => {
      option['ind'] = getChoiceItemAlphaInd(index);
    });
    setOptions(fetchedOptions);
  }, [question]);

  useEffect(() => {
    if (value) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleSelect = (choice: string) => {
    setSelectedValue(choice);
    onChange?.(choice);
  };

  const validateField = (): boolean => {
    setValidationError([]);

    if (question.required && !selectedValue) {
      setValidationError(["This question is required"]);
      return true;
    }

    return false;
  };

  const onNextClick = () => {
    if (validateField()) {
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 500);
      return;
    }
    onNextQuestionTrigger?.(1);
  };

  const onSubmitClick = () => {
    if (validateField()) {
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 500);
      return;
    }
    onFormSubmit?.();
  };

  return (
    <div className='w-full space-y-2'>
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
        {options?.length > 0 ? (
          <ScrollArea className="h-[40dvh] sm:h-[50dvh]">
            <div className="flex flex-col gap-2 px-4">
              {
                options?.map((option, index) =>
                  <ChoiceItem option={option} isSelected={selectedValue === option.id} onSelect={handleSelect} key={index} />)
              }
            </div>
          </ScrollArea>
        ) : (
          <div className="text-sm text-muted-foreground/30 italic p-4 text-center border-dotted border-2 rounded-lg">
            No options added...
          </div>
        )}
      </div>

      {validationError.length > 0 && (
        <div className="space-y-1">
          {validationError.map((error, index) => (
            <p key={index} className="text-sm text-destructive mt-1">
              {error}
            </p>
          ))}
        </div>
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
            <Button size="xl" onClick={onSubmitClick} className={cn(shouldShake && "animate-shake")}>
              Submit
            </Button> :
            <Button size="xl" onClick={onNextClick} className={cn(shouldShake && "animate-shake")}>
              Next
            </Button>
        }
      </div>
    </div>
  )
}

export default ChoiceSingle