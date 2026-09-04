import { useEffect, useState } from 'react'

export function useFetch(fetcher, dependencias = []) {
  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelado = false
    setCargando(true)
    setError(null)

    fetcher()
      .then((resultado) => {
        if (!cancelado) setDatos(resultado)
      })
      .catch((err) => {
        if (!cancelado) setError(err.message)
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })

    return () => {
      cancelado = true
    }
  }, dependencias)

  return { datos, setDatos, cargando, error, setError }
}
