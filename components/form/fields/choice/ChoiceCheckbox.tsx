import { Question } from "@prisma/client"

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: any) => void,
}

const ChoiceCheckbox = ({ question, value, onChange }: Props) => {
  return (
    <div>ChoiceCheckbox</div>
  )
}

export default ChoiceCheckbox