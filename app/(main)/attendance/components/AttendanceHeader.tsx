"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SunIcon, MoonIcon } from "lucide-react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AddPersonDialog from "./AddPersonDialog";
import { DatePicker } from "./DatePicker";
import { useAttendanceContext } from "../contexts";

export default function AttendanceHeader() {
  const { selectedDate, setSelectedDate, setSelectedTurno, isDayMode } =
    useAttendanceContext();

  // Add a safe handler for date changes
  const handleDateChange = (newDate: Date) => {
    if (newDate && !isNaN(newDate.getTime())) {
      setSelectedDate(newDate);
    }
  };

  return (
    <Card
      className={`w-full overflow-hidden shadow-lg transition-colors duration-500 
  ${
    isDayMode
      ? "bg-gradient-to-br from-blue-50 to-indigo-100"
      : "bg-gradient-to-br from-gray-800 to-indigo-900"
  }`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle
            className={`text-3xl font-bold ${isDayMode ? "text-[#140a9a]" : "text-white"}`}
          >
            Registro de asistencia
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AddPersonDialog />
              </TooltipTrigger>
              <TooltipContent>
                <p>Add New Entry</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <DatePicker
          date={selectedDate}
          setDate={handleDateChange}
          isDayMode={isDayMode}
        />

        <div
          className={`rounded-xl overflow-hidden shadow-md transition-colors duration-500 ${
            isDayMode ? "bg-white" : "bg-gray-700"
          }`}
        >
          <div className="relative flex">
            <motion.div
              className={`absolute h-full rounded-xl ${
                isDayMode
                  ? "bg-gradient-to-r from-yellow-200 to-orange-200"
                  : "bg-gradient-to-r from-indigo-800 to-purple-800"
              }`}
              initial={false}
              animate={{
                x: isDayMode ? 0 : "100%",
                width: "50%",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <Button
              variant="ghost"
              className={`flex-1 h-14 transition-all duration-300 z-10 ${
                isDayMode
                  ? "text-[#140a9a] font-bold hover:text-white hover:bg-[#140a9a]"
                  : "text-indigo-200 hover:text-white hover:bg-indigo-700"
              }`}
              onClick={() => setSelectedTurno("Día")}
            >
              <SunIcon
                className={`h-5 w-5 mr-2 ${isDayMode ? "text-yellow-500" : "text-yellow-200"}`}
              />
              <span>Día</span>
            </Button>
            <Button
              variant="ghost"
              className={`flex-1 h-14 transition-all duration-300 z-10 ${
                !isDayMode
                  ? "text-white font-bold hover:bg-indigo-600"
                  : "text-[#140a9a] hover:text-white hover:bg-[#140a9a]"
              }`}
              onClick={() => setSelectedTurno("Noche")}
            >
              <MoonIcon
                className={`h-5 w-5 mr-2 ${!isDayMode ? "text-indigo-200" : "text-indigo-400"}`}
              />
              <span>Noche</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
