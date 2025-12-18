import { Question } from '@/types/common'

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: any) => void,
}

const InfoPhone = ({ question, value, onChange }: Props) => {
  return (
    <div>InfoPhone</div>
  )
}

export default InfoPhone