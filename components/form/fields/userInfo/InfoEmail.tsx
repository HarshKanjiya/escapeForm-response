import { Question } from '@/types/common'

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: any) => void,
}

const InfoEmail = ({ question, value, onChange }: Props) => {
  return (
    <div>InfoEmail</div>
  )
}

export default InfoEmail