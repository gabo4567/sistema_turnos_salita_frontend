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
