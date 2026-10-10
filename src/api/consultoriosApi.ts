import { apiFetch } from './httpClient'
import type { Consultorio } from '../types/Consultorio'
import type { ConsultorioFormValues } from '../schemas/consultorio.schema'

export function getConsultorios(): Promise<Consultorio[]> {
  return apiFetch('/consultorios')
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
