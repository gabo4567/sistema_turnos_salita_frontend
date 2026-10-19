// Valor mínimo para un <input type="datetime-local"> de turno: "ahora",
// redondeado hacia arriba al próximo :00 o :30. Redondear es necesario
// porque el step de 30' del input cuenta sus pasos a partir de este min:
// si quedara en un minuto suelto (ej. "14:23"), el selector ofrecería
// 14:23, 14:53, etc. en vez de los turnos en punto o a la media hora.
export function obtenerFechaHoraMinima(): string {
  const ahora = new Date()
  const resto = ahora.getMinutes() % 30

  if (resto !== 0) {
    ahora.setMinutes(ahora.getMinutes() + (30 - resto))
  }
  ahora.setSeconds(0, 0)

  const pad = (valor: number) => String(valor).padStart(2, '0')
  return `${ahora.getFullYear()}-${pad(ahora.getMonth() + 1)}-${pad(ahora.getDate())}T${pad(ahora.getHours())}:${pad(ahora.getMinutes())}`
}
