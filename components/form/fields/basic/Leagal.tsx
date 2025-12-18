import { Question } from '@/types/common'

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: any) => void,
}

const Leagal = ({ question, value, onChange }: Props) => {
  return (
    <div>Leagal</div>
  )
}

export default Leagal