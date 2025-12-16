import { Question } from "@prisma/client"

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: any) => void,
}

const RatingZeroToTen = ({ question, value, onChange }: Props) => {
  return (
    <div>RatingZeroToTen</div>
  )
}

export default RatingZeroToTen