import {
  fetchAttendances,
  fetchEquipos,
  fetchPersonas,
  fetchComponentChangeouts,
} from "@/lib/services";
import { addDays } from "date-fns";
import {
  AttendanceRecord,
  BacklogTask,
  ComponentChangeoutTask,
  JustDoItTask,
} from "@/lib/types";

// Create a generic date-range fetcher
async function fetchDateRangeData<
  T extends Record<
    string,
    AttendanceRecord | ComponentChangeoutTask | BacklogTask | JustDoItTask
  >,
>(fetchFn: (date: Date) => Promise<T>, days: number = 10): Promise<T> {
  const today = new Date();
  const dateRange = Array.from({ length: days * 2 + 1 }, (_, i) => i - days);

  const allData = await Promise.all(
    dateRange.map((offset) => fetchFn(addDays(today, offset))),
  );

  return allData.reduce(
    (acc, data) => ({
      ...acc,
      ...data,
    }),
    {} as T,
  );
}

// Use it for both types of fetches
export async function fetchInitialAttendances() {
  const data = await fetchDateRangeData(fetchAttendances);
  console.log("Attendance loaded:", Object.keys(data).length);
  return data;
}

export async function fetchInitialComponentChangeouts() {
  const data = await fetchDateRangeData(fetchComponentChangeouts);
  console.log("Component changeouts loaded:", Object.keys(data).length);
  return data;
}

export async function initializeAppData() {
  await Promise.all([
    fetchPersonas(),
    fetchEquipos(),
    fetchInitialAttendances(),
    fetchInitialComponentChangeouts(),
  ]);
}
