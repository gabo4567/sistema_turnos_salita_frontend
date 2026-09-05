import { apiFetch } from './httpClient'

export function getConsultorios() {
  return apiFetch('/consultorios')
}

export function crearConsultorio(consultorio) {
  return apiFetch('/consultorios', {
    method: 'POST',
    body: JSON.stringify(consultorio),
  })
}

export function actualizarConsultorio(id, consultorio) {
  return apiFetch(`/consultorios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(consultorio),
  })
}

export function darDeBajaConsultorio(id) {
  return apiFetch(`/consultorios/${id}`, { method: 'DELETE' })
}
