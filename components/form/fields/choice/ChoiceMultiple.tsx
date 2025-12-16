import { Question } from "@prisma/client"

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: string) => void,
}

const ChoiceMultiple = ({ question, value, onChange }: Props) => {
  return (
    <div>ChoiceMultiple</div>
  )
}

export default ChoiceMultiple