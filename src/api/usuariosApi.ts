import { apiFetch } from './httpClient'
import type { Usuario } from '../types/Usuario'
import type { UsuarioFormValues } from '../schemas/usuario.schema'

const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

export function getUsuarios(): Promise<Usuario[]> {
  return apiFetch('/usuarios', { headers: authHeaders() })
}

export function crearUsuario(usuario: UsuarioFormValues): Promise<Usuario> {
  return apiFetch('/usuarios', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(usuario),
  })
}

export function actualizarUsuario(id: string, usuario: Partial<UsuarioFormValues>): Promise<Usuario> {
  return apiFetch(`/usuarios/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(usuario),
  })
}

export function darDeBajaUsuario(id: string): Promise<Usuario> {
  return apiFetch(`/usuarios/${id}`, { method: 'DELETE', headers: authHeaders() })
}
