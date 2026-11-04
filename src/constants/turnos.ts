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

// Para los <select> de horaInicio/horaFin al cargar el horario de un
// médico: a diferencia de generarHorariosDelDia(), acá sí incluye las
// 20:00 (como horaFin — "atiende hasta las 20:00" es un valor válido).
export function generarOpcionesHorarioConCierre(): string[] {
  return [...generarHorariosDelDia(), `${String(HORA_CIERRE).padStart(2, '0')}:00`]
}

// 1=lunes...6=sábado, coincide con Date.getUTCDay() y con lo que guarda el
// backend. Domingo no es una opción, la salita no abre ese día.
export const DIAS_SEMANA: { valor: number; etiqueta: string }[] = [
  { valor: 1, etiqueta: 'Lunes' },
  { valor: 2, etiqueta: 'Martes' },
  { valor: 3, etiqueta: 'Miércoles' },
  { valor: 4, etiqueta: 'Jueves' },
  { valor: 5, etiqueta: 'Viernes' },
  { valor: 6, etiqueta: 'Sábado' },
]
