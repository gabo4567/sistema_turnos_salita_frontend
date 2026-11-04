import type { Especialidad } from './Turno'

export interface TelefonoMedico {
  codigoArea: string
  numero: string
}

// 1=lunes...5=viernes (la salita no abre sábados ni domingos). Un médico
// sin bloques cargados todavía no puede recibir turnos (ver DIAS_SEMANA en
// constants/turnos y medicoSinHorarioConfigurado en utils/horariosMedico).
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
