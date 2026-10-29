import { apiFetch } from './httpClient'
import type { Paciente } from '../types/Paciente'
import type { PacienteFormValues } from '../schemas/paciente.schema'

export function crearPaciente(paciente: PacienteFormValues): Promise<Paciente> {
  return apiFetch('/pacientes', {
    method: 'POST',
    body: JSON.stringify(paciente),
  })
}

export interface FiltrosPacientes {
  obraSocial?: string
  dni?: string
  estado?: 'activos' | 'inactivos' | 'todos'
}

export function getPacientes(filtros: FiltrosPacientes = {}): Promise<Paciente[]> {
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(filtros).filter(([, valor]) => valor)) as Record<string, string>
  ).toString()

  return apiFetch(`/pacientes${query ? `?${query}` : ''}`)
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
