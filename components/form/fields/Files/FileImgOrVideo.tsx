import { Question } from '@/types/common'

interface Props {
  question: Question,
  value?: any,
  error?: string[],
  singlePage?: boolean
  onChange?: (value: any) => void,
  onError?: (errors: string[]) => void,
  onNextQuestionTrigger?: (dir: 1 | -1) => void,
}

const FileImgOrVideo = ({ question, value, onChange }: Props) => {
  return (
    <div>FileImgOrVideo</div>
  )
}

export default FileImgOrVideo