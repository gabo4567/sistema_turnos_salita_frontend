import { apiFetch } from './httpClient'

export function crearPaciente(paciente) {
  return apiFetch('/pacientes', {
    method: 'POST',
    body: JSON.stringify(paciente),
  })
}
