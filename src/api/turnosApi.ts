import { apiFetch } from './httpClient'
import type { Turno, Especialidad, EstadoTurno } from '../types/Turno'
import type { TurnoFormValues } from '../schemas/turno.schema'

// Lo que efectivamente viaja al backend: fecha y hora (elegidas por
// separado en el formulario) ya combinadas en un único ISO datetime.
export type NuevoTurnoPayload = Omit<TurnoFormValues, 'fecha' | 'hora'> & { fechaTurno: string }

// Para PUT /turnos/:id: a diferencia de Turno (que trae paciente/medico/
// consultorio ya populados como objetos), acá médico y consultorio van
// como id de texto — es lo que el backend espera recibir.
export interface ActualizarTurnoPayload {
  especialidad?: Especialidad
  medico?: string
  consultorio?: string
  fechaTurno?: string
  estado?: EstadoTurno
  observaciones?: string
}

interface DisponibilidadResponse {
  ocupados: string[]
}

export function getTurnos(): Promise<Turno[]> {
  return apiFetch('/turnos')
}

export function getTurnoPorId(id: string): Promise<Turno> {
  return apiFetch(`/turnos/${id}`)
}

export function getMisTurnos(): Promise<Turno[]> {
  return apiFetch('/turnos/mis-turnos')
}

export function getMisTurnosMedico(): Promise<Turno[]> {
  return apiFetch('/turnos/mis-turnos-medico')
}

export function getDisponibilidad(medicoId: string, fecha: string, excluirTurnoId?: string): Promise<DisponibilidadResponse> {
  const exclusion = excluirTurnoId ? `&excluirTurnoId=${excluirTurnoId}` : ''
  return apiFetch(`/turnos/disponibilidad?medico=${medicoId}&fecha=${fecha}${exclusion}`)
}

export function crearTurno(turno: NuevoTurnoPayload): Promise<Turno> {
  return apiFetch('/turnos', {
    method: 'POST',
    body: JSON.stringify(turno),
  })
}

export function cancelarTurno(id: string): Promise<Turno> {
  return apiFetch(`/turnos/${id}`, { method: 'DELETE' })
}

export function actualizarTurno(id: string, datos: ActualizarTurnoPayload): Promise<Turno> {
  return apiFetch(`/turnos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  })
}
