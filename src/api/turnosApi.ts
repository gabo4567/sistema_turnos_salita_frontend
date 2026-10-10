import { apiFetch } from './httpClient'
import type { Turno } from '../types/Turno'
import type { TurnoFormValues } from '../schemas/turno.schema'

export function getTurnos(): Promise<Turno[]> {
  return apiFetch('/turnos')
}

export function crearTurno(turno: TurnoFormValues): Promise<Turno> {
  return apiFetch('/turnos', {
    method: 'POST',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
