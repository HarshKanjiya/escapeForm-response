import { Question } from "@prisma/client"

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: any) => void,
}

const ScreenWelcome = ({ question, value, onChange }: Props) => {
  return (
    <div>ScreenWelcome</div>
  )
}

export default ScreenWelcome