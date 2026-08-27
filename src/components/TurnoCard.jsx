function TurnoCard({ turno, onLlamar }) {
  const atendido = turno.estado === 'atendido'
  const hora = new Date(turno.fechaTurno).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  return (
    <div className="turno-row">
      <span className="hora">{hora}</span>
      <span>
        <span className="paciente d-block">{turno.paciente?.nombre ?? 'Paciente sin datos'}</span>
        <span className="obra-social">{turno.paciente?.obraSocial?.nombre || 'Particular'}</span>
      </span>
      <span className={`badge-estado ${atendido ? 'atendido' : 'espera'}`}>
        {atendido ? 'Atendido' : 'En espera'}
      </span>
      <button
        type="button"
        className="btn btn-outline-primary btn-sm"
        disabled={atendido}
        onClick={() => onLlamar(turno.id)}
      >
        Llamar
      </button>
    </div>
  )
}

export default TurnoCard
