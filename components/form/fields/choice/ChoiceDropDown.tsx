import { Question } from "@prisma/client"

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: any) => void,
}

const ChoiceDropDown = ({ question, value, onChange }: Props) => {
  return (
    <div>ChoiceDropDown</div>
  )
}

export default ChoiceDropDown