import { Link } from 'react-router-dom'

function PacienteRow({ paciente, onDarDeBaja }) {
  const handleDarDeBaja = () => {
    if (window.confirm(`¿Dar de baja a ${paciente.nombre}?`)) {
      onDarDeBaja(paciente.id)
    }
  }

  return (
    <div className="ledger-row paciente-row">
      <span>
        <span className="nombre d-block">{paciente.nombre}</span>
        <span className="dni">DNI {paciente.dni}</span>
      </span>
      <span className="obra-social">{paciente.obraSocial?.nombre || 'Particular'}</span>
      <span className="d-flex gap-2">
        <Link to={`/pacientes/${paciente.dni}/historia`} className="btn btn-link btn-sm">
          Historia
        </Link>
        <Link to={`/pacientes/${paciente.dni}/editar`} className="btn btn-outline-primary btn-sm">
          Editar
        </Link>
        <button type="button" className="btn btn-outline-danger btn-sm" onClick={handleDarDeBaja}>
          Dar de baja
        </button>
      </span>
    </div>
  )
}

export default PacienteRow
