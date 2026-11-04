const pad = (valor: number) => String(valor).padStart(2, '0')

// Fecha de hoy en formato "YYYY-MM-DD", para el min del <input type="date">
// y para saber si la fecha elegida en el selector de turno es hoy.
export function obtenerFechaMinima(): string {
  const ahora = new Date()
  return `${ahora.getFullYear()}-${pad(ahora.getMonth() + 1)}-${pad(ahora.getDate())}`
}

export function esFechaDeHoy(fecha: string): boolean {
  return fecha === obtenerFechaMinima()
}

// Fecha y hora actual en formato "YYYY-MM-DDTHH:mm" (hora local), para el
// max de un <input type="datetime-local"> que no debe aceptar fechas
// futuras (ej. entradas de historia clínica).
export function obtenerFechaHoraActual(): string {
  const ahora = new Date()
  return `${obtenerFechaMinima()}T${pad(ahora.getHours())}:${pad(ahora.getMinutes())}`
}

// Hora actual en formato "HH:mm", redondeada hacia arriba al próximo :00 o
// :30 — para tachar en la grilla de horarios los bloques que ya pasaron
// cuando la fecha elegida es hoy.
export function horaActualRedondeada(): string {
  const ahora = new Date()
  const resto = ahora.getMinutes() % 30

  if (resto !== 0) {
    ahora.setMinutes(ahora.getMinutes() + (30 - resto))
  }

  return `${pad(ahora.getHours())}:${pad(ahora.getMinutes())}`
}
