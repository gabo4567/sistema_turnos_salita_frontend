export type TipoTelefono = 'CELULAR' | 'FIJO' | 'TRABAJO'

export type ObraSocial =
  | 'PAMI'
  | 'OSPEL'
  | 'OSDE'
  | 'SANCOR'
  | 'OSECAC'
  | 'SWISS MEDICAL'
  | 'GALENO'
  | 'MEDICUS'
  | 'OMINT'
  | 'FEMEBA'
  | 'OTRAS'
  | 'NINGUNA'

export interface Direccion {
  calle: string
  numero: string
  piso?: string
  departamento?: string
  barrio?: string
}

export interface Telefono {
  tipo?: TipoTelefono
  codigoArea: string
  numero: string
}

export interface ObraSocialInfo {
  nombre: ObraSocial
  numeroAfiliado?: string
}

export interface HistorialMedicoEntry {
  _id?: string
  fecha: string
  diagnostico: string
  tratamiento: string
  medico: string
}

export interface Paciente {
  id: string
  nombre: string
  dni: string
  direccion: Direccion
  email: string
  telefono: Telefono
  obraSocial: ObraSocialInfo
  historialMedico: HistorialMedicoEntry[]
  activo?: boolean
}
