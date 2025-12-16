import { Question } from "@prisma/client"

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: any) => void,
}

const ChoiceSingle = ({ question, value, onChange }: Props) => {
  return (
    <div>ChoiceSingle</div>
  )
}

export default ChoiceSingle