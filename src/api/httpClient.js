const BASE_URL = 'http://localhost:3000/api/v1'

export class ApiError extends Error {
  constructor(message, errores = []) {
    super(message)
    this.name = 'ApiError'
    this.errores = errores
  }
}

export async function apiFetch(path, options = {}) {
  let response

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch {
    throw new ApiError(
      `No se pudo conectar con el servidor en ${BASE_URL}. Verificá que el backend esté corriendo (si la consola del navegador muestra un error de CORS, avisale a quien mantiene el backend).`
    )
  }

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    const mensajes = Array.isArray(body?.data)
      ? body.data
      : body?.data
        ? [String(body.data)]
        : []
    throw new ApiError(body?.message ?? 'Error al comunicarse con el servidor', mensajes)
  }

  return body?.data
}
