import { Question } from '@/types/common'

interface Props {
  question: Question,
  value?: any,
  error?: string[],
  singlePage?: boolean
  onChange?: (value: any) => void,
  onError?: (errors: string[]) => void,
  onNextQuestionTrigger?: () => void
}

const FileAny = ({ question, value, onChange }: Props) => {
  return (
    <div>FileAny</div>
  )
}

export default FileAny