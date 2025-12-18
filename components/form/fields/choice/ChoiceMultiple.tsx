import { Question } from '@/types/common'

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: any) => void,
}

const ChoiceMultiple = ({ question, value, onChange }: Props) => {
  return (
    <div>ChoiceMultiple</div>
  )
}

export default ChoiceMultiple