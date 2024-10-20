import {Cargo, Categoria, EstadoAsistencia, PersonaPredefinida, TipoTurno} from "@/app/types/Asistencia";
import React from "react";
// import {
//     BedIcon,
//     BriefcaseIcon,
//     CheckCircleIcon,
//     GraduationCapIcon,
//     HomeIcon, MoonIcon,
//     PalmtreeIcon,
//     StethoscopeIcon, SunIcon,
//     XCircleIcon
// } from "lucide-react";

import { CheckCircleIcon, XCircleIcon, BriefcaseIcon, PalmtreeIcon, GraduationCapIcon, HomeIcon, StethoscopeIcon, SunIcon, MoonIcon, BedIcon} from 'lucide-react'


export const estadosAsistencia: EstadoAsistencia[] = [
    'Presente', 'Falla', 'Vacaciones', 'Permiso con goce', 'Permiso sin goce', 'Exámenes', 'Curso', 'Teletrabajo', 'Licencia'
]

export const tiposTurno: TipoTurno[] = ['Turno día', 'Turno noche', 'Descanso']

export const categorias: Categoria[] = ['Administrativos KCH.', '7x7 KCH / KCC', 'PERSONAL ESOP', 'CUMMINS', 'REEMPLAZO. AT PALAS']

export const cargos: Cargo[] = ['Sub gerente', 'ADM KCH', 'Prevencion KCH', 'Jefe SSOMA', 'Jefe de Mantencion', 'Jefe RRHH', 'Ing. Gestion', 'Jefa de planificacion', 'SSOMA', 'Jefe Confiabilidad', 'Analista de Recursos Humanos', 'Coordinadora de Operaciones', 'Undefined']


export const iconosPorEstado: { [key in EstadoAsistencia]: React.ReactNode } = {
    'Presente': <CheckCircleIcon className="h-4 w-4 text-green-500" />,
    'Falla': <XCircleIcon className="h-4 w-4 text-red-500" />,
    'Vacaciones': <PalmtreeIcon className="h-4 w-4 text-yellow-500" />,
    'Permiso con goce': <BriefcaseIcon className="h-4 w-4 text-blue-500" />,
    'Permiso sin goce': <BriefcaseIcon className="h-4 w-4 text-gray-500" />,
    'Exámenes': <GraduationCapIcon className="h-4 w-4 text-purple-500" />,
    'Curso': <GraduationCapIcon className="h-4 w-4 text-indigo-500" />,
    'Teletrabajo': <HomeIcon className="h-4 w-4 text-cyan-500" />,
    'Licencia': <StethoscopeIcon className="h-4 w-4 text-pink-500" />
}

export const iconosPorTurno: { [key in TipoTurno]: React.ReactNode } = {
    'Turno día': <SunIcon className="h-4 w-4 text-yellow-500" />,
    'Turno noche': <MoonIcon className="h-4 w-4 text-blue-500" />,
    'Descanso': <BedIcon className="h-4 w-4 text-gray-500" />
}

export const personasPredefinidas: PersonaPredefinida[] = [
    { nombre: 'Francisco Gonzalez', cargo: 'Sub gerente', categoria: 'Administrativos KCH.' },
    { nombre: 'Derek Verdejo', cargo: 'ADM KCH', categoria: 'Administrativos KCH.' },
    { nombre: 'Antonio Parraguez', cargo: 'Prevencion KCH', categoria: '7x7 KCH / KCC' },
    { nombre: 'Gerson Rojas', cargo: 'Jefe SSOMA', categoria: 'Administrativos KCH.' },
    { nombre: 'Cristian Salazar', cargo: 'Jefe de Mantencion', categoria: '7x7 KCH / KCC' },
    { nombre: 'Marcelo Moreno', cargo: 'Jefe RRHH', categoria: 'Administrativos KCH.' },
    { nombre: 'Rodrigo Hube', cargo: 'Ing. Gestion', categoria: 'PERSONAL ESOP' },
    { nombre: 'Haydee Canibilo', cargo: 'Jefa de planificacion', categoria: 'Administrativos KCH.' },
    { nombre: 'Camilo de la Vega', cargo: 'SSOMA', categoria: '7x7 KCH / KCC' },
    { nombre: 'Cecil Vega', cargo: 'Jefe Confiabilidad', categoria: 'CUMMINS' },
    { nombre: 'Georgia Martinez', cargo: 'Analista de Recursos Humanos', categoria: 'Administrativos KCH.' },
    { nombre: 'Margareth Sánchez', cargo: 'Coordinadora de Operaciones', categoria: 'REEMPLAZO. AT PALAS' }
]

export const turnosPorEstado: { [key in EstadoAsistencia]: TipoTurno[] } = {
    'Presente': ['Turno día', 'Turno noche', 'Descanso'],
    'Falla': ['Turno día', 'Turno noche'],
    'Vacaciones': ['Descanso'],
    'Permiso con goce': ['Descanso'],
    'Permiso sin goce': ['Descanso'],
    'Exámenes': ['Turno día', 'Descanso'],
    'Curso': ['Turno día', 'Descanso'],
    'Teletrabajo': ['Turno día', 'Descanso'],
    'Licencia': ['Descanso']
}

export const estadosPorTurno: { [key in TipoTurno]: EstadoAsistencia[] } = {
    'Turno día': ['Presente', 'Falla', 'Exámenes', 'Curso', 'Teletrabajo'],
    'Turno noche': ['Presente', 'Falla'],
    'Descanso': ['Presente', 'Vacaciones', 'Permiso con goce', 'Permiso sin goce', 'Exámenes', 'Curso', 'Teletrabajo', 'Licencia']
}
