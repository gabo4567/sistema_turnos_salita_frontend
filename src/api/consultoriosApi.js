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
