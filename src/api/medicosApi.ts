import { apiFetch, apiFetchPaginado, type PaginaDeResultados } from './httpClient'
import type { Medico, BloqueHorarioMedico } from '../types/Medico'
import type { MedicoFormValues, ActualizarMedicoFormValues } from '../schemas/medico.schema'

// Igual que el form, pero con `horarios` ya convertido al array que espera
// el backend (ver horariosAPayload en schemas/medico.schema.ts) en vez de
// las 6 filas "densas" que usa el formulario.
export type CrearMedicoPayload = Omit<MedicoFormValues, 'horarios'> & { horarios: BloqueHorarioMedico[] }
export type ActualizarMedicoPayload = Partial<Omit<ActualizarMedicoFormValues, 'horarios'>> & {
  horarios?: BloqueHorarioMedico[]
}

export type OrdenMedicos = 'apellido_asc' | 'apellido_desc' | 'reciente' | 'antiguo'

export interface FiltrosMedicos {
  estado?: 'activos' | 'inactivos' | 'todos'
  especialidad?: string
  busqueda?: string
  orden?: OrdenMedicos
  pagina?: number
  limite?: number
}

function queryMedicos(filtros: FiltrosMedicos): string {
  const entradas = Object.entries(filtros)
    .filter(([, valor]) => valor !== undefined && valor !== '')
    .map(([clave, valor]) => [clave, String(valor)])
  const query = new URLSearchParams(entradas).toString()
  return query ? `?${query}` : ''
}

export function getMedicos(filtros: FiltrosMedicos = {}): Promise<Medico[]> {
  return apiFetch(`/medicos${queryMedicos(filtros)}`)
}

// Variante paginada: para MedicosPage. El resto de las pantallas sigue
// usando getMedicos() sin `pagina`, que trae el listado completo como hoy.
export function listarMedicosPaginado(filtros: FiltrosMedicos = {}): Promise<PaginaDeResultados<Medico>> {
  return apiFetchPaginado(`/medicos${queryMedicos(filtros)}`)
}

export function getMiMedico(): Promise<Medico> {
  return apiFetch('/medicos/me')
}

export function crearMedico(medico: CrearMedicoPayload): Promise<Medico> {
  return apiFetch('/medicos', {
    method: 'POST',
    body: JSON.stringify(medico),
  })
}

export function actualizarMedico(id: string, medico: ActualizarMedicoPayload): Promise<Medico> {
  return apiFetch(`/medicos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(medico),
  })
}

export function darDeBajaMedico(id: string): Promise<Medico> {
  return apiFetch(`/medicos/${id}`, { method: 'DELETE' })
}
