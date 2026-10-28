import { apiFetch } from './httpClient'
import type { Turno } from '../types/Turno'
import type { TurnoFormValues } from '../schemas/turno.schema'

// Lo que efectivamente viaja al backend: fecha y hora (elegidas por
// separado en el formulario) ya combinadas en un único ISO datetime.
export type NuevoTurnoPayload = Omit<TurnoFormValues, 'fecha' | 'hora'> & { fechaTurno: string }

interface DisponibilidadResponse {
  ocupados: string[]
}

export function getTurnos(): Promise<Turno[]> {
  return apiFetch('/turnos')
}

export function getMisTurnos(): Promise<Turno[]> {
  return apiFetch('/turnos/mis-turnos')
}

export function getMisTurnosMedico(): Promise<Turno[]> {
  return apiFetch('/turnos/mis-turnos-medico')
}

export function getDisponibilidad(medicoId: string, fecha: string): Promise<DisponibilidadResponse> {
  return apiFetch(`/turnos/disponibilidad?medico=${medicoId}&fecha=${fecha}`)
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

export function actualizarTurno(id: string, datos: Partial<Turno>): Promise<Turno> {
  return apiFetch(`/turnos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  })
}
