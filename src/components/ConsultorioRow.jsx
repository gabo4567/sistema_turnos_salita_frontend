import { ESPECIALIDADES } from '../constants/turnos'

function ConsultorioRow({ consultorio }) {
  const especialidad = ESPECIALIDADES.find((e) => e.valor === consultorio.especialidad)?.etiqueta

  return (
    <div className="ledger-row consultorio-row">
      <span className="numero">Consultorio {consultorio.numero}</span>
      <span className="piso">{consultorio.piso ? `Piso ${consultorio.piso}` : '—'}</span>
      <span className="especialidad">{especialidad ?? 'General'}</span>
    </div>
  )
}

export default ConsultorioRow
