// Para comparar texto en búsquedas sin que importen mayúsculas ni acentos
// (ej. que "sanchez" encuentre a "SÁNCHEZ").
export function normalizarTexto(valor: string): string {
  return valor
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

// Arma "Nombre Apellido" tolerando que el apellido falte (datos viejos,
// de antes de separar los campos).
export function nombreCompleto(persona: { nombre?: string; apellido?: string }): string {
  return [persona.nombre, persona.apellido].filter(Boolean).join(' ')
}
