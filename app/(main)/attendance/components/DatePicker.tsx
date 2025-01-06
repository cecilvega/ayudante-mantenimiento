import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface DatePickerProps {
  date: Date;
  setDate: (date: Date) => void;
  isDayMode: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  date,
  setDate,
  isDayMode,
}) => {
  // Ensure we always have a valid date
  const currentDate = date || new Date();

  // Safe date selection handler
  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate && !isNaN(newDate.getTime())) {
      setDate(newDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start text-left font-normal ${
            isDayMode
              ? "bg-white hover:bg-gray-100"
              : "bg-gray-800 hover:bg-gray-700 text-white"
          }`}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {format(currentDate, "PPP", { locale: es })}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={currentDate}
          onSelect={handleDateSelect}
          initialFocus
          locale={es}
          className={`rounded-md border ${
            isDayMode ? "bg-white" : "bg-gray-800 text-white"
          }`}
        />
      </PopoverContent>
    </Popover>
  );
};
