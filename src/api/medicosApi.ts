import { apiFetch } from './httpClient'
import type { Medico } from '../types/Medico'
import type { MedicoFormValues, ActualizarMedicoFormValues } from '../schemas/medico.schema'

export interface FiltrosMedicos {
  estado?: 'activos' | 'inactivos' | 'todos'
}

export function getMedicos(filtros: FiltrosMedicos = {}): Promise<Medico[]> {
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(filtros).filter(([, valor]) => valor)) as Record<string, string>
  ).toString()

  return apiFetch(`/medicos${query ? `?${query}` : ''}`)
}

export function getMiMedico(): Promise<Medico> {
  return apiFetch('/medicos/me')
}

export function crearMedico(medico: MedicoFormValues): Promise<Medico> {
  return apiFetch('/medicos', {
    method: 'POST',
    body: JSON.stringify(medico),
  })
}

export function actualizarMedico(id: string, medico: Partial<ActualizarMedicoFormValues>): Promise<Medico> {
  return apiFetch(`/medicos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(medico),
  })
}

export function darDeBajaMedico(id: string): Promise<Medico> {
  return apiFetch(`/medicos/${id}`, { method: 'DELETE' })
}
