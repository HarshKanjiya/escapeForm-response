import { Question } from '@/types/common'
import { Button } from "@/components/ui/button"
import { CheckCircle2Icon, RefreshCwIcon } from "lucide-react"

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: any) => void,
  onReset?: () => void,
  singlePage?: boolean
}

const ScreenEnd = ({ question, value, onChange, onReset, singlePage }: Props) => {
  const handleNext = () => {
    if (onChange) {
      onChange(true);
    }
  };

  const handleSubmitAgain = () => {
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-8 max-w-2xl mx-auto p-8">
      <div className="space-y-6">
        <CheckCircle2Icon className="w-20 h-20 text-green-500 mx-auto" />

        {question.title && (
          <h1 className={"text-2xl md:text-4xl font-bold tracking-tight"}>
            {question.title}
          </h1>
        )}
        {question.description && (
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {question.description}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {onReset && (
          <Button
            size="lg"
            variant="outline"
            onClick={handleSubmitAgain}
            className="flex items-center gap-2 text-lg px-8 py-6"
          >
            <RefreshCwIcon className="w-5 h-5" />
            Submit Again
          </Button>
        )}

        {onChange && (
          <Button
            size="lg"
            onClick={handleNext}
            className="flex items-center gap-2 text-lg px-8 py-6"
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  )
}

export default ScreenEnd