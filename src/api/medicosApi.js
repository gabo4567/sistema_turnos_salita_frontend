import { apiFetch } from './httpClient'

export function getMedicos() {
  return apiFetch('/medicos')
}

export function crearMedico(medico) {
  return apiFetch('/medicos', {
    method: 'POST',
    body: JSON.stringify(medico),
  })
}
