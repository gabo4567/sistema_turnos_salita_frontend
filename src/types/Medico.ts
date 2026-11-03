import type { Especialidad } from './Turno'

export interface TelefonoMedico {
  codigoArea: string
  numero: string
}

export interface Medico {
  id: string
  nombre: string
  apellido: string
  especialidades: Especialidad[]
  matricula: string
  telefono?: TelefonoMedico
  cupoMaximo: number
  activo?: boolean
  // Populado desde el backend (email de la cuenta de acceso vinculada).
  usuarioId?: { id: string; email: string } | string
}
