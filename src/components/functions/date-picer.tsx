import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

interface DatePickerProps {
    title: string,
    startTitle: string
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    className?: string
}

export function DatePicker({ date, setDate, title, startTitle, className }: DatePickerProps) {
    return (
        <Popover>
            <div className="flex flex-col w-full">
                <p className={`block w-full text-end ${className}`}>{title}</p>
                <PopoverTrigger asChild className="h-12">
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground  bg-transparent"
                        )}
                    >
                        <CalendarIcon />
                        {date ? format(date, "PPP") : <span>{startTitle}</span>}
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                    />
                </PopoverContent>
            </div>
        </Popover>
    )
}
