import type { Especialidad } from './Turno'

export interface TelefonoMedico {
  codigoArea: string
  numero: string
}

// 1=lunes...6=sábado. Un médico sin bloques cargados atiende lunes a
// viernes, horario completo de la salita (ver DIAS_SEMANA en constants/turnos).
export interface BloqueHorarioMedico {
  diaSemana: number
  horaInicio: string
  horaFin: string
}

export interface Medico {
  id: string
  nombre: string
  apellido: string
  especialidades: Especialidad[]
  matricula: string
  telefono?: TelefonoMedico
  cupoMaximo: number
  horarios?: BloqueHorarioMedico[]
  activo?: boolean
  // Populado desde el backend (email de la cuenta de acceso vinculada).
  usuarioId?: { id: string; email: string } | string
}
