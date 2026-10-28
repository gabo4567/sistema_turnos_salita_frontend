import type { Paciente } from './Paciente'
import type { Medico } from './Medico'
import type { Consultorio } from './Consultorio'

export type Especialidad = 'cardiologia' | 'neurologia' | 'pediatria' | 'dermatologia'

export type EstadoTurno = 'pendiente' | 'llamado' | 'atendido' | 'cancelado' | 'no_asistio'

export interface Turno {
  id: string
  paciente: Paciente
  especialidad: Especialidad
  medico?: Medico
  consultorio?: Consultorio
  fechaTurno: string
  estado?: EstadoTurno
  observaciones?: string
}
