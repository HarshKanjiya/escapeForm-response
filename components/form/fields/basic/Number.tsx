import { Question } from "@prisma/client"

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: string) => void,
}

const Number = ({ question, value, onChange }: Props) => {
  return (
    <div>Number</div>
  )
}

export default Number