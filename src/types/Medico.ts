import type { Especialidad } from './Turno'

export interface Medico {
  id: string
  nombre: string
  especialidad: Especialidad
  matricula: string
  telefono?: string
  cupoMaximo: number
}
