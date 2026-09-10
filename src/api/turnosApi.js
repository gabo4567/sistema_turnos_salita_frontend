import { apiFetch } from './httpClient'

export function getTurnos() {
  return apiFetch('/turnos')
}

export function crearTurno(turno) {
  return apiFetch('/turnos', {
    method: 'POST',
    headers: { Authorization: 'token123' },
    body: JSON.stringify(turno),
  })
}

export function cancelarTurno(id) {
  return apiFetch(`/turnos/${id}`, { method: 'DELETE' })
}

export function actualizarTurno(id, datos) {
  return apiFetch(`/turnos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  })
}
