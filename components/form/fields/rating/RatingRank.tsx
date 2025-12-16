import { Question } from "@prisma/client"

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: string) => void,
}

const RatingRank = ({ question, value, onChange }: Props) => {
  return (
    <div>RatingRank</div>
  )
}

export default RatingRank