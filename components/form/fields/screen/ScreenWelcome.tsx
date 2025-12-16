import { Question } from "@prisma/client"

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: string) => void,
}

const ScreenWelcome = ({ question, value, onChange }: Props) => {
  return (
    <div>ScreenWelcome</div>
  )
}

export default ScreenWelcome