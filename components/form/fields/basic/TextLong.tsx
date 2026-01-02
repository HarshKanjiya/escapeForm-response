import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Question } from '@/types/common';
import { useState } from 'react';

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

const TextLong = ({ question, value, isLastQuestion, singlePage, isFirstQuestion, onChange, onNextQuestionTrigger, onFormSubmit }: Props) => {

  const [answer, setAnswer] = useState("");
  // const [errors, setErrors] = useState<string[]>([]);


  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer(e.target.value);
    onChange?.(answer);
  };


  return (
    <div
      className='w-full space-y-2 py-2 pb-5'
    >
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
          <p className="text-md text-muted-foreground italic py-1">
            {question.description}
          </p>
        )}
      </div>

      <div className="space-y-1 relative">
        <Textarea
          id={question.id}
          value={answer}
          onChange={handleInputChange}
          placeholder={question.placeholder || "Type your answer here..."}
          required={question.required}
          minLength={question.metadata?.min as number || undefined}
          maxLength={question.metadata?.max as number || undefined}
          className={cn('border resize-none border-muted bg-transparent! shadow-none! py-2 min-h-12 px-2! text-xl! border-x-0 border-t-0 rounded-none border-b! outline-none! active:outline-none! ring-0! border-b-muted-foreground/20 active:border-b-primary transition-[border-color] duration-200 placeholder:text-primary/30', question.metadata?.max ? "pr-10" : "", "w-full")}
        ></Textarea>
        <div className='text-xs text-accent-foreground/50'>
          <i><span className='text-accent-foreground'>Shift + Enter</span> to add a new line</i>
        </div>
        {question.metadata?.max && typeof question.metadata.max === 'number' && (
          <div className="flex justify-end absolute right-3 top-5 -translate-y-1/2">
            <span className={cn(
              "text-sm text-muted-foreground",
              answer.length > question.metadata.max * 0.9 && "text-orange-500",
              answer.length >= question.metadata.max && "text-destructive"
            )}>
              {answer.length} / {question.metadata.max}
            </span>
          </div>
        )}
      </div>

      {question.metadata && (
        <div className="text-xs text-muted-foreground space-y-1 pt-2">
          {question.metadata.min && typeof question.metadata.min === 'number' && (
            <p>Minimum {question.metadata.min} characters required</p>
          )}
          {question.metadata.pattern && (
            <p>Please enter a valid format</p>
          )}
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
  );
}

export default TextLong