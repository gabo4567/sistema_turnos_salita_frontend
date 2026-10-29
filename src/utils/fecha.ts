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

// "fecha" es un string "YYYY-MM-DD" (el valor crudo de <input type="date">,
// sin hora). new Date(fecha) lo parsea como medianoche UTC -- hay que leer
// el día con getUTCDay(), no getDay(), porque en UTC-3 (Argentina) la
// versión local daría el día de la fecha anterior.
export function esFinDeSemana(fecha: string): boolean {
  const dia = new Date(fecha).getUTCDay()
  return dia === 0 || dia === 6
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
