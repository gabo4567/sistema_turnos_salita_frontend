import { apiFetch } from './httpClient'

export function crearRecepcion(datos) {
  return apiFetch('/recepcion', {
    method: 'POST',
    body: JSON.stringify(datos),
  })
}
