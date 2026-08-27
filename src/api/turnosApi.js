import { apiFetch } from './httpClient'

export function getTurnos() {
  return apiFetch('/turnos')
}
