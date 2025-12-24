import { Button } from "@/components/ui/button"
import { Question } from '@/types/common'
import { Form } from "@prisma/client"
import { ArrowRightIcon } from "lucide-react"
import Image from "next/image"

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: any) => void,
  form?: Partial<Form>,
  singlePage?: boolean
}

const ScreenWelcome = ({ question, value, onChange, form, singlePage }: Props) => {
  const handleStart = () => {
    if (onChange) {
      onChange(true);
    }
  };

  // Use form data if available, otherwise fallback to question data
  const title = question.title;
  const description = form?.description || question.description;
  const logoUrl = form?.logoUrl;

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-8 max-w-2xl mx-auto p-8">
      {/* Logo */}
      <div className="w-20 h-20 flex items-center justify-center">
        <Image
          src={logoUrl || '/logo-light.svg'}
          alt="Form logo"
          width={80}
          height={80}
          className="object-contain rounded-lg"
          quality={100}
          priority
          unoptimized={false}
        />
      </div>

      <div className="space-y-4">
        {title && (
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
            {title}
          </h1>
        )}
        {description && (
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {description}
          </p>
        )}
      </div>

      <Button
        size="lg"
        onClick={handleStart}
        className="flex items-center gap-2 text-lg px-8 py-6"
      >
        Start Form
        <ArrowRightIcon className="w-5 h-5" />
      </Button>
    </div>
  )
}

export default ScreenWelcome