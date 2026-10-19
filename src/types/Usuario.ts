export type RolStaff = 'admin' | 'recepcionista' | 'medico'

export interface Usuario {
  id: string
  nombre: string
  email: string
  rol: RolStaff
}
