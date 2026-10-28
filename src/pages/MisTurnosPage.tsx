import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getMisTurnos, cancelarTurno, type FiltroEstado } from '../api/turnosApi'
import { extraerMensaje } from '../api/httpClient'
import { useFetch } from '../hooks/useFetch'
import { useConfirm } from '../hooks/useConfirm'
import { ESPECIALIDADES } from '../constants/turnos'
import type { Turno } from '../types/Turno'

const OPCIONES_ESTADO: { valor: FiltroEstado; etiqueta: string }[] = [
  { valor: 'activos', etiqueta: 'Activos' },
  { valor: 'cancelado', etiqueta: 'Cancelados' },
  { valor: 'no_asistio', etiqueta: 'No asistió' },
  { valor: 'todos', etiqueta: 'Todos' },
]

const ETIQUETAS_ESTADO: Record<string, string> = {
  pendiente: 'Pendiente',
  llamado: 'Te están llamando',
  atendido: 'Atendido',
  cancelado: 'Cancelado',
  no_asistio: 'No asistió',
}

const CLASES_ESTADO: Record<string, string> = {
  pendiente: 'espera',
  llamado: 'llamado',
  atendido: 'atendido',
  cancelado: 'cancelado',
  no_asistio: 'no-asistio',
}

function MisTurnosPage() {
  const [estado, setEstado] = useState<FiltroEstado>('activos')
  const { datos, setDatos, cargando, error, setError } = useFetch<Turno[]>(
    () => getMisTurnos(estado),
    [estado]
  )
  const confirmar = useConfirm()
  const location = useLocation()
  const turnoAgendado = Boolean((location.state as { turnoAgendado?: boolean } | null)?.turnoAgendado)
  const turnos = datos ?? []

  const handleCancelar = async (id: string) => {
    const ok = await confirmar('¿Cancelar este turno?', {
      variante: 'peligro',
      textoConfirmar: 'Cancelar turno',
    })
    if (!ok) return

    try {
      await cancelarTurno(id)
      // Según el filtro elegido (ej. "Cancelados"/"Todos"), el turno
      // cancelado tiene que seguir apareciendo, no desaparecer sin más.
      setDatos(await getMisTurnos(estado))
    } catch (err) {
      setError(extraerMensaje(err))
    }
  }

  return (
    <div className="container text-start py-4">
      <p className="section-label mb-1">Mi cuenta</p>
      <h1 className="mb-4">Mis Turnos</h1>

      {turnoAgendado && (
        <div className="alert alert-success" role="status">
          Turno agendado correctamente.
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="btn-group mb-3" role="group" aria-label="Filtrar por estado">
        {OPCIONES_ESTADO.map((opcion) => (
          <button
            key={opcion.valor}
            type="button"
            className={`btn btn-sm ${estado === opcion.valor ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setEstado(opcion.valor)}
            disabled={cargando}
          >
            {opcion.etiqueta}
          </button>
        ))}
      </div>

      {cargando ? (
        <p className="text-body-secondary">Cargando...</p>
      ) : turnos.length === 0 ? (
        <p className="text-body-secondary">No se encontraron turnos para este filtro.</p>
      ) : (
        <div className="ledger">
          {turnos.map((turno) => {
            const estado = turno.estado ?? 'pendiente'
            const pendiente = estado === 'pendiente'
            const cancelado = estado === 'cancelado'
            const fecha = new Date(turno.fechaTurno)

            return (
              <div className="ledger-row turno-row" key={turno.id}>
                <span className="hora">
                  <span className="dia d-block">
                    {fecha.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </span>
                  {fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })}
                </span>
                <span>
                  <span className="paciente d-block">
                    {turno.medico ? `${turno.medico.nombre} ${turno.medico.apellido}` : 'Médico a confirmar'}
                  </span>
                  <span className="obra-social">
                    {cancelado && turno.observaciones
                      ? turno.observaciones
                      : ESPECIALIDADES.find((e) => e.valor === turno.especialidad)?.etiqueta}
                    {turno.consultorio && ` · Consultorio ${turno.consultorio.numero}`}
                  </span>
                </span>
                <span className={`badge-estado ${CLASES_ESTADO[estado] ?? estado}`}>
                  {ETIQUETAS_ESTADO[estado] ?? estado}
                </span>
                <span className="d-flex gap-2">
                  {pendiente && (
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleCancelar(turno.id)}
                    >
                      Cancelar
                    </button>
                  )}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MisTurnosPage
