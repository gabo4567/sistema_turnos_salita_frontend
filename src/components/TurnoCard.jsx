import { useState } from 'react'
import './TurnoCard.css'

function TurnoCard({ paciente, horario }) {
  const [estado, setEstado] = useState('Pendiente')

  function handleClick() {
    setEstado((estadoActual) =>
      estadoActual === 'Pendiente' ? 'Atendido' : 'Pendiente'
    )
  }

  return (
    <div className="turno-card">
      <div className="turno-info">
        <p className="turno-paciente">{paciente}</p>
        <p className="turno-horario">{horario}</p>
      </div>
      <span className={`turno-estado turno-estado--${estado.toLowerCase()}`}>
        {estado}
      </span>
      <button type="button" className="turno-boton" onClick={handleClick}>
        Marcar como {estado === 'Pendiente' ? 'Atendido' : 'Pendiente'}
      </button>
    </div>
  )
}

export default TurnoCard
