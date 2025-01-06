// import { Timestamp } from "firebase/firestore";
export interface AddAttendanceParams {
  nombre: string;
  rut: string;
  categoria: string;
  subcategoria: string;
  estado: EstadoAsistencia;
  turno: Turno;
  date: Date;
  habitacion?: number;
  cama?: string;
}

export type EstadoAsistencia =
  | "NA"
  | "Presente"
  | "Falla"
  | "Vacaciones"
  | "Permiso con goce"
  | "Permiso sin goce"
  | "Exámenes"
  | "Curso"
  | "Teletrabajo"
  | "Licencia";

export type Turno = "Día" | "Noche";
export type Cama = "Ventana" | "Pasillo" | "NA";
export type Categoria = "MN" | "M" | "N" | "NA";
export type Subcategoria = "NA" | "M1" | "N1" | "M2" | "N2";

export interface PersonaRecord {
  id: string;
  rut: string;
  nombre: string;
  habitacion: number;
  cama: string;
  cargo: string;
  predefinido: boolean;
  categoria: string;
  subcategoria: string;
  turno: string;
  grupo: string;
  // [key: string]: any; // Add this to satisfy index signature requirement
  createdAt: string; // ISO timestamp when record was created
  synced?: boolean; // Track if record is synced with Firebase
}

export interface AttendanceRecord {
  id: string;
  categoria: string;
  estado: EstadoAsistencia;
  habitacion: number;
  nombre: string;
  createdBy: string;
  createdAt: string;
  rut: string;
  subcategoria: string;
  turno: Turno;
  date: string;
  ingreso: string;
  grupo: string;
  cama: string;
  // [key: string]: any; // Add this to satisfy index signature requirement
}
