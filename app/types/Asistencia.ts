export type EstadoAsistencia = 'Presente' | 'Falla' | 'Vacaciones' | 'Permiso con goce' | 'Permiso sin goce' | 'Exámenes' | 'Curso' | 'Teletrabajo' | 'Licencia'
export type TipoTurno = 'Turno día' | 'Turno noche' | 'Descanso'
export type Categoria = 'Administrativos KCH.' | '7x7 KCH / KCC' | 'PERSONAL ESOP' | 'CUMMINS' | 'REEMPLAZO. AT PALAS'
export type Cargo = 'Sub gerente' | 'ADM KCH' | 'Prevencion KCH' | 'Jefe SSOMA' | 'Jefe de Mantencion' | 'Jefe RRHH' | 'Ing. Gestion' | 'Jefa de planificacion' | 'SSOMA' | 'Jefe Confiabilidad' | 'Analista de Recursos Humanos' | 'Coordinadora de Operaciones' | 'Undefined'

export interface Asistente {
    id: number
    nombre: string
    cargo?: Cargo
    categoria: Categoria
    estado: EstadoAsistencia
    turno: TipoTurno
}

export interface PersonaPredefinida {
    nombre: string
    cargo: Cargo
    categoria: Categoria
}