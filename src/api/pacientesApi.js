import { apiFetch } from './httpClient'

export function crearPaciente(paciente) {
  return apiFetch('/pacientes', {
    method: 'POST',
    body: JSON.stringify(paciente),
  })
}

export function getPacientes(filtros = {}) {
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(filtros).filter(([, valor]) => valor))
  ).toString()

  return apiFetch(`/pacientes${query ? `?${query}` : ''}`)
}

export function actualizarPaciente(id, paciente) {
  return apiFetch(`/pacientes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(paciente),
  })
}
