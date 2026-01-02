import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { Question } from '@/types/common'
import { QuestionOption } from '@prisma/client';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useEffect, useState } from 'react';

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

const ChoiceCheckbox = ({ question, value, isLastQuestion, singlePage, isFirstQuestion, onChange, onNextQuestionTrigger, onFormSubmit }: Props) => {

  const [selectedValues, setSelectedValues] = useState<string[]>(Array.isArray(value) ? value : []);
  const [options, setOptions] = useState<QuestionOption[]>([]);

  const metadata = question.metadata || {};
  const minSelections = typeof metadata.min === 'number' ? metadata.min : undefined;
  const maxSelections = typeof metadata.max === 'number' ? metadata.max : undefined;

  useEffect(() => {
    const fetchedOptions = question.options?.filter((i) => i.label?.trim().length) || [];
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
    <div className="w-full space-y-4 p-2 pb-5">
      <div className="py-2">
        <Label
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
            <div className="w-full" role="group" aria-label="Checkbox options">
              <div className="flex flex-col gap-2 px-4">
                {
                  options?.map((option, index) =>
                    <CheckboxItem option={option} isSelected={selectedValues.includes(option.id)} onSelect={handleToggle} key={index} />)
                }
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="text-sm text-muted-foreground/30 italic p-4 text-center border-dotted border-2 rounded-lg">
            No options added...
          </div>
        )}
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
  );
}

const CheckboxItem = ({ option, isSelected, onSelect }: { option: QuestionOption, isSelected: boolean, onSelect: (choice: string) => void }) => {
  return (
    <div
      onClick={() => onSelect(option.id)}
      className={cn(
        "w-full flex items-center px-4 py-3 text-primary border border-primary/10 bg-primary/5 rounded-lg max-sm:text-sm cursor-pointer",
        isSelected
          ? "border-primary/50 bg-primary/15"
          : "hover:border-primary/30 hover:bg-primary/5"
      )}>
      <Checkbox
        id={option.id}
        checked={isSelected}
        onCheckedChange={(checked) => {
          return false;
        }}
        className="mr-3 pointer-events-none"
      />
      <label
        htmlFor={option.id}
        className="flex items-center flex-1 cursor-pointer pointer-events-none"
      >
        {option.label}
      </label>
    </div>
  )
};

export default ChoiceCheckbox