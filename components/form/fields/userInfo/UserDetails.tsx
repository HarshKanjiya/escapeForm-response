import { Question } from '@/types/common'

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: any) => void,
}

const UserDetails = ({ question, value, onChange }: Props) => {
    return (
        <div>UserDetails</div>
    )
}

export default UserDetails