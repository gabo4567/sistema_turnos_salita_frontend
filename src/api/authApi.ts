const AUTH_URL = 'http://localhost:3000/api/auth'

export interface LoginResponse {
  ok: boolean
  token?: string
  nombre?: string
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${AUTH_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  return response.json()
}
