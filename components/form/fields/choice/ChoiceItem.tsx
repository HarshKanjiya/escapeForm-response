import { cn } from "@/lib/utils";
import { QuestionOption } from "@prisma/client";

export const ChoiceItem = ({ option, isSelected, onSelect }: { option: QuestionOption, isSelected: boolean, onSelect: (choice: string) => void }) => {
    return (
        <button
            type="button"
            onClick={() => onSelect(option.id)}
            className={cn(
                "w-full flex px-4 py-3 text-primary border border-primary/10 bg-primary/5 rounded-lg max-sm:text-sm",
                isSelected
                    ? "border-primary/50 bg-primary/15"
                    : "hover:border-primary/30 hover:bg-primary/5 cursor-pointer"
            )}>
            <p className={cn(
                "font-medium mr-3 font-mono border p-1 w-min h-5 min-w-5 rounded-sm flex items-center justify-center text-xs",
                isSelected ? "bg-primary text-primary-50 ring-2 ring-primary-200 ring-offset-primary-50" : "border-primary-300"
            )}>{option['ind']}</p>
            {option.label}
        </button>
    )
};