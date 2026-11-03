import { apiFetch, apiFetchPaginado, type PaginaDeResultados } from './httpClient'
import type { Usuario, RolStaff } from '../types/Usuario'
import type { UsuarioFormValues } from '../schemas/usuario.schema'

export type OrdenUsuarios = 'nombre_asc' | 'nombre_desc' | 'reciente' | 'antiguo'

export interface FiltrosUsuarios {
  rol?: RolStaff
  estado?: 'activos' | 'inactivos' | 'todos'
  busqueda?: string
  orden?: OrdenUsuarios
  pagina?: number
  limite?: number
}

function queryUsuarios(filtros: FiltrosUsuarios): string {
  const entradas = Object.entries(filtros)
    .filter(([, valor]) => valor !== undefined && valor !== '')
    .map(([clave, valor]) => [clave, String(valor)])
  const query = new URLSearchParams(entradas).toString()
  return query ? `?${query}` : ''
}

export function getUsuarios(filtros: FiltrosUsuarios = {}): Promise<Usuario[]> {
  return apiFetch(`/usuarios${queryUsuarios(filtros)}`)
}

// Variante paginada: para PersonalPage. EditarPersonalPage sigue usando
// getUsuarios() sin `pagina`, que trae el listado completo como siempre.
export function listarUsuariosPaginado(filtros: FiltrosUsuarios = {}): Promise<PaginaDeResultados<Usuario>> {
  return apiFetchPaginado(`/usuarios${queryUsuarios(filtros)}`)
}

export function crearUsuario(usuario: UsuarioFormValues): Promise<Usuario> {
  return apiFetch('/usuarios', {
    method: 'POST',
    body: JSON.stringify(usuario),
  })
}

export function actualizarUsuario(id: string, usuario: Partial<UsuarioFormValues>): Promise<Usuario> {
  return apiFetch(`/usuarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(usuario),
  })
}

export function darDeBajaUsuario(id: string): Promise<Usuario> {
  return apiFetch(`/usuarios/${id}`, { method: 'DELETE' })
}
