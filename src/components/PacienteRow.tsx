import { Link } from 'react-router-dom'
import type { Paciente } from '../types/Paciente'
import { useConfirm } from '../hooks/useConfirm'

interface PacienteRowProps {
  paciente: Paciente
  onDarDeBaja: (id: string) => void
}

function PacienteRow({ paciente, onDarDeBaja }: PacienteRowProps) {
  const confirmar = useConfirm()

  const handleDarDeBaja = async () => {
    const ok = await confirmar(`¿Dar de baja a ${paciente.nombre}?`, {
      variante: 'peligro',
      textoConfirmar: 'Dar de baja',
    })
    if (ok) onDarDeBaja(paciente.id)
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
