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
  onCancelar: (id: string) => void
}

function TurnoCard({ turno, onLlamar, onCancelar }: TurnoCardProps) {
  const confirmar = useConfirm()
  const atendido = turno.estado === 'atendido'
  const cancelado = turno.estado === 'cancelado'
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
        <span className="paciente d-block">{turno.paciente?.nombre ?? 'Paciente sin datos'}</span>
        <span className="obra-social">
          {cancelado && turno.observaciones
            ? turno.observaciones
            : turno.paciente?.obraSocial?.nombre || 'Particular'}
          {turno.medico && ` · ${turno.medico.nombre} ${turno.medico.apellido}`}
          {turno.consultorio && ` · Consultorio ${turno.consultorio.numero}`}
        </span>
      </span>
      <span className={`badge-estado ${cancelado ? 'cancelado' : atendido ? 'atendido' : 'espera'}`}>
        {cancelado ? 'Cancelado' : atendido ? 'Atendido' : 'En espera'}
      </span>
      <span className="d-flex gap-2">
        {!cancelado && (
          <>
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              disabled={atendido}
              onClick={() => onLlamar(turno.id)}
            >
              Llamar
            </button>
            <Link to={`/turnos/${turno.id}/editar`} className="btn btn-outline-primary btn-sm">
              Editar
            </Link>
            <button type="button" className="btn btn-outline-danger btn-sm" onClick={handleCancelar}>
              Cancelar
            </button>
          </>
        )}
      </span>
    </div>
  )
}

export default TurnoCard
