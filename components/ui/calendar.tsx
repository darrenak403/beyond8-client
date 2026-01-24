"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-[--cell-size] w-full items-center justify-center px-[--cell-size]",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-[--cell-size] w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "bg-popover absolute inset-0 opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label"
            ? "text-sm"
            : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-[--cell-size] select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-muted-foreground select-none text-[0.8rem]",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
          defaultClassNames.day
        ),
        range_start: cn(
          "bg-accent rounded-l-md",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("bg-accent rounded-r-md", defaultClassNames.range_end),
        today: cn(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-[--cell-size] items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex aspect-square h-auto w-full min-w-[--cell-size] flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

// Month Year Picker Component
interface MonthYearPickerProps {
  value?: string; // Format: "YYYY-MM" or "nay"
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const months = [
  { value: 1, label: "Tháng 1", short: "T1" },
  { value: 2, label: "Tháng 2", short: "T2" },
  { value: 3, label: "Tháng 3", short: "T3" },
  { value: 4, label: "Tháng 4", short: "T4" },
  { value: 5, label: "Tháng 5", short: "T5" },
  { value: 6, label: "Tháng 6", short: "T6" },
  { value: 7, label: "Tháng 7", short: "T7" },
  { value: 8, label: "Tháng 8", short: "T8" },
  { value: 9, label: "Tháng 9", short: "T9" },
  { value: 10, label: "Tháng 10", short: "T10" },
  { value: 11, label: "Tháng 11", short: "T11" },
  { value: 12, label: "Tháng 12", short: "T12" },
];

function MonthYearPicker({
  value = "",
  onChange,
  placeholder = "Chọn tháng/năm",
  disabled = false,
  className,
}: MonthYearPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const [selectedMonth, setSelectedMonth] = React.useState<number | null>(null);
  const [selectedYear, setSelectedYear] = React.useState<number>(currentYear);

  // Parse value from prop
  React.useEffect(() => {
    if (value === "nay") {
      setSelectedMonth(currentMonth);
      setSelectedYear(currentYear);
    } else if (value && value.includes("-")) {
      const [year, month] = value.split("-");
      setSelectedYear(parseInt(year));
      setSelectedMonth(parseInt(month));
    } else {
      setSelectedMonth(null);
      setSelectedYear(currentYear);
    }
  }, [value, currentMonth, currentYear]);

  const handleSelect = (month: number) => {
    setSelectedMonth(month);
    
    // Check if selected month/year is current month/year
    if (month === currentMonth && selectedYear === currentYear) {
      onChange?.("nay");
    } else {
      onChange?.(`${selectedYear}-${month.toString().padStart(2, "0")}`);
    }
    
    setIsOpen(false);
  };

  const handleSetCurrent = () => {
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
    onChange?.("nay");
    setIsOpen(false);
  };

  const getDisplayValue = () => {
    if (value === "nay") {
      return "Hiện tại";
    } else if (selectedMonth && selectedYear) {
      return `${months[selectedMonth - 1].label} ${selectedYear}`;
    }
    return placeholder;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <ChevronDownIcon className="mr-2 h-4 w-4" />
          {getDisplayValue()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Card className="border-0 shadow-none">
          <CardContent className="p-3">
            {/* Year selector */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedYear((prev) => prev - 1)}
                disabled={selectedYear <= 1960}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <span className="font-semibold text-sm">{selectedYear}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedYear((prev) => prev + 1)}
                disabled={selectedYear >= currentYear}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>

            {/* Month grid */}
            <div className="grid grid-cols-4 gap-2">
              {months.map((month) => {
                const isSelected = selectedMonth === month.value;
                const isCurrent = month.value === currentMonth && selectedYear === currentYear;

                return (
                  <Button
                    key={month.value}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSelect(month.value)}
                    className={cn(
                      "h-9",
                      isSelected && "bg-purple-600 hover:bg-purple-700",
                      isCurrent && !isSelected && "border-2 border-purple-400"
                    )}
                  >
                    {month.short}
                  </Button>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2 border-t p-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleSetCurrent}
            >
              Hiện tại
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
}

export { Calendar, CalendarDayButton, MonthYearPicker }
