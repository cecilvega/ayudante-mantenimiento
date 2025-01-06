"use client";

import React, { useEffect, useState } from "react";

import {
  AddAttendanceParams,
  AttendanceRecord,
  PersonaRecord,
  Turno,
} from "@/lib/types";
// import { AttendanceOperationResult } from "./types";
import { useAttendanceServices } from "./services";
import { fetchAttendances, fetchPersonas } from "@/lib/services";

interface AttendanceContextValue {
  // UI inputs
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  selectedTurno: Turno;
  setSelectedTurno: (shift: Turno) => void;
  // UI state
  addPersonDialogOpen: boolean;
  setAddPersonDialogOpen: (open: boolean) => void;
  isDayMode: boolean; // Add this derived property
  isLoading: boolean;
  hasAttendance: (nombre: string) => boolean;
  // Firebase data
  personas: Record<string, PersonaRecord>;
  setPersonas: React.Dispatch<
    React.SetStateAction<Record<string, PersonaRecord>>
  >;
  attendances: Record<string, AttendanceRecord>;
  setAttendances: React.Dispatch<
    React.SetStateAction<Record<string, AttendanceRecord>>
  >;

  // Operations
  handleAddAttendance: (
    attendance: AddAttendanceParams | AddAttendanceParams[],
  ) => Promise<void>;

  handleUpdateAttendance: (
    id: string,
    updates: Partial<AttendanceRecord>,
  ) => Promise<void>;

  handleRemoveAttendance: (ids: string[]) => Promise<void>;
}
// Create context with a default value
export const AttendanceContext = React.createContext<
  AttendanceContextValue | undefined
>(undefined);

// Custom hook for using the attendance context
export const useAttendanceContext = () => {
  const context = React.useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error("useAttendance must be used within an AttendanceProvider");
  }
  return context;
};

export function AttendanceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [addPersonDialogOpen, setAddPersonDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const services = useAttendanceServices();
  const { selectedDate, setAttendances, setPersonas } = services;

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [personasData, attendancesData] = await Promise.all([
          fetchPersonas(),
          fetchAttendances(selectedDate),
        ]);

        setPersonas(personasData);
        setAttendances(attendancesData);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [selectedDate, setAttendances, setPersonas]);

  // Handle date changes
  useEffect(() => {
    const loadAttendances = async () => {
      setIsLoading(true);
      try {
        const attendancesData = await fetchAttendances(selectedDate);
        setAttendances(attendancesData);
      } catch (error) {
        console.error("Error loading attendances:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAttendances();
  }, [selectedDate, setAttendances]);

  return (
    <AttendanceContext.Provider
      value={{
        ...services,
        addPersonDialogOpen,
        setAddPersonDialogOpen,
        isLoading,
        isDayMode: services.selectedTurno === "Día",
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
}
