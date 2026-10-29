import type { Especialidad } from './Turno'

export interface Medico {
  id: string
  nombre: string
  apellido: string
  especialidades: Especialidad[]
  matricula: string
  telefono?: string
  cupoMaximo: number
  activo?: boolean
}
