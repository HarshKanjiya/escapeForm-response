import { Question } from "@prisma/client"

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: any) => void,
}

const ChoiceBool = ({ question, value, onChange }: Props) => {
  return (
    <div>ChoiceBool</div>
  )
}

export default ChoiceBool