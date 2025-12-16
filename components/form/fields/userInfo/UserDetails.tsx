import { Question } from "@prisma/client"

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: string) => void,
}

const UserDetails = ({ question, value, onChange }: Props) => {
    return (
        <div>UserDetails</div>
    )
}

export default UserDetails