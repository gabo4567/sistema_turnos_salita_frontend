import { Link } from 'react-router-dom'
import { ESPECIALIDADES } from '../constants/turnos'

function MedicoRow({ medico, onDarDeBaja }) {
  const especialidad =
    ESPECIALIDADES.find((e) => e.valor === medico.especialidad)?.etiqueta ?? medico.especialidad

  const handleDarDeBaja = () => {
    if (window.confirm(`¿Dar de baja a ${medico.nombre}?`)) {
      onDarDeBaja(medico.id)
    }
  }

  return (
    <div className="ledger-row medico-row">
      <span>
        <span className="nombre d-block">{medico.nombre}</span>
        <span className="matricula">Matrícula {medico.matricula}</span>
      </span>
      <span className="especialidad">{especialidad}</span>
      <span className="telefono">{medico.telefono || '—'}</span>
      <span className="d-flex gap-2">
        <Link to={`/medicos/${medico.matricula}/editar`} className="btn btn-outline-primary btn-sm">
          Editar
        </Link>
        <button type="button" className="btn btn-outline-danger btn-sm" onClick={handleDarDeBaja}>
          Dar de baja
        </button>
      </span>
    </div>
  )
}

export default MedicoRow
