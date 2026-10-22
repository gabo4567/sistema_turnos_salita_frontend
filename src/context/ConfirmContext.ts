import { createContext } from 'react'

export interface OpcionesConfirmacion {
  titulo?: string
  textoConfirmar?: string
  textoCancelar?: string
  variante?: 'peligro' | 'primario'
}

export type ConfirmarFn = (mensaje: string, opciones?: OpcionesConfirmacion) => Promise<boolean>

export const ConfirmContext = createContext<ConfirmarFn | null>(null)
