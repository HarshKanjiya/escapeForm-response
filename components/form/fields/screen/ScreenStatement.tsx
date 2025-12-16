import { Question } from "@prisma/client"

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: any) => void,
}

const ScreenStatement = ({ question, value, onChange }: Props) => {
  return (
    <div>ScreenStatement</div>
  )
}

export default ScreenStatement