import { apiFetch, apiFetchPaginado, type PaginaDeResultados } from './httpClient'
import type { Paciente } from '../types/Paciente'
import type { PacienteFormValues } from '../schemas/paciente.schema'

export function crearPaciente(paciente: PacienteFormValues): Promise<Paciente> {
  return apiFetch('/pacientes', {
    method: 'POST',
    body: JSON.stringify(paciente),
  })
}

export type OrdenPacientes = 'apellido_asc' | 'apellido_desc' | 'reciente' | 'antiguo'

export interface FiltrosPacientes {
  obraSocial?: string
  dni?: string
  estado?: 'activos' | 'inactivos' | 'todos'
  busqueda?: string
  orden?: OrdenPacientes
  pagina?: number
  limite?: number
}

function queryPacientes(filtros: FiltrosPacientes): string {
  const entradas = Object.entries(filtros)
    .filter(([, valor]) => valor !== undefined && valor !== '')
    .map(([clave, valor]) => [clave, String(valor)])
  const query = new URLSearchParams(entradas).toString()
  return query ? `?${query}` : ''
}

export function getPacientes(filtros: FiltrosPacientes = {}): Promise<Paciente[]> {
  return apiFetch(`/pacientes${queryPacientes(filtros)}`)
}

// Variante paginada: para usar cuando se manda `pagina` (PacientesPage). El
// resto de las pantallas sigue usando getPacientes() sin ese parámetro, que
// trae el listado completo como siempre.
export function listarPacientesPaginado(filtros: FiltrosPacientes = {}): Promise<PaginaDeResultados<Paciente>> {
  return apiFetchPaginado(`/pacientes${queryPacientes(filtros)}`)
}

export function actualizarPaciente(id: string, paciente: Partial<Paciente>): Promise<Paciente> {
  return apiFetch(`/pacientes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(paciente),
  })
}

export function darDeBajaPaciente(id: string): Promise<Paciente> {
  return apiFetch(`/pacientes/${id}`, { method: 'DELETE' })
}
