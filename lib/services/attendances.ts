import {
  collection,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/config/firebase";

import { AddAttendanceParams, AttendanceRecord } from "@/lib/types";

export async function fetchAttendances(date: Date) {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Convert JavaScript Date to Firestore Timestamp
    const startTimestamp = Timestamp.fromDate(startOfDay);
    const endTimestamp = Timestamp.fromDate(endOfDay);

    const q = query(
      collection(db, "attendances"),
      where("date", ">=", startTimestamp),
      where("date", "<=", endTimestamp),
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.reduce((acc, doc) => {
      const data = doc.data();
      // Convert Timestamp back to Date when needed
      const attendanceData = {
        ...data,
        date: data.date instanceof Timestamp ? data.date.toDate() : data.date,
      };
      return {
        ...acc,
        [doc.id]: { id: doc.id, ...attendanceData } as AttendanceRecord,
      };
    }, {});
  } catch (error) {
    console.error("Error fetching attendance for date:", error);
    return {};
  }
}

// Add Attendanes
function generateAttendanceId(
  attendance: AddAttendanceParams,
  currentAttendances: Record<string, AttendanceRecord>,
): string {
  // If RUT exists, use it
  const date_string = attendance.date
    .toISOString()
    .slice(0, 10)
    .replace("-", "");
  if (attendance.rut) {
    return `${date_string}-${attendance.rut.replace("-", "")}`;
  }

  // If no RUT, generate temporary one based on current day's count
  const noRutCount = Object.values(currentAttendances).filter(
    (a) => !a.rut || a.rut === "",
  ).length;

  const tempRut = `NO-RUT-${String(noRutCount + 1).padStart(3, "0")}`;
  return `${date_string}-${tempRut}-`;
}

export function formatAttendanceForLocalState(
  attendance: AddAttendanceParams,
  currentAttendances: Record<string, AttendanceRecord>,
): AttendanceRecord {
  const id = generateAttendanceId(attendance, currentAttendances);
  return {
    id,
    nombre: attendance.nombre,
    rut: attendance.rut,
    categoria: attendance.categoria,
    subcategoria: attendance.subcategoria,
    estado: attendance.estado,
    turno: attendance.turno,
    habitacion: attendance.habitacion || -1,
    cama: attendance.cama || "NA",
    createdAt: new Date().toISOString(),
    createdBy: "current-user-id",
    date: attendance.date.toISOString(),
    ingreso: new Date().toISOString(),
    grupo: "",
  };
}

export async function addAttendance(
  attendances: AddAttendanceParams[],
  currentAttendances: Record<string, AttendanceRecord>,
): Promise<void> {
  const batch = writeBatch(db);

  attendances.forEach((attendance) => {
    const id = generateAttendanceId(attendance, currentAttendances);
    const docRef = doc(collection(db, "attendances"), id);
    const newAttendance = {
      nombre: attendance.nombre,
      rut: attendance.rut,
      categoria: attendance.categoria,
      subcategoria: attendance.subcategoria,
      estado: attendance.estado,
      turno: attendance.turno,
      habitacion: attendance.habitacion,
      cama: attendance.cama,
      createdAt: Timestamp.now(),
      createdBy: "current-user-id",
      date: Timestamp.fromDate(attendance.date),
      ingreso: Timestamp.now(),
      grupo: "",
    };

    batch.set(docRef, newAttendance);
  });

  return batch.commit();
}

export async function updateAttendance(
  id: string,
  updates: Partial<AttendanceRecord>,
) {
  console.log("Attempting to update document:", id);
  const docRef = doc(db, "attendances", id);
  await updateDoc(docRef, updates);
}

export async function removeAttendance(ids: string[]): Promise<void> {
  const batch = writeBatch(db);

  ids.forEach((id) => {
    const docRef = doc(db, "attendances", id);
    batch.delete(docRef);
  });

  return batch.commit();
}
