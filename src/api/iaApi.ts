import { apiFetch } from './httpClient'
import type { AnalisisClinico } from '../types/AnalisisClinico'
import type { HistorialMedicoEntry } from '../types/Paciente'

const TIMEOUT_MS = 20_000

export function analizarHistorial(historialMedico: HistorialMedicoEntry[]): Promise<AnalisisClinico> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

  return apiFetch<AnalisisClinico>('/ia/analisis-clinico', {
    method: 'POST',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify({ historialMedico }),
    signal: controller.signal,
  }).finally(() => clearTimeout(timeoutId))
}
