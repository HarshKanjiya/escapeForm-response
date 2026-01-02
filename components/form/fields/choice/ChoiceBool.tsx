import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Question } from '@/types/common';

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
          onClick={() => onChange(true)}
          className={cn(
            "w-full flex px-4 py-3 text-primary border border-primary/10 bg-primary/5 rounded-lg max-sm:text-sm",
            value === true
              ? "border-primary/50 bg-primary/15"
              : "hover:border-primary/30 hover:bg-primary/5 cursor-pointer"
          )}
        >Yes</button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={cn(
            "w-full flex px-4 py-3 text-primary border border-primary/10 bg-primary/5 rounded-lg max-sm:text-sm",
            value === false
              ? "border-primary/50 bg-primary/15"
              : "hover:border-primary/30 hover:bg-primary/5 cursor-pointer"
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