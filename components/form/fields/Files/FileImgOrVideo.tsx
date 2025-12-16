import { Question } from "@prisma/client"

interface Props {
  question: Question,
  value?: any,
  onChange?: (value: any) => void,
}

const FileImgOrVideo = ({ question, value, onChange }: Props) => {
  return (
    <div>FileImgOrVideo</div>
  )
}

export default FileImgOrVideo