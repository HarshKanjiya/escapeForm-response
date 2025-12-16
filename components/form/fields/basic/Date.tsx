import { Question } from "@prisma/client"

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: string) => void,
}

const Date = ({ question, value, onChange }: Props) => {
  return (
    <div>Date</div>
  )
}

export default Date