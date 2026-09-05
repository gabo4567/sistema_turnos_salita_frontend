import { Link } from 'react-router-dom'
import { ESPECIALIDADES } from '../constants/turnos'

function ConsultorioRow({ consultorio, onDarDeBaja }) {
  const especialidad = ESPECIALIDADES.find((e) => e.valor === consultorio.especialidad)?.etiqueta

  const handleDarDeBaja = () => {
    if (window.confirm(`¿Dar de baja el consultorio ${consultorio.numero}?`)) {
      onDarDeBaja(consultorio.id)
    }
  }

  return (
    <div className="ledger-row consultorio-row">
      <span className="numero">Consultorio {consultorio.numero}</span>
      <span className="piso">{consultorio.piso ? `Piso ${consultorio.piso}` : '—'}</span>
      <span className="especialidad">{especialidad ?? 'General'}</span>
      <span className="d-flex gap-2">
        <Link
          to={`/consultorios/${consultorio.numero}/editar`}
          className="btn btn-outline-primary btn-sm"
        >
          Editar
        </Link>
        <button type="button" className="btn btn-outline-danger btn-sm" onClick={handleDarDeBaja}>
          Dar de baja
        </button>
      </span>
    </div>
  )
}

export default ConsultorioRow
