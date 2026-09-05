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

export function actualizarMedico(id, medico) {
  return apiFetch(`/medicos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(medico),
  })
}

export function darDeBajaMedico(id) {
  return apiFetch(`/medicos/${id}`, { method: 'DELETE' })
}
