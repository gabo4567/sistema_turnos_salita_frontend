import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

interface UseFetchResult<T> {
  datos: T | null
  setDatos: Dispatch<SetStateAction<T | null>>
  cargando: boolean
  error: string | null
  setError: Dispatch<SetStateAction<string | null>>
}

export function useFetch<T>(fetcher: () => Promise<T>, dependencias: unknown[] = []): UseFetchResult<T> {
  const [datos, setDatos] = useState<T | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelado = false
    setCargando(true)
    setError(null)

    fetcher()
      .then((resultado) => {
        if (!cancelado) setDatos(resultado)
      })
      .catch((err) => {
        if (!cancelado) setError(err instanceof Error ? err.message : String(err))
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })

    return () => {
      cancelado = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencias)

  return { datos, setDatos, cargando, error, setError }
}
