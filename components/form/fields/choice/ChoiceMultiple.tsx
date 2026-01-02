import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, getChoiceItemAlphaInd } from "@/lib/utils";
import { Question } from '@/types/common';
import { useEffect, useState } from "react";
import { ChoiceItem } from "./ChoiceItem";
import { QuestionOption } from "@prisma/client";

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

const ChoiceMultiple = ({ question, value, isLastQuestion, singlePage, isFirstQuestion, onChange, onNextQuestionTrigger, onFormSubmit }: Props) => {
  
  const [selectedValues, setSelectedValues] = useState<string[]>(Array.isArray(value) ? value : []);
  const [options, setOptions] = useState<QuestionOption[]>([]);

  const metadata = question.metadata || {};
  const minSelections = typeof metadata.min === 'number' ? metadata.min : undefined;
  const maxSelections = typeof metadata.max === 'number' ? metadata.max : undefined;


  useEffect(() => {
    const fetchedOptions = question.options?.filter((i) => i.label?.trim().length) || [];
    fetchedOptions.map((option, index) => {
      option['ind'] = getChoiceItemAlphaInd(index);
    });
    setOptions(fetchedOptions);
  }, [question]);

  useEffect(() => {
    if (Array.isArray(value)) {
      setSelectedValues(value);
    }
  }, [value]);

  const handleToggle = (optionValue: string) => {
    let newValues: string[];

    if (selectedValues.includes(optionValue)) {
      // Deselect
      newValues = selectedValues.filter(v => v !== optionValue);
    } else {
      // Select
      if (maxSelections && selectedValues.length >= maxSelections) {
        // Already at max selections, don't add more
        return;
      }
      newValues = [...selectedValues, optionValue];
    }

    setSelectedValues(newValues);
    onChange?.(newValues);
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

        {(minSelections || maxSelections) && (
          <p className="text-sm text-muted-foreground mt-2">
            {minSelections && maxSelections
              ? `Select between ${minSelections} and ${maxSelections} options`
              : minSelections
                ? `Select at least ${minSelections} option${minSelections > 1 ? 's' : ''}`
                : maxSelections
                  ? `Select up to ${maxSelections} option${maxSelections > 1 ? 's' : ''}`
                  : null}
          </p>
        )}
      </div>

      <div className="space-y-2">
        {selectedValues.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground justify-end ">
            <span className="font-medium text-foreground">{selectedValues.length}</span>
            <span>option{selectedValues.length !== 1 ? 's' : ''} selected</span>
          </div>
        )}
        {options?.length > 0 ? (
          <ScrollArea className="h-[40dvh] sm:h-[50dvh]">
            <div className="flex flex-col gap-2 px-4">
              {
                options?.map((option, index) =>
                  <ChoiceItem option={option} isSelected={selectedValues.includes(option.id)} onSelect={handleToggle} key={index} />)
              }
            </div>
          </ScrollArea>
        ) : (
          <div className="text-sm text-muted-foreground/30 italic p-4 text-center border-dotted border-2 rounded-lg">
            No options added...
          </div>
        )}
      </div>

      {options.length === 0 && (
        <div className="text-sm text-muted-foreground italic p-4 text-center border border-dashed border-border/40 rounded-lg">
          No options available
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

export default ChoiceMultiple