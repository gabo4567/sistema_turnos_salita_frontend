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

// Filtro de estado compartido por los 3 listados: 'activos' (todo menos
// cancelados, el comportamiento de siempre) y 'todos' (sin restricción,
// incluye cancelados) se suman a los estados puntuales.
export type FiltroEstado = EstadoTurno | 'activos' | 'todos'

export function getTurnos(estado?: FiltroEstado): Promise<Turno[]> {
  return apiFetch(`/turnos${estado ? `?estado=${estado}` : ''}`)
}

export function getTurnoPorId(id: string): Promise<Turno> {
  return apiFetch(`/turnos/${id}`)
}

export function getMisTurnos(estado?: FiltroEstado): Promise<Turno[]> {
  return apiFetch(`/turnos/mis-turnos${estado ? `?estado=${estado}` : ''}`)
}

export type PeriodoFiltro = 'hoy' | 'semana' | 'mes' | '6meses'

export interface FiltrosMisTurnosMedico {
  estado?: FiltroEstado
  periodo?: PeriodoFiltro
}

export function getMisTurnosMedico(filtros: FiltrosMisTurnosMedico = {}): Promise<Turno[]> {
  const parametros = new URLSearchParams()
  if (filtros.estado) parametros.set('estado', filtros.estado)
  if (filtros.periodo) parametros.set('periodo', filtros.periodo)
  const query = parametros.toString()
  return apiFetch(`/turnos/mis-turnos-medico${query ? `?${query}` : ''}`)
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

export function marcarAusenciaMedico(): Promise<{ cancelados: number }> {
  return apiFetch('/turnos/ausencia-medico', { method: 'PATCH' })
}

export function marcarLlamado(id: string): Promise<Turno> {
  return apiFetch(`/turnos/${id}/llamar`, { method: 'PATCH' })
}

export function marcarFinalizado(id: string): Promise<Turno> {
  return apiFetch(`/turnos/${id}/finalizar`, { method: 'PATCH' })
}

export function actualizarTurno(id: string, datos: ActualizarTurnoPayload): Promise<Turno> {
  return apiFetch(`/turnos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  })
}
