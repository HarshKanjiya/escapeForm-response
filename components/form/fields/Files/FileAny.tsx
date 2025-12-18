import { Question } from '@/types/common'

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: any) => void,
}

const FileAny = ({ question, value, onChange }: Props) => {
  return (
    <div>FileAny</div>
  )
}

export default FileAny