const API_URL = 'http://localhost:3000/api/v1/pacientes'

export class PacienteApiError extends Error {
  constructor(message, errores = []) {
    super(message)
    this.name = 'PacienteApiError'
    this.errores = errores
  }
}

export async function crearPaciente(paciente) {
  let response

  try {
    response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paciente),
    })
  } catch {
    throw new PacienteApiError(
      'No se pudo conectar con el servidor en http://localhost:3000. Verificá que el backend esté corriendo (si la consola del navegador muestra un error de CORS, avisale a quien mantiene el backend).'
    )
  }

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    const mensajes = Array.isArray(body?.data)
      ? body.data
      : body?.data
        ? [String(body.data)]
        : []
    throw new PacienteApiError(body?.message ?? 'Error al crear el paciente', mensajes)
  }

  return body.data
}
