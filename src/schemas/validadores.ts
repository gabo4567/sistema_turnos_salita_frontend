// Valida el valor crudo de un <input type="datetime-local"> (ej. "2026-10-15T10:00"):
// los minutos tienen que ser "00" o "30", para que los turnos queden siempre en punto o a la media hora.
export const esHorarioEnMediaHora = (valor: string): boolean => {
  const minutos = valor.split('T')[1]?.split(':')[1]?.slice(0, 2)
  return minutos === '00' || minutos === '30'
}

export const MENSAJE_HORARIO_MEDIA_HORA = 'El turno debe ser en punto o a la media hora (ej. 10:00 o 10:30)'
