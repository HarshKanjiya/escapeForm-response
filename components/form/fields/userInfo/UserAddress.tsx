import { Question } from "@prisma/client"

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: string) => void,
}

const UserAddress = ({ question, value, onChange }: Props) => {
  return (
    <div>UserAddress</div>
  )
}

export default UserAddress