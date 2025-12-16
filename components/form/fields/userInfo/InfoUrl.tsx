import { Question } from "@prisma/client"

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: any) => void,
}

const InfoUrl = ({ question, value, onChange }: Props) => {
  return (
    <div>InfoUrl</div>
  )
}

export default InfoUrl