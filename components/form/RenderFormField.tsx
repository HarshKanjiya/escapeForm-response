import { Question } from '@/types/common'
import { Form, QuestionType } from '@prisma/client'
import Date from './fields/basic/Date'
import Leagal from './fields/basic/Leagal'
import Number from './fields/basic/Number'
import TextLong from './fields/basic/TextLong'
import TextShort from './fields/basic/TextShort'
import ChoiceBool from './fields/choice/ChoiceBool'
import ChoiceCheckbox from './fields/choice/ChoiceCheckbox'
import ChoiceDropDown from './fields/choice/ChoiceDropDown'
import ChoiceMultiple from './fields/choice/ChoiceMultiple'
import ChoicePicture from './fields/choice/ChoicePicture'
import ChoiceSingle from './fields/choice/ChoiceSingle'
import FileAny from './fields/Files/FileAny'
import FileImgOrVideo from './fields/Files/FileImgOrVideo'
import RatingRank from './fields/rating/RatingRank'
import RatingStar from './fields/rating/RatingStar'
import RatingZeroToTen from './fields/rating/RatingZeroToTen'
import ScreenEnd from './fields/screen/ScreenEnd'
import ScreenStatement from './fields/screen/ScreenStatement'
import ScreenWelcome from './fields/screen/ScreenWelcome'
import InfoEmail from './fields/userInfo/InfoEmail'
import InfoPhone from './fields/userInfo/InfoPhone'
import InfoUrl from './fields/userInfo/InfoUrl'
import UserAddress from './fields/userInfo/UserAddress'
import UserDetails from './fields/userInfo/UserDetails'

interface Props {
    question: Question,
    value?: any,
    onChange?: (value: any) => void,
    error?: string[],
    onReset?: () => void,
    form?: Partial<Form>
}

const RenderFormField = (props: Props) => {
    switch (props.question.type) {
        case QuestionType.DATE:
            return <Date {...props} />
        case QuestionType.LEAGAL:
            return <Leagal {...props} />
        case QuestionType.NUMBER:
            return <Number {...props} />
        case QuestionType.TEXT_LONG:
            return <TextLong {...props} />
        case QuestionType.TEXT_SHORT:
            return <TextShort {...props} />
        case QuestionType.CHOICE_BOOL:
            return <ChoiceBool {...props} />
        case QuestionType.CHOICE_CHECKBOX:
            return <ChoiceCheckbox {...props} />
        case QuestionType.CHOICE_DROPDOWN:
            return <ChoiceDropDown {...props} />
        case QuestionType.CHOICE_MULTIPLE:
            return <ChoiceMultiple {...props} />
        case QuestionType.CHOICE_PICTURE:
            return <ChoicePicture {...props} />
        case QuestionType.CHOICE_SINGLE:
            return <ChoiceSingle {...props} />
        case QuestionType.FILE_ANY:
            return <FileAny {...props} />
        case QuestionType.FILE_IMAGE_OR_VIDEO:
            return <FileImgOrVideo {...props} />
        case QuestionType.INFO_EMAIL:
            return <InfoEmail {...props} />
        case QuestionType.INFO_PHONE:
            return <InfoPhone {...props} />
        case QuestionType.INFO_URL:
            return <InfoUrl {...props} />
        case QuestionType.USER_ADDRESS:
            return <UserAddress {...props} />
        case QuestionType.USER_DETAIL:
            return <UserDetails {...props} />
        case QuestionType.SCREEN_WELCOME:
            return <ScreenWelcome {...props} />
        case QuestionType.SCREEN_STATEMENT:
            return <ScreenStatement {...props} />
        case QuestionType.SCREEN_END:
            return <ScreenEnd {...props} />
        case QuestionType.RATING_RANK:
            return <RatingRank {...props} />
        case QuestionType.RATING_STAR:
            return <RatingStar {...props} />
        case QuestionType.RATING_ZERO_TO_TEN:
            return <RatingZeroToTen {...props} />
        // case QuestionType.REDIRECT_TO_URL:
        // return < {...props} />
        default:
            break;
    }

    return (
        <div>
            RenderFormField for question type: {props.question.type}
        </div>
    )
}

export default RenderFormField