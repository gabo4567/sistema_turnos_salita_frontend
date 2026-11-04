import { generarHorariosDelDia } from '../constants/turnos'
import type { Medico } from '../types/Medico'

const horariosCompletos = generarHorariosDelDia()

// "fecha" es "YYYY-MM-DD": new Date(fecha) lo parsea como medianoche UTC de
// ese día, así que getUTCDay() da el día de la semana correcto en Argentina.
export function diaSemanaDe(fecha: string): number {
  return new Date(fecha).getUTCDay()
}

// Un médico sin horario cargado no tiene turnos disponibles — ver
// medicoSinHorarioConfigurado(), que distingue ese caso de "no atiende
// este día" para mostrar un mensaje distinto en la grilla.
export function medicoSinHorarioConfigurado(medico: Medico | undefined): boolean {
  return !medico?.horarios || medico.horarios.length === 0
}

// Horarios que la grilla puede ofrecer para este médico y esta fecha, antes
// de descontar los ya ocupados (eso lo resuelve getDisponibilidad aparte).
// Vacío significa "el médico no atiende este día" (o no tiene horario
// cargado en absoluto — chequeado aparte con medicoSinHorarioConfigurado).
export function horariosDelMedicoParaFecha(medico: Medico | undefined, fecha: string): string[] {
  if (!fecha || !medico?.horarios || medico.horarios.length === 0) return []

  const dia = diaSemanaDe(fecha)
  const bloque = medico.horarios.find((b) => b.diaSemana === dia)
  if (!bloque) return []

  return horariosCompletos.filter((hora) => hora >= bloque.horaInicio && hora < bloque.horaFin)
}
