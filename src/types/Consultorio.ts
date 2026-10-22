import type { Especialidad } from './Turno'

export interface Consultorio {
  id: string
  numero: string
  piso?: string
  especialidad?: Especialidad | ''
}
