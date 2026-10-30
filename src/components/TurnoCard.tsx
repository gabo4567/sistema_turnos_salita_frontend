import { Link } from 'react-router-dom'
import type { Turno } from '../types/Turno'
import { useConfirm } from '../hooks/useConfirm'

const formatearDia = (fechaTurno: string) => {
  const fecha = new Date(fechaTurno)
  const hoy = new Date()
  const manana = new Date()
  manana.setDate(hoy.getDate() + 1)

  if (fecha.toDateString() === hoy.toDateString()) return 'Hoy'
  if (fecha.toDateString() === manana.toDateString()) return 'Mañana'

  return fecha.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })
}

interface TurnoCardProps {
  turno: Turno
  onLlamar: (id: string) => void
  onFinalizar: (id: string) => void
  onCancelar: (id: string) => void
}

const ETIQUETAS_ESTADO: Record<string, string> = {
  pendiente: 'En espera',
  llamado: 'Llamado',
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

function TurnoCard({ turno, onLlamar, onFinalizar, onCancelar }: TurnoCardProps) {
  const confirmar = useConfirm()
  const estado = turno.estado ?? 'pendiente'
  const pendiente = estado === 'pendiente'
  const llamado = estado === 'llamado'
  const atendido = estado === 'atendido'
  const cancelado = estado === 'cancelado'
  const noAsistio = estado === 'no_asistio'
  const finalizado = atendido || cancelado || noAsistio
  const hora = new Date(turno.fechaTurno).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  const handleCancelar = async () => {
    const ok = await confirmar('¿Cancelar este turno?', {
      variante: 'peligro',
      textoConfirmar: 'Cancelar turno',
    })
    if (ok) onCancelar(turno.id)
  }

  return (
    <div className="ledger-row turno-row">
      <span className="hora">
        <span className="dia d-block">{formatearDia(turno.fechaTurno)}</span>
        {hora}
      </span>
      <span>
        <span className="paciente d-block">
          <span className="etiqueta-dato">Paciente: </span>
          {turno.paciente?.nombre ?? 'Paciente sin datos'}
        </span>
        {turno.medico && (
          <span className="medico-turno d-block">
            <span className="etiqueta-dato">Médico: </span>
            {turno.medico.nombre} {turno.medico.apellido}
          </span>
        )}
        {(cancelado && turno.observaciones) || turno.consultorio ? (
          <span className="obra-social">
            {[
              cancelado && turno.observaciones ? turno.observaciones : null,
              turno.consultorio ? `Consultorio ${turno.consultorio.numero}` : null,
            ]
              .filter(Boolean)
              .join(' · ')}
          </span>
        ) : null}
      </span>
      <span className={`badge-estado ${CLASES_ESTADO[estado] ?? estado}`}>{ETIQUETAS_ESTADO[estado] ?? estado}</span>
      <span className="d-flex gap-2">
        <Link to={`/turnos/${turno.id}`} className="btn btn-outline-secondary btn-sm">
          Detalle
        </Link>
        {!cancelado && !noAsistio && (
          <>
            {pendiente && (
              <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => onLlamar(turno.id)}>
                Llamar
              </button>
            )}
            {llamado && (
              <button type="button" className="btn btn-outline-success btn-sm" onClick={() => onFinalizar(turno.id)}>
                Finalizar consulta
              </button>
            )}
            {!llamado && !atendido && (
              <Link to={`/turnos/${turno.id}/editar`} className="btn btn-outline-primary btn-sm">
                Editar
              </Link>
            )}
            {!finalizado && (
              <button type="button" className="btn btn-outline-danger btn-sm" onClick={handleCancelar}>
                Cancelar
              </button>
            )}
          </>
        )}
      </span>
    </div>
  )
}

export default TurnoCard
