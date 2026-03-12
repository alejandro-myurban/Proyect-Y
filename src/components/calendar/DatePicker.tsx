"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

export function DatePicker({ date, setDate }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "input-field text-white flex items-center justify-between",
            !date && "text-[#8b8b99]"
          )}
        >
          {date ? format(date, "PPP") : "Seleccionar fecha"}
          <CalendarIcon className="h-4 w-4 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          defaultMonth={date}
          onSelect={(date) => {
            setDate(date)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

interface TimePickerProps {
  time: string
  setTime: (time: string) => void
}

export function TimePicker({ time, setTime }: TimePickerProps) {
  return (
    <Input
      type="time"
      step="1"
      value={time}
      onChange={(e) => setTime(e.target.value)}
      className="text-white bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
    />
  )
}

interface DatePickerWithTimeProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  time: string
  setTime: (time: string) => void
}

export function DatePickerWithTime({ date, setDate, time, setTime }: DatePickerWithTimeProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex-1">
        <DatePicker date={date} setDate={setDate} />
      </div>
      <div className="w-32">
        <TimePicker time={time} setTime={setTime} />
      </div>
    </div>
  )
}

export function getDateTimeString(date: Date | undefined, time: string): string {
  if (!date) return ""
  
  const dateStr = format(date, "yyyy-MM-dd")
  return `${dateStr}T${time}`
}
