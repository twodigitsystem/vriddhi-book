"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps extends React.ComponentPropsWithoutRef<"div"> {
  onUpdate: (values: { range: DateRange | undefined; from: Date | undefined; to: Date | undefined }) => void;
  initialDateFrom?: Date;
  initialDateTo?: Date;
  align?: "start" | "center" | "end";
  locale?: string;
  showCompare?: boolean;
}

export function DateRangePicker({
  onUpdate,
  initialDateFrom,
  initialDateTo,
  align = "end",
  locale = "en-US",
  showCompare = false,
  className,
  ...props
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: initialDateFrom || new Date(),
    to: initialDateTo || addDays(new Date(), 20),
  });

  React.useEffect(() => {
    onUpdate({ range: date, from: date?.from, to: date?.to });
  }, [date, onUpdate]);

  return (
    <div className={cn("grid gap-2", className)} {...props}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <> 
                  {format(date.from, "LLL dd, y")}
                  {" - "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}