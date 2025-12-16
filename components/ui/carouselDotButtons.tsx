interface DotButtonNavProps {
    slideCount: number;
    currentIndex: number;
    onDotClick: (index: number) => void;
    className?: string;
}

export const DotButtonNav: React.FC<DotButtonNavProps> = ({ slideCount, currentIndex, onDotClick, className = "" }) => {
    return (
        <div className={`carousel-dot-nav ${className}`.trim()}>
            {Array.from({ length: slideCount }).map((_, idx) => (
                <DotButton
                    key={idx}
                    className={`h-3 w-3 rounded-full transition-all duration-200 cursor-pointer ${idx === currentIndex ? "!bg-secondary-foreground/80" : "bg-secondary-foreground/20"}`}
                    aria-label={`Go to slide ${idx + 1}`}
                    aria-pressed={idx === currentIndex}
                    onClick={() => onDotClick(idx)}
                />
            ))}
        </div>
    );
};
import React, {
    ComponentPropsWithRef,
    useCallback,
    useEffect,
    useState
} from 'react'
import { EmblaCarouselType } from 'embla-carousel'

type UseDotButtonType = {
    selectedIndex: number
    scrollSnaps: number[]
    onDotButtonClick: (index: number) => void
}

export const useDotButton = (
    emblaApi: EmblaCarouselType | undefined
): UseDotButtonType => {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

    const onDotButtonClick = useCallback(
        (index: number) => {
            if (!emblaApi) return
            emblaApi.scrollTo(index)
        },
        [emblaApi]
    )

    const onInit = useCallback((emblaApi: EmblaCarouselType) => {
        setScrollSnaps(emblaApi.scrollSnapList())
    }, [])

    const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
        setSelectedIndex(emblaApi.selectedScrollSnap())
    }, [])

    useEffect(() => {
        if (!emblaApi) return

        onInit(emblaApi)
        onSelect(emblaApi)
        emblaApi.on('reInit', onInit).on('reInit', onSelect).on('select', onSelect)
    }, [emblaApi, onInit, onSelect])

    return {
        selectedIndex,
        scrollSnaps,
        onDotButtonClick
    }
}

type PropType = ComponentPropsWithRef<'button'>

export const DotButton: React.FC<PropType> = (props) => {
    const { children, ...restProps } = props

    return (
        <button type="button" {...restProps}>
            {children}
        </button>
    )
}
