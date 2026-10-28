import type { Especialidad } from '../types/Turno'

export const ESPECIALIDADES: { valor: Especialidad; etiqueta: string }[] = [
  { valor: 'cardiologia', etiqueta: 'Cardiología' },
  { valor: 'neurologia', etiqueta: 'Neurología' },
  { valor: 'pediatria', etiqueta: 'Pediatría' },
  { valor: 'dermatologia', etiqueta: 'Dermatología' },
]

// Horario de atención de la salita: 08:00 a 20:00, turnos de 30'. El
// último horario disponible es 19:30 (HORA_CIERRE queda como límite
// exclusivo, no se ofrece un turno "a las 20:00").
const HORA_APERTURA = 8
const HORA_CIERRE = 20

export function generarHorariosDelDia(): string[] {
  const horarios: string[] = []

  for (let hora = HORA_APERTURA; hora < HORA_CIERRE; hora++) {
    horarios.push(`${String(hora).padStart(2, '0')}:00`)
    horarios.push(`${String(hora).padStart(2, '0')}:30`)
  }

  return horarios
}
