import { Question } from "@prisma/client"

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: string) => void,
}

const ChoicePicture = ({ question, value, onChange }: Props) => {
  return (
    <div>ChoicePicture</div>
  )
}

export default ChoicePicture