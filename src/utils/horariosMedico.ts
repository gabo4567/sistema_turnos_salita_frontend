import { generarHorariosDelDia } from '../constants/turnos'
import type { Medico } from '../types/Medico'

const horariosCompletos = generarHorariosDelDia()

// "fecha" es "YYYY-MM-DD": new Date(fecha) lo parsea como medianoche UTC de
// ese día, así que getUTCDay() da el día de la semana correcto en Argentina.
export function diaSemanaDe(fecha: string): number {
  return new Date(fecha).getUTCDay()
}

// Horarios que la grilla puede ofrecer para este médico y esta fecha, antes
// de descontar los ya ocupados (eso lo resuelve getDisponibilidad aparte).
// Vacío significa "el médico no atiende este día".
export function horariosDelMedicoParaFecha(medico: Medico | undefined, fecha: string): string[] {
  if (!fecha) return []

  const dia = diaSemanaDe(fecha)

  if (!medico?.horarios || medico.horarios.length === 0) {
    // Sin horario configurado: lunes a viernes, horario completo de la
    // salita — el comportamiento de siempre.
    if (dia === 0 || dia === 6) return []
    return horariosCompletos
  }

  const bloque = medico.horarios.find((b) => b.diaSemana === dia)
  if (!bloque) return []

  return horariosCompletos.filter((hora) => hora >= bloque.horaInicio && hora < bloque.horaFin)
}
