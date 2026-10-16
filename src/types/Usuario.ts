export type RolStaff = 'admin' | 'recepcionista'

export interface Usuario {
  id: string
  nombre: string
  email: string
  rol: RolStaff
}
