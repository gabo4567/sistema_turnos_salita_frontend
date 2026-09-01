export function actualizarCampoAnidado(objeto, camino, valor) {
  const [clave, ...resto] = camino

  if (resto.length === 0) {
    return { ...objeto, [clave]: valor }
  }

  return { ...objeto, [clave]: actualizarCampoAnidado(objeto[clave] ?? {}, resto, valor) }
}
