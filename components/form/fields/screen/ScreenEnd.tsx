import { Question } from "@prisma/client"

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: string) => void,
}

const ScreenEnd = ({ question, value, onChange }: Props) => {
  return (
    <div>ScreenEnd</div>
  )
}

export default ScreenEnd