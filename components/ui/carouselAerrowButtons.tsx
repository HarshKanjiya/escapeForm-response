import { EmblaCarouselType } from 'embla-carousel'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, MoveDown, MoveLeft, MoveRight, MoveUp } from 'lucide-react'
import React, {
    ComponentPropsWithRef,
    useCallback,
    useEffect,
    useState
} from 'react'
import { Button } from './button'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'
import { TooltipArrow } from '@radix-ui/react-tooltip'

type UsePrevNextButtonsType = {
    prevBtnDisabled: boolean
    nextBtnDisabled: boolean
    onPrevButtonClick: () => void
    onNextButtonClick: () => void
}

export const usePrevNextButtons = (
    emblaApi: EmblaCarouselType | undefined
): UsePrevNextButtonsType => {
    const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
    const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

    const onPrevButtonClick = useCallback(() => {
        if (!emblaApi) return
        emblaApi.scrollPrev()
    }, [emblaApi])

    const onNextButtonClick = useCallback(() => {
        if (!emblaApi) return
        emblaApi.scrollNext()
    }, [emblaApi])

    const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
        setPrevBtnDisabled(!emblaApi.canScrollPrev())
        setNextBtnDisabled(!emblaApi.canScrollNext())
    }, [])

    useEffect(() => {
        if (!emblaApi) return

        onSelect(emblaApi)
        emblaApi.on('reInit', onSelect).on('select', onSelect)
    }, [emblaApi, onSelect])

    return {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    }
}

type PropType = ComponentPropsWithRef<'button'> & {
    isVertical?: boolean;
}

export const PrevButton: React.FC<PropType> = (props) => {
    const { isVertical = false, onClick, ...restProps } = props

    useEffect(() => {
        const handleKeydown = (event: KeyboardEvent) => {
            if (event.ctrlKey && (event.key === 'ArrowLeft' || event.key === 'ArrowUp')) {
                event.preventDefault()
                if (onClick) onClick({} as React.MouseEvent<HTMLButtonElement>)
            }
        }

        document.addEventListener('keydown', handleKeydown)
        return () => {
            document.removeEventListener('keydown', handleKeydown)
        }
    }, [onClick])

    if (isVertical) {
        return (
            <div className='flex justify-between items-center gap-3 w-40'>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size={'lg'} variant={'secondary'} onClick={onClick} {...restProps} className='rounded-t-xl !w-24'>
                            <span>Prev</span>
                            <ChevronUp />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side='left'>
                        <TooltipArrow />
                        Ctrl + Up
                    </TooltipContent>
                </Tooltip>
            </div>)
    }

    return (
        <div className='flex flex-col items-end gap-3'>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button size={'lg'} variant={'secondary'} onClick={onClick} {...restProps} className="relative rounded-l-xl">
                        <ChevronLeft />
                        <span>Prev</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent side='bottom'>
                    <TooltipArrow />
                    Ctrl + Left
                </TooltipContent>
            </Tooltip>
        </div>
    )
}

export const NextButton: React.FC<PropType> = (props) => {
    const { isVertical = false, onClick, ...restProps } = props

    useEffect(() => {
        const handleKeydown = (event: KeyboardEvent) => {
            if (event.ctrlKey && (event.key === 'ArrowRight' || event.key === 'ArrowDown')) {
                event.preventDefault()
                if (onClick) onClick({} as React.MouseEvent<HTMLButtonElement>)
            }
        }

        document.addEventListener('keydown', handleKeydown)
        return () => {
            document.removeEventListener('keydown', handleKeydown)
        }
    }, [onClick])

    if (isVertical) {
        return (
            <div className='flex justify-between items-center gap-3 w-40'>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size={'lg'} variant={'secondary'} onClick={onClick} {...restProps} className='rounded-b-xl !w-24'>
                            <span>Next</span>
                            <ChevronDown />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side='left'>
                        <TooltipArrow />
                        Ctrl + Down
                    </TooltipContent>
                </Tooltip>
            </div>)
    }

    return (
        <div className='flex flex-col items-start gap-3'>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button size={'lg'} variant={'secondary'} onClick={onClick} {...restProps} className="relative rounded-r-xl">
                        <span>Next</span>
                        <ChevronRight />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side='bottom'>
                    <TooltipArrow />
                    Ctrl + Right
                </TooltipContent>
            </Tooltip>
        </div>
    )
}
