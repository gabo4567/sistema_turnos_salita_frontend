import { apiFetch, apiFetchPaginado, type PaginaDeResultados } from './httpClient'
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

export interface FiltrosListadoTurnos {
  estado?: FiltroEstado
  medico?: string
  especialidad?: Especialidad
  rango?: 'hoy' | 'todos'
  fechaDesde?: string
  fechaHasta?: string
  busquedaPaciente?: string
  pagina?: number
  limite?: number
}

function queryTurnos(filtros: FiltrosListadoTurnos): string {
  const entradas = Object.entries(filtros)
    .filter(([, valor]) => valor !== undefined && valor !== '')
    .map(([clave, valor]) => [clave, String(valor)])
  const query = new URLSearchParams(entradas).toString()
  return query ? `?${query}` : ''
}

// Para TurnosPage: Hoy/Todos, Desde/Hasta, estado, búsqueda por paciente,
// médico y especialidad se resuelven todos en el backend, para que
// combinen bien con la paginación.
export function listarTurnosPaginado(filtros: FiltrosListadoTurnos = {}): Promise<PaginaDeResultados<Turno>> {
  return apiFetchPaginado(`/turnos${queryTurnos(filtros)}`)
}

export function getTurnoPorId(id: string): Promise<Turno> {
  return apiFetch(`/turnos/${id}`)
}

export function getMisTurnos(estado?: FiltroEstado): Promise<Turno[]> {
  return apiFetch(`/turnos/mis-turnos${estado ? `?estado=${estado}` : ''}`)
}

// Mismos filtros que el listado general, sin médico ni especialidad
// (siempre son los del médico logueado).
export interface FiltrosMisTurnosMedico {
  estado?: FiltroEstado
  rango?: 'hoy' | 'todos'
  fechaDesde?: string
  fechaHasta?: string
  busquedaPaciente?: string
  pagina?: number
  limite?: number
}

// Para MisTurnosMedicoPage: Hoy/Todos, Desde/Hasta, estado y búsqueda por
// paciente se resuelven en el backend, igual que en el listado general.
export function listarMisTurnosMedicoPaginado(
  filtros: FiltrosMisTurnosMedico = {}
): Promise<PaginaDeResultados<Turno>> {
  return apiFetchPaginado(`/turnos/mis-turnos-medico${queryTurnos(filtros)}`)
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

export interface ResumenAusenciaMedico {
  cantidadTurnosHoy: number
  proximaFechaQueAtiende: string | null
}

// Antes de confirmar, para mostrarle al médico cuántos turnos tiene hoy y a
// qué día se moverían si confirma.
export function obtenerResumenAusenciaMedico(): Promise<ResumenAusenciaMedico> {
  return apiFetch('/turnos/ausencia-medico/resumen')
}

export function marcarAusenciaMedico(): Promise<{ reprogramados: number; cancelados: number }> {
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
