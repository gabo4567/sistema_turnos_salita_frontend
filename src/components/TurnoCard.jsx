const formatearDia = (fechaTurno) => {
  const fecha = new Date(fechaTurno)
  const hoy = new Date()
  const manana = new Date()
  manana.setDate(hoy.getDate() + 1)

  if (fecha.toDateString() === hoy.toDateString()) return 'Hoy'
  if (fecha.toDateString() === manana.toDateString()) return 'Mañana'

  return fecha.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })
}

function TurnoCard({ turno, onLlamar, onCancelar }) {
  const atendido = turno.estado === 'atendido'
  const hora = new Date(turno.fechaTurno).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  const handleCancelar = () => {
    if (window.confirm('¿Cancelar este turno?')) {
      onCancelar(turno.id)
    }
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
          {turno.paciente?.obraSocial?.nombre || 'Particular'}
          {turno.medico && ` · ${turno.medico.nombre}`}
          {turno.consultorio && ` · Consultorio ${turno.consultorio.numero}`}
        </span>
      </span>
      <span className={`badge-estado ${atendido ? 'atendido' : 'espera'}`}>
        {atendido ? 'Atendido' : 'En espera'}
      </span>
      <span className="d-flex gap-2">
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          disabled={atendido}
          onClick={() => onLlamar(turno.id)}
        >
          Llamar
        </button>
        <button type="button" className="btn btn-outline-danger btn-sm" onClick={handleCancelar}>
          Cancelar
        </button>
      </span>
    </div>
  )
}

export default TurnoCard
