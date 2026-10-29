import { apiFetch } from './httpClient'
import type { Consultorio } from '../types/Consultorio'
import type { ConsultorioFormValues } from '../schemas/consultorio.schema'

export interface FiltrosConsultorios {
  estado?: 'activos' | 'inactivos' | 'todos'
}

export function getConsultorios(filtros: FiltrosConsultorios = {}): Promise<Consultorio[]> {
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(filtros).filter(([, valor]) => valor)) as Record<string, string>
  ).toString()

  return apiFetch(`/consultorios${query ? `?${query}` : ''}`)
}

export function crearConsultorio(consultorio: ConsultorioFormValues): Promise<Consultorio> {
  return apiFetch('/consultorios', {
    method: 'POST',
    body: JSON.stringify(consultorio),
  })
}

export function actualizarConsultorio(id: string, consultorio: Partial<ConsultorioFormValues>): Promise<Consultorio> {
  return apiFetch(`/consultorios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(consultorio),
  })
}

export function darDeBajaConsultorio(id: string): Promise<Consultorio> {
  return apiFetch(`/consultorios/${id}`, { method: 'DELETE' })
}
