import { Question } from "@prisma/client"

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: any) => void,
}

const Date = ({ question, value, onChange }: Props) => {
  return (
    <div>Date</div>
  )
}

export default Date