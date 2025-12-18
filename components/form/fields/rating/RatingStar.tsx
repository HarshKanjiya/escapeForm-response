import { Question } from '@/types/common'

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: any) => void,
}

const RatingStar = ({ question, value, onChange }: Props) => {
  return (
    <div>RatingStar</div>
  )
}

export default RatingStar