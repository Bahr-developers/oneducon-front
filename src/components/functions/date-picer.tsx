import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useState } from "react" // useState import qo'shildi

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
    const [open, setOpen] = useState(false) // Popover ochiq/yopiq holati

    const handleDateSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate)
        setOpen(false) // Sana tanlanganda popover yopiladi
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <div className="flex flex-col w-full">
                <p className={`block w-full text-end ${className}`}>{title}</p>
                <PopoverTrigger asChild className="h-12">
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground bg-transparent"
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
                        onSelect={handleDateSelect} // Yangi funksiya ishlatildi
                        initialFocus
                    />
                </PopoverContent>
            </div>
        </Popover>
    )
}