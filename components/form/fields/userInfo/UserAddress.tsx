import { Question } from '@/types/common'

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: any) => void,
}

const UserAddress = ({ question, value, onChange }: Props) => {
  return (
    <div>UserAddress</div>
  )
}

export default UserAddress