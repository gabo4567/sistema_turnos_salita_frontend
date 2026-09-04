import { ESPECIALIDADES } from '../constants/turnos'

function MedicoRow({ medico }) {
  const especialidad =
    ESPECIALIDADES.find((e) => e.valor === medico.especialidad)?.etiqueta ?? medico.especialidad

  return (
    <div className="ledger-row medico-row">
      <span>
        <span className="nombre d-block">{medico.nombre}</span>
        <span className="matricula">Matrícula {medico.matricula}</span>
      </span>
      <span className="especialidad">{especialidad}</span>
      <span className="telefono">{medico.telefono || '—'}</span>
    </div>
  )
}

export default MedicoRow
