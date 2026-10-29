import { useEffect, useRef } from 'react'

const DEMORA_MS = 4500

// Para avisos de éxito: se ocultan solos a los pocos segundos así no quedan
// pegados en pantalla si el usuario no navega ni hace otra acción. Los
// errores/advertencias NO usan esto a propósito -- ahí la persona necesita
// tiempo para leer qué pasó y decidir cómo seguir, así que se quedan fijos.
export function useAutoDismiss(valor: unknown, limpiar: () => void, demoraMs = DEMORA_MS) {
  const limpiarRef = useRef(limpiar)
  limpiarRef.current = limpiar

  useEffect(() => {
    if (!valor) return

    const id = setTimeout(() => limpiarRef.current(), demoraMs)
    return () => clearTimeout(id)
  }, [valor, demoraMs])
}
