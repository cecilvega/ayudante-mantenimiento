// app/(main)/attendance/services.ts
import { useCallback, useState } from "react";
import {
  AddAttendanceParams,
  AttendanceRecord,
  PersonaRecord,
  Turno,
} from "@/lib/types";
import {
  addAttendance,
  updateAttendance,
  removeAttendance,
  formatAttendanceForLocalState,
  fetchAttendances,
} from "@/lib/services";

export function useAttendanceServices() {
  const [attendances, setAttendances] = useState<
    Record<string, AttendanceRecord>
  >({});
  const [personas, setPersonas] = useState<Record<string, PersonaRecord>>({});
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [selectedTurno, setSelectedTurno] = useState<Turno>("Día");

  // Inside AttendanceRegistry component
  const refreshAttendances = useCallback(async () => {
    try {
      const attendancesData = await fetchAttendances(selectedDate);
      setAttendances(attendancesData);
    } catch (error) {
      console.error("Error refreshing attendances:", error);
    }
  }, [selectedDate]);

  // Wrap the service call with local state updates
  const handleAddAttendance = async (
    attendanceData: AddAttendanceParams | AddAttendanceParams[],
  ) => {
    const newAttendances = Array.isArray(attendanceData)
      ? attendanceData
      : [attendanceData];

    setAttendances((prev) => {
      const updates: Record<string, AttendanceRecord> = {};
      newAttendances.forEach((attendance) => {
        const formattedAttendance = formatAttendanceForLocalState(
          attendance,
          prev,
        );
        updates[formattedAttendance.id] = formattedAttendance;
      });
      return { ...prev, ...updates };
    });

    await addAttendance(newAttendances, attendances);
  };

  const handleUpdateAttendance = async (
    id: string,
    updates: Partial<AttendanceRecord>,
  ) => {
    console.log("Updating attendance:", { id, updates });
    console.log("Current attendances:", attendances); // Add this
    await updateAttendance(id, updates);
    // Mark as synced after successful Firebase update
    setAttendances((prev) => ({
      ...prev,
      [id]: { ...prev[id], synced: true },
    }));
    await refreshAttendances();
  };

  const handleRemoveAttendance = async (ids: string[]) => {
    setAttendances((prev) => {
      const newAttendances = { ...prev };
      ids.forEach((id) => delete newAttendances[id]);
      return newAttendances;
    });

    await removeAttendance(ids);
  };

  const hasAttendance = useCallback(
    (nombre: string) => {
      return Object.values(attendances).some(
        (attendance) =>
          attendance.nombre.toLowerCase() === nombre.toLowerCase(),
      );
    },
    [attendances],
  );

  return {
    selectedDate,
    setSelectedDate,
    selectedTurno,
    setSelectedTurno,

    personas,
    setPersonas,
    attendances,
    setAttendances,
    handleAddAttendance,
    handleUpdateAttendance,
    handleRemoveAttendance,
    hasAttendance,
  };
}
