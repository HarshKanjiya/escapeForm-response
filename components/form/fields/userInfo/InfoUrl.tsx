import { Question } from "@prisma/client"

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: string) => void,
}

const InfoUrl = ({ question, value, onChange }: Props) => {
  return (
    <div>InfoUrl</div>
  )
}

export default InfoUrl