// Para comparar texto en búsquedas sin que importen mayúsculas ni acentos
// (ej. que "sanchez" encuentre a "SÁNCHEZ").
export function normalizarTexto(valor: string): string {
  return valor
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}
