import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Question } from "@/types/common";
import { useState } from "react";

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: any) => void,
}

const TextShort = ({ question, value, onChange }: Props) => {
  const [answer, setAnswer] = useState("");

  const metadata = question.metadata || {};


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
    onChange?.(answer);
  };


  return (
    <div
      className='w-full space-y-2 p-2 pb-5'
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
        <Input
          id={question.id}
          type="text"
          value={answer}
          onChange={handleInputChange}
          placeholder={question.placeholder || "Type your answer here..."}
          required={question.required}
          minLength={metadata.min as number || undefined}
          maxLength={metadata.max as number || undefined}
          pattern={metadata.pattern || undefined}
          className={cn('border border-muted bg-white! py-6 px-4 text-xl!', metadata.max ? "pr-10" : "", "w-full")}
        />

        {metadata.max && typeof metadata.max === 'number' && (
          <div className="flex justify-end absolute right-3 top-1/2 -translate-y-1/2">
            <span className={cn(
              "text-sm text-muted-foreground",
              answer.length > metadata.max * 0.9 && "text-orange-500",
              answer.length >= metadata.max && "text-destructive"
            )}>
              {answer.length} / {metadata.max}
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
    </div>
  )
}

export default TextShort