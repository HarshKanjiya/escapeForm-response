import { Question } from "@prisma/client"

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: string) => void,
}

const TextLong = ({ question, value, onChange }: Props) => {
  return (
    <div>TextLong</div>
  )
}

export default TextLong