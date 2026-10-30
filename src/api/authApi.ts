import type { Direccion, Telefono, ObraSocialInfo } from '../types/Paciente'
import { ApiError } from './httpClient'

const AUTH_URL = `${import.meta.env.VITE_API_URL}/api/auth`

export type Rol = 'admin' | 'recepcionista' | 'paciente' | 'medico'

export interface LoginResponse {
  ok: boolean
  token?: string
  nombre?: string
  rol?: Rol
}

export async function login(usuario: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${AUTH_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, password }),
  })

  return response.json()
}

export interface PerfilStaff {
  rol: 'admin' | 'recepcionista' | 'medico'
  nombre: string
  email: string
}

export interface PerfilPaciente {
  rol: 'paciente'
  nombre: string
  dni: string
  email: string
  telefono: Telefono
  direccion: Direccion
  obraSocial: ObraSocialInfo
}

export type Perfil = PerfilStaff | PerfilPaciente

// Respuesta estándar del backend ({ success, message, data }), distinta del
// contrato { ok, token } de /login — estos dos endpoints sí la usan.
interface RespuestaEstandar {
  success: boolean
  message: string
  data?: string[]
}

export async function olvidePassword(email: string): Promise<string> {
  const response = await fetch(`${AUTH_URL}/olvide-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })

  const body: RespuestaEstandar = await response.json()

  if (!response.ok) {
    throw new ApiError(body.message ?? 'No se pudo procesar el pedido', body.data ?? [])
  }

  return body.message
}

export async function restablecerPassword(token: string, password: string): Promise<string> {
  const response = await fetch(`${AUTH_URL}/restablecer-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
  })

  const body: RespuestaEstandar = await response.json()

  if (!response.ok) {
    throw new ApiError(body.message ?? 'No se pudo restablecer la contraseña', body.data ?? [])
  }

  return body.message
}

export async function getMiPerfil(): Promise<Perfil> {
  const response = await fetch(`${AUTH_URL}/me`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

  const body = await response.json()

  if (!response.ok) {
    throw new Error(body?.message ?? 'No se pudo obtener el perfil')
  }

  return body.data
}
