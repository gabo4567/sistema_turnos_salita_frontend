import type { Direccion, Telefono, ObraSocialInfo } from '../types/Paciente'

const AUTH_URL = `${import.meta.env.VITE_API_URL}/api/auth`

export type Rol = 'admin' | 'recepcionista' | 'paciente'

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
  rol: 'admin' | 'recepcionista'
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
