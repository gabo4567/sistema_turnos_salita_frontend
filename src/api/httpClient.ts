const BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1`

interface RespuestaEstandar<T> {
  success: boolean
  timestamp: string
  message: string
  total: number
  data?: T
}

export class ApiError extends Error {
  errores: string[]

  constructor(message: string, errores: string[] = []) {
    super(message)
    this.name = 'ApiError'
    this.errores = errores
  }
}

interface ApiFetchOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>
}

export function extraerMensaje(error: unknown): string {
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado'
}

export function extraerMensajesError(error: unknown): string[] {
  if (error instanceof ApiError && error.errores.length) return error.errores
  if (error instanceof Error) return [error.message]
  return ['Ocurrió un error inesperado']
}

export async function apiFetch<T>(path: string, { headers, ...options }: ApiFetchOptions = {}): Promise<T> {
  let response: Response

  const token = localStorage.getItem('token')

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('La operación tardó demasiado y se canceló. Probá de nuevo.')
    }
    throw new ApiError(
      `No se pudo conectar con el servidor en ${BASE_URL}. Verificá que el backend esté corriendo (si la consola del navegador muestra un error de CORS, avisale a quien mantiene el backend).`
    )
  }

  const body: RespuestaEstandar<T> | null = await response.json().catch(() => null)

  if (!response.ok) {
    const mensajes = Array.isArray(body?.data)
      ? (body.data as unknown as string[])
      : body?.data
        ? [String(body.data)]
        : []
    throw new ApiError(body?.message ?? 'Error al comunicarse con el servidor', mensajes)
  }

  return body?.data as T
}
