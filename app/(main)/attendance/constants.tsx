import {
  CheckCircleIcon,
  XCircleIcon,
  BriefcaseIcon,
  PalmtreeIcon,
  GraduationCapIcon,
  HomeIcon,
  StethoscopeIcon,
  SunIcon,
  MoonIcon,
  UserIcon,
  LayoutDashboardIcon,
  DoorOpenIcon,
} from "lucide-react";
import { EstadoAsistencia, Cama, Turno } from "@/lib/types";
import React from "react";

export const ESTADOS_ASISTENCIA: EstadoAsistencia[] = [
  "NA",
  "Presente",
  "Falla",
  "Vacaciones",
  "Permiso con goce",
  "Permiso sin goce",
  "Exámenes",
  "Curso",
  "Teletrabajo",
  "Licencia",
];

export const ICONOS_POR_ESTADO: { [key in EstadoAsistencia]: React.ReactNode } =
  {
    NA: <UserIcon className="h-4 w-4 text-gray-400" />,
    Presente: <CheckCircleIcon className="h-4 w-4 text-green-500" />,
    Falla: <XCircleIcon className="h-4 w-4 text-red-500" />,
    Vacaciones: <PalmtreeIcon className="h-4 w-4 text-yellow-500" />,
    "Permiso con goce": <BriefcaseIcon className="h-4 w-4 text-blue-500" />,
    "Permiso sin goce": <BriefcaseIcon className="h-4 w-4 text-gray-500" />,
    Exámenes: <GraduationCapIcon className="h-4 w-4 text-purple-500" />,
    Curso: <GraduationCapIcon className="h-4 w-4 text-indigo-500" />,
    Teletrabajo: <HomeIcon className="h-4 w-4 text-cyan-500" />,
    Licencia: <StethoscopeIcon className="h-4 w-4 text-pink-500" />,
  };

export const ICONOS_POR_TURNO: {
  [key in Turno]: {
    icon: React.ReactNode;
    bgColor: string;
    textColor: string;
  };
} = {
  Día: {
    icon: <SunIcon className="h-4 w-4" />,
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
  },
  Noche: {
    icon: <MoonIcon className="h-4 w-4" />,
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
};

export const ICONOS_POR_CAMA: {
  [key in Cama]: React.ReactNode;
} = {
  Ventana: <LayoutDashboardIcon className="h-4 w-4 text-blue-500" />,
  Pasillo: <DoorOpenIcon className="h-4 w-4 text-green-500" />,
  NA: <UserIcon className="h-4 w-4 text-gray-400" />,
};
