import { Link } from 'react-router-dom'

function PacienteRow({ paciente }) {
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
      </span>
    </div>
  )
}

export default PacienteRow
