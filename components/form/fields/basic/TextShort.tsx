import { Question } from "@prisma/client"

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: any) => void,
}

const TextShort = ({ question, value, onChange }: Props) => {
  return (
    <div>TextShort</div>
  )
}

export default TextShort