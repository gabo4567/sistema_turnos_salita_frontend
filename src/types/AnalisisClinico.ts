export type NivelGravedad = 'bajo' | 'medio' | 'alto'

export interface AnalisisClinico {
  resumenClinico: string
  medicamentosDetectados: string[]
  nivelGravedad: NivelGravedad
}
