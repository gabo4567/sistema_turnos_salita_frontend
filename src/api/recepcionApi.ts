import { apiFetch } from './httpClient'
import type { Turno } from '../types/Turno'
import type { RecepcionFormValues } from '../schemas/recepcion.schema'

export type NuevaRecepcionPayload = Omit<RecepcionFormValues, 'fecha' | 'hora'> & { fechaTurno: string }

export function crearRecepcion(datos: NuevaRecepcionPayload): Promise<Turno> {
  return apiFetch('/recepcion', {
    method: 'POST',
    body: JSON.stringify(datos),
  })
}
