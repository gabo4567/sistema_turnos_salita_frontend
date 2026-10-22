import { useContext } from 'react'
import { ConfirmContext, type ConfirmarFn } from '../context/ConfirmContext'

export function useConfirm(): ConfirmarFn {
  const contexto = useContext(ConfirmContext)
  if (!contexto) {
    throw new Error('useConfirm debe usarse dentro de <ConfirmProvider>')
  }
  return contexto
}
