import { useEffect, useState } from 'react'

// Para inputs de búsqueda que ahora disparan un fetch al backend en vez de
// filtrar en memoria: evita un pedido por cada tecla.
export function useDebounce<T>(valor: T, demoraMs = 350): T {
  const [valorDebounced, setValorDebounced] = useState(valor)

  useEffect(() => {
    const timeout = setTimeout(() => setValorDebounced(valor), demoraMs)
    return () => clearTimeout(timeout)
  }, [valor, demoraMs])

  return valorDebounced
}
