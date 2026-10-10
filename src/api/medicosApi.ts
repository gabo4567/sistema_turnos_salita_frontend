import { apiFetch } from './httpClient'
import type { Medico } from '../types/Medico'
import type { MedicoFormValues } from '../schemas/medico.schema'

export function getMedicos(): Promise<Medico[]> {
  return apiFetch('/medicos')
}

export function crearMedico(medico: MedicoFormValues): Promise<Medico> {
  return apiFetch('/medicos', {
    method: 'POST',
    body: JSON.stringify(medico),
  })
}

export function actualizarMedico(id: string, medico: Partial<MedicoFormValues>): Promise<Medico> {
  return apiFetch(`/medicos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(medico),
  })
}

export function darDeBajaMedico(id: string): Promise<Medico> {
  return apiFetch(`/medicos/${id}`, { method: 'DELETE' })
}
