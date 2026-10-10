import { apiFetch } from './httpClient'
import type { AnalisisClinico } from '../types/AnalisisClinico'
import type { HistorialMedicoEntry } from '../types/Paciente'

export function analizarHistorial(historialMedico: HistorialMedicoEntry[]): Promise<AnalisisClinico> {
  return apiFetch('/ia/analisis-clinico', {
    method: 'POST',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify({ historialMedico }),
  })
}
